import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signInAnonymously 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { User, Lock, Mail, Loader2 } from "lucide-react";

interface AuthGateProps {
  onAuthSuccess: () => void;
}

export default function AuthGate({ onAuthSuccess }: AuthGateProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [goal, setGoal] = useState("gain_muscle");

  // Easter Egg Secret Admin Mode click counters & modal state
  const [clickTimestamps, setClickTimestamps] = useState<number[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState("");
  const [adminModalError, setAdminModalError] = useState("");
  const [adminVerifying, setAdminVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Normal Sign In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update display name
        await updateProfile(userCredential.user, { displayName: name });

        // Save user profile to Firestore
        const userDocPath = `users/${userCredential.user.uid}`;
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            name,
            email,
            goal,
            joinedAt: new Date().toISOString(),
            streak: { current: 0, longest: 0, lastActive: new Date().toISOString() }
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, userDocPath);
        }
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    const now = Date.now();
    // Keep only timestamps within the last 3000ms
    const recentClicks = [...clickTimestamps.filter(t => now - t < 3000), now];
    setClickTimestamps(recentClicks);

    if (recentClicks.length >= 5) {
      setClickTimestamps([]); // Recount reset
      setShowAdminModal(true);
      setAdminPasscode("");
      setAdminModalError("");
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminModalError("");
    setAdminVerifying(true);
    try {
      const response = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: adminPasscode })
      });
      const data = await response.json();
      if (data.authorized) {
        localStorage.setItem("overhaultrain_is_admin", "true");
        setShowAdminModal(false);
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn("Bypass auth err:", authErr);
        }
        onAuthSuccess();
      } else {
        setAdminModalError("Invalid credentials.");
      }
    } catch (err: any) {
      console.error("Admin verification failed", err);
      setAdminModalError("Authorization check failed.");
    } finally {
      setAdminVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 p-4 md:p-8 overflow-y-auto font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col space-y-6 my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Brand Logo Header */}
        <div className="text-center">
          <div className="mb-4">
            <img 
              src="/images/LOGO.png" 
              alt="Overhaultrain Logo" 
              onClick={handleLogoClick}
              className="w-24 h-24 mx-auto object-contain drop-shadow-[0_10px_20px_rgba(139,92,246,0.1)] active:scale-105 transition cursor-pointer select-none"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {isLogin ? "Welcome Back" : "Join Overhaultrain"}
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {isLogin 
              ? "Sign in to continue your fitness journey" 
              : "Create your account and start training smarter"}
          </p>
        </div>

        {/* Authentication form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left select-text">
          {!isLogin && (
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10.5 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors placeholder-slate-650"
                  placeholder="Alex Rivera"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10.5 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors placeholder-slate-650"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10.5 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors placeholder-slate-650"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors placeholder-slate-650"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">Primary Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
                >
                  <option value="lose_weight">Lose Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="maintain">Stay Healthy / Performance</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <p className="text-rose-400 text-xs text-center bg-rose-950/20 border border-rose-900/50 p-2.5 rounded-xl font-medium animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3.5 rounded-xl font-bold text-white transition disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.985]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        {/* Toggle options */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            {isLogin 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </button>
        </div>

      </div>

      {/* Admin Passcode Easter Egg Entry Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans text-left">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center">
              <div className="bg-cyan-950/50 border border-cyan-800/40 p-2.5 w-11 h-11 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-pulse">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Administrative Gate</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">Enter secure credentials to bypass auth and activate override panels.</p>
            </div>
            
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-colors placeholder-slate-600 font-mono tracking-widest"
                  autoFocus
                />
              </div>
              
              {adminModalError && (
                <p className="text-xs text-rose-400 text-center animate-shake" id="admin-modal-error">{adminModalError}</p>
              )}
              
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2.5 border border-slate-800 hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminVerifying}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 py-2.5 text-xs font-bold rounded-xl text-white transition cursor-pointer shadow-lg active:scale-[0.985] flex items-center justify-center gap-1.5"
                >
                  {adminVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Authorize"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
