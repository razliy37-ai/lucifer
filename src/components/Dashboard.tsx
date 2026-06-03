import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  Bell, 
  Plus, 
  UserCheck, 
  Wallet,
  PiggyBank,
  Briefcase
} from "lucide-react";
import { User, Transaction, Category } from "../types";

interface DashboardProps {
  user: User;
  companyName: string;
  transactions: Transaction[];
  categories: Category[];
  isDark: boolean;
  onNavigateToTab: (tab: string) => void;
  onAddTransaction: (t: Omit<Transaction, "id">) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  companyName, 
  transactions, 
  categories, 
  isDark, 
  onNavigateToTab,
  onAddTransaction 
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Quick Add Form State
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [categoryId, setCategoryId] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Compute stats
  const totalRevenue = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  // Imagine initial starting SME bank balance capital is $15,000
  const cashBalance = 15000 + netProfit;

  // Filter category helper
  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || "Miscellaneous";
  };

  const getCategoryColor = (catId: string) => {
    const color = categories.find(c => c.id === catId)?.color || "blue";
    const mapping: Record<string, string> = {
      emerald: "bg-emerald-500",
      teal: "bg-teal-500",
      indigo: "bg-indigo-500",
      rose: "bg-rose-500",
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      violet: "bg-violet-500",
      amber: "bg-amber-500",
      cyan: "bg-cyan-500",
      pink: "bg-pink-500"
    };
    return mapping[color] || "bg-blue-500";
  };

  // Safe category pre-selection
  const filteredCategories = categories.filter(c => c.type === type);
  const defaultCategoryPreselect = filteredCategories[0]?.id || "";

  // Handle transaction submission
  const handleSubmitQuick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return;
    
    // Limits check for free plan
    if (user.subscription === "free" && transactions.length >= 100) {
      alert("You have reached the Free Plan limit of 100 transactions/month. Please upgrade to unlock premium!");
      return;
    }

    onAddTransaction({
      amount: parseFloat(amount),
      type,
      categoryId: categoryId || defaultCategoryPreselect,
      description: desc || `Standard ${type} item`,
      date
    });

    // Reset Form
    setAmount("");
    setDesc("");
    setShowQuickAdd(false);
  };

  // Formatted date
  const formatTxDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const year = parts[0];
        const month = months[parseInt(parts[1], 10) - 1];
        const day = parts[2];
        return `${month} ${day}, ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-3xl font-extrabold tracking-tight">{companyName}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              user.subscription === "premium" 
                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
            }`}>
              {user.subscription === "premium" ? "Premium SaaS Member" : "Free Trial Sandbox"}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Financial diagnostic overview for <span className="font-mono text-xs">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3.5">
          {/* Quick-add Transaction button */}
          <button
            onClick={() => {
              // Preselect first category of matching current tab
              const firstCat = categories.find(c => c.type === "income")?.id || "";
              setCategoryId(firstCat);
              setShowQuickAdd(true);
            }}
            className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/10 transition flex items-center gap-1.5"
            id="dash-quick-add"
          >
            <Plus className="w-4 h-4" /> Log Transaction
          </button>
        </div>
      </div>

      {/* KPI Stats Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue Card */}
        <div className={`p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-mono">${totalRevenue.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last period</span>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className={`p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-mono">${totalExpenses.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-xs text-rose-400">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>+6.2% marketing outlay</span>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className={`p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Profit Margin</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-mono">${netProfit.toLocaleString()}</h3>
            <div className={`flex items-center gap-1 text-xs ${netProfit >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              <span>Margin Rate: {totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Cash Balance Card */}
        <div className={`p-6 rounded-2xl border transition-all ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Balance</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-extrabold font-mono">${cashBalance.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-xs text-blue-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Starting Capital: $15,000</span>
            </div>
          </div>
        </div>

      </div>

      {/* Subscription Warnings and Platform Alert Indicators */}
      {user.subscription === "free" && (
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-slate-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Free Plan Usage Tracker:</strong> You have logged <strong>{transactions.length}</strong> transactions out of your monthly quota (100 total limit).
            </span>
          </div>
          <button 
            onClick={() => onNavigateToTab("reports")} 
            className="text-xs font-extrabold text-blue-500 hover:underline flex-shrink-0 uppercase tracking-widest"
          >
            Upgrade Plan Now
          </button>
        </div>
      )}

      {/* Main Grid: Charts & Recents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Financial Flow Timeline (Interactive custom SVG timeline Chart) */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Revenue vs Expense Flows</h3>
              <p className="text-xs text-slate-400">Monthly fiscal profile and operational scale</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-medium">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500" /> Expense</span>
            </div>
          </div>

          {/* SVG Custom Balanced Chart */}
          <div className="h-64 w-full relative flex items-end">
            <div className="absolute inset-x-0 bottom-0 h-1 border-b border-slate-800 flex" />
            
            {/* June */}
            <div className="flex-1 flex flex-col justify-end items-center space-y-2 h-full z-10 hover:opacity-95">
              <div className="flex space-x-2 items-end w-full max-w-[120px] justify-center">
                {/* Income June */}
                <div 
                  className="w-8 sm:w-10 bg-emerald-500 rounded-t shadow transition-all duration-500"
                  style={{ height: `${Math.min(totalRevenue ? (totalRevenue / 25000) * 160 + 20 : 20, 180)}px` }}
                >
                  <div className="text-[9px] text-white font-mono text-center pt-1 font-bold">
                    ${(totalRevenue / 1000).toFixed(1)}K
                  </div>
                </div>
                {/* Expense June */}
                <div 
                  className="w-8 sm:w-10 bg-rose-500 rounded-t shadow transition-all duration-500"
                  style={{ height: `${Math.min(totalExpenses ? (totalExpenses / 25000) * 160 + 20 : 20, 180)}px` }}
                >
                  <div className="text-[9px] text-white font-mono text-center pt-1 font-bold">
                    ${(totalExpenses / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">Current (June)</span>
            </div>

            {/* Previous month (May) */}
            <div className="flex-1 flex flex-col justify-end items-center space-y-2 h-full border-r border-slate-800/20">
              <div className="flex space-x-2 items-end w-full max-w-[120px] justify-center">
                {/* Income May (Faked context for visual beauty) */}
                <div 
                  className="w-8 sm:w-10 bg-emerald-500/50 rounded-t shadow"
                  style={{ height: "110px" }}
                >
                  <div className="text-[9px] text-white font-mono text-center pt-1 font-bold">
                    $15.7K
                  </div>
                </div>
                {/* Expense May */}
                <div 
                  className="w-8 sm:w-10 bg-rose-500/50 rounded-t shadow"
                  style={{ height: "70px" }}
                >
                  <div className="text-[9px] text-white font-mono text-center pt-1 font-bold">
                    $10.7K
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">Historical (May)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/40 text-xs text-slate-400 flex justify-between items-center">
            <span>Graph scaled automatically (max limit $25,000)</span>
            <span className="text-blue-500 font-semibold cursor-pointer flex items-center gap-0.5" onClick={() => onNavigateToTab("reports")}>
              View details report <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Business Diagnostic Summary & AI Advisor Trigger Card */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${isDark ? "bg-slate-900 border-slate-800" : "bg-gradient-to-tr from-blue-50 to-white border-slate-150 shadow-sm"}`}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-500">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h4 className="font-extrabold uppercase tracking-widest text-xs">AI Advisory Insights</h4>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold">Automated Advisory Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with the FinTrack AI model (Gemini 3.5 Flash). Our financial assistant analyzes recent transaction category percentages.
              </p>
            </div>

            <div className={`p-3.5 rounded-xl text-xs italic ${isDark ? "bg-slate-950/40 text-slate-350" : "bg-blue-500/5 text-slate-700"}`}>
              "Your June cash reserves remain stable at +$15K initial runway. Rent remains a primary hard outlay. Click analyze to check marketing ROI."
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <button
              onClick={() => onNavigateToTab("aiassistant")}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-755 hover:to-indigo-755 text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              Consult Advisory Copilot <Sparkles className="w-4 h-4 text-yellow-300" />
            </button>
          </div>
        </div>

      </div>

      {/* Recent Transactions List */}
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold">Recent Transactions Ledger</h3>
            <p className="text-xs text-slate-400">Chronological history of registered business flows</p>
          </div>
          <button
            onClick={() => onNavigateToTab("transactions")}
            className="text-xs font-bold text-blue-500 hover:underline uppercase tracking-wider flex items-center gap-0.5"
          >
            Manage entire history <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/20 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-1">Date</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/10 text-sm">
              {transactions.slice(-5).reverse().map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3.5 px-1 text-slate-400 whitespace-nowrap font-mono text-xs">
                    {formatTxDate(t.date)}
                  </td>
                  <td className="py-3.5 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 font-semibold">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getCategoryColor(t.categoryId)}`} />
                      <span>{getCategoryName(t.categoryId)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-slate-400 max-w-xs truncate">{t.description}</td>
                  <td className={`py-3.5 px-2 font-mono font-bold text-right ${
                    t.type === "income" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No transactions recorded. Click "Log Transaction" above to add some initial records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Add Transaction Modal Overlay */}
      {showQuickAdd && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-950/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl animate-fade-in ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-1.5">
                <Wallet className="w-5 h-5 text-blue-500" /> Log SME Transaction
              </h3>
              <button 
                onClick={() => setShowQuickAdd(false)} 
                className="text-xs text-slate-400 hover:text-slate-300 font-mono tracking-widest px-2 py-1 rounded hover:bg-slate-800/20"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuick} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Transaction Flow</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      // Match first income category
                      const matching = categories.find(c => c.type === "income");
                      if (matching) setCategoryId(matching.id);
                    }}
                    className={`py-2 text-xs font-extrabold rounded-lg border transition ${
                      type === "income" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                        : "border-slate-800 hover:bg-slate-800/10"
                    }`}
                  >
                    INFLOW (Income)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      const matching = categories.filter(c => c.type === "expense");
                      if (matching && matching.length > 0) setCategoryId(matching[0].id);
                    }}
                    className={`py-2 text-xs font-extrabold rounded-lg border transition ${
                      type === "expense" 
                        ? "bg-rose-500/10 border-rose-500 text-rose-500" 
                        : "border-slate-800 hover:bg-slate-800/10"
                    }`}
                  >
                    OUTFLOW (Expense)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Outlay Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2,500.00"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">SME Category Allocation</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                >
                  {categories
                    .filter(c => c.type === type)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Calendar Booking Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="e.g. Monthly server cost, consulting retainer, etc"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg transition"
                >
                  Commit Ledger Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
