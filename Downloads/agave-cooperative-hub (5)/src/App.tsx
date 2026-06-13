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
  Unlock,
  LogOut,
  User,
  Heart,
  Globe,
  DollarSign,
  Droplet,
  FileSpreadsheet,
  AlertOctagon,
  ChevronRight,
  ExternalLink,
  ClipboardList
} from 'lucide-react';

import SignupForm from './components/SignupForm';
import SOPViewer from './components/SOPViewer';
import PlantationCostingCalculator from './components/PlantationCostingCalculator';
import CooperativeConstitutionGenerator from './components/CooperativeConstitutionGenerator';
import ComplianceRoadmap from './components/ComplianceRoadmap';
import TelemetrySimulator from './components/TelemetrySimulator';
import MellowMinisLabel from './components/MellowMinisLabel';

// Newly formulated Pan-African modules
import ManualLibrary from './components/ManualLibrary';
import MarketProbeTool from './components/MarketProbeTool';
import WaterPlanner from './components/WaterPlanner';
import PlantProvenanceLog from './components/PlantProvenanceLog';
import PestDecisionTree from './components/PestDecisionTree';

// Global shared country catalog
import { COUNTRIES } from './data/countries';
import { LanguageProvider, useLanguage } from './LanguageContext';

interface RegisteredUser {
  fullName: string;
  email: string;
  role: string;
  enterpriseName: string;
  source: string;
  registeredAt?: string;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Advanced Navigation tabs
  const [activeTab, setActiveTab] = useState<
    'manual' | 'sop' | 'probe' | 'planner' | 'provenance' | 'pest' | 'costing' | 'constitution' | 'compliance' | 'telemetry'
  >('manual');

  // Subdomain detection and current active country state
  const [selectedCountryId, setSelectedCountryId] = useState<string>('zimbabwe');
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic subdomain-aware resolver
  useEffect(() => {
    try {
      const hostname = window.location.hostname;
      const firstPart = hostname.split('.')[0].toLowerCase();
      const match = COUNTRIES.find(c => c.id === firstPart);
      if (match) {
        setSelectedCountryId(match.id);
      } else {
        setSelectedCountryId('zimbabwe'); // Default fallback
      }
    } catch (err) {
      console.error('Failed to resolve host subdomain', err);
      setSelectedCountryId('zimbabwe');
    }
  }, []);

