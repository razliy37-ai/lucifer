import React, { useState } from "react";
import { TrendingUp, Mail, Shield, KeyRound, AlertCircle, HelpCircle, CheckCircle, Sparkles } from "lucide-react";
import { UserRole, SubscriptionType, User } from "../types";

interface AuthProps {
  onAuthSuccess: (user: User) => void;
  onBackToLanding: () => void;
  isDark: boolean;
  defaultMode?: "login" | "register";
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onBackToLanding, isDark, defaultMode = "login" }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "verify">(defaultMode);
  
  // Form values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [plan, setPlan] = useState<SubscriptionType>("premium");
  
  // UI States
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [tempUserId, setTempUserId] = useState<string>("");

  const handleGoogleLogin = () => {
    // Google OAuth simulation
    setSuccessMsg("Connecting securely with Google Accounts Account Services...");
    setError(null);
    setTimeout(() => {
      const mockGoogleGmail = email || "owner@sme-example.com";
      const mockUser: User = {
        id: "usr-" + Math.random().toString(36).substring(3, 9),
        name: email ? email.split("@")[0] : "Razli Raz",
        email: mockGoogleGmail,
        role: "user", // Default
        subscription: "premium", // Premium for Google trial
        businessId: "bus-google"
      };
      onAuthSuccess(mockUser);
    }, 1200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please declare a valid email and passkey combination.");
      return;
    }
    
    setError(null);
    setSuccessMsg("Validating standard secure session token...");
    
    setTimeout(() => {
      // Create user session
      const mockUser: User = {
        id: "usr-logged",
        name: email.split("@")[0] || "Proprietor",
        email: email,
        role: email.toLowerCase().includes("admin") ? "administrator" : "user",
        subscription: email.toLowerCase().includes("free") ? "free" : "premium",
        businessId: "bus-custom"
      };
      onAuthSuccess(mockUser);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !businessName) {
      setError("Please provide all required fields to register your SME.");
      return;
    }
    
    setError(null);
    setSuccessMsg("Account pre-allocated. Initiating safety verification screen...");
    
    setTimeout(() => {
      // Transition to code verification screen
      setTempUserId("usr-" + Math.random().toString(36).substring(3, 9));
      setMode("verify");
      setSuccessMsg("We sent a secure validation token message to your email.");
    }, 1200);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Validating code token successfully!");
    setError(null);
    
    setTimeout(() => {
      const mockUser: User = {
        id: tempUserId || "usr-test",
        name: fullName || "Valued Merchant",
        email: email,
        role: role,
        subscription: plan,
        businessId: "bus-" + Math.random().toString(36).substring(3, 10),
      };
      // Propagate registered business information immediately
      localStorage.setItem("fintrack_company_name", businessName || "My SME Business");
      onAuthSuccess(mockUser);
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Input your email address to recover your key.");
      return;
    }
    setError(null);
    setSuccessMsg(`A deep-link password recovery route has been dispatched to ${email}.`);
  };

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 flex items-center justify-center font-sans ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}`}>
      <div className={`w-full max-w-md p-8 sm:p-10 rounded-3xl border shadow-xl ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        
        {/* App Logo */}
        <div className="flex flex-col items-center select-none text-center space-y-3 mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-md cursor-pointer" onClick={onBackToLanding}>
            <TrendingUp className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            FinTrack Portal
          </h2>
          <p className="text-xs text-slate-500 max-w-xs">
            Automated SME Ledger &amp; Financial Advisory Suite
          </p>
        </div>

        {/* Feedback Alert Banners */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex gap-2 items-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs flex gap-2 items-center">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-yellow-500 animate-spin" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode: Login */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Coordinates</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-400">Passkey</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Forgot passkey?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                  required
                />
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
              id="login-submit-btn"
            >
              Sign In to FinTrack
            </button>

            {/* Quick Helper Tip */}
            <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed border ${isDark ? "bg-slate-800/20 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
              💡 <strong>Tip:</strong> Log in with <code className="text-blue-500">admin@fintrack.io</code> for full system administrator privileges. Log in with <code className="text-blue-500">free@fintrack.io</code> to test constraints of the Free subscription tier limits.
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="flex-shrink mx-4 text-slate-500 text-xs">Or connect via</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={`w-full py-3 rounded-xl border font-medium text-sm flex items-center justify-center gap-2.5 transition ${isDark ? "bg-slate-950 hover:bg-slate-900 border-slate-850" : "bg-white hover:bg-slate-50 border-slate-200"}`}
              id="google-login-btn"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-1.12 2.76-2.4 3.62v3h3.84c2.25-2.07 3.55-5.12 3.55-8.7A12.2 12.2 0 0 0 23.745 12.27z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.84-3c-1.1.73-2.5 1.16-4.12 1.16-3.17 0-5.85-2.14-6.81-5.02H1.233v3.1A12 12 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.19 14.23c-.25-.73-.39-1.5-.39-2.3 0-.8.14-1.58.39-2.3V6.53H1.233A12 12 0 0 0 0 11.93c0 1.95.47 3.8 1.23 5.4l3.96-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.41A12 12 0 0 0 1.23 6.53l3.96 3.1c.96-2.88 3.64-5.02 6.81-5.02s3.64 5.02 6.81 5.02z"
                />
              </svg>
              Sign In with Google Account
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-xs text-blue-500 font-semibold hover:underline"
              >
                Start free trial
              </button>
            </div>
          </form>
        )}

        {/* Mode: Register */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Corporate Owner Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="CEO Name"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Registered SME Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Alpha Consulting Ltd"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Business Email Coordinates</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operations@company.com"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Create Secure Passkey</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                required
              />
            </div>

            {/* Custom User Parameters Selection on account registration */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SaaS Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"}`}
                >
                  <option value="user">SME Owner (User)</option>
                  <option value="administrator">System Admin (Platform)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">SaaS Tier Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as SubscriptionType)}
                  className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"}`}
                >
                  <option value="premium">Premium Suite ($29/mo)</option>
                  <option value="free">Free Tier Sandbox</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
              id="register-submit-btn"
            >
              Sign Up &amp; Verify Email
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-500">Back to </span>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-blue-500 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Mode: Email Verification Code Simulation */}
        {mode === "verify" && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold">Email Verification Required</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Security is paramount. We dispatched a 5-digit authentication pin code to <strong className="text-slate-200">{email}</strong>. Please input it below.
              </p>
            </div>

            <div className="flex justify-center space-x-3.5 font-mono">
              <input
                type="text"
                maxLength={5}
                placeholder="12345"
                defaultValue="58421"
                className={`w-32 py-2 text-center text-xl font-bold tracking-widest rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-100 border-slate-200 text-slate-900"}`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
              id="verify-submit-btn"
            >
              Validate Credentials &amp; Launch
            </button>

            <button
              type="button"
              onClick={() => {
                setSuccessMsg("Dispatched a replacement verification code pin.");
              }}
              className="w-full text-xs text-blue-500 font-medium hover:underline text-center"
            >
              Resend Code Verification message
            </button>
          </form>
        )}

        {/* Mode: Forgot Password */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div className="text-center space-y-2 mb-4">
              <div className="w-11 h-11 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mx-auto">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold">Reset Your Passkey</h3>
              <p className="text-xs text-slate-400">
                Type in your configured email. We will wire a secure bypass sequence right away.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Corporate Email coordinates</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="my-login@comp.com"
                className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition"
              id="forgot-submit-btn"
            >
              Send Bypass passkey Link
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-blue-500 font-semibold hover:underline"
              >
                Return to Sign In screen
              </button>
            </div>
          </form>
        )}

        {/* Back navigation footer */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-850 text-center">
          <button
            onClick={onBackToLanding}
            className="text-xs text-slate-400 hover:text-slate-300 transition"
          >
            ← Return to Presentational Page
          </button>
        </div>

      </div>
    </div>
  );
};
