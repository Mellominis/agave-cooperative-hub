import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Express Server Handler endpoint
app.post('/api/verify-admin', (req, res) => {
  const { code } = req.body;
  const masterSecret = process.env.APP_ADMIN_SECRET_KEY || "OVERHAUL2026";
  
  if (code === masterSecret) {
    return res.status(200).json({ authorized: true });
  }
  return res.status(401).json({ authorized: false });
});

// Helper to get GoogleGenAI client with lazy loading
let aiClient: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper function to format the final coach response
function formatGerdyResponse(places: any[], types: string[], query: string) {
  if (!places || places.length === 0) {
    return `Hmm, I couldn't find any ${types.join(' or ')} near "${query}". Want to try a different query or expand your search focus? 🗺️`;
  }
  
  const placeList = places.slice(0, 5).map(p => {
    const rating = p.rating ? `⭐ ${p.rating} (${p.userRatingCount} reviews)` : '🆕 Brand new place';
    const priceSymbol = p.priceLevel ? '💰'.repeat(p.priceLevel + 1) : '';
    const address = p.formattedAddress || 'Nearby Area';
    return `• **${p.displayName?.text}** — ${address} — ${rating} ${priceSymbol}`;
  }).join('\n');
  
  return `🎯 **Overhaultrain Recommendations**

Found ${places.length} active spots near your focus matching your criteria! Here are the recommended facilities:

${placeList}

Ask me to pinpoint directions to any of these, or toggle voice on to read them aloud! 🏃‍♂️💪`;
}