  // Sync profile sessions from localStorage
  useEffect(() => {
    const checkRegistration = () => {
      try {
        const data = localStorage.getItem('agave_registered_user');
        if (data) {
          const user = JSON.parse(data);
          setIsRegistered(true);
          setRegisteredUser(user);
        } else {
          setIsRegistered(false);
          setRegisteredUser(null);
        }
      } catch (err) {
        console.error('Failed to parse registered user:', err);
        setIsRegistered(false);
        setRegisteredUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    setTimeout(checkRegistration, 100);

    window.addEventListener('agave_registration_changed', checkRegistration);
    window.addEventListener('storage', (e) => {
      if (e.key === 'agave_registered_user') {
        checkRegistration();
      }
    });

    return () => {
      window.removeEventListener('agave_registration_changed', checkRegistration);
      window.removeEventListener('storage', checkRegistration);
    };
  }, []);

  const handleRegisterSuccess = () => {
    try {
      const data = localStorage.getItem('agave_registered_user');
      if (data) {
        const user = JSON.parse(data);
        setIsRegistered(true);
        setRegisteredUser(user);
      }
    } catch (err) {
      console.error('Failed to parse registration success:', err);
    }
  };

  const handleLogout = () => {
    setShowResetConfirm(true);
  };

  const handleLogoutDirect = () => {
    try {
      localStorage.removeItem('agave_registered_user');
      setIsRegistered(false);
      setRegisteredUser(null);
      setActiveTab('manual');
      setShowResetConfirm(false);
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  const currentCountry = useMemo(() => {
    return COUNTRIES.find(c => c.id === selectedCountryId) || COUNTRIES[0];
  }, [selectedCountryId]);

  const validTabs = [
    'manual',
    'sop',
    'probe',
    'planner',
    'provenance',
    'pest',
    'costing',
    'constitution',
    'compliance',
    'telemetry'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <MellowMinisLabel size="lg" interactive={false} />
          <p className="mt-4 text-agave-800 text-sm font-semibold tracking-wider font-sans uppercase animate-pulse">
            {t.common.loadingText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="app-root" 
      className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-agave-100 selection:text-agave-950 flex flex-col justify-between"
    >
      {/* Universal Top Header */}
      <header className="border-b border-stone-200/65 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo and branding */}
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

          {/* Selector + Register Indicator Row */}
          <div className="flex items-center gap-3">
            {/* Elegant Language Toggle Dropdown */}
            <div id="language-toggle" className="relative flex items-center gap-1.5 bg-white border border-stone-250 hover:border-agave-500 rounded-xl px-2.5 py-1.5 shadow-2xs transition-all">
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

            {/* Dedicated Zimbabwe Pilot Indicator */}
            <div id="pilot-indicator" className="hidden sm:flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-sans font-extrabold text-stone-750 tracking-wider uppercase flex items-center gap-1">
                <span>🇿🇼</span> {t.common.pilotNetwork}
              </span>
            </div>

            {/* Profile badge / Reset indicator */}
            {isRegistered ? (
              <div id="user-badge" className="flex items-center gap-2 bg-stone-50 border border-stone-200 p-1 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-agave-100 text-agave-750 flex items-center justify-center text-xs font-bold">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="hidden lg:block text-left pr-2 leading-none">
                  <span className="text-[11px] font-extrabold text-stone-800 block capitalize truncate max-w-[120px]">
                    {registeredUser?.fullName || ' grower'}
                  </span>
                  <span className="text-[8px] text-stone-400 font-mono block truncate max-w-[100px]">
                    {registeredUser?.enterpriseName || t.common.smallholder}
                  </span>
                </div>
                <button
                  id="reset-profile-btn"
                  type="button"
                  onClick={handleLogout}
                  title="Logout / Reset credentials"
                  className="p-1 px-2.5 rounded-lg border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-200 bg-white hover:bg-red-50 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline text-[10px]">{t.common.logout}</span>
                </button>
              </div>
            ) : (
              <span id="guest-preview-badge" className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/60 text-[9px] font-extrabold px-2.5 py-1.5 rounded-full uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                {t.common.guestMode}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {!isRegistered ? (
            /* =========================================================================
               UNREGISTERED STATE - GUEST PREVIEW WITH GATED LANDING PAGE
               ========================================================================= */
            <motion.div
              key="unregistered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="py-12 sm:py-16"
            >
              <div className="max-w-3xl mx-auto px-4">
                <div className="text-center mb-8">
                  <div className="mb-4 flex justify-center">
                    <MellowMinisLabel size="xl" interactive={true} />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-900 mb-2 mt-2 tracking-tight uppercase">
                    {t.landing.title}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-agave-50 border border-agave-200 text-agave-900 px-3 py-1 rounded-full font-extrabold uppercase tracking-widest mb-4">
                    <span>🇿🇼</span> {t.landing.subtitle}
                  </span>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium">
                    {t.landing.description}
                  </p>
                </div>

                {/* Main Wording Pillars (Zimbabwe Pilot Highlights) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-stone-200 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-agave-700 uppercase tracking-widest">{t.landing.pillar1Title}</span>
                    <p className="text-[11px] text-stone-550 leading-relaxed font-sans font-medium">
                      {t.landing.pillar1Desc}
                    </p>
                  </div>

                  <div className="bg-white border border-stone-200 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-agave-700 uppercase tracking-widest">{t.landing.pillar2Title}</span>
                    <p className="text-[11px] text-stone-550 leading-relaxed font-sans font-medium">
                      {t.landing.pillar2Desc}
                    </p>
                  </div>

                  <div className="bg-white border border-stone-200 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-agave-700 uppercase tracking-widest">{t.landing.pillar3Title}</span>
                    <p className="text-[11px] text-stone-550 leading-relaxed font-sans font-medium">
                      {t.landing.pillar3Desc}
                    </p>
                  </div>

                  <div className="bg-white border border-stone-200 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-agave-700 uppercase tracking-widest">{t.landing.pillar4Title}</span>
                    <p className="text-[11px] text-stone-550 leading-relaxed font-sans font-medium">
                      {t.landing.pillar4Desc}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
                  <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Unlock className="w-4 h-4 text-agave-650" />
                    {t.landing.gatedTitle}
                  </h2>
                  
                  <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                    {t.landing.gatedDesc}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-stone-650 font-sans leading-relaxed">
                    <div className="border border-stone-150 p-3.5 rounded-2xl bg-stone-50/50 space-y-1">
                      <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-stone-500" /> {t.landing.infoSopTitle}
                      </span>
                      <span>{t.landing.infoSopDesc}</span>
                    </div>

                    <div className="border border-stone-150 p-3.5 rounded-2xl bg-stone-50/50 space-y-1">
                      <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-stone-500" /> {t.landing.infoCrmTitle}
                      </span>
                      <span>{t.landing.infoCrmDesc}</span>
                    </div>

                    <div className="border border-stone-150 p-3.5 rounded-2xl bg-stone-50/50 space-y-1">
                      <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                        <Droplet className="w-4 h-4 text-stone-500" /> {t.landing.infoWaterTitle}
                      </span>
                      <span>{t.landing.infoWaterDesc}</span>
                    </div>

                    <div className="border border-stone-150 p-3.5 rounded-2xl bg-stone-50/50 space-y-1">
                      <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-stone-500" /> {t.landing.infoTraceTitle}
                      </span>
                      <span>{t.landing.infoTraceDesc}</span>
                    </div>
                  </div>

                  <hr className="border-stone-150 my-2" />

                  {/* Register user form */}
                  <SignupForm 
                    source="training-page" 
                    ctaText={t.signup.description}
                    buttonText={t.signup.submitBtn}
                    onSuccess={handleRegisterSuccess}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               REGISTERED STATE - HIGH-PREMIUM INTERACTIVE HUB
               ========================================================================= */
            <motion.div
              key="registered-workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="max-w-7xl mx-auto px-4 py-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Horizontal Navigation Tab Bar */}
                <div className="lg:col-span-12">
                  <div className="bg-white border border-stone-200 p-2 rounded-2xl shadow-xs flex flex-wrap gap-1.5 justify-start select-none" role="tablist">
                    
                    {/* Manual Library Tab */}
                    <button
                      onClick={() => setActiveTab('manual')}
                      role="tab"
                      aria-selected={activeTab === 'manual'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'manual'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t.tabs.manual}</span>
                    </button>

                    {/* Standard Operating Procedures Tab */}
                    <button
                      onClick={() => setActiveTab('sop')}
                      role="tab"
                      aria-selected={activeTab === 'sop'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'sop'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <ClipboardList className="w-4 h-4" />
                      <span>{t.tabs.sop}</span>
                    </button>

                    {/* Market Probe Tool Tab */}
                    <button
                      onClick={() => setActiveTab('probe')}
                      role="tab"
                      aria-selected={activeTab === 'probe'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'probe'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>{t.tabs.probe}</span>
                    </button>

                    {/* Water Planner Tab */}
                    <button
                      onClick={() => setActiveTab('planner')}
                      role="tab"
                      aria-selected={activeTab === 'planner'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'planner'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Droplet className="w-4 h-4" />
                      <span>{t.tabs.planner}</span>
                    </button>

                    {/* Plant Provenance Log Tab */}
                    <button
                      onClick={() => setActiveTab('provenance')}
                      role="tab"
                      aria-selected={activeTab === 'provenance'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'provenance'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Sprout className="w-4 h-4" />
                      <span>{t.tabs.provenance}</span>
                    </button>

                    {/* Pest Decision Tree Tab */}
                    <button
                      onClick={() => setActiveTab('pest')}
                      role="tab"
                      aria-selected={activeTab === 'pest'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'pest'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>{t.tabs.pest}</span>
                    </button>

                    {/* Costing Simulator Tab */}
                    <button
                      onClick={() => setActiveTab('costing')}
                      role="tab"
                      aria-selected={activeTab === 'costing'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'costing'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Calculator className="w-4 h-4" />
                      <span>{t.tabs.costing}</span>
                    </button>

                    {/* Cooperative Constitution Tab */}
                    <button
                      onClick={() => setActiveTab('constitution')}
                      role="tab"
                      aria-selected={activeTab === 'constitution'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'constitution'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Landmark className="w-4 h-4" />
                      <span>{t.tabs.constitution}</span>
                    </button>

                    {/* Compliance Roadmap Tab */}
                    <button
                      onClick={() => setActiveTab('compliance')}
                      role="tab"
                      aria-selected={activeTab === 'compliance'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'compliance'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t.tabs.compliance}</span>
                    </button>

                    {/* Yield Telemetry Tab */}
                    <button
                      onClick={() => setActiveTab('telemetry')}
                      role="tab"
                      aria-selected={activeTab === 'telemetry'}
                      className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                        activeTab === 'telemetry'
                          ? 'bg-agave-650 text-white shadow shadow-agave-600/10'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <BarChart2 className="w-4 h-4" />
                      <span>{t.tabs.telemetry}</span>
                    </button>
                    
                  </div>
                </div>

                {/* Subcomponent Rendering Section */}
                <div className="lg:col-span-12 min-h-[440px]" role="tabpanel">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab + '_' + selectedCountryId}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.12 }}
                      id={`${activeTab}-content`}
                    >
                      {activeTab === 'manual' && <ManualLibrary currentCountryId={selectedCountryId} />}
                      {activeTab === 'sop' && <SOPViewer currentCountryId={selectedCountryId} />}
                      {activeTab === 'probe' && <MarketProbeTool currentCountryId={selectedCountryId} />}
                      {activeTab === 'planner' && <WaterPlanner currentCountryId={selectedCountryId} />}
                      {activeTab === 'provenance' && <PlantProvenanceLog currentCountryId={selectedCountryId} />}
                      {activeTab === 'pest' && <PestDecisionTree />}
                      {activeTab === 'costing' && <PlantationCostingCalculator />}
                      {activeTab === 'constitution' && <CooperativeConstitutionGenerator currentCountryId={selectedCountryId} />}
                      {activeTab === 'compliance' && <ComplianceRoadmap currentCountryId={selectedCountryId} />}
                      {activeTab === 'telemetry' && <TelemetrySimulator />}
                      
                      {/* Robust error fallback */}
                      {!validTabs.includes(activeTab) && (
                        <div className="text-center text-stone-500 py-16 bg-white border border-stone-200 rounded-3xl">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                          <p className="text-xs font-bold uppercase tracking-wider">Module Not Found</p>
                          <p className="text-xs mt-1 text-stone-400">Please select an alternative tab from the workspace panel.</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <footer 
        id="hub-footer" 
        className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500 font-sans shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>
              © {new Date().getFullYear()} {t.common.copyrightText} <strong>{currentCountry.name}</strong>.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400 font-semibold text-[10px] uppercase tracking-wider">
            <span>Administered by Mellow Minis Core Trust</span>
            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
            <span>{t.common.madeWith}</span>
            <Heart className="w-3.5 h-3.5 text-red-650 fill-red-650 inline" />
            <span>{t.common.forSmallholders}</span>
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Non-Blocking Modal overlay */}
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
                onClick={handleLogoutDirect}
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
