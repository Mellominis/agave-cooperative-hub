/**
 * App.tsx
 *
 * Owns:
 *   - LanguageProvider + AppContent shell
 *   - Sticky header (branding, language selector, pilot badge, user badge)
 *   - Country / subdomain resolution
 *   - Navigation tabs + module rendering
 *   - Footer
 *   - Logout confirmation modal (triggered from header badge;
 *     actual session clear is dispatched so AccessGate stays in sync)
 *
 * Auth / registration logic lives entirely in <AccessGate>.
 * This file only tracks registeredUser so the header badge can display the name.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sprout,
  BookOpen,
  Calculator,
  Landmark,
  ShieldCheck,
  BarChart2,
  Lock,
  LogOut,
  User,
  Heart,
  Globe,
  Droplet,
  AlertOctagon,
  ClipboardList,
} from 'lucide-react';

import AccessGate, { RegisteredUser } from './components/AccessGate';
import SOPViewer from './components/SOPViewer';
import PlantationCostingCalculator from './components/PlantationCostingCalculator';
import CooperativeConstitutionGenerator from './components/CooperativeConstitutionGenerator';
import ComplianceRoadmap from './components/ComplianceRoadmap';
import TelemetrySimulator from './components/TelemetrySimulator';
import MellowMinisLabel from './components/MellowMinisLabel';
import ManualLibrary from './components/ManualLibrary';
import MarketProbeTool from './components/MarketProbeTool';
import WaterPlanner from './components/WaterPlanner';
import PlantProvenanceLog from './components/PlantProvenanceLog';
import PestDecisionTree from './components/PestDecisionTree';

import { COUNTRIES } from './data/countries';
import { LanguageProvider, useLanguage } from './LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId =
  | 'manual' | 'sop' | 'probe' | 'planner' | 'provenance'
  | 'pest' | 'costing' | 'constitution' | 'compliance' | 'telemetry';

const VALID_TABS: TabId[] = [
  'manual', 'sop', 'probe', 'planner', 'provenance',
  'pest', 'costing', 'constitution', 'compliance', 'telemetry',
];

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

// ─── AppContent ───────────────────────────────────────────────────────────────

function AppContent() {
  const { t, language, setLanguage } = useLanguage();

  // Auth state — synced from AccessGate via onAuthChange; used only for header badge
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Navigation
  const [activeTab, setActiveTab] = useState<TabId>('manual');

  // Country / subdomain
  const [selectedCountryId, setSelectedCountryId] = useState<string>('zimbabwe');

  useEffect(() => {
    try {
      const firstPart = window.location.hostname.split('.')[0].toLowerCase();
      const match = COUNTRIES.find((c) => c.id === firstPart);
      setSelectedCountryId(match ? match.id : 'zimbabwe');
    } catch {
      setSelectedCountryId('zimbabwe');
    }
  }, []);

  const currentCountry = useMemo(
    () => COUNTRIES.find((c) => c.id === selectedCountryId) ?? COUNTRIES[0],
    [selectedCountryId],
  );

  // ── Auth change from AccessGate ──
  const handleAuthChange = (user: RegisteredUser | null) => {
    setRegisteredUser(user);
    if (!user) setActiveTab('manual');
  };

  // ── Logout: triggered from header, cleared via storage event → AccessGate ──
  const handleLogoutRequest = () => setShowResetConfirm(true);

  const handleLogoutConfirm = () => {
    try { localStorage.removeItem('agave_registered_user'); } catch { /* silent */ }
    window.dispatchEvent(new Event('agave_registration_changed'));
    setShowResetConfirm(false);
  };

  // ── Tab config ──
  const tabs: { id: TabId; icon: React.ElementType; label: string }[] = [
    { id: 'manual',       icon: BookOpen,      label: t.tabs.manual },
    { id: 'sop',          icon: ClipboardList, label: t.tabs.sop },
    { id: 'probe',        icon: User,          label: t.tabs.probe },
    { id: 'planner',      icon: Droplet,       label: t.tabs.planner },
    { id: 'provenance',   icon: Sprout,        label: t.tabs.provenance },
    { id: 'pest',         icon: AlertOctagon,  label: t.tabs.pest },
    { id: 'costing',      icon: Calculator,    label: t.tabs.costing },
    { id: 'constitution', icon: Landmark,      label: t.tabs.constitution },
    { id: 'compliance',   icon: ShieldCheck,   label: t.tabs.compliance },
    { id: 'telemetry',    icon: BarChart2,     label: t.tabs.telemetry },
  ];

  return (
    <div
      id="app-root"
      className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-agave-100 selection:text-agave-950 flex flex-col justify-between"
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-stone-200/65 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <MellowMinisLabel size="sm" interactive={true} />
            </div>
            <div>
              <span className="text-sm font-extrabold text-stone-900 uppercase font-display tracking-tight block">
                {t.common.appTitle}
              </span>
              <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase block font-bold">
                {t.common.appSubtitle}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">

            {/* Language */}
            <div
              id="language-toggle"
              className="relative flex items-center gap-1.5 bg-white border border-stone-250 hover:border-agave-500 rounded-xl px-2.5 py-1.5 shadow-2xs transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-agave-600 animate-pulse" />
              <select
                id="language-selector"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-stone-800 focus:outline-none cursor-pointer pr-1"
                aria-label="Language Selector"
              >
                <option value="en">English</option>
                <option value="sn">ChiShona</option>
                <option value="nd">isiNdebele</option>
              </select>
            </div>

            {/* Pilot badge */}
            <div
              id="pilot-indicator"
              className="hidden sm:flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl"
            >
              <span className="text-[11px] font-sans font-extrabold text-stone-750 tracking-wider uppercase flex items-center gap-1">
                <span>🇿🇼</span> {t.common.pilotNetwork}
              </span>
            </div>

            {/* User badge / guest pill */}
            {registeredUser ? (
              <div id="user-badge" className="flex items-center gap-2 bg-stone-50 border border-stone-200 p-1 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-agave-100 text-agave-750 flex items-center justify-center text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden lg:block text-left pr-2 leading-none">
                  <span className="text-[11px] font-extrabold text-stone-800 block capitalize truncate max-w-[120px]">
                    {registeredUser.fullName || 'grower'}
                  </span>
                  <span className="text-[8px] text-stone-400 font-mono block truncate max-w-[100px]">
                    {registeredUser.enterpriseName || t.common.smallholder}
                  </span>
                </div>
                <button
                  id="reset-profile-btn"
                  type="button"
                  onClick={handleLogoutRequest}
                  title="Logout / Reset credentials"
                  className="p-1 px-2.5 rounded-lg border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 bg-white hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline text-[10px]">{t.common.logout}</span>
                </button>
              </div>
            ) : (
              <span
                id="guest-preview-badge"
                className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/60 text-[9px] font-extrabold px-2.5 py-1.5 rounded-full uppercase tracking-wider"
              >
                <Lock className="w-3 h-3" />
                {t.common.guestMode}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-grow">
        <AccessGate onAuthChange={handleAuthChange}>
          {/* Only rendered when AccessGate confirms user is registered + approved */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Tab bar */}
              <div className="lg:col-span-12">
                <div
                  className="bg-white border border-stone-200 p-2 rounded-2xl shadow-xs flex flex-wrap gap-1.5 justify-start select-none"
                  role="tablist"
                >
                  {tabs.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      role="tab"
                      aria-selected={activeTab === id}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === id
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active panel */}
              <div className="lg:col-span-12 min-h-[440px]" role="tabpanel">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}_${selectedCountryId}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.12 }}
                    id={`${activeTab}-content`}
                  >
                    {activeTab === 'manual'       && <ManualLibrary currentCountryId={selectedCountryId} />}
                    {activeTab === 'sop'           && <SOPViewer currentCountryId={selectedCountryId} />}
                    {activeTab === 'probe'         && <MarketProbeTool currentCountryId={selectedCountryId} />}
                    {activeTab === 'planner'       && <WaterPlanner currentCountryId={selectedCountryId} />}
                    {activeTab === 'provenance'    && <PlantProvenanceLog currentCountryId={selectedCountryId} />}
                    {activeTab === 'pest'          && <PestDecisionTree />}
                    {activeTab === 'costing'       && <PlantationCostingCalculator />}
                    {activeTab === 'constitution'  && <CooperativeConstitutionGenerator currentCountryId={selectedCountryId} />}
                    {activeTab === 'compliance'    && <ComplianceRoadmap currentCountryId={selectedCountryId} />}
                    {activeTab === 'telemetry'     && <TelemetrySimulator />}

                    {!VALID_TABS.includes(activeTab) && (
                      <div className="text-center text-stone-500 py-16 bg-white border border-stone-200 rounded-3xl">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                        <p className="text-xs font-bold uppercase tracking-wider">Module Not Found</p>
                        <p className="text-xs mt-1 text-stone-400">
                          Please select an alternative tab from the workspace panel.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        </AccessGate>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        id="hub-footer"
        className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500 font-sans shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>
              © {new Date().getFullYear()} {t.common.copyrightText}{' '}
              <strong>{currentCountry.name}</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 font-semibold text-[10px] uppercase tracking-wider">
            <span>Administered by Mellow Minis Core Trust</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>{t.common.madeWith}</span>
            <Heart className="w-3.5 h-3.5 text-red-650 fill-red-650 inline" />
            <span>{t.common.forSmallholders}</span>
          </div>
        </div>
      </footer>

      {/* ── Logout confirmation modal ────────────────────────────────────────── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-1 font-display">
              {t.common.resetProfile}
            </h3>
            <p className="text-xs text-stone-450 leading-relaxed mb-6 font-medium">
              {t.common.resetDesc}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-stone-250 text-stone-600 hover:bg-stone-50 text-xs font-extrabold tracking-wide transition-all cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold tracking-wide shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {t.common.yesReset}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
