import React from "react";
import { X, Star, Globe, Phone, Clock, MessageSquare, MapPin, Utensils } from "lucide-react";
import { PlacePin } from "../types";

interface PlaceDetailCardProps {
  place: PlacePin;
  onClose: () => void;
  onAskChat: (promptText: string) => void;
  onRecommendMenu?: (placeId: string, name: string) => void;
}

export default function PlaceDetailCard({ place, onClose, onAskChat, onRecommendMenu }: PlaceDetailCardProps) {
  // Extract photo URL if available
  const photoUrl = place.photos && place.photos.length > 0 ? place.photos[0] : null;

  return (
    <div 
      id="place-detail-card"
      className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[450px]"
    >
      {/* Title / Photo header */}
      <div className="relative h-40 bg-slate-100 flex-shrink-0">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={place.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-cyan-600/10 to-indigo-600/10 flex items-center justify-center text-slate-400">
            <MapPin className="w-12 h-12 stroke-[1.25]" />
          </div>
        )}
        <button 
          id="close-detail-btn"
          onClick={onClose}
          className="absolute top-2 right-2 bg-slate-900/40 text-white hover:bg-slate-900/60 transition p-1.5 rounded-full backdrop-blur-sm"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 pt-10">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500 text-white font-medium uppercase tracking-wider">
            {place.source === "grounding" ? "AI Highlighted" : place.source === "user_click" ? "Selected Pin" : "Searched spot"}
          </span>
          <h3 className="text-lg font-bold text-white leading-tight mt-1 truncate">{place.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 overflow-y-auto text-slate-700 text-sm flex-1">
        {/* Short details / Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {place.rating ? (
              <>
                <div className="flex items-center text-amber-500 gap-0.5">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold text-slate-800">{place.rating}</span>
                </div>
                {place.userRatingCount && (
                  <span className="text-slate-400 text-xs">({place.userRatingCount} reviews)</span>
                )}
              </>
            ) : (
              <span className="text-slate-400 text-xs">No ratings found</span>
            )}
          </div>
          <span className="text-slate-400 font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
            {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
          </span>
        </div>

        {/* Address */}
        {place.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="text-slate-600 leading-tight">{place.address}</span>
          </div>
        )}

        {/* Phone details */}
        {place.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <a href={`tel:${place.phone}`} className="hover:underline text-cyan-600">{place.phone}</a>
          </div>
        )}

        {/* Website details */}
        {place.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <a 
              href={place.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-cyan-600 hover:underline truncate"
            >
              Visit website
            </a>
          </div>
        )}

        {/* Opening hours list if available */}
        {place.weekdayText && place.weekdayText.length > 0 && (
          <div className="border-t border-slate-50 pt-2 shrink-0">
            <div className="flex items-center gap-2 mb-1.5 font-medium text-slate-800">
              <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Opening Hours</span>
            </div>
            <div className="pl-6 space-y-0.5 text-xs text-slate-500 max-h-24 overflow-y-auto">
              {place.weekdayText.map((day, idx) => (
                <div key={idx}>{day}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Concierge triggers */}
      <div className="p-3 bg-slate-50 border-t border-slate-150 flex flex-col gap-1.5 flex-shrink-0">
        <label className="text-[10px] text-slate-400 font-medium tracking-wide uppercase px-1">Ask chatbot about this venue:</label>
        
        {onRecommendMenu && (
          <button
            onClick={() => onRecommendMenu(place.id, place.name)}
            className="w-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-3 rounded-lg text-center transition flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md mb-1"
          >
            <Utensils className="w-3.5 h-3.5 text-white animate-pulse" />
            <span>Coach order suggestions</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onAskChat(`What makes ${place.name} stand out, and what are its best features?`)}
            className="text-xs bg-white text-slate-700 hover:text-cyan-600 border border-slate-200 py-1.5 px-2 rounded-lg text-left truncate transition flex items-center gap-1.5 hover:border-cyan-200"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
            <span>Why visit?</span>
          </button>
          <button
            onClick={() => onAskChat(`Recommend spots similar to ${place.name} in this general area.`)}
            className="text-xs bg-white text-slate-700 hover:text-cyan-600 border border-slate-200 py-1.5 px-2 rounded-lg text-left truncate transition flex items-center gap-1.5 hover:border-cyan-200"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
            <span>Related places</span>
          </button>
        </div>
      </div>
    </div>
  );
}
