/**
 * SignupForm.tsx  (fully corrected)
 *
 * Registration flow — exactly as specified:
 *   1. createUserWithEmailAndPassword  → real Firebase Auth account
 *   2. setDoc(doc(db, 'apps/zimbabwe/signups', user.uid), ...)  → UID-keyed Firestore doc
 *   3. Resend email dispatch
 *   4. localStorage persist (includes uid)
 *   5. Redirect to /pending-approval
 *
 * Form fields added:
 *   - password       (min 6 chars)
 *   - confirmPassword (must match)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Landmark,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';

import { useLanguage } from '../LanguageContext';

// Firestore
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Auth
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SignupFormProps {
  source: string;
  ctaText: string;
  buttonText: string;
  onSuccess?: () => void;
}

interface IntegrationStats {
  firestore:    { status: 'success' | 'error' | 'skipped'; message?: string };
  resend:       { status: 'success' | 'error' | 'skipped'; message?: string };
  googleSheets: { status: 'success' | 'error' | 'skipped'; message?: string };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignupForm({
  source,
  ctaText,
  buttonText,
  onSuccess,
}: SignupFormProps) {
  const { t } = useLanguage();

  // ── Form state ──
  const [formData, setFormData] = useState({
    firstName:        '',
    lastName:         '',
    email:            '',
    password:         '',
    confirmPassword:  '',
    roleOrInterest:   '',
    districtOrProvince: '',
    agreeToTerms:     false,
  });

  const [errors, setErrors]           = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [integrationStats, setIntegrationStats] = useState<IntegrationStats | null>(null);

  // Password visibility toggles
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Pre-fill email from session API if available ──
  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const res = await fetch('/api/current-user');
        if (res.ok) {
          const user = await res.json();
          setFormData((prev) => ({ ...prev, email: user.email || '' }));
        }
      } catch {
        // No session — leave email blank
      }
    };
    fetchUserSession();
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Clear the field error as the user types
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // ─── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.firstName.trim())
      e.firstName = t.signup.errFirstName;

    if (!formData.lastName.trim())
      e.lastName = t.signup.errLastName;

    if (!formData.email.trim())
      e.email = t.signup.errEmail;
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      e.email = t.signup.errEmailValid;

    if (!formData.password || formData.password.length < 6)
      e.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

    if (!formData.roleOrInterest)
      e.roleOrInterest = t.signup.errRole;

    if (!formData.districtOrProvince.trim())
      e.districtOrProvince = t.signup.errDistrict;

    if (!formData.agreeToTerms)
      e.agreeToTerms = t.signup.errTerms;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // ── 1. Create Firebase Auth account ────────────────────────────────
      // This gives us a real, password-authenticated UID that the access gate
      // can look up with auth.currentUser — no anonymous session needed.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;

      // ── 2. Build the Firestore payload ─────────────────────────────────
      const now = new Date().toISOString();

      const signupData = {
        uid:            user.uid,
        fullName:       `${formData.firstName} ${formData.lastName}`.trim(),
        email:          formData.email,
        role:           formData.roleOrInterest,
        enterpriseName: formData.districtOrProvince,
        source,
        createdAt:      now,
        registeredAt:   now,
        // Approval workflow
        status:         'pending' as const,
        approvedAt:     null,
        // Classification
        country:        'zimbabwe',
        sector:         'agave',
      };

      // ── 3. setDoc — UID as document ID ─────────────────────────────────
      // Using { merge: true } so a re-submission updates the same doc,
      // not a duplicate, which would break the access-gate lookup.
      let firestoreStatus: IntegrationStats['firestore'] = { status: 'success' };

      try {
        await setDoc(
          doc(db, 'apps/zimbabwe/signups', user.uid),
          signupData,
          { merge: true },
        );
      } catch (dbErr: any) {
        console.error('Firestore setDoc failed:', dbErr);
        firestoreStatus = {
          status: 'error',
          message: dbErr?.message ?? 'Database registration failed.',
        };
        throw new Error(firestoreStatus.message);
      }

      // ── 4. Resend email dispatch (non-fatal) ───────────────────────────
      let resendStatus: IntegrationStats['resend'] = { status: 'success' };

      try {
        const mailRes = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        });
        if (!mailRes.ok) {
          const mailErr = await mailRes.json().catch(() => ({}));
          throw new Error(mailErr.error ?? `Server returned ${mailRes.status}`);
        }
      } catch (mailErr: any) {
        console.error('Resend dispatch failed:', mailErr);
        resendStatus = {
          status: 'error',
          message: mailErr?.message ?? 'Could not dispatch welcome email.',
        };
      }

      // ── 5. Persist to localStorage ─────────────────────────────────────
      localStorage.setItem(
        'agave_registered_user',
        JSON.stringify({ uid: user.uid, ...signupData }),
      );

      // ── 6. Surface integration stats + show success state ──────────────
      setIntegrationStats({
        firestore:    firestoreStatus,
        resend:       resendStatus,
        googleSheets: { status: 'skipped' },
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      // ── 7. Notify parent & redirect ────────────────────────────────────
      setTimeout(() => {
        onSuccess?.();
        window.dispatchEvent(new Event('agave_registration_changed'));

        setTimeout(() => {
          window.location.href = '/pending-approval';
        }, 1000);
      }, 3200);

    } catch (err: any) {
      console.error('Registration workflow error:', err);
      setIsSubmitting(false);

      // Surface Firebase Auth errors in a human-readable way
      const firebaseMsg: Record<string, string> = {
        'auth/email-already-in-use':    'That email is already registered. Try signing in instead.',
        'auth/invalid-email':           'Please enter a valid email address.',
        'auth/weak-password':           'Password must be at least 6 characters.',
        'auth/network-request-failed':  'Network error — please check your connection and try again.',
      };

      const friendlyMsg =
        firebaseMsg[err?.code] ?? err?.message ?? t.signup.errSubmit;

      setErrors({ submit: friendlyMsg });
    }
  };

  // ─── Success state ─────────────────────────────────────────────────────────

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

        <h3 className="text-xl font-bold text-agave-950 mb-2">{t.signup.successTitle}</h3>
        <p className="text-agave-750 max-w-sm text-sm">{t.signup.successDesc}</p>

        {integrationStats && (
          <div className="mt-5 w-full max-w-sm bg-white/60 backdrop-blur-xs border border-agave-200/60 rounded-xl p-4 text-left space-y-2">
            <h4 className="text-[11px] font-bold text-agave-700 uppercase tracking-widest border-b border-agave-200/40 pb-1.5 flex items-center justify-between">
              <span>{t.signup.logsTitle}</span>
              <span className="text-[9px] text-agave-500 normal-case font-normal">{t.signup.activeRelays}</span>
            </h4>

            <div className="space-y-2 text-xs">
              {(
                [
                  ['firestore',    t.signup.firestoreSync, t.signup.connected, t.signup.failed, t.signup.skipped],
                  ['resend',       t.signup.emailDispatch, t.signup.emailed,   t.signup.failed, t.signup.skipped],
                  ['googleSheets', t.signup.sheetsBackup,  t.signup.logged,    t.signup.failed, t.signup.skipped],
                ] as [keyof IntegrationStats, string, string, string, string][]
              ).map(([key, label, okLabel, errLabel, skipLabel]) => {
                const entry = integrationStats[key];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium text-agave-800">{label}</span>
                    {entry.status === 'success' && (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px]">{okLabel}</span>
                    )}
                    {entry.status === 'error' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[10px]" title={entry.message}>{errLabel}</span>
                    )}
                    {entry.status === 'skipped' && (
                      <span className="px-2 py-0.5 rounded-md bg-agave-100/65 text-agave-600 border border-agave-200/40 text-[9px]">{skipLabel}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-agave-500 mt-1 leading-snug">{t.signup.configKeysHint}</p>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2 text-sm text-emerald-800 font-medium bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-100">
          <Sparkles className="w-4 h-4 animate-pulse text-emerald-600" />
          {t.signup.unlockResources}
        </div>
      </motion.div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────────

  return (
    <div className="border-t border-agave-200/40 pt-6 mt-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-agave-900 uppercase tracking-wider mb-1">
          {t.signup.title}
        </h3>
        <p className="text-xs sm:text-sm text-agave-650 font-sans">{ctaText}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Names ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* First name */}
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
              {t.signup.firstName}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="firstName" type="text" name="firstName"
                value={formData.firstName} onChange={handleChange}
                placeholder={t.signup.firstNamePlaceholder}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${errors.firstName ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
              />
            </div>
            {errors.firstName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.firstName}</p>}
          </div>

          {/* Last name */}
          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
              {t.signup.lastName}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="lastName" type="text" name="lastName"
                value={formData.lastName} onChange={handleChange}
                placeholder={t.signup.lastNamePlaceholder}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${errors.lastName ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
              />
            </div>
            {errors.lastName && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.lastName}</p>}
          </div>
        </div>

        {/* ── Email ── */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
            {t.signup.email}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="email" type="email" name="email"
              value={formData.email} onChange={handleChange}
              placeholder={t.signup.emailPlaceholder}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${errors.email ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.email}</p>}
        </div>

        {/* ── Password + Confirm ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${errors.password ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-agave-400 hover:text-agave-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${errors.confirmPassword ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-agave-400 hover:text-agave-600 transition-colors"
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* ── Role + District ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Role */}
          <div>
            <label htmlFor="roleOrInterest" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
              {t.signup.roleOrInterest}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400 pointer-events-none">
                <Briefcase className="w-4 h-4" />
              </span>
              <select
                id="roleOrInterest" name="roleOrInterest"
                value={formData.roleOrInterest} onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-agave-950 bg-white focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all font-medium text-sm ${errors.roleOrInterest ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
              >
                <option value="">{t.signup.rolePlaceholder}</option>
                <option value="grower">{t.signup.roleFarmer}</option>
                <option value="processor">{t.signup.roleProcessor}</option>
                <option value="agronomy_advocate">{t.signup.roleAgronomist}</option>
                <option value="trade_buying_agent">{t.signup.roleDistributor}</option>
              </select>
            </div>
            {errors.roleOrInterest && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.roleOrInterest}</p>}
          </div>

          {/* District */}
          <div>
            <label htmlFor="districtOrProvince" className="block text-xs font-semibold text-agave-800 uppercase tracking-wider mb-1.5">
              {t.signup.district}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-agave-400">
                <Landmark className="w-4 h-4" />
              </span>
              <input
                id="districtOrProvince" type="text" name="districtOrProvince"
                value={formData.districtOrProvince} onChange={handleChange}
                placeholder={t.signup.districtPlaceholder}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-agave-950 bg-white placeholder:text-agave-300 focus:outline-none focus:ring-2 focus:ring-agave-500/10 focus:border-agave-500 transition-all ${errors.districtOrProvince ? 'border-rose-300 bg-rose-50/25' : 'border-agave-200/80'}`}
              />
            </div>
            {errors.districtOrProvince && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.districtOrProvince}</p>}
          </div>
        </div>

        {/* ── Consent ── */}
        <div className="mt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox" name="agreeToTerms"
              checked={formData.agreeToTerms} onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-agave-200 text-agave-600 focus:ring-agave-500/10 bg-white/70"
            />
            <span className="text-xs text-agave-650 leading-snug">{t.signup.agree}</span>
          </label>
          {errors.agreeToTerms && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.agreeToTerms}</p>}
        </div>

        {/* ── Submit error banner ── */}
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
              {t.signup.submitting}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {buttonText}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
