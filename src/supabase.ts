/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith("http://") || supabaseUrl.startsWith("https://"));

if (!hasValidCredentials) {
  console.warn(
    "Supabase credentials not configured or invalid. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

// Fallback to a valid placeholder structure to prevent createClient from throwing an error on module load
const finalUrl = hasValidCredentials ? supabaseUrl : "https://placeholder-project.supabase.co";
const finalKey = hasValidCredentials ? supabaseAnonKey : "placeholder-anon-key";

export const supabase = createClient(finalUrl, finalKey);

function checkSupabaseConfigured() {
  if (!hasValidCredentials) {
    throw new Error(
      "Supabase project credentials are not integrated. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file."
    );
  }
}

// ── Type definitions matching Supabase tables ────────────────────────────────

export interface TastingRow {
  id: string;
  user_id: string;
  name: string;
  weight: string;
  protein: number;
  carbs: number;
  calories: number;
  rating: number;
  primary_flavor: string;
  sensory_note: string;
  created_at: string;
}

export interface WellnessRow {
  id: string;
  user_id: string;
  mood: number;
  energy: number;
  comment: string;
  created_at: string;
}

// ── CRUD helpers ─────────────────────────────────────────────────────────────

export async function fetchTastings(userId: string): Promise<TastingRow[]> {
  checkSupabaseConfigured();
  const { data, error } = await supabase
    .from("tasting_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`fetchTastings: ${error.message}`);
  return data ?? [];
}

export async function insertTasting(
  userId: string,
  entry: Omit<TastingRow, "id" | "user_id" | "created_at">
): Promise<TastingRow> {
  checkSupabaseConfigured();
  const { data, error } = await supabase
    .from("tasting_entries")
    .insert({ ...entry, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(`insertTasting: ${error.message}`);
  return data;
}

export async function deleteTasting(id: string, userId: string): Promise<void> {
  checkSupabaseConfigured();
  const { error } = await supabase
    .from("tasting_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(`deleteTasting: ${error.message}`);
}

export async function fetchWellnessLogs(userId: string): Promise<WellnessRow[]> {
  checkSupabaseConfigured();
  const { data, error } = await supabase
    .from("wellness_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`fetchWellnessLogs: ${error.message}`);
  return data ?? [];
}

export async function insertWellnessLog(
  userId: string,
  entry: Omit<WellnessRow, "id" | "user_id" | "created_at">
): Promise<WellnessRow> {
  checkSupabaseConfigured();
  const { data, error } = await supabase
    .from("wellness_logs")
    .insert({ ...entry, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(`insertWellnessLog: ${error.message}`);
  return data;
}
