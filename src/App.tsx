import React, { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import { APIProvider, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Compass, HelpCircle, User, Sparkles, MapPin, Layers, Info } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MapContainer from "./components/MapContainer";
import PlaceDetailCard from "./components/PlaceDetailCard";
import { Message, PlacePin, GroundingChunk, ChatHistoryItem } from "./types";

// Exposing API standard keys following Constitution Rules
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY";

interface MapContentProps {
  center: { lat: number; lng: number };
  zoom: number;
  pins: PlacePin[];
  selectedPin: PlacePin | null;
  onMapClick: (lat: number, lng: number) => void;
  onPinSelect: (pin: PlacePin) => void;
  onAutocompleteSelect: (lat: number, lng: number, name: string, address: string) => void;
  onPinAdded: (pin: PlacePin) => void;
  onSendMessage: (text: string) => void;
  userGoal: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setPins: React.Dispatch<React.SetStateAction<PlacePin[]>>;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setPlaceName: (name: string) => void;
  setSelectedPin: (pin: PlacePin | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onMapLoad?: (map: google.maps.Map | null) => void;
}

function MapContent({
  center,
  zoom,
  pins,
  selectedPin,
  onMapClick,
  onPinSelect,
  onAutocompleteSelect,
  onPinAdded,
  onSendMessage,
  userGoal,
  messages,
  setMessages,
  setPins,
  setCenter,
  setZoom,
  setPlaceName,
  setSelectedPin,
  setLoading,
  loading,
  onMapLoad,
}: MapContentProps) {
  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        pins={pins}
        selectedPin={selectedPin}
        onMapClick={onMapClick}
        onPinSelect={onPinSelect}
        onAutocompleteSelect={onAutocompleteSelect}
        onPinAdded={onPinAdded}
        onMapLoad={onMapLoad}
      />

      {selectedPin && (
        <PlaceDetailCard
          place={selectedPin}
          onClose={() => setSelectedPin(null)}
          onAskChat={(queryText) => onSendMessage(queryText)}
          onRecommendMenu={async (placeId, name) => {
            if (loading) return;
            setLoading(true);

            const userMsg: Message = {
              id: `user-${Date.now()}`,
              role: "user",
              text: `Suggest custom order recommendations for **${name}** aligned with my nutrition focus! 🍽️`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };
            setMessages((prev: Message[]) => [...prev, userMsg]);

            try {
              const res = await fetch("/api/menu-recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ placeId, restaurantName: name, userGoal }),
              });

              if (res.ok) {
                const data = await res.json();
                const coachMsg: Message = {
                  id: `bot-${Date.now()}`,
                  role: "model",
                  text: data.recommendations || "No recommendations available.",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };
                setMessages((prev: Message[]) => [...prev, coachMsg]);
              } else {
                throw new Error("Menu service unavailable");
              }
            } catch (e: any) {
              console.error(e);
              const errMsg: Message = {
                id: `error-${Date.now()}`,
                role: "model",
                text: `⚠️ Could not get menu recommendations for **${name}**.`,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              };
              setMessages((prev: Message[]) => [...prev, errMsg]);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </>
  );
}

// Master GeoConcierge App component containing state context and Google Maps logic
function GeoConciergeApp() {
  const [map, setMapInstance] = useState<google.maps.Map | null>(null);
  const placesLib = useMapsLibrary("places");
  
  // Geolocation states
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 47.6062, lng: -122.3321 }); // Standard: Seattle, WA
  const [zoom, setZoom] = useState<number>(12);
  const [placeName, setPlaceName] = useState<string>("Seattle, WA");
  
  // Master active markers & panels
  const [pins, setPins] = useState<PlacePin[]>([]);
  const [selectedPin, setSelectedPin] = useState<PlacePin | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userGoal, setUserGoal] = useState<string>("gain_muscle");
  
  // Voice coach session state
  const [gerdySessionState, setGerdySessionState] = useState<any>({
    activeSubMode: null,
    placeType: null
  });

  // Initialize coordinates context with user's geolocation if granted
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCenter({ lat, lng });
          setZoom(13);
          setPlaceName("My Current Location");
          
          // Plant initial geocoordinate pin
          const myLocationPin: PlacePin = {
            id: "my-location",
            name: "My Location",
            lat,
            lng,
            address: "Your browser geocoordinates context",
            source: "user_click"
          };
          setPins([myLocationPin]);
        },
        (err) => {
          console.log("Geolocation permission declined or unnavigable. Utilizing default focal center Seattle.", err);
        }
      );
    }
  }, []);

  // Map Click handler (places purple temporary pin and reverses geocode to find description / address)
  const handleMapClick = (lat: number, lng: number) => {
    // Zoom in slightly on selection 
    setCenter({ lat, lng });
    setZoom(14);
    
    if (typeof google === "undefined" || !google.maps || !google.maps.Geocoder) {
      console.warn("Google Geocoder is not yet active/authorized.");
      const resolvedAddress = `Point at (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      const clickedPin: PlacePin = {
        id: `click-${Date.now()}`,
        name: `Custom pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        lat,
        lng,
        address: resolvedAddress,
        source: "user_click"
      };
      setPins((prev) => {
        const withoutOldClicks = prev.filter((p) => p.source !== "user_click");
        return [...withoutOldClicks, clickedPin];
      });
      setSelectedPin(clickedPin);
      return;
    }

    // Call client-side reverse geocoder
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      let resolvedAddress = "Unknown custom point";
      if (status === "OK" && results && results[0]) {
        resolvedAddress = results[0].formatted_address;
      }
      
      const newPinName = `Custom pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      setPlaceName(resolvedAddress);

      const clickedPin: PlacePin = {
        id: `click-${Date.now()}`,
        name: newPinName,
        lat,
        lng,
        address: resolvedAddress,
        source: "user_click"
      };

      // Set as active selected pin and add to map pins list
      setPins((prev) => {
        // Filter previous click pins to avoid multiple junk click markers
        const withoutOldClicks = prev.filter((p) => p.source !== "user_click");
        return [...withoutOldClicks, clickedPin];
      });
      setSelectedPin(clickedPin);
    });
  };

  // Callback returning Autocomplete choices from searchbars
  const handleAutocompleteSelect = (lat: number, lng: number, name: string, address: string) => {
    setCenter({ lat, lng });
    setZoom(15);
    setPlaceName(name);
  };

  const handleAddNewPin = (newPin: PlacePin) => {
    setPins((prev) => {
      // Prevent duplicates
      if (prev.some((p) => p.id === newPin.id)) return prev;
      return [...prev, newPin];
    });
    setSelectedPin(newPin);
  };

  // Handles clicking a Map Marker pin to fetch details dynamically via PlacesService
  const handlePinSelect = (pin: PlacePin) => {
    setSelectedPin(pin);
    setCenter({ lat: pin.lat, lng: pin.lng });

    // Validate that the ID is a real Google Place ID and not one of our synthetic/mock IDs before calling getDetails
    const isValidId = pin.id && 
      !pin.id.startsWith("click-") && 
      !pin.id.startsWith("search-") && 
      !pin.id.startsWith("grounding-") && 
      !pin.id.startsWith("preset-") && 
      !pin.id.startsWith("bot-") && 
      !pin.id.startsWith("user-") && 
      !pin.id.startsWith("error-") && 
      pin.id !== "my-location";

    // Try fetching dense data dynamically from google places service if we only have summary coordinates
    if (!map || !placesLib || !isValidId) {
      return;
    }

    if (typeof google === "undefined" || !google.maps || !google.maps.places || !google.maps.places.PlacesService) {
      console.warn("Google PlacesService is not currently available/authenticated.");
      return;
    }

    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: pin.id,
        fields: ["name", "formatted_address", "formatted_phone_number", "website", "rating", "opening_hours", "photos", "user_ratings_total"],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          // Extract weekday hours
          const weekdayText = place.opening_hours?.weekday_text || [];
          // Extract photo url
          let photoUrls: string[] = [];
          if (place.photos && place.photos.length > 0) {
            photoUrls = [place.photos[0].getUrl({ maxWidth: 600 })];
          }

          const detailedPin: PlacePin = {
            ...pin,
            name: place.name || pin.name,
            address: place.formatted_address || pin.address,
            phone: place.formatted_phone_number || undefined,
            website: place.website || undefined,
            weekdayText: weekdayText.length > 0 ? weekdayText : undefined,
            rating: place.rating || pin.rating,
            userRatingCount: place.user_ratings_total || pin.userRatingCount,
            photos: photoUrls.length > 0 ? photoUrls : pin.photos,
          };

          // Update active marker states
          setPins((prev) => prev.map((p) => (p.id === pin.id ? detailedPin : p)));
          setSelectedPin(detailedPin);
        }
      }
    );
  };

  // Master handler syncing full-stack chatbot query using Maps Grounding server-side
  const handleSendMessage = async (text: string) => {
    if (loading) return;
    setLoading(true);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const lowerMsg = text.toLowerCase();

      // Check for voice-coach find submode triggers
      if (lowerMsg.includes('find gym') || lowerMsg.includes('nearby gym')) {
        setGerdySessionState({ activeSubMode: 'findPlace', placeType: 'gym' });
        
        const welcomeText = `Let me find gyms near you! I'll need your location permission. Ready? 🗺️`;
        const initialBotMsg: Message = {
          id: `bot-${Date.now()}-welcome`,
          role: "model",
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, initialBotMsg]);
        
        // Trigger locating and find spots
        let searchCoords = { lat: center?.lat || 47.6062, lng: center?.lng || -122.3321 };
        if (navigator.geolocation) {
          try {
            const pos: any = await new Promise((res, rej) => {
              navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3500 });
            });
            searchCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            setCenter(searchCoords);
            setZoom(14);
            setPlaceName("My Current Location");
          } catch (e) {
            console.log('Location request timed out or cancelled, seeking current center.');
          }
        }
        
        // Perform search
        const searchRes = await fetch("/api/maps-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "gyms and workout centers near me",
            userLat: searchCoords.lat,
            userLng: searchCoords.lng,
            userGoal,
          }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const botResultMsg: Message = {
            id: `bot-${Date.now()}-result`,
            role: "model",
            text: searchData.gerdyMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, botResultMsg]);

          if (searchData.places && Array.isArray(searchData.places)) {
            const newPins: PlacePin[] = searchData.places.map((place: any, index: number) => ({
              id: place.id || `search-result-${index}-${Date.now()}`,
              name: place.displayName?.text || "Recommended Spot",
              lat: place.location?.latitude,
              lng: place.location?.longitude,
              address: place.formattedAddress,
              rating: place.rating,
              userRatingCount: place.userRatingCount,
              source: "grounding"
            })).filter((p: any) => typeof p.lat === "number" && typeof p.lng === "number");

            if (newPins.length > 0) {
              setPins((prev) => {
                const withoutOldGrounding = prev.filter(p => p.source !== "grounding");
                return [...withoutOldGrounding, ...newPins];
              });
              setCenter({ lat: newPins[0].lat, lng: newPins[0].lng });
              setZoom(14);
            }
          }
        }
        setLoading(false);
        return;
      }

      if (lowerMsg.includes('healthy restaurant') || lowerMsg.includes('where to eat')) {
        setGerdySessionState({ activeSubMode: 'findPlace', placeType: 'restaurant' });
        
        const welcomeText = `Finding healthy restaurants near you! ${
          userGoal === 'lose_weight' 
            ? "I'll prioritize places with lighter options." 
            : "Looking for protein-rich spots!"
        } 🍽️`;
        
        const initialBotMsg: Message = {
          id: `bot-${Date.now()}-welcome`,
          role: "model",
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, initialBotMsg]);

        // Trigger locating and find spots
        let searchCoords = { lat: center?.lat || 47.6062, lng: center?.lng || -122.3321 };
        if (navigator.geolocation) {
          try {
            const pos: any = await new Promise((res, rej) => {
              navigator.geolocation.getCurrentPosition(res, rej, { timeout: 3500 });
            });
            searchCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            };
            setCenter(searchCoords);
            setZoom(14);
            setPlaceName("My Current Location");
          } catch (e) {
            console.log('Location request timed out or cancelled, seeking current center.');
          }
        }
        
        // Perform search
        const queryTerm = userGoal === 'lose_weight' ? "healthy salads weight loss restaurant" : "high protein muscles nutrition cafe";
        const searchRes = await fetch("/api/maps-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: queryTerm,
            userLat: searchCoords.lat,
            userLng: searchCoords.lng,
            userGoal,
          }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const botResultMsg: Message = {
            id: `bot-${Date.now()}-result`,
            role: "model",
            text: searchData.gerdyMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, botResultMsg]);

          if (searchData.places && Array.isArray(searchData.places)) {
            const newPins: PlacePin[] = searchData.places.map((place: any, index: number) => ({
              id: place.id || `search-result-${index}-${Date.now()}`,
              name: place.displayName?.text || "Recommended Spot",
              lat: place.location?.latitude,
              lng: place.location?.longitude,
              address: place.formattedAddress,
              rating: place.rating,
              userRatingCount: place.userRatingCount,
              source: "grounding"
            })).filter((p: any) => typeof p.lat === "number" && typeof p.lng === "number");

            if (newPins.length > 0) {
              setPins((prev) => {
                const withoutOldGrounding = prev.filter(p => p.source !== "grounding");
                return [...withoutOldGrounding, ...newPins];
              });
              setCenter({ lat: newPins[0].lat, lng: newPins[0].lng });
              setZoom(14);
            }
          }
        }
        setLoading(false);
        return;
      }

      // Check if message text matches standard search commands for gyms, workout spots, healthy food, eating nearby, etc.
      const isSearchPattern = text.toLowerCase().match(/(find|locate|near me|gym|restaurant|eat|workout|park|food|trail|running|exercise)/);

      if (isSearchPattern) {
        const searchRes = await fetch("/api/maps-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: text,
            userLat: center?.lat,
            userLng: center?.lng,
            userGoal,
          }),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          
          const botMsg: Message = {
            id: `bot-${Date.now()}`,
            role: "model",
            text: searchData.gerdyMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setMessages((prev) => [...prev, botMsg]);

          // Dynamically plot returned points of interest as recommendation pins
          if (searchData.places && Array.isArray(searchData.places)) {
            const newPins: PlacePin[] = searchData.places.map((place: any, index: number) => {
              const pLat = place.location?.latitude;
              const pLng = place.location?.longitude;
              const name = place.displayName?.text || "Recommended Spot";
              return {
                id: place.id || `search-result-${index}-${Date.now()}`,
                name: name,
                lat: pLat,
                lng: pLng,
                address: place.formattedAddress,
                rating: place.rating,
                userRatingCount: place.userRatingCount,
                source: "grounding"
              };
            }).filter((p: any) => typeof p.lat === "number" && typeof p.lng === "number");

            if (newPins.length > 0) {
              setPins((prev) => {
                // Keep existing search / clicked pins, replace grounding pins of this query
                const withoutOldGrounding = prev.filter(p => p.source !== "grounding");
                const combined = [...withoutOldGrounding, ...newPins];
                return combined.filter((p, idx, self) => self.findIndex(o => o.id === p.id) === idx);
              });

              // Slide zoom & view to focus on the top gym/facility pin automatically
              setCenter({ lat: newPins[0].lat, lng: newPins[0].lng });
              setZoom(14);
            }
          }

          setLoading(false);
          return;
        }
      }

      // Map chat messages context to pass history, including the latest user message
      const updatedMessages = [...messages, userMsg];
      const historyContext: ChatHistoryItem[] = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      // Server POST communication (CORS-safe and key protected)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          lat: center.lat,
          lng: center.lng,
          history: historyContext,
          userGoal,
        }),
      });

      if (!res.ok) {
        throw new Error(`API returned communication error code ${res.status}`);
      }

      const data = await res.json();

      // Extract coordinates & references
      const references: GroundingChunk[] = [];
      const rawChunks = data.groundingMetadata?.groundingChunks || [];
      
      rawChunks.forEach((chunk: any) => {
        const title = chunk.maps?.title || chunk.web?.title || "Real-Time Grounding Context";
        const uri = chunk.maps?.uri || chunk.web?.uri || "";
        references.push({ title, uri });
      });

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        references: references.length > 0 ? references : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Dynamic Marker Plotting:
      // Loop over grounding references and query Places service client-side to place emerald green recommendation pins!
      if (placesLib && map && rawChunks.length > 0) {
        if (typeof google === "undefined" || !google.maps || !google.maps.places || !google.maps.places.PlacesService) {
          console.warn("Google PlacesService is not available/authorized for grounding searches.");
          setLoading(false);
          return;
        }
        const service = new google.maps.places.PlacesService(map);
        
        rawChunks.forEach((chunk: any, index: number) => {
          const title = chunk.maps?.title || chunk.web?.title;
          if (!title) return;

          // Perform lightweight Places text search relative to the focal map center
          service.textSearch(
            {
              query: title,
              location: new google.maps.LatLng(center.lat, center.lng),
              radius: 5000,
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                const venue = results[0];
                const lat = venue.geometry?.location?.lat();
                const lng = venue.geometry?.location?.lng();

                if (typeof lat === "number" && typeof lng === "number") {
                  const verifiedPin: PlacePin = {
                    id: venue.place_id || `grounding-${index}-${Date.now()}`,
                    name: venue.name || title,
                    lat,
                    lng,
                    address: venue.formatted_address,
                    rating: venue.rating,
                    userRatingCount: venue.user_ratings_total,
                    source: "grounding",
                  };

                  // Append grounding pin
                  setPins((prev) => {
                    if (prev.some((p) => p.id === verifiedPin.id)) return prev;
                    return [...prev, verifiedPin];
                  });
                }
              }
            }
          );
        });
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "model",
        text: `⚠️ **Connection Error**: ${error?.message || "Could not retrieve chatbot answer from Express server. Ensure your GEMINI_API_KEY is configured."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setPins((prev) => prev.filter((p) => p.source === "user_click"));
    setSelectedPin(null);
  };

  const handleAddressSearch = (addressText: string) => {
    if (typeof google === "undefined" || !google.maps || !google.maps.Geocoder) {
      console.warn("Google Geocoder is not yet active.");
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: addressText }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;
        
        setCenter({ lat, lng });
        setZoom(14);
        setPlaceName(address);

        const newPin: PlacePin = {
          id: `preset-${Date.now()}`,
          name: addressText,
          lat,
          lng,
          address,
          source: "autocomplete_search"
        };
        setPins((prev) => {
          if (prev.some((p) => p.name.toLowerCase() === addressText.toLowerCase())) return prev;
          return [...prev, newPin];
        });
        setSelectedPin(newPin);
      } else {
        console.warn("Geocoding failed relative to: " + status);
      }
    });
  };

  return (
    <div className="w-full h-screen h-[100dvh] flex flex-col md:flex-row bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar Layout */}
      <Sidebar
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
        currentCoordinates={center}
        currentPlaceName={placeName}
        onClearHistory={handleClearHistory}
        userGoal={userGoal}
        setUserGoal={setUserGoal}
        onReferenceClick={(lat, lng, name) => {
          setCenter({ lat, lng });
          setZoom(16);
          setPlaceName(name);
        }}
        pins={pins}
        selectedPin={selectedPin}
        onPinSelect={handlePinSelect}
        onAddressSearch={handleAddressSearch}
      />

      {/* Main Interactive Map Layout container */}
      <div className="flex-1 h-1/2 md:h-full relative border-t md:border-t-0 p-0 m-0 overflow-hidden">
        {pins.length === 0 && (
          <div className="absolute top-18 right-4 bg-slate-900/90 text-white text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-800 z-10 shadow-2xl backdrop-blur flex items-center gap-2 max-w-sm animate-in fade-in slide-in-from-top duration-300">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <p>Click on coordinates or search destinations to establish a focal context for the chatbot.</p>
          </div>
        )}

        <MapContent
          center={center}
          zoom={zoom}
          pins={pins}
          selectedPin={selectedPin}
          onMapClick={handleMapClick}
          onPinSelect={handlePinSelect}
          onAutocompleteSelect={handleAutocompleteSelect}
          onPinAdded={handleAddNewPin}
          onSendMessage={handleSendMessage}
          userGoal={userGoal}
          messages={messages}
          setMessages={setMessages}
          setPins={setPins}
          setCenter={setCenter}
          setZoom={setZoom}
          setPlaceName={setPlaceName}
          setSelectedPin={setSelectedPin}
          setLoading={setLoading}
          loading={loading}
          onMapLoad={setMapInstance}
        />
      </div>
    </div>
  );
}

// Global wrap configuration enforcing API key check first
export default function App() {
  if (!hasValidKey) {
    return (
      <MapContainer
        center={{ lat: 47.6062, lng: -122.3321 }}
        zoom={12}
        pins={[]}
        selectedPin={null}
        onMapClick={() => {}}
        onPinSelect={() => {}}
        onAutocompleteSelect={() => {}}
        onPinAdded={() => {}}
      />
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <GeoConciergeApp />
    </APIProvider>
  );
}