// Maps Search Unified endpoint
app.post(["/api/maps-search", "/.netlify/functions/maps-search"], async (req, res) => {
  const { query, userLat, userLng, userGoal } = req.body;
  
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

  if (!query) {
    res.status(400).json({ error: "Query is required" });
    return;
  }

  try {
    // Step 1: If no coordinates, geocode the address
    let lat = userLat;
    let lng = userLng;
    
    if ((!lat || !lng) && GOOGLE_API_KEY) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
      const geocodeRes = await fetch(geocodeUrl);
      const geocodeData: any = await geocodeRes.json();
      if (geocodeData.results && geocodeData.results[0]) {
        lat = geocodeData.results[0].geometry.location.lat;
        lng = geocodeData.results[0].geometry.location.lng;
      }
    }

    // Default center to Seattle if absolutely nothing is specified
    if (!lat || !lng) {
      lat = 47.6062;
      lng = -122.3321;
    }

    // Step 2: Detect search type (gym or restaurant)
    const searchTypes = [];
    const queryLower = query.toLowerCase();
    if (queryLower.includes('gym') || queryLower.includes('workout') || queryLower.includes('exercise') || queryLower.includes('train') || queryLower.includes('fitness') || queryLower.includes('park') || queryLower.includes('trail') || queryLower.includes('run')) {
      searchTypes.push('gym');
    }
    if (queryLower.includes('restaurant') || queryLower.includes('eat') || queryLower.includes('food') || queryLower.includes('meal') || queryLower.includes('protein') || queryLower.includes('healthy') || queryLower.includes('salad') || queryLower.includes('cafe')) {
      searchTypes.push('restaurant');
    }

    // Default if unclear
    if (searchTypes.length === 0) {
      searchTypes.push('gym', 'restaurant');
    }

    // Step 3: Call Nearby Search for each type
    const allResults: any[] = [];

    if (GOOGLE_API_KEY) {
      for (const type of searchTypes) {
        // Map simplified types to Google's New Places API support tags
        const includedTypes = type === 'gym' ? ['gym', 'fitness_center'] : ['restaurant', 'cafe'];
        
        // Using the NEW Places API (POST method) as requested by user
        try {
          const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': GOOGLE_API_KEY,
              'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.types,places.location'
            },
            body: JSON.stringify({
              includedTypes: includedTypes,
              maxResultCount: 15,
              locationRestriction: {
                circle: {
                  center: { latitude: lat, longitude: lng },
                  radius: 5000  // 5km radius
                }
              },
              rankPreference: 'DISTANCE'  // Closest first
            })
          });
          
          if (response.ok) {
            const data: any = await response.json();
            if (data.places && Array.isArray(data.places)) {
              allResults.push(...data.places);
            }
          }
        } catch (placeErr) {
          console.error("Error fetching from searchNearby for type " + type, placeErr);
        }
      }
    }

    // Deduplicate responses by place ID
    const seen = new Set();
    const uniqueResults = allResults.filter(p => {
      const uKey = p.id || p.displayName?.text;
      if (!uKey || seen.has(uKey)) return false;
      seen.add(uKey);
      return true;
    });

    // Step 4: Filter by user's fitness goal using Gemini
    let filteredResults = uniqueResults;

    if (userGoal && GEMINI_API_KEY && uniqueResults.length > 0) {
      const goalPrompt = `
        User's fitness goal: ${userGoal}
        Places found: ${JSON.stringify(uniqueResults.map(p => ({ id: p.id, name: p.displayName?.text, types: p.types })))}
        
        Return ONLY a JSON array of place names (strings) or IDs that are GOOD for someone with this fitness goal.
        For 'lose_weight' / 'lose': prefer places with active options (gyms, outdoor exercise, salad bars, protein-focused restaurants, low calorie joints)
        For 'gain_muscle' / 'gain': prefer bodybuilding gyms, heavy lifting facilities, high-protein restaurants
        For 'maintain' / 'healthy': balanced active options and healthy wholefoods restaurants
        
        Return strictly a valid JSON array of strings containing the exact titles of the matching places, for example: ["Gold's Gym", "Evergreen Salads"]
        Do not add Markdown formatting code blocks like \`\`\`json. Return ONLY raw JSON text.
      `;

      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: goalPrompt }] }]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData: any = await geminiRes.json();
          let parsedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
          // Clean possible markdown wrapper tags
          parsedText = parsedText.replace(/```json/g, "").replace(/```/g, "").trim();
          
          try {
            const recommendedNames = JSON.parse(parsedText);
            if (Array.isArray(recommendedNames)) {
              const matched = uniqueResults.filter(p => 
                recommendedNames.some((rec: string) => 
                  p.displayName?.text?.toLowerCase().includes(rec.toLowerCase()) || 
                  rec.toLowerCase().includes(p.displayName?.text?.toLowerCase())
                )
              );
              if (matched.length > 0) {
                filteredResults = matched;
              }
            }
          } catch (jsonErr) {
            console.error("Failed to parse Gemini recommendation response", jsonErr, parsedText);
          }
        }
      } catch (geminiErr) {
        console.error("Gemini goal-filtering error:", geminiErr);
      }
    }

    // Step 5: Return formatted results for Coach to speak
    const gerdyResponse = formatGerdyResponse(filteredResults, searchTypes, query);

    res.json({
      places: filteredResults,
      gerdyMessage: gerdyResponse,
      totalFound: filteredResults.length
    });
  } catch (err: any) {
    console.error("Maps Search API Error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// AI Diet/Menu Recommendation endpoint
app.post("/api/menu-recommendations", async (req, res) => {
  const { placeId, restaurantName, userGoal } = req.body;
  const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.GOOGLE_MAPS_API_KEY || "";

  if (!restaurantName) {
    res.status(400).json({ error: "Restaurant Name is required" });
    return;
  }

  let websiteUri = "";
  let editorialSummary = "";

  // Call standard Google Places V1 Details REST endpoint if placeId query is valid and not a synthetic/mock prefix
  const isValidPlaceId = placeId && 
    !placeId.startsWith("click-") && 
    !placeId.startsWith("search-") && 
    !placeId.startsWith("grounding-") && 
    !placeId.startsWith("preset-") && 
    !placeId.startsWith("bot-") && 
    !placeId.startsWith("user-") && 
    !placeId.startsWith("error-") && 
    placeId !== "my-location";

  if (isValidPlaceId && GOOGLE_API_KEY) {
    try {
      const detailsUrl = `https://places.googleapis.com/v1/places/${placeId}?fields=websiteUri,editorialSummary&key=${GOOGLE_API_KEY}`;
      const detailsRes = await fetch(detailsUrl, {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask": "websiteUri,editorialSummary"
        }
      });
      if (detailsRes.ok) {
        const detailsData: any = await detailsRes.json();
        websiteUri = detailsData.websiteUri || "";
        editorialSummary = detailsData.editorialSummary?.text || "";
      }
    } catch (err) {
      console.error("Error fetching place details for menu items:", err);
    }
  }

  try {
    const ai = getGenAIClient();
    
    // Format human readable userGoal strings
    let goalDescription = "maintain general health and wellness";
    if (userGoal === "lose_weight") {
      goalDescription = "lose weight with low-calorie, nutrient-dense, high-satiety choices";
    } else if (userGoal === "gain_muscle") {
      goalDescription = "gain lean muscle with high-protein, calorie-sufficient, clean macro items";
    } else if (userGoal === "maintain") {
      goalDescription = "maintain and fuel athletic performance with balanced macros and natural health-focused wholefoods";
    }

    const prompt = `
      You are the elite Overhaultrain AI Voice Coach and Nutritionist.
      
      Suggest specific menu item recommendations for someone trying to ${goalDescription} at the restaurant: "${restaurantName}".
      ${websiteUri ? `Official Website: ${websiteUri}` : ""}
      ${editorialSummary ? `Editorial Summary of this Venue: "${editorialSummary}"` : ""}
      
      Consider the user's active training plan:
      - High protein & clean energy fuel options
      - Custom calorie considerations matching ${userGoal}
      
      Return 2-3 specific real or highly representative menu recommendations (such as protein bowls, specific salads, lean protein wraps, or customized steak/chicken plates) with a brief, punchy, expert nutritional athletic justification for why they fit the user's training goal.
      
      Format your response in clean Markdown with bold menu item names and clear bullet points. Keep the tone enthusiastic, athletic, highly supportive, and professional. Speak like a virtual performance trainer!
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({
      recommendations: response.text || "No recommendations could be generated.",
      websiteUri,
      editorialSummary
    });
  } catch (err: any) {
    console.error("Gemini context recommendation error:", err);
    res.status(500).json({ error: err.message || "Failed to generate recommendations." });
  }
});

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
  const { message, lat, lng, history, userGoal, language } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  try {
    const ai = getGenAIClient();

    // Map history to the format required by the SDK or construct conversational contents
    // Structure contents with history + the current user message
    let contents: any[] = [];
    if (history && Array.isArray(history)) {
      contents = history.map((h: any) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      }));
    }
    // Append current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const isLatLngAvailable = typeof lat === "number" && typeof lng === "number";

    // Setup models and tools
    // We use gemini-2.5-flash as the standard model for maps/search grounding tasks
    const model = "gemini-2.5-flash";

    // Generate goal-specific guidance
    let goalInstruction = "";
    if (userGoal) {
      if (userGoal === "lose_weight") {
        goalInstruction = `\n[FITNESS GOAL CONTEXT: The user is currently training to LOSE WEIGHT. Prioritize and highlight active lifestyle options (like outdoor jogging tracks, calisthenics parks, hiking trails, yoga studios) and low-calorie/healthy dining options (such as fresh salad bars, clean organic cafes, vegan diners, or light protein-serving spots).]`;
      } else if (userGoal === "gain_muscle") {
        goalInstruction = `\n[FITNESS GOAL CONTEXT: The user is currently training to GAIN MUSCLE & BULK. Prioritize and highlight heavy-duty physical facilities (like premium bodybuilding gyms, weightlifting clubs, indoor climbing gyms) and high-protein restaurants (such as premium steak houses, rotisserie chicken spots, Korean bbq grills, or custom high-protein meal prep spots).]`;
      } else if (userGoal === "maintain") {
        goalInstruction = `\n[FITNESS GOAL CONTEXT: The user is focused on general WELLNESS & STRENGTH MAINTENANCE. Prioritize balanced lifestyle sites (including moderate hiking paths, recreation centers, swimming pools) and balanced food selections (such as macro-friendly bistros, health-focused juice bars, or farm-to-table organic joints).]`;
      }
    }

    // Setup model language instructions
    let languagePrefix = "You are Gerdy, an elite fitness and nutrition coach. Respond entirely in English.";
    if (language === "es") {
      languagePrefix = "You are Gerdy, an elite fitness and nutrition coach. The user's system language is Spanish. Respond entirely in Spanish.";
    } else if (language === "fr") {
      languagePrefix = "You are Gerdy, an elite fitness and nutrition coach. The user's system language is French. Respond entirely in French.";
    }

    // Setup configuration
    const config: any = {
      systemInstruction: `${languagePrefix}

You are an elite, highly interactive, map-based fitness concierge and location chatbot powered by Overhaultrain.
Your goals are:
1. Provide extremely accurate and helpful geographical, fitness, and local training/diet recommendation suggestions.
2. Rely strictly on real-time Google Maps ground truth using the provided googleMaps tool.
3. Whenever relevant, reference specific pins or locations by their full proper name so the map client can pinpoint them (e.g. "Gold's Gym Seattle" or "Evergreen Salads"). 
4. Always frame recommendations with training details like why they are special, approximate distances or how they support the user's fitness goals. 
5. Important: Your response will be displayed in Markdown. Highlight headings, names of venues in bold, and create clean, bulleted summaries.
6. Speak in an encouraging, concise, ultra-professional AI Voice Coach tone. Keep responses punchy and ready to be read aloud.${goalInstruction}`,
      tools: [{ googleMaps: {} }],
    };

    // If coordinates are provided, bias the Google Maps grounding search near this area
    if (isLatLngAvailable) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    // Extract the textual answer and grounding chunks
    const responseText = response.text || "";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata || null;

    res.json({
      text: responseText,
      groundingMetadata,
    });
  } catch (err: any) {
    console.error("Gemini API Error in server.ts:", err);
    res.status(500).json({
      error: err.message || "An unexpected error occurred while communicating with Gemini.",
    });
  }
});

// Food Image Analysis Endpoint using Gemini 3.5-flash vision capabilities
app.post("/api/analyze-food", async (req, res) => {
  const { image } = req.body;

  if (!image) {
    res.status(400).json({ error: "Image data is required" });
    return;
  }

  try {
    const ai = getGenAIClient();

    // Extract mime type and raw base64 data
    let base64Data = image;
    let mimeType = "image/jpeg";

    if (base64Data.startsWith("data:")) {
      const parts = base64Data.split(",");
      mimeType = parts[0].split(";")[0].split(":")[1] || "image/jpeg";
      base64Data = parts[1];
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const promptText = `
      You are an elite athletic trainer, dietitian, and professional nutritionist.
      Analyze the provided meal picture and output estimated values.
      
      Look closely at the components, identify the main ingredients, guess the typical portion size, and return estimated values:
      - foodName: A short descriptive name of the meal (e.g. "Grilled Chicken Breast with Steamed Broccoli")
      - calories: Total calories (kcal)
      - protein: Protein content (g)
      - carbs: Carbohydrates content (g)
      - fat: Fat content (g)

      Verify constraints:
      - Double-check your values against typical standard nutrition catalogs (like USDA or nutrition labels) for this quantity.
      - Return strictly a valid JSON object matching the requested schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        imagePart,
        { text: promptText }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: {
              type: Type.STRING,
              description: "Short descriptive name of the detected meal",
            },
            calories: {
              type: Type.INTEGER,
              description: "Total estimated calories in kcal",
            },
            protein: {
              type: Type.INTEGER,
              description: "Total estimated protein in grams",
            },
            carbs: {
              type: Type.INTEGER,
              description: "Total estimated carbs in grams",
            },
            fat: {
              type: Type.INTEGER,
              description: "Total estimated fat in grams",
            },
          },
          required: ["foodName", "calories", "protein", "carbs", "fat"],
        }
      }
    });

    const textResponse = response.text || "{}";
    const parsedData = JSON.parse(textResponse.trim());

    res.json(parsedData);
  } catch (err: any) {
    console.error("Error analyzing meal layout image:", err);
    // Provide a graceful fallback directly from backend in case of limits or issues
    res.json({
      foodName: "Analyzed Meal (Aesthetic Health Portion)",
      calories: 420,
      protein: 28,
      carbs: 45,
      fat: 14,
      isFallback: true
    });
  }
});

// Start full server setup (Integrate Vite as middleware)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
