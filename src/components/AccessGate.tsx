/**
 * AccessGate.tsx
 *
 * Handles all registration / session state.
 * - Unregistered  →  renders the guest landing page + SignupForm
 * - Registered    →  renders `children` (the main workspace)
 *
 * Drop this file into src/components/ and update the App.tsx import accordingly.
 */

import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  LogOut,
  ClipboardList,
  DollarSign,
  Droplet,
  FileSpreadsheet,
  Clock,
} from 'lucide-react';

import SignupForm from './SignupForm';
import SignInForm from './SignInForm';
import MellowMinisLabel from './MellowMinisLabel';
import { useLanguage } from '../LanguageContext';

// Auth
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisteredUser {
  fullName: string;
  email: string;
  role: string;
  enterpriseName: string;
  source: string;
  registeredAt?: string;
  status?: 'pending' | 'approved';
}

interface AccessGateProps {
  /** Rendered only when the user is registered */
  children: ReactNode;
  /**
   * Called whenever registration state changes so a parent can react if needed.
   * Passes `null` on logout.
   */
  onAuthChange?: (user: RegisteredUser | null) => void;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_KEY = 'agave_registered_user';
const CHANGE_EVENT = 'agave_registration_changed';

function readUser(): RegisteredUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RegisteredUser) : null;
  } catch {
    return null;
  }
}

function clearUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* silent */
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccessGate({ children, onAuthChange }: AccessGateProps) {
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // ── Initialise & listen for storage changes ──
  useEffect(() => {
    const sync = () => {
      const user = readUser();
      setRegisteredUser(user);
      onAuthChange?.(user);
    };

    // Small delay mirrors the original so downstream effects aren't surprised
    const timer = setTimeout(() => {
      sync();
      setIsLoading(false);
    }, 100);

    const handleCustomEvent = () => sync();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };

    window.addEventListener(CHANGE_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(CHANGE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [onAuthChange]);

  // ── Registration success callback ──
  const handleRegisterSuccess = () => {
    const user = readUser();
    setRegisteredUser(user);
    onAuthChange?.(user);
  };

  // ── Logout flow ──
  const handleLogout = () => setShowResetConfirm(true);

  const handleLogoutConfirm = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase Auth signout failed:', err);
    }
    clearUser();
    setRegisteredUser(null);
    setShowResetConfirm(false);
    onAuthChange?.(null);
    if (window.location.pathname === '/pending-approval') {
      window.history.replaceState({}, '', '/');
    }
  };

  // ── Loading splash ──
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

  const isPendingView = registeredUser?.status === 'pending' || window.location.pathname === '/pending-approval';

  return (
    <>
      <AnimatePresence mode="wait">
        {isPendingView ? (
          /* ═══════════════════════════════════════════════════════════════
             PENDING APPROVAL — waiting screen with reset button
             ═══════════════════════════════════════════════════════════════ */
          <motion.div
            key="pending-approval-state"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 sm:py-16"
          >
            <div className="max-w-xl mx-auto px-4">
              <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm text-center relative overflow-hidden">
                {/* Visual elements */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-agave-500 to-emerald-500" />
                
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-200 shadow-xs">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>

                <span className="inline-flex items-center gap-1 text-[10px] bg-stone-100 text-stone-600 border border-stone-200 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4">
                  <span>🇿🇼</span> Zimbabwe Pilot Syndicate
                </span>

                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-stone-900 mb-3 tracking-tight uppercase">
                  Verification Pending
                </h2>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  Thank you for joining the Mellow Minis Agave Smallholder Pilot Network. Your registration profile is currently undergoing verification by the Cooperative Administration to ensure regional extension compliance.
                </p>

                {/* User profile details box */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs font-semibold text-stone-800">
                  <div className="flex justify-between items-center border-b border-stone-150 pb-2">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Registered Name</span>
                    <span className="capitalize">{registeredUser?.fullName || 'Smallholder Grower'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-150 pb-2">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                    <span className="font-mono">{registeredUser?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-150 pb-2">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">District/Enterprise</span>
                    <span>{registeredUser?.enterpriseName || 'Gwanda / Matabeleland South'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Access Status</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Pending Approval
                    </span>
                  </div>
                </div>

                {/* Information Callout */}
                <div className="p-3 bg-blue-50/50 border border-blue-150 text-left rounded-xl text-xs text-blue-800 font-medium leading-relaxed mb-8 flex gap-2.5 items-start">
                  <span className="text-base text-blue-500 mt-0.5">ℹ️</span>
                  <span>
                    A secure authentication session has been logged. Once your local extension credentials are confirmed, the premium interactive toolkits (borehole calculator, costing logs, and diagnostic trees) will unlock automatically.
                  </span>
                </div>

                {/* Reset Credentials/Logout Button */}
                <div className="pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-[11px] text-stone-400 font-semibold leading-normal">
                      Need to log in with another account?
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl border border-red-200 text-red-700 hover:bg-rose-50 hover:text-red-800 text-xs font-extrabold tracking-wide transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Reset & Sign Out
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        ) : !registeredUser ? (
          /* ═══════════════════════════════════════════════════════════════
             GUEST / UNREGISTERED — landing page + sign-up form
             ═══════════════════════════════════════════════════════════════ */
          <motion.div
            key="unregistered-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="py-12 sm:py-16"
          >
            <div className="max-w-3xl mx-auto px-4">
              {/* ── Hero ── */}
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

              {/* ── Value pillars ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(
                  [
                    [t.landing.pillar1Title, t.landing.pillar1Desc],
                    [t.landing.pillar2Title, t.landing.pillar2Desc],
                    [t.landing.pillar3Title, t.landing.pillar3Desc],
                    [t.landing.pillar4Title, t.landing.pillar4Desc],
                  ] as [string, string][]
                ).map(([title, desc]) => (
                  <div
                    key={title}
                    className="bg-white border border-stone-200 p-4 rounded-2xl space-y-1"
                  >
                    <span className="text-[10px] font-bold text-agave-700 uppercase tracking-widest">
                      {title}
                    </span>
                    <p className="text-[11px] text-stone-550 leading-relaxed font-sans font-medium">
                      {desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Gated sign-up card ── */}
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-xs font-bold text-stone-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-agave-650" />
                  {t.landing.gatedTitle}
                </h2>

                <p className="text-xs text-stone-600 leading-relaxed font-semibold">
                  {t.landing.gatedDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-stone-650 font-sans leading-relaxed">
                  {(
                    [
                      [ClipboardList, t.landing.infoSopTitle, t.landing.infoSopDesc],
                      [DollarSign,    t.landing.infoCrmTitle, t.landing.infoCrmDesc],
                      [Droplet,       t.landing.infoWaterTitle, t.landing.infoWaterDesc],
                      [FileSpreadsheet, t.landing.infoTraceTitle, t.landing.infoTraceDesc],
                    ] as [React.ElementType, string, string][]
                  ).map(([Icon, title, desc]) => (
                    <div
                      key={title}
                      className="border border-stone-150 p-3.5 rounded-2xl bg-stone-50/50 space-y-1"
                    >
                      <span className="font-bold text-stone-900 block flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-stone-500" /> {title}
                      </span>
                      <span>{desc}</span>
                    </div>
                  ))}
                </div>

                <hr className="border-stone-150 my-2" />

                {/* ── Sign-in / Sign-up toggle ── */}
                <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 p-1 rounded-xl w-full">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-agave-800 shadow-sm border border-stone-200'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    New Registration
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white text-agave-800 shadow-sm border border-stone-200'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {authMode === 'signup' ? (
                    <motion.div
                      key="signup-form"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <SignupForm
                        source="training-page"
                        ctaText={t.signup.description}
                        buttonText={t.signup.submitBtn}
                        onSuccess={handleRegisterSuccess}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signin-form"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <SignInForm
                        onSuccess={handleRegisterSuccess}
                        onSwitchToSignup={() => setAuthMode('signup')}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             REGISTERED — render children (main workspace)
             ═══════════════════════════════════════════════════════════════ */
          <motion.div
            key="registered-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Logout confirmation modal ── */}
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
    </>
  );
}

// ─── Named export for convenience ─────────────────────────────────────────────
export type { AccessGateProps };
