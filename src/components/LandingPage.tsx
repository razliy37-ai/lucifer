import React from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Brain, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  PieChart, 
  FileText,
  Clock,
  HeartHandshake
} from "lucide-react";

interface LandingPageProps {
  onStartDemo: (plan: "free" | "premium") => void;
  onNavigateToAuth: (mode: "login" | "register") => void;
  isDark: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartDemo, onNavigateToAuth, isDark }) => {
  return (
    <div className={`min-h-screen font-sans ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-800"}`}>
      {/* Navigation Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"} transition-colors`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigateToAuth("login")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}
              id="nav-login-btn"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigateToAuth("register")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-500/10 transition flex items-center gap-1.5"
              id="nav-signup-btn"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),rgba(255,255,255,0))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/15">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Smarter SME Bookkeeping Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Manage Your Business Finances Smarter with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                FinTrack
              </span>
            </h1>

            <p className={`text-base sm:text-xl max-w-2xl mx-auto ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Track income, monitor expenses, and generate professional profit &amp; loss reports automatically in seconds. Built explicitly for modern SMEs, creators, and freelancers.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onStartDemo("premium")}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group"
                id="hero-premium-btn"
              >
                Access Premium Demo <Sparkles className="w-5 h-5 text-amber-300" />
              </button>
              <button
                onClick={() => onStartDemo("free")}
                className={`w-full sm:w-auto px-8 py-4 font-semibold rounded-xl border transition-all ${
                  isDark 
                    ? "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200" 
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                }`}
                id="hero-free-btn"
              >
                Launch Free Tier Sandbox
              </button>
            </div>

            {/* Simulated Desktop Preview Frame */}
            <div className="mt-16 relative rounded-2xl overflow-hidden border border-slate-700/20 shadow-2xl">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="w-48 bg-slate-800/60 rounded text-[10px] text-slate-400 py-0.5 mx-auto text-center truncate">
                  fintrack-saas.com/dashboard
                </div>
              </div>
              <div className={`p-6 sm:p-10 ${isDark ? "bg-slate-950" : "bg-slate-900"} text-left text-slate-300 flex flex-col md:flex-row gap-6 items-center`}>
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Live Real-time Financial Reporting</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Say goodbye to manual spreadsheets. FinTrack automatically calculates your net profits, displays interactive trend metrics, and leverages the Gemini API to run instant diagnostic audits on cash flow deficits.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-300">
                    <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded">
                      ● Active Income: $20,200
                    </span>
                    <span className="flex items-center gap-1 bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded">
                      ■ June Outflow: $8,220
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-1/3 bg-slate-800/40 p-4 rounded-xl border border-slate-700/40 flex flex-col justify-between h-48">
                  <p className="text-xs text-slate-400 font-mono">FINANCIAL ASSISTANT SUMMARY</p>
                  <div className="text-sm text-white italic">
                    "Marketing expenditures grew by 15% comparing this month to last month. June's net margins remain robust at 59%."
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold cursor-pointer">
                    Chat with Advisory Copilot <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 border-y ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              SaaS Features Stack
            </h2>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Everything an entrepreneur or small team needs to monitor corporate finances safely and intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Income Tracking</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Log multiple sales channels and consulting invoices. Maintain accurate histories automatically.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Expense Management</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Sort outlays into clear default categories (rent, inventory, utilities, salaries) or define custom fields in seconds.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Real-Time Core Dashboard</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Analyze key metrics at a glance: net margins, active cash balances, monthly growth counters, and interactive trends.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Financial Assistant</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Harness Gemini 3.5 AI to analyze patterns, detect unusual spike warnings, and get smart saving recommendations.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-5">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Automated P&amp;L Reports</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate Instant profit-margin ledgers and cashflow reports with simple layout formulas compatible with accounting needs.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">PDF &amp; CSV Export</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Download high-fidelity financial audits, transaction sheets, and trend reports to share with investors or legal CPAs.
              </p>
            </div>

            {/* Feature Card 7 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Team Collaboration</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Invite team stakeholders and customize administrative permissions to share fiscal data securely.
              </p>
            </div>

            {/* Feature Card 8 */}
            <div className={`p-6 rounded-2xl border transition-all hover:translate-y-[-4px] ${isDark ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:shadow-md"}`}>
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Robust Platform Analytics</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Explore an Administrator command room showing total platform registrations, subscription states, and metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed to Save You 10+ Hours Every Week
              </h2>
              <p className={`text-base ${isDark ? "text-slate-400" : "text-slate-600"} leading-relaxed`}>
                SME proprietors spend days writing spreadsheets and chasing invoices. FinTrack collapses complex cash-management flows into a simple single-screen workspace, providing automatic insight summaries that bypass expensive consulting fees.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full h-fit">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Save Bookkeeping Time</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Reduce manual journal entries to simple, instant micro-inputs.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full h-fit">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Reduce Accounting Errors</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Clean automated calculators ensure your calculations are perfectly accurate.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full h-fit">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Better Corporate Decisions</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gain actionable performance clarity and trend charts that prove business viability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-1 rounded-2xl shadow-xl">
              <div className={`p-8 sm:p-10 rounded-2xl ${isDark ? "bg-slate-950" : "bg-slate-900"} text-white space-y-6`}>
                <div className="flex items-center space-x-3 text-blue-400">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span className="font-mono text-sm tracking-wider uppercase font-semibold">Instant Business Audit</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-4 space-y-2">
                  <p className="text-xs text-slate-400 font-mono">June 2026 Core Growth</p>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">+31.2% Month-over-Month Margin</p>
                </div>
                <blockquote className="text-sm sm:text-base italic text-slate-300 leading-relaxed">
                  "Your cash inflows represent continuous services retainer income. Expenses are safely consolidated under wages (41.5%) and advertising campaigns (16.6%). We recommend evaluating social advertising budgets to secure June retention."
                </blockquote>
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400 border border-slate-700">
                    FT
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">AI Financial Advisory Model</p>
                    <p className="text-[10px] text-slate-500 font-mono">POWERED BY GEMINI 3.5 FLASH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`py-20 border-t ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Flexible Pricing Tiers
            </h2>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Start tracking on our free tier or upgrade to unlock high-fidelity AI audits and export engines.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Free Plan */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold">Free Plan</h3>
                  <p className="text-sm text-slate-400 mt-1">Excellent for side-gigs and bootstrapping creators.</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold">$0</span>
                  <span className="text-sm font-semibold text-slate-500 ml-1">/ month</span>
                </div>

                <hr className={isDark ? "border-slate-800" : "border-slate-100"} />

                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Up to 100 transactions per month
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Clean unified financial dashboard
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    Simple category customization ledger
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-5 h-5 flex items-center justify-center">○</div>
                    No AI Financial advisory analyses
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-5 h-5 flex items-center justify-center">○</div>
                    Standard text reports (no PDF downloads)
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onStartDemo("free")}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all text-center border ${
                    isDark 
                      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white" 
                      : "bg-slate-150 hover:bg-slate-200 border-slate-200 text-slate-800"
                  }`}
                  id="pricing-free-btn"
                >
                  Launch Free Plan Demo
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className={`p-8 rounded-3xl border-2 relative flex flex-col justify-between ${
              isDark 
                ? "bg-slate-900/90 border-blue-600" 
                : "bg-white border-blue-600 shadow-md"
            }`}>
              {/* Badge */}
              <div className="absolute top-0 right-1/2 transform translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                Highly Recommended
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-1.5">
                      Premium Plan <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">Unlock AI forecasting, detailed audits, and document builders.</p>
                </div>

                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold">$29</span>
                  <span className="text-sm font-semibold text-slate-500 ml-1">/ month</span>
                </div>

                <hr className={isDark ? "border-slate-800" : "border-slate-100"} />

                <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <strong>Unlimited</strong> transactions history logs
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    Advanced profit-margin calculations
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <strong>AI Financial Assistant</strong> (Gemini Model)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    High-fidelity PDF, Excel &amp; CSV exporters
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    Multi-user team invitations &amp; role manager
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    Priority 24/7 financial support
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => onStartDemo("premium")}
                  className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 text-center"
                  id="pricing-premium-btn"
                >
                  Launch Premium Plan Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Footer */}
      <footer className={`py-12 border-t ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">FinTrack Platform Inc.</span>
          </div>
          <p>© 2026 FinTrack. All rights reserved. SME Automated Bookkeeping platform.</p>
        </div>
      </footer>
    </div>
  );
};
