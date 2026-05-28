import React, { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  Send, 
  RefreshCw, 
  Navigation, 
  Compass, 
  MapPin, 
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume2 as SpeakerIcon,
  Flame,
  Dumbbell,
  Heart,
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  Mail
} from "lucide-react";
import { Message, PlacePin } from "../types";

interface SidebarProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  loading: boolean;
  currentCoordinates: { lat: number; lng: number } | null;
  currentPlaceName: string;
  onClearHistory: () => void;
  userGoal: string;
  setUserGoal: (goal: string) => void;
  onReferenceClick: (lat: number, lng: number, title: string) => void;
  pins: PlacePin[];
  selectedPin: PlacePin | null;
  onPinSelect: (pin: PlacePin) => void;
  onAddressSearch: (addressText: string) => void;
}

export default function Sidebar({
  messages,
  onSendMessage,
  loading,
  currentCoordinates,
  currentPlaceName,
  onClearHistory,
  userGoal,
  setUserGoal,
  onReferenceClick,
  pins,
  selectedPin,
  onPinSelect,
  onAddressSearch
}: SidebarProps) {
  const [inputValue, setInputValue] = useState("");
  const [addressInput, setAddressInput] = useState("");
  const [showNearbySpots, setShowNearbySpots] = useState(true);
  const [showAddressPresets, setShowAddressPresets] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Capabilities state
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Netlify waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(true);

  const encodeWaitlist = (data: { [key: string]: string }) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || submittingWaitlist) return;
    setSubmittingWaitlist(true);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeWaitlist({ "form-name": "waitlist", "email": waitlistEmail }),
      });
      setWaitlistSubmitted(true);
      setWaitlistEmail("");
    } catch (err) {
      console.error("Netlify waitlist submission error:", err);
      // Fallback state inside offline AI studio sandboxes
      setWaitlistSubmitted(true);
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle Text-To-Speech for incoming model messages
  useEffect(() => {
    if (messages.length === 0 || !isVoiceEnabled) return;
    
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role === "model") {
      // Cancel any ongoing speaking
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        
        // Clean markdown indicators for cleaner voice output
        const textToSpeak = lastMsg.text
          .replace(/[#*`_~]/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Simplify markdown links
          .slice(0, 300); // Keep spoken output concise

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [messages, isVoiceEnabled]);

  // Setup Browser Speech Recognition Context
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
          onSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech Recognition error:", event.error);
        if (event.error === "not-allowed") {
          setSpeechError("Microphone access denied.");
        } else {
          setSpeechError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSendMessage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Stop speech synthesis if speaking
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start voice recognition", err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  const handleQuickPrompt = (prompt: string) => {
    if (loading) return;
    onSendMessage(prompt);
  };

  return (
    <div 
      id="sidebar-panel" 
      className="w-full md:w-[450px] bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800 flex-shrink-0"
    >
      {/* Header featuring high fidelity Overhaultrain UI branding SVG */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex-shrink-0">
        <div className="flex flex-col gap-1 select-none">
          {/* Main user-provided high fidelity branding */}
          <div className="flex items-center space-x-2.5 py-1">
            <img 
              src="/images/logo.png" 
              alt="OVERHAULTRAIN Logo" 
              className="w-9 h-9 object-contain rounded-md shadow-md"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl font-bold logo-text tracking-wide">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">OVERHAUL</span>
              <span className="text-white">TRAIN</span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5 px-1 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] text-[#A1A1AA] uppercase font-bold tracking-widest">
              Live Location Grounding Mode
            </span>
          </div>
        </div>

        {/* Focal point metadata */}
        <div className="mt-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-900/45">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">GPS Focal Target</span>
              <span className="text-[9px] bg-blue-950 font-bold px-1.5 py-0.5 rounded text-blue-400">
                referenced
              </span>
            </div>
            <p className="font-semibold text-slate-200 truncate">{currentPlaceName}</p>
            {currentCoordinates && (
              <p className="text-[10px] text-slate-500 font-mono">
                lat: {currentCoordinates.lat.toFixed(5)}, lng: {currentCoordinates.lng.toFixed(5)}
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Coach Training Focus segmented slider */}
        <div className="mt-3 bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">Coach Training Focus</span>
            <span className="text-[9px] font-mono text-blue-400 bg-blue-950/50 px-1.5 py-0.5 rounded font-semibold border border-blue-900/30">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setUserGoal("lose_weight")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition border ${
                userGoal === "lose_weight"
                  ? "bg-gradient-to-tr from-blue-950 to-indigo-950 border-blue-500/50 text-blue-400 shadow-md"
                  : "bg-slate-950/40 border-transparent text-slate-400 hover:bg-slate-950/65 hover:text-slate-300"
              }`}
            >
              <Flame className="w-3.5 h-3.5 mb-1 text-orange-400" />
              <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">Lose Weight</span>
            </button>

            <button
              type="button"
              onClick={() => setUserGoal("gain_muscle")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition border ${
                userGoal === "gain_muscle"
                  ? "bg-gradient-to-tr from-blue-950 to-indigo-950 border-blue-500/50 text-blue-400 shadow-md"
                  : "bg-slate-950/40 border-transparent text-slate-400 hover:bg-slate-950/65 hover:text-slate-300"
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5 mb-1 text-purple-400" />
              <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">Gain Muscle</span>
            </button>

            <button
              type="button"
              onClick={() => setUserGoal("maintain")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition border ${
                userGoal === "maintain"
                  ? "bg-gradient-to-tr from-blue-950 to-indigo-950 border-blue-500/50 text-blue-400 shadow-md"
                  : "bg-slate-950/40 border-transparent text-slate-400 hover:bg-slate-950/65 hover:text-slate-300"
              }`}
            >
              <Heart className="w-3.5 h-3.5 mb-1 text-rose-500" />
              <span className="text-[10px] font-semibold tracking-tight whitespace-nowrap">Stay Healthy</span>
            </button>
          </div>
        </div>

        {/* Simplify Address Entry Section */}
        <div className="mt-3 bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Quick Teleport / Address
            </span>
            <button 
              type="button" 
              onClick={() => setShowAddressPresets(!showAddressPresets)}
              className="text-[#A1A1AA] hover:text-white transition"
            >
              {showAddressPresets ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showAddressPresets && (
            <div className="space-y-2 animate-in fade-in duration-200">
              {/* Address Quick input geocoder form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (addressInput.trim()) {
                    onAddressSearch(addressInput.trim());
                    setAddressInput("");
                  }
                }}
                className="flex gap-1.5"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="Enter city, coordinates or address..."
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-600 focus:outline-none rounded-lg px-2.5 py-1.5 text-[11px] text-slate-150 pl-7"
                  />
                  <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  disabled={!addressInput.trim()}
                  className="bg-slate-850 hover:bg-slate-800 text-[11px] font-bold text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 transition whitespace-nowrap animate-pulse"
                >
                  Locate
                </button>
              </form>

              {/* Popular quick presets */}
              <div className="flex flex-wrap gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => onAddressSearch("Santa Monica, CA")}
                  className="text-[10px] bg-slate-950/40 hover:bg-slate-950 text-slate-300 font-medium px-2 py-1 rounded border border-slate-800/60 hover:border-slate-800 transition shadow-sm"
                >
                  🏝️ Santa Monica
                </button>
                <button
                  type="button"
                  onClick={() => onAddressSearch("Austin, TX")}
                  className="text-[10px] bg-slate-950/40 hover:bg-slate-950 text-slate-300 font-medium px-2 py-1 rounded border border-slate-800/60 hover:border-slate-800 transition shadow-sm"
                >
                  🏃 Austin, TX
                </button>
                <button
                  type="button"
                  onClick={() => onAddressSearch("Central Park, NY")}
                  className="text-[10px] bg-slate-950/40 hover:bg-slate-950 text-slate-300 font-medium px-2 py-1 rounded border border-slate-800/60 hover:border-slate-800 transition shadow-sm"
                >
                  🌳 Central Park
                </button>
                <button
                  type="button"
                  onClick={() => onAddressSearch("Miami Beach, FL")}
                  className="text-[10px] bg-slate-950/40 hover:bg-slate-950 text-slate-300 font-medium px-2 py-1 rounded border border-slate-800/60 hover:border-slate-800 transition shadow-sm"
                >
                  ☀️ Miami Beach
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nearby Spots plotted list */}
        <div className="mt-3 bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Nearby Plotted Spots ({pins.length})
            </span>
            <button 
              type="button" 
              onClick={() => setShowNearbySpots(!showNearbySpots)}
              className="text-[#A1A1AA] hover:text-white transition"
            >
              {showNearbySpots ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showNearbySpots && (
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 transition-all">
              {pins.length === 0 ? (
                <div className="text-[10px] text-slate-500 py-1.5 text-center leading-normal italic">
                  Search nearby or ask about gyms/restaurants to plot active options.
                </div>
              ) : (
                pins.map((pin) => {
                  const isSelected = selectedPin?.id === pin.id;
                  const isGrounding = pin.source === "grounding";
                  return (
                    <button
                      key={pin.id}
                      type="button"
                      onClick={() => onPinSelect(pin)}
                      className={`w-full text-left p-1.5 px-2 rounded-lg text-xs transition border flex items-start gap-2 ${
                        isSelected 
                          ? "bg-slate-950 border-cyan-500 text-slate-100 shadow-inner animate-pulse" 
                          : "bg-slate-950/40 border-transparent text-slate-300 hover:bg-slate-950/70 hover:border-slate-800"
                      }`}
                    >
                      <MapPin className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                        isGrounding ? "text-emerald-400" : isSelected ? "text-cyan-400" : "text-slate-500"
                      }`} />
                      
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold truncate text-[11px]">{pin.name}</p>
                          <span className={`text-[8px] px-1 py-0.5 rounded tracking-wide font-bold uppercase shrink-0 ${
                            isGrounding ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/40" : "bg-slate-900 text-slate-400"
                          }`}>
                            {isGrounding ? "grounded" : "search"}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <p className="truncate pr-2">{pin.address || "Click to focus and load address"}</p>
                          {pin.rating && (
                            <span className="flex items-center gap-0.5 text-yellow-500 font-mono text-[9px] shrink-0">
                              <Star className="w-2.5 h-2.5 fill-yellow-500 stroke-yellow-500" />
                              {pin.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Overhaultrain Performance Waitlist Netlify Form */}
        <div className="mt-3 bg-slate-900 border border-slate-800 rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              Overhaultrain Elite Waitlist
            </span>
            <button 
              type="button" 
              onClick={() => setShowWaitlist(!showWaitlist)}
              className="text-[#A1A1AA] hover:text-white transition"
            >
              {showWaitlist ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showWaitlist && (
            <div className="space-y-2 animate-in fade-in duration-200 text-xs">
              {!waitlistSubmitted ? (
                <form 
                  name="waitlist" 
                  onSubmit={handleWaitlistSubmit}
                  className="space-y-1.5"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                >
                  {/* React boilerplate for Netlify Forms */}
                  <input type="hidden" name="form-name" value="waitlist" />
                  <p className="text-[10.5px] text-slate-400 leading-normal">
                    Get premium early updates on next wave features, high intensity route guides, and custom training alerts.
                  </p>
                  
                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        name="email"
                        required
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-600 focus:outline-none rounded-lg px-2.5 py-1.5 text-[11px] text-slate-150 pl-7"
                        disabled={submittingWaitlist}
                      />
                      <Mail className="w-3 h-3 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingWaitlist || !waitlistEmail.trim()}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-[11px] font-bold text-white px-3 py-1.5 rounded-lg transition whitespace-nowrap"
                    >
                      {submittingWaitlist ? "Joining..." : "Join Waitlist"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-2 py-2.5 bg-purple-950/40 border border-purple-900/30 rounded-lg text-center text-purple-400 space-y-1 animate-in zoom-in-95 duration-200">
                  <p className="font-bold text-[11px] flex items-center justify-center gap-1">
                    🚀 System Slot Secured!
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Your spot is registered! Watch your inbox for executive fitness telemetry.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-900/50 flex items-center justify-center text-blue-400 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-sm font-semibold text-slate-200">Say Hello to Overhaultrain</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                I am your location-aware AI voice coach. Tap anywhere on the map or click the microphone to speak questions about local parks, scenic trails, outdoor running routes, or high-rated food spots.
              </p>
            </div>

            {/* Quick starts structured beautifully matching branding theme */}
            <div className="grid grid-cols-1 gap-2 w-full text-left pt-2">
              <button 
                onClick={() => handleQuickPrompt("Suggest a great scenic route or outdoor park for running near here.")}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl transition flex items-center gap-2"
              >
                <div className="p-1 rounded-md bg-purple-950 text-purple-400">🏃</div>
                <span>Scenic workout & running parks</span>
              </button>
              <button 
                onClick={() => handleQuickPrompt("What are the best healthy high-protein restaurants or food spots nearby?")}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl transition flex items-center gap-2"
              >
                <div className="p-1 rounded-md bg-blue-950 text-blue-400">🥗</div>
                <span>Healthy, high-protein dining nearby</span>
              </button>
              <button 
                onClick={() => handleQuickPrompt("Recommend landmarks or scenic lookout points close to this center.")}
                className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 p-2.5 rounded-xl transition flex items-center gap-2"
              >
                <div className="p-1 rounded-md bg-slate-850 text-[#A1A1AA]">⛰️</div>
                <span>Mountain peaks & scenic lookout views</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isAi = msg.role === "model";
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"} gap-1`}
                >
                  <div className={`text-[10px] text-slate-500 font-medium px-1 flex items-center gap-1 ${isAi ? "flex-row" : "flex-row-reverse"}`}>
                    <span>{isAi ? "Overhaultrain Coach" : "Audience"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  
                  {/* Message bubble themed with prompt colors */}
                  <div 
                    className={`p-3.5 rounded-2xl max-w-[90%] text-xs shadow-md border ${
                      isAi 
                        ? "bg-slate-900 text-slate-200 border-slate-800/85 rounded-tl-none font-sans" 
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 rounded-tr-none font-sans"
                    }`}
                  >
                    {isAi ? (
                      <div className="markdown-body space-y-2 leading-relaxed">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    )}
                  </div>

                  {/* Grounded references links per policy mandate */}
                  {isAi && msg.references && msg.references.length > 0 && (
                    <div className="mt-1.5 w-full bg-slate-900/40 p-2 px-3 rounded-xl border border-slate-800/60 max-w-[90%]">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Layers className="w-3 h-3 text-cyan-400" />
                        <span className="text-[9px] text-[#A1A1AA] uppercase tracking-widest font-bold">
                          Verified Google Maps Ground Truth
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {msg.references.map((ref, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            {ref.uri ? (
                              <a 
                                href={ref.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1 font-medium truncate"
                              >
                                <span className="bg-blue-950 text-blue-400 w-3.5 h-3.5 inline-flex items-center justify-center rounded text-[8px] font-mono select-none flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="truncate">{ref.title || "View on Google Maps"}</span>
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400 inline-flex items-center gap-1 truncate">
                                <span className="bg-slate-800 text-slate-400 w-3.5 h-3.5 inline-flex items-center justify-center rounded text-[8px] font-mono select-none flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="truncate">{ref.title || "Local Point"}</span>
                              </span>
                            )}
                            {ref.text && (
                              <p className="text-[10px] text-slate-500 italic pl-5 line-clamp-1 leading-normal">
                                "{ref.text}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex flex-col items-start gap-1">
            <div className="text-[10px] text-slate-500 font-medium px-1">Coach is analyzing geographic layers...</div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 max-w-[90%] flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
              <span className="text-xs text-slate-400 italic ml-2.5 animate-pulse">Running Google Maps query...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section with integrated Real-time Voice Controller */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex-shrink-0 space-y-3">
        {speechError && (
          <div className="text-[10px] text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900/30 text-center">
            {speechError}
          </div>
        )}

        {/* Dynamic Context Hint */}
        {currentCoordinates && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800/80 shrink-0">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate max-w-[180px]">Query focused around {currentPlaceName}</span>
            </span>
            <button 
              type="button"
              onClick={() => handleQuickPrompt(`Recommend optimal outdoor workout structures or calisthenics parks around ${currentPlaceName}.`)}
              className="text-[10px] text-blue-400 hover:underline font-medium shrink-0"
            >
              Calisthenics 💪
            </button>
          </div>
        )}

        {/* Actual form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          {/* Continuous Voice Dictation state indicator inside input row */}
          <div className="relative flex-1">
            <input
              id="chat-message-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening natively... Speak now!" : "Ask Coach or speak e.g. trails, high protein..."}
              className={`w-full bg-slate-900 border ${
                isListening ? "border-blue-500 focus:ring-blue-500" : "border-slate-800 focus:ring-blue-600"
              } rounded-xl pl-4 pr-10 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 text-xs text-left transition-colors`}
              disabled={loading}
            />
            
            {/* Inline Microphone controller inside search bar */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title={isListening ? "Stop voice input" : "Speak to coach"}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            id="chat-send-btn"
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 disabled:bg-slate-800 disabled:text-slate-600 font-semibold p-2.5 rounded-xl transition shadow-lg shrink-0 flex items-center justify-center text-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex justify-between items-center text-[10px]">
          {/* Text to Speech synthesizer toggler */}
          <button
            type="button"
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`flex items-center gap-1.5 font-medium transition ${
              isVoiceEnabled ? "text-blue-400 hover:text-blue-300" : "text-slate-500 hover:text-slate-400"
            }`}
            title="Toggle read aloud"
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Text-to-Speech active</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Text-to-Speech disabled</span>
              </>
            )}
          </button>

          <button 
            type="button"
            id="clear-history-button"
            onClick={onClearHistory}
            className="text-slate-500 hover:text-slate-300 transition flex items-center gap-1 font-medium ring-offset-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-0.5"
          >
            <RefreshCw className="w-3 h-3" /> Clear Context
          </button>
        </div>
      </div>
    </div>
  );
}

