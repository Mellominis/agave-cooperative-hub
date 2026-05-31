import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
  Plus, Search, Star, Flame, MapPin, Utensils, TrendingUp, Sparkles, 
  Trash2, Compass, Calendar, X, Heart, ShieldAlert, CheckCircle, 
  Dumbbell, MessageSquare, Award, Clock, Loader2
} from "lucide-react";
import { auth } from "../firebase";
import { useLocalization } from "../LocalizationContext";
import {
  supabase,
  fetchTastings,
  insertTasting,
  deleteTasting,
  fetchWellnessLogs,
  insertWellnessLog,
  type TastingRow,
  type WellnessRow,
} from "../supabase";

interface TastingJournalDashboardProps {
  onToggleMap?: () => void;
}

export default function TastingJournalDashboard({ onToggleMap }: TastingJournalDashboardProps) {
  const { t } = useLocalization();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "nutrition" | "tastings" | "checkins">("overview");

  // ── Supabase data state ───────────────────────────────────────────────────
  const [tastings, setTastings] = useState<TastingRow[]>([]);
  const [wellnessLogs, setWellnessLogs] = useState<WellnessRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [savingTasting, setSavingTasting] = useState(false);
  const [savingWellness, setSavingWellness] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Sample static preset catalog data
  const nutritionItems = [
    { id: 1, name: "Chicken Breast", weight: "150g cooked", protein: "31g", carbs: "0g", calories: "+165" },
    { id: 2, name: "White Rice", weight: "100g cooked", protein: "2.7g", carbs: "28g", calories: "+130" },
    { id: 3, name: "Boiled Egg", weight: "1 large", protein: "6.3g", carbs: "0.6g", calories: "+78" },
    { id: 4, name: "Baked Salmon", weight: "115g cooked", protein: "22g", carbs: "0g", calories: "+206" },
  ];

  // ── Load data from Supabase on mount ─────────────────────────────────────
  const loadData = useCallback(async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setDataError(null);
    try {
      const [tastingsData, wellnessData] = await Promise.all([
        fetchTastings(userId),
        fetchWellnessLogs(userId),
      ]);
      setTastings(tastingsData);
      setWellnessLogs(wellnessData);
    } catch (err: any) {
      console.error("Supabase load error:", err);
      setDataError("Could not load data. Check database sync.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Real-time subscription ────────────────────────────────────────────────
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const tastingChannel = supabase
      .channel("tasting_entries_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasting_entries", filter: `user_id=eq.${userId}` } as any,
        () => { loadData(); }
      )
      .subscribe();

    const wellnessChannel = supabase
      .channel("wellness_logs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wellness_logs", filter: `user_id=eq.${userId}` } as any,
        () => { loadData(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tastingChannel);
      supabase.removeChannel(wellnessChannel);
    };
  }, [loadData]);

  // ── Form states ───────────────────────────────────────────────────────────
  const [newFoodName, setNewFoodName] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newProtein, setNewProtein] = useState<number>(20);
  const [newCarbs, setNewCarbs] = useState<number>(10);
  const [newCalories, setNewCalories] = useState<number>(150);
  const [newRating, setNewRating] = useState<number>(5);
  const [newFlavor, setNewFlavor] = useState("Savory & Amino");
  const [newSensoryNote, setNewSensoryNote] = useState("");

  const [moodRate, setMoodRate] = useState<number>(8);
  const [energyRate, setEnergyRate] = useState<number>(7);
  const [physicalNote, setPhysicalNote] = useState("");

  // ── Google OAuth Sync States & Handlers ────────────────────────────────────
  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("google_health_access_token");
  });
  const [googleProfile, setGoogleProfile] = useState<any>(() => {
    const json = localStorage.getItem("google_health_profile");
    return json ? JSON.parse(json) : null;
  });

  const handleSyncGoogleHealth = () => {
    setGoogleSyncing(true);
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || "648490686014-j51rg307ade591gj45e1u3t8ep1oba4a.apps.googleusercontent.com";
    
    const redirectUri = window.location.origin;
    const scopes = [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.body.read",
      "https://www.googleapis.com/auth/fitness.nutrition.read",
      "https://www.googleapis.com/auth/fitness.heart_rate.read",
      "https://www.googleapis.com/auth/fitness.sleep.read"
    ].join(" ");

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: clientId.trim(),
      redirect_uri: redirectUri,
      response_type: "token",
      scope: scopes,
      include_granted_scopes: "true",
      state: "google_health_sync"
    }).toString();

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "google_health_sync_popup",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      setDataError("Popup blocked. Please enable popups to sync Google Health.");
      setGoogleSyncing(false);
      return;
    }

    const interval = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(interval);
          setGoogleSyncing(false);
          return;
        }

        const currentUrl = popup.location.href;
        if (currentUrl.includes(window.location.origin)) {
          const hash = popup.location.hash;
          if (hash) {
            const params = new URLSearchParams(hash.substring(1));
            const accessToken = params.get("access_token");
            if (accessToken) {
              localStorage.setItem("google_health_access_token", accessToken);
              setGoogleAccessToken(accessToken);
              
              fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
              })
                .then(res => res.json())
                .then(profile => {
                  if (profile && profile.name) {
                    localStorage.setItem("google_health_profile", JSON.stringify(profile));
                    setGoogleProfile(profile);
                  }
                })
                .catch(err => console.error("Error fetching Google profile info:", err));

              clearInterval(interval);
              popup.close();
              setGoogleSyncing(false);
            }
          }
        }
      } catch (e) {
        // Ignore cross-origin domain protection exceptions during the redirection
      }
    }, 500);
  };

  const handleDisconnectGoogleHealth = () => {
    localStorage.removeItem("google_health_access_token");
    localStorage.removeItem("google_health_profile");
    setGoogleAccessToken(null);
    setGoogleProfile(null);
  };

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleAddTasting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName.trim()) return;
    const userId = auth.currentUser?.uid;
    if (!userId) { setDataError("Not signed in."); return; }

    setSavingTasting(true);
    setDataError(null);
    try {
      const row = await insertTasting(userId, {
        name: newFoodName.trim(),
        weight: newWeight || "1 serving",
        protein: Number(newProtein) || 0,
        carbs: Number(newCarbs) || 0,
        calories: Number(newCalories) || 0,
        rating: newRating,
        primary_flavor: newFlavor,
        sensory_note: newSensoryNote || "No sensory notes left.",
      });
      // Prepend to tastings
      setTastings((prev) => [row, ...prev]);
      setNewFoodName(""); setNewWeight(""); setNewProtein(20);
      setNewCarbs(10); setNewCalories(150); setNewRating(5); setNewSensoryNote("");
    } catch (err: any) {
      setDataError(`Save failed: ${err.message}`);
    } finally {
      setSavingTasting(false);
    }
  };

  const handleDeleteTasting = async (id: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    // Optimistic removal
    setTastings((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTasting(id, userId);
    } catch (err: any) {
      setDataError(`Delete failed: ${err.message}`);
      loadData(); // Revert on failure
    }
  };

  const handleCreateCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = auth.currentUser?.uid;
    if (!userId) { setDataError("Not signed in."); return; }

    setSavingWellness(true);
    setDataError(null);
    try {
      const row = await insertWellnessLog(userId, {
        mood: moodRate,
        energy: energyRate,
        comment: physicalNote || "Routine wellness status logged.",
      });
      setWellnessLogs((prev) => [row, ...prev]);
      setPhysicalNote("");
    } catch (err: any) {
      setDataError(`Save failed: ${err.message}`);
    } finally {
      setSavingWellness(false);
    }
  };

  const handleSelectPreset = (item: any) => {
    setNewFoodName(item.name);
    setNewWeight(item.weight);
    setNewProtein(parseFloat(item.protein) || 0);
    setNewCarbs(parseFloat(item.carbs) || 0);
    setNewCalories(parseInt(item.calories.replace("+", "")) || 150);
    setActiveSubTab("tastings");
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredTastings = useMemo(() => {
    if (!searchQuery.trim()) return tastings;
    const q = searchQuery.toLowerCase();
    return tastings.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.primary_flavor.toLowerCase().includes(q) ||
        t.sensory_note.toLowerCase().includes(q)
    );
  }, [tastings, searchQuery]);

  const filteredPresets = useMemo(() => {
    if (!searchQuery.trim()) return nutritionItems;
    const q = searchQuery.toLowerCase();
    return nutritionItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const metricsSummary = useMemo(() => {
    return tastings.reduce(
      (acc, t) => { acc.calories += t.calories; acc.protein += t.protein; acc.carbs += t.carbs; return acc; },
      { calories: 0, protein: 0, carbs: 0 }
    );
  }, [tastings]);

  const avgRating = useMemo(() => {
    if (tastings.length === 0) return 0;
    return (tastings.reduce((s, t) => s + t.rating, 0) / tastings.length).toFixed(1);
  }, [tastings]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full bg-[#0b0f19] text-white flex flex-col font-sans antialiased selection:bg-purple-500/30 overflow-hidden">

      {/* Error banner */}
      {dataError && (
        <div className="w-full px-4 py-2 bg-rose-950/60 border-b border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-top">
          <span>⚠️ {dataError}</span>
          <button onClick={() => setDataError(null)} className="text-rose-400 hover:text-white transition"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* Compact Top Header (Mid-page section containing downsized header and Map View button) */}
      <header className="flex justify-between items-center py-1.5 px-3 border-b border-slate-900 bg-[#0e1424]/40 backdrop-blur shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-purple-400 text-xs">🍴</span>
          <h2 className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-300 uppercase">
            {t("dashboard.header")}
          </h2>
        </div>
        <button
          onClick={() => { if (onToggleMap) onToggleMap(); else setIsMapOpen(true); }}
          className="text-[10px] bg-purple-600/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-md hover:bg-purple-600 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center gap-1 shrink-0"
        >
          🗺️ Map View
        </button>
      </header>

      {/* Tab bar + search */}
      <div className="w-full px-5 py-2 bg-[#0d1321]/60 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none select-none">
          {[
            { id: "overview",  label: "Overview Hub",     icon: Sparkles },
            { id: "tastings",  label: "Tasting Logger",   icon: Utensils },
            { id: "nutrition", label: "Preset Catalog",   icon: HighlightIcon },
            { id: "checkins",  label: "Wellness Vault",   icon: Heart },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSubTab(id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition capitalize select-none cursor-pointer shrink-0 ${
                activeSubTab === id
                  ? "bg-gradient-to-r from-purple-900/40 to-indigo-900/50 border border-purple-500/40 text-purple-200"
                  : "text-slate-400 hover:text-slate-100 border border-transparent hover:bg-slate-900/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs w-full sm:w-60 shrink-0">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flavor or ingredients..."
            className="w-full bg-slate-900/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2 top-2 text-slate-400 hover:text-slate-250">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loadingData && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2.5 text-slate-400 text-xs">
          <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
          <span>Synchronizing with Cloud Database…</span>
        </div>
      )}

      {!loadingData && (
        <main className="flex-1 overflow-y-auto p-5 md:p-6 pb-24 space-y-6 scrollbar-thin scrollbar-thumb-purple-900/60 scroll-smooth">

          {/* ── OVERVIEW ── */}
          {activeSubTab === "overview" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-gradient-to-r from-slate-950 via-[#131b2e] to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-purple-400 uppercase">
                      <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Smart Tasting Metrics
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-white mb-1">
                      Align your meal sensory taste with athletic goals
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                      Every athlete deserves savory, delicious meals. Log flavor tags and sensory ratings here to discover culinary combinations that meet your target fitness fuel metrics perfectly.
                    </p>
                  </div>
                  <div className="bg-purple-950/30 border border-purple-500/20 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">Journal Count</h4>
                      <span className="text-lg font-black text-white">{tastings.length} Logged Entries</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom duration-300">
                {[
                  { icon: "🍛", label: "Logged Calories",  value: `${metricsSummary.calories} kcal`, color: "orange" },
                  { icon: "💪", label: "Total Protein",     value: `${metricsSummary.protein}g`,      color: "purple" },
                  { icon: "📈", label: "Average Taste",     value: `${avgRating} / 5.0 ★`,            color: "cyan" },
                  { icon: "⚡", label: "Wellness Check-ins", value: `${wellnessLogs.length} Logged`,  color: "emerald" },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-purple-950/30 text-purple-400 text-lg">{icon}</div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</span>
                      <p className="text-lg font-black text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" /> Recent Culinary Tasting History
                  </h3>
                  {filteredTastings.length === 0 ? (
                    <div className="bg-slate-900/30 border border-slate-800/60 p-12 rounded-3xl text-center">
                      <p className="text-slate-500 text-xs italic">No tasting logs yet — add one in the Tasting Logger tab!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTastings.slice(0, 5).map((log) => (
                        <TastingCard key={log.id} log={log} onDelete={handleDeleteTasting} formatDate={formatDate} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-slate-400" /> Sensory Taste Analytics
                  </h3>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-xl">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Flavor Concentration Quotient</h4>
                    <div className="space-y-3 text-xs">
                      {[
                        { label: "Savory & Amino Profile", pct: 60, color: "from-purple-600 to-indigo-500", textColor: "text-purple-400" },
                        { label: "Sweet & Nutty Profile", pct: 25, color: "from-amber-600 to-amber-400",   textColor: "text-amber-400" },
                        { label: "Sour & Acidic Profile",   pct: 15, color: "from-cyan-600 to-teal-400",     textColor: "text-cyan-400" },
                      ].map(({ label, pct, color, textColor }) => (
                        <div key={label}>
                          <div className="flex justify-between text-slate-400 mb-1">
                            <span>{label}</span>
                            <span className={`${textColor} font-bold`}>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div className={`bg-gradient-to-r ${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-[11px] leading-normal text-slate-400 flex gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p>Your culinary palette favors glutamic savory tones — perfectly aligned with high-protein adherence.</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 shadow-xl">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Active Check-In Status</h4>
                    {wellnessLogs.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl">
                          <div className="text-lg">🧠</div>
                          <span className="text-[10px] text-slate-500 font-bold block uppercase mt-0.5">Last Mood</span>
                          <strong className="text-sm font-black text-cyan-400">{wellnessLogs[0].mood} / 10</strong>
                        </div>
                        <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl">
                          <div className="text-lg">⚡</div>
                          <span className="text-[10px] text-slate-500 font-bold block uppercase mt-0.5">Last Energy</span>
                          <strong className="text-sm font-black text-purple-400">{wellnessLogs[0].energy} / 10</strong>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic">No check-ins logged yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TASTING LOGGER ── */}
          {activeSubTab === "tastings" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-slate-400" /> Log Nutritional Flavor Review
                </h3>
                <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-3xl shadow-xl">
                  <form onSubmit={handleAddTasting} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 block mb-1.5 font-bold">Food or Recipe Name *</label>
                        <input type="text" value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} required placeholder="e.g. Honey Pecan Crusted Cod" className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-650 focus:outline-none focus:border-purple-500 transition-colors" />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1.5 font-bold">Serving / Weight Context</label>
                        <input type="text" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="e.g. 150g cooked, 1 cup" className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-650 focus:outline-none focus:border-purple-500 transition-colors" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {([["Calories (kcal)", newCalories, setNewCalories], ["Protein (g)", newProtein, setNewProtein], ["Carbs (g)", newCarbs, setNewCarbs]] as [string, number, (v: number) => void][]).map(([lbl, val, setter]) => (
                        <div key={lbl}>
                          <label className="text-slate-400 block mb-1.5 font-bold">{lbl}</label>
                          <input type="number" value={val} onChange={(e) => setter(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850 pt-4">
                      <div>
                        <label className="text-slate-400 block mb-1.5 font-bold">Primary Flavor Signature</label>
                        <select value={newFlavor} onChange={(e) => setNewFlavor(e.target.value)} className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-purple-500">
                          {["Savory & Amino", "Sweet & Nutty", "Umami & Complex", "Tangy & Refreshing", "Spicy & Warming", "Bitter & Rich"].map((f) => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1.5 font-bold">Taste Rating Evaluation</label>
                        <div className="flex items-center gap-1.5 h-10">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button key={i} type="button" onClick={() => setNewRating(i + 1)} className="text-slate-500 hover:scale-125 hover:text-yellow-400 transition cursor-pointer active:scale-95">
                              <Star className={`w-6 h-6 ${i < newRating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`} />
                            </button>
                          ))}
                          <span className="text-slate-400 text-xs font-bold pl-2">({newRating}/5)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1.5 font-bold">Sensory Descriptions / Texture Notes</label>
                      <textarea rows={3} value={newSensoryNote} onChange={(e) => setNewSensoryNote(e.target.value)} placeholder="Textures, aroma notes, and initial palette response..." className="w-full bg-slate-950 focus:border-purple-500/80 focus:outline-none rounded-xl p-3 text-slate-200 text-xs leading-relaxed border border-slate-800/80" />
                    </div>
                    <button type="submit" disabled={savingTasting} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-purple-950/20 active:scale-[0.985] transition-transform text-xs flex items-center justify-center gap-2">
                      {savingTasting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      {savingTasting ? "Saving to Cloud DB…" : "Save Tasting Journal Entry"}
                    </button>
                  </form>
                </div>

                {/* Existing logs */}
                {filteredTastings.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Entries ({filteredTastings.length})</h4>
                    {filteredTastings.map((log) => (
                      <TastingCard key={log.id} log={log} onDelete={handleDeleteTasting} formatDate={formatDate} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-slate-400" /> Tasting Instructions
                </h3>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 text-xs leading-relaxed text-slate-400">
                  {[
                    { n: 1, title: "Rate your food flavor profile", body: "Log reviews so the coach recommending recipes understands your exact flavour inclinations." },
                    { n: 2, title: "Balance training macros", body: "Each tasting tracks protein, carbohydrates, and calories, giving you deep visibility over post-workout replenishment." },
                    { n: 3, title: "Utilize Catalog Presets", body: "Switch to the \"Preset Catalog\" tab and import database presets with a single click!" },
                  ].map(({ n, title, body }) => (
                    <div key={n} className="flex gap-2.5 items-start">
                      <span className="p-1 rounded-lg bg-purple-950/40 text-purple-400 font-bold block shrink-0 text-center w-6">{n}</span>
                      <div>
                        <h5 className="font-bold text-slate-200">{title}</h5>
                        <p className="mt-0.5 text-slate-400 text-[11px]">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-950/10 border border-emerald-500/10 p-5 rounded-3xl">
                  <div className="flex gap-3 items-center mb-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Firestore Sync Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    All tasting entries are persisted in real-time to your Cloud Firestore database and will be available across sessions and devices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── PRESET CATALOG ── */}
          {activeSubTab === "nutrition" && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-purple-400 animate-pulse" /> Overhaultrain Preset Nutrition Food Items
              </h3>
              <p className="text-xs text-slate-400 leading-normal max-w-2xl">Quickly select standard healthy high-protein options. Tapping an item auto-fills the Tasting Logger!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {filteredPresets.map((item) => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-colors group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{item.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-850 font-mono">{item.calories} k</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block">Weight: {item.weight}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] border-t border-slate-950 pt-3">
                      <div className="flex gap-2">
                        <span className="bg-purple-950/30 text-purple-300 px-1.5 py-0.5 rounded text-[10px] font-bold">P: {item.protein}</span>
                        <span className="bg-amber-950/30 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-bold">C: {item.carbs}</span>
                      </div>
                      <button type="button" onClick={() => handleSelectPreset(item)} className="px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-500 text-purple-100 hover:text-white transition-all text-[10.5px] font-bold cursor-pointer active:scale-95 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WELLNESS VAULT ── */}
          {activeSubTab === "checkins" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 animate-pulse" /> Commit Daily Athlete Wellness Status
                </h3>
                <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-3xl shadow-xl">
                  <form onSubmit={handleCreateCheckin} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: "Psychological Mood Focus", val: moodRate, setter: setMoodRate, color: "accent-cyan-400", textColor: "text-cyan-400", lo: "Fatigued", hi: "Excellent Focus" },
                        { label: "Physical Energy Metric",   val: energyRate, setter: setEnergyRate, color: "accent-purple-500", textColor: "text-purple-400", lo: "Sore / Exhausted", hi: "Peak Power" },
                      ].map(({ label, val, setter, color, textColor, lo, hi }) => (
                        <div key={label} className="space-y-2">
                          <label className="text-slate-400 font-bold flex justify-between">
                            <span>{label}</span>
                            <span className={`${textColor} font-black text-sm`}>{val} / 10</span>
                          </label>
                          <input type="range" min="1" max="10" value={val} onChange={(e) => setter(Number(e.target.value))} className={`w-full ${color} bg-slate-950 h-2.5 rounded-full outline-none`} />
                          <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                            <span>1 ({lo})</span><span>10 ({hi})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2">
                      <label className="text-slate-400 block mb-1.5 font-bold">Soreness / Recovery Notes</label>
                      <textarea rows={2} value={physicalNote} onChange={(e) => setPhysicalNote(e.target.value)} placeholder="Comment on muscle tightness, recovery quality, sleep indicators..." className="w-full bg-slate-950 focus:border-rose-400 focus:outline-none rounded-xl p-3 text-slate-200 text-xs leading-relaxed border border-slate-800/80" />
                    </div>
                    <button type="submit" disabled={savingWellness} className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 py-3 rounded-xl font-bold text-white shadow-lg active:scale-[0.985] transition-transform text-xs flex items-center justify-center gap-2">
                      {savingWellness ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      {savingWellness ? "Saving to Cloud DB…" : "Save Diagnostic Wellness Check-in"}
                    </button>
                  </form>
                </div>

                {wellnessLogs.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Previous Check-ins ({wellnessLogs.length})</h4>
                    {wellnessLogs.map((log) => (
                      <div key={log.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-rose-500" /> {formatDate(log.created_at)}
                          </span>
                          <div className="flex gap-2 text-[10.5px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-cyan-950/30 text-cyan-400 border border-cyan-900/20 font-bold">Mood: {log.mood}/10</span>
                            <span className="px-2 py-0.5 rounded bg-purple-950/30 text-purple-400 border border-purple-900/20 font-bold">Energy: {log.energy}/10</span>
                          </div>
                        </div>
                        <p className="text-slate-300 text-xs italic bg-slate-950/30 p-2.5 rounded-xl border border-slate-850/40">"{log.comment}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Google Health Sync Control Card */}
                <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-slate-800 p-5 rounded-3xl space-y-3.5 shadow-xl animate-in fade-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">🌐</span>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-sans">Google Health Integration</h4>
                  </div>
                  
                  {googleAccessToken ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <div className="text-[11px] text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">
                          {googleProfile ? (
                            <span>Connected as <strong>{googleProfile.name}</strong></span>
                          ) : (
                            <span>Google Health Sync Active</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-[#94a3b8] leading-relaxed">
                        Successfully synchronized Google Fit, unified Fitbit metrics, & Health account credentials! Ready to fetch steps, calories, sleeping and exercises.
                      </p>
                      <button
                        type="button"
                        onClick={handleDisconnectGoogleHealth}
                        className="w-full text-center px-3 py-2 bg-rose-950/40 hover:bg-rose-900 border border-rose-500/20 text-rose-300 rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                      >
                        Disconnect Integration
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-[11.5px] text-[#94a3b8] leading-relaxed">
                        Connect your Google account to synchronize active steps, target calorie indexes, fitness exercises, sleep logs, and paired Fitbit device metrics securely under the unified Google Health platform.
                      </p>
                      <button
                        type="button"
                        onClick={handleSyncGoogleHealth}
                        disabled={googleSyncing}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 transition active:scale-95 font-bold rounded-xl text-xs cursor-pointer shadow-md"
                      >
                        {googleSyncing ? (
                          <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                        ) : (
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                        )}
                        <span>Sync Google Health Data</span>
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Dumbbell className="w-4 h-4 text-purple-400" /> Efficacy Indicators
                </h3>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 text-xs leading-relaxed text-slate-400">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">Why track recovery status?</h4>
                  <p>Training hard is only 50% of the fitness equation. By storing Psychological Mood and Physical Energy metrics, your coaches can safely assess workout intensity and proactively suggest rest days.</p>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl leading-normal flex flex-col gap-2">
                    <span className="text-amber-400 font-bold">★ AI Coaching Insight:</span>
                    <p className="text-[11px]">Your energy has climbed 15% following early dinner tasting logs. Rest intervals seem balanced correctly.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

    </div>
  );
}

// ── Extracted tasting card sub-component ─────────────────────────────────────
function TastingCard({
  log,
  onDelete,
  formatDate,
}: {
  log: TastingRow;
  onDelete: (id: string) => void | Promise<void>;
  formatDate: (s: string) => string;
  key?: string | number;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700/80 p-4 rounded-2xl transition duration-150 space-y-3 group animate-in fade-in">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{log.name}</h4>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-medium">{log.weight}</span>
          </div>
          <span className="text-[9.5px] text-slate-500 font-bold block mt-1">{formatDate(log.created_at)}</span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < log.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`} />
            ))}
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-950/30 border border-purple-500/20 text-purple-300 text-[9.5px] font-bold">{log.primary_flavor}</span>
        </div>
      </div>
      <p className="text-slate-300 text-xs italic bg-slate-950/40 p-3 rounded-xl border border-slate-900 leading-normal">"{log.sensory_note}"</p>
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-950/40">
        <div className="flex gap-3 text-[10.5px]">
          <span>Protein: <strong className="text-purple-400">{log.protein}g</strong></span>
          <span>Carbs: <strong className="text-amber-400">{log.carbs}g</strong></span>
          <span>Calories: <strong className="text-emerald-400">+{log.calories} kcal</strong></span>
        </div>
        <button type="button" onClick={() => onDelete(log.id)} className="text-slate-500 hover:text-rose-400 transition flex items-center gap-1 cursor-pointer active:scale-95" title="Delete log">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function HighlightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={props.className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66a2.25 2.25 0 00-1.592-.659z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}
