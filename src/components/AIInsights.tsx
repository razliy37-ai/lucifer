import React, { useState } from "react";
import { Sparkles, Brain, AlertTriangle, Lightbulb, PiggyBank, RefreshCw, Send, HelpCircle } from "lucide-react";
import { User, Transaction, Category } from "../types";

interface AIInsightsProps {
  user: User;
  companyName: string;
  transactions: Transaction[];
  categories: Category[];
  isDark: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ user, companyName, transactions, categories, isDark }) => {
  const [insightOutput, setInsightOutput] = useState<string | null>(() => {
    if (user.subscription !== "premium") {
      return "⚠️ **Premium Feature Required**: Upgrade your subscription to Premium to consult FinTrack AI Financial Assistant and get Gemini-powered performance audits on your corporate ledger.";
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [statusQuote, setStatusQuote] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  const auditQuotes = [
    "Ingesting active ledger entries...",
    "Calculating sector gross margins...",
    "Detecting anomalous utility spend peaks...",
    "Analyzing historical MoM balance charts...",
    "Formulating action strategies for cost efficiency...",
    "Mapping marketing ROI profiles with benchmarks..."
  ];

  const handleQueryAI = async (specificTopic?: string) => {
    if (user.subscription !== "premium") {
      alert("Consulting FinTrack AI requires a Premium Subscription plan. Head over to our Billing module or switch roles on registration!");
      return;
    }

    setLoading(true);
    setInsightOutput(null);
    
    // Cycle progress quotes
    let quoteIndex = 0;
    setStatusQuote(auditQuotes[0]);
    const interval = setInterval(() => {
      quoteIndex = (quoteIndex + 1) % auditQuotes.length;
      setStatusQuote(auditQuotes[quoteIndex]);
    }, 1800);

    try {
      // Calculate summary parameters
      const totalRev = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const totalExp = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const summary = {
        totalRevenue: totalRev,
        totalExpenses: totalExp,
        netProfit: totalRev - totalExp,
        cashBalance: 15050 + (totalRev - totalExp)
      };

      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: companyName,
          summary,
          transactions: transactions.slice(-15), // Last 15 for safety token size
          customPrompt: specificTopic || customPrompt
        })
      });

      const data = await res.json();
      clearInterval(interval);

      if (data.success) {
        setInsightOutput(data.insight);
      } else {
        setInsightOutput(`❌ **Error**: ${data.error || "Failed to parse advice."}`);
      }
    } catch (err: any) {
      clearInterval(interval);
      setInsightOutput(`❌ **Connection Deficit**: Unable to hit server API. Ensure server is active and Gemini API keys are configured correctly.\n\nRaw defect info: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = [
    { label: "SME Cash Performance Audit", icon: Brain, topic: "Run a complete spending audit of June ledger events" },
    { label: "Anomalies & Overspending Detection", icon: AlertTriangle, topic: "Find unusual spend spikes or marketing run issues" },
    { label: "3 Cost Saving Recommendations", icon: PiggyBank, topic: "Give me 3 precise, practical business saving tips" },
    { label: "Revenue Improvement Ideas", icon: Lightbulb, topic: "Formulate realistic revenue growth tips for this trade" }
  ];

  // Helper to parse markdown blocks into beautiful styled HTML
  const renderParsedMarkdown = (rawText: string) => {
    if (!rawText) return null;
    
    const lines = rawText.split("\n");
    return lines.map((line, idx) => {
      // Strong headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-base font-bold text-blue-500 mt-4 mb-2">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-lg font-black text-white bg-slate-950/20 px-3 py-1.5 rounded-lg mt-6 mb-3 border-l-4 border-blue-500">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-xl font-extrabold text-white mt-8 mb-4 border-b border-slate-800 pb-2">{line.replace("# ", "")}</h2>;
      }
      
      // Points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const cleaned = line.replace(/^[-*]\s+/, "");
        // Highlight bold text inline
        return (
          <li key={idx} className="text-xs leading-relaxed text-slate-300 ml-4 list-disc mb-1.5">
            {cleaned.includes("**") ? parseInlineBold(cleaned) : cleaned}
          </li>
        );
      }

      // Normal paragraph
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      
      return (
        <p key={idx} className="text-xs leading-relaxed text-slate-300 mb-2.5">
          {line.includes("**") ? parseInlineBold(line) : line}
        </p>
      );
    });
  };

  // Safe inline bold formatter
  const parseInlineBold = (text: string) => {
    const parts = text.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-white font-extrabold bg-blue-500/10 px-1 rounded">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold tracking-tight">AI Financial Assistant</h1>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/20 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Powered by Gemini
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">Harness advanced language modeling to run audits, flag spikes, and receive custom cost-saving tips instantly.</p>
        </div>
      </div>

      {user.subscription !== "premium" && (
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-slate-300 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-500 text-sm">SaaS Premium Upgrade Required</h4>
              <p className="text-xs text-slate-400 mt-1">
                The AI Automated advisory module utilizes the secure server-integrated Gemini 3.5 API to read ledger variables. Our free tier limits accessing this suite.
              </p>
              <div className="mt-4 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs italic">
                🔑 <strong>Developer Tip:</strong> Head back to Authentication or Sign Out, click "Start Free Trial" and register specifying <strong>"Premium Tier Plan"</strong> to test full AI capabilities immediately!
              </div>
            </div>
          </div>
        </div>
      )}

      {user.subscription === "premium" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Preset trigger panels */}
          <div className="space-y-4.5">
            <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-500" /> Selector Playbook
              </h3>
              <p className="text-xs text-slate-500 mb-4">Click one of our engineered diagnostic triggers to run instant financial formulas on your database.</p>
              
              <div className="space-y-2.5">
                {presetQueries.map((query, index) => {
                  const IconComp = query.icon;
                  return (
                    <button
                      key={index}
                      disabled={loading}
                      onClick={() => handleQueryAI(query.topic)}
                      className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/20 hover:bg-slate-850 hover:border-slate-700 transition flex items-center gap-3 group text-xs text-slate-300 font-semibold"
                    >
                      <div className="p-1.5 bg-blue-600/10 text-blue-500 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span>{query.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Ask component */}
            <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Custom Ad-hoc Consulting</h3>
              
              <div className="space-y-3">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="How should I optimize my utility spending? What is my safety margin rate?"
                  className="w-full h-24 p-3 text-xs bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none text-slate-300 placeholder:text-slate-650"
                />

                <button
                  disabled={loading || !customPrompt.trim()}
                  onClick={() => handleQueryAI()}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Audit Question
                </button>
              </div>
            </div>

          </div>

          {/* Interactive Output Terminal */}
          <div className="lg:col-span-2">
            
            <div className={`h-full min-h-[450px] p-6 sm:p-8 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-150 text-slate-900 shadow"
            }`}>
              
              {/* Top status */}
              <div className="flex justify-between items-center border-b border-slate-800/15 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-500" />
                  <div>
                    <span className="text-sm font-bold block">Advisory Copilot Report Terminal</span>
                    <span className="text-[10px] text-slate-400 font-mono">Model alias: gemini-3.5-flash</span>
                  </div>
                </div>
                
                {insightOutput && (
                  <button
                    onClick={() => handleQueryAI()}
                    className="p-1.5 rounded bg-slate-950/20 hover:bg-slate-800/20 text-blue-500 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Central text response context */}
              <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 scrollbar-thin">
                
                {/* Idle Mode */}
                {!insightOutput && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10 space-y-4">
                    <Brain className="w-12 h-12 text-slate-700 animate-pulse" />
                    <div className="space-y-1 max-w-sm">
                      <p className="font-bold text-slate-300 text-sm">SME Advisory Core Standby</p>
                      <p className="text-xs text-slate-500">
                        Choose a trigger from the Selector Playbook or enter an ad-hoc concern to run a live analysis of June's transactions log.
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading Mode */}
                {loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-600/30 text-blue-500 flex items-center justify-center animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-slate-200 text-sm animate-pulse">{statusQuote}</p>
                      <p className="text-[10px] text-slate-500 max-w-xs font-mono">Wired via server-proxied Google GenAI API</p>
                    </div>
                  </div>
                )}

                {/* Live parsed Output Mode */}
                {insightOutput && (
                  <div className="prose prose-sm prose-invert max-w-none text-left space-y-4">
                    {renderParsedMarkdown(insightOutput)}
                  </div>
                )}

              </div>

              {/* Advisory disclaimer footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/15 text-[10px] text-slate-500 flex items-center gap-1.5 justify-center leading-relaxed">
                <span>⚡ <strong>Disclaimer:</strong> FinTrack AI provides automated statistical audits using Gemini. Consult registered CPA accountants for tax filings.</span>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
