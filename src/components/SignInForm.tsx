/**
 * SignInForm.tsx
 *
 * Sign-in flow for returning growers:
 *   1. signInWithEmailAndPassword  → Firebase Auth session
 *   2. getDoc(doc(db, 'apps/zimbabwe/signups', user.uid))  → fetch their profile
 *   3. Check status — 'pending' → /pending-approval, 'approved' → restore session
 *   4. localStorage.setItem('agave_registered_user', ...)  → AccessGate picks it up
 *   5. Dispatch 'agave_registration_changed' → AccessGate unlocks the workspace
 *
 * Styling matches SignupForm.tsx exactly (same Tailwind classes, same icon style).
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { useLanguage } from '../LanguageContext';

// Auth
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

// Firestore
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SignInFormProps {
  /** Called after a successful sign-in so the parent can react (e.g. close a modal) */
  onSuccess?: () => void;
  /** Render a link/button to switch back to the signup form */
  onSwitchToSignup?: () => void;
}

// ─── Firebase error map ───────────────────────────────────────────────────────

const AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-email':        'Please enter a valid email address.',
  'auth/user-not-found':       'No account found with that email. Please sign up first.',
  'auth/wrong-password':       'Incorrect password. Please try again.',
  'auth/invalid-credential':   'Incorrect email or password. Please try again.',
  'auth/too-many-requests':    'Too many failed attempts. Please wait a moment and try again.',
  'auth/user-disabled':        'This account has been disabled. Please contact support.',
  'auth/network-request-failed': 'Network error — please check your connection.',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignInForm({ onSuccess, onSwitchToSignup }: SignInFormProps) {
  const { t } = useLanguage();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors]             = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);

  // Password reset state
  const [resetSent, setResetSent]         = useState(false);
  const [resetLoading, setResetLoading]   = useState(false);
  const [resetError, setResetError]       = useState('');

  // ─── Field helpers ──────────────────────────────────────────────────────────

  const clearError = (field: string) =>
    setErrors((prev) => { const c = { ...prev }; delete c[field]; return c; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim())                    e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email   = 'Please enter a valid email address.';
    if (!password)                        e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Sign-in ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Firebase Auth sign-in
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      // 2. Fetch their Firestore profile (written by SignupForm with user.uid as doc ID)
      const snap = await getDoc(doc(db, 'apps/zimbabwe/signups', user.uid));

      if (!snap.exists()) {
        // Auth account exists but no Firestore profile — edge case
        throw Object.assign(
          new Error('Your profile could not be found. Please contact support or sign up again.'),
          { code: 'app/profile-missing' },
        );
      }

      const profile = snap.data();

      // 3. Status gate — pending users go back to the waiting page
      if (profile.status === 'pending') {
        // Still restore localStorage so AccessGate stays consistent
        localStorage.setItem('agave_registered_user', JSON.stringify({ uid: user.uid, ...profile }));
        window.dispatchEvent(new Event('agave_registration_changed'));
        window.location.href = '/pending-approval';
        return;
      }

      // 4. Approved — restore session and unlock the workspace
      localStorage.setItem(
        'agave_registered_user',
        JSON.stringify({ uid: user.uid, ...profile }),
      );

      setIsSubmitting(false);
      setIsSuccess(true);

      // 5. Notify parent + AccessGate
      setTimeout(() => {
        window.dispatchEvent(new Event('agave_registration_changed'));
        onSuccess?.();
      }, 1200);

    } catch (err: any) {
      setIsSubmitting(false);
      const friendly = AUTH_ERRORS[err?.code] ?? err?.message ?? 'Sign-in failed. Please try again.';
      setErrors({ submit: friendly });
    }
  };

  // ─── Password reset ─────────────────────────────────────────────────────────

  const handlePasswordReset = async () => {
    setResetError('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setResetError('Enter your email address above first, then click "Forgot password".');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: any) {
      setResetError(AUTH_ERRORS[err?.code] ?? 'Could not send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // ─── Success state ──────────────────────────────────────────────────────────

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center text-center p-8 bg-agave-50 rounded-xl border border-agave-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-agave-100 flex items-center justify-center text-agave-600 mb-4"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>
        <h3 className="text-xl font-bold text-agave-950 mb-2">Welcome back!</h3>
        <p className="text-agave-750 max-w-sm text-sm">
          You're signed in. Loading your workspace…
        </p>
      </motion.div>
    );
  }

  // ─── Form ───────────────────────────────────────────────────────────────────

  return (
    <div className="border-t border-agave-200/40 pt-6 mt-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-agave-900 uppercase tracking-wider mb-1">
          Sign In
        </h3>
        <p className="text-xs sm:text-sm text-agave-650 font-sans">
          Welcome back — enter your registered email and password to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Email ── */}
        <div>
          <label
            htmlFor="signin-email"
            className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="signin-email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${
                errors.email ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>
          )}
        </div>

        {/* ── Password ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="signin-password"
              className="block text-xs font-semibold text-agave-800 uppercase tracking-wider"
            >
              Password
            </label>
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="text-[11px] text-agave-500 hover:text-agave-700 font-semibold transition-colors underline underline-offset-2 cursor-pointer disabled:opacity-60"
            >
              {resetLoading ? 'Sending…' : 'Forgot password?'}
            </button>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              placeholder="Your password"
              autoComplete="current-password"
              className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${
                errors.password ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-agave-400 hover:text-agave-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>
          )}
        </div>

        {/* ── Password reset confirmation / error ── */}
        {resetSent && (
          <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600" />
            Reset link sent! Check your inbox (and spam folder).
          </div>
        )}
        {resetError && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
            {resetError}
          </div>
        )}

        {/* ── Submit error ── */}
        {errors.submit && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
            ⚠️ {errors.submit}
          </div>
        )}

        {/* ── Submit button ── */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-agave-600 hover:bg-agave-700 active:bg-agave-800 text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-agave-700/10 hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Sign In
            </>
          )}
        </button>

        {/* ── Switch to signup ── */}
        {onSwitchToSignup && (
          <p className="text-center text-xs text-agave-500 font-medium pt-1">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-agave-700 font-bold hover:underline underline-offset-2 cursor-pointer"
            >
              Register here
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
