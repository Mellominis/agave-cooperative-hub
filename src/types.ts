/**
 * TypeScript Type Definitions for Map Chatbot Applet
 */

export interface GeolocationState {
  lat: number;
  lng: number;
  accuracy?: number | null;
  error?: string | null;
  loading: boolean;
}

export interface GroundingChunk {
  title?: string;
  uri?: string;
  text?: string;
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  references?: GroundingChunk[];
}

export interface PlacePin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
  rating?: number;
  userRatingCount?: number;
  phone?: string;
  website?: string;
  weekdayText?: string[];
  photos?: string[];
  source: "grounding" | "user_click" | "autocomplete_search";
}

export interface ChatHistoryItem {
  role: "user" | "model";
  text: string;
}
