import React, { useState } from "react";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  Trash2, 
  CheckCircle, 
  X, 
  ShieldAlert, 
  ArrowUpRight,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { User, PlatformSubscriber, SubscriptionType } from "../types";
import { MOCK_ADMIN_SUBSCRIBERS } from "../data";

interface AdminProps {
  user: User;
  isDark: boolean;
}

export const Admin: React.FC<AdminProps> = ({ user, isDark }) => {
  const [subscribers, setSubscribers] = useState<PlatformSubscriber[]>(() => {
    const cached = localStorage.getItem("fintrack_subscribers_db");
    return cached ? JSON.parse(cached) : MOCK_ADMIN_SUBSCRIBERS;
  });

  // Form states to register mock SME accounts
  const [showAddSME, setShowAddSME] = useState(false);
  const [newSMEBusiness, setNewSMEBusiness] = useState("");
  const [newSMEEmail, setNewSMEEmail] = useState("");
  const [newSMEPlan, setNewSMEPlan] = useState<SubscriptionType>("premium");
  const [newSMERev, setNewSMERev] = useState("");

  const saveToLocal = (updated: PlatformSubscriber[]) => {
    setSubscribers(updated);
    localStorage.setItem("fintrack_subscribers_db", JSON.stringify(updated));
  };

  if (user.role !== "administrator") {
    return (
      <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-slate-350 space-y-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-500 text-sm">Access Restrictions Violation</h4>
            <p className="text-xs text-slate-400 mt-1">
              The Admin Dashboard is strictly reserved for FinTrack Platform Administrators.
            </p>
            <div className="mt-4 p-3 bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg">
              🔑 <strong>Platform Developer Bypass:</strong> Click Sign Out on the sidebar, go to Login and type the email <strong>"admin@fintrack.io"</strong> to gain administrator privileges instantly!
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stats Calculations
  const totalBusinesses = subscribers.length;
  const activePremiumCount = subscribers.filter(s => s.plan === "premium" && s.status === "active").length;
  // SaaS Premium seats are priced at $29/mo
  const monthlyRecurringRevenue = activePremiumCount * 29;
  
  const platformAUM = subscribers.reduce((sum, s) => sum + s.monthlyRevenue, 0);

  const handleTogglePlan = (subId: string) => {
    const updated = subscribers.map(s => {
      if (s.id === subId) {
        const nextPlan: SubscriptionType = s.plan === "premium" ? "free" : "premium";
        return {
          ...s,
          plan: nextPlan
        };
      }
      return s;
    });
    saveToLocal(updated);
  };

  const handleToggleStatus = (subId: string) => {
    const updated = subscribers.map(s => {
      if (s.id === subId) {
        const nextStatus = s.status === "active" ? "cancelled" : "active";
        return {
          ...s,
          status: nextStatus as any
        };
      }
      return s;
    });
    saveToLocal(updated);
  };

  const handleDeleteSubscriber = (subId: string) => {
    if (confirm("Are you sure you want to remove this tenant from FinTrack's active servers?")) {
      const updated = subscribers.filter(s => s.id !== subId);
      saveToLocal(updated);
    }
  };

  const handleAddSMESubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSMEBusiness.trim() || !newSMEEmail.trim()) return;

    const newSub: PlatformSubscriber = {
      id: "sub" + (subscribers.length + 1),
      businessName: newSMEBusiness.trim(),
      email: newSMEEmail.trim(),
      plan: newSMEPlan,
      startDate: new Date().toISOString().split("T")[0],
      monthlyRevenue: parseFloat(newSMERev) || 2500,
      status: "active"
    };

    const updated = [...subscribers, newSub];
    saveToLocal(updated);

    // Reset
    setNewSMEBusiness("");
    setNewSMEEmail("");
    setNewSMERev("");
    setShowAddSME(false);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" /> Root Access
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">SaaS administrative control deck. Track conversions, update premium plans, and view total SME MRR performance indicators.</p>
        </div>

        <button
          onClick={() => setShowAddSME(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition flex items-center gap-1.5 self-start md:self-auto shadow-lg shadow-blue-500/10"
        >
          <UserPlus className="w-4 h-4" /> Register Client SME
        </button>
      </div>

      {/* Admin KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Conversions */}
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3.5xl font-black font-mono">{totalBusinesses} <span className="text-xs text-slate-500">Businesses</span></h3>
          <p className="text-xs text-slate-500 mt-2">Active database tenants mapped</p>
        </div>

        {/* Platform MRR */}
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimated SaaS MRR</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3.5xl font-black font-mono">${monthlyRecurringRevenue} <span className="text-xs text-slate-500">USD</span></h3>
          <p className="text-xs text-slate-500 mt-2">Active premium accounts are charged $29/mo </p>
        </div>

        {/* Premium Conversions Ratio */}
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Premium Seats Ratio</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3.5xl font-black font-mono">
            {totalBusinesses ? ((activePremiumCount / totalBusinesses) * 100).toFixed(0) : 0}%
          </h3>
          <p className="text-xs text-slate-500 mt-2">({activePremiumCount} of {totalBusinesses} on Premium seats)</p>
        </div>

        {/* Client Business Scale */}
        <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate SME Volume</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3.5xl font-black font-mono">${(platformAUM / 1000).toFixed(1)}K</h3>
          <p className="text-xs text-slate-500 mt-2">Sum of registered business revenues</p>
        </div>

      </div>

      {/* Main subscriber table List */}
      <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
        <div className="mb-6">
          <h3 className="text-lg font-bold">Client Subscriptions Accounts Management</h3>
          <p className="text-xs text-slate-400">View contact details, change membership tiers, or remove business profiles securely.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/20 text-slate-450 uppercase font-extrabold tracking-widest">
                <th className="py-3 px-3">Business SME Profile</th>
                <th className="py-3 px-3">Email Coordinates</th>
                <th className="py-3 px-3">SaaS Tier Plan</th>
                <th className="py-3 px-3">Enrollment Date</th>
                <th className="py-3 px-3">Reporting Revenue Scale</th>
                <th className="py-3 px-3 text-center">Membership Status</th>
                <th className="py-3 px-3 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/10 text-sm">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-850/10 transition">
                  <td className="py-3 px-3 font-bold">{sub.businessName}</td>
                  <td className="py-3 px-3 text-xs text-slate-400">{sub.email}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTogglePlan(sub.id)}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer border transition ${
                        sub.plan === "premium" 
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/25" 
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/25"
                      }`}
                      title="Click to toggle member tier subscription plan"
                    >
                      {sub.plan}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-400 font-mono">{sub.startDate}</td>
                  <td className="py-3 px-3 font-mono text-xs">${sub.monthlyRevenue.toLocaleString()}/mo</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      sub.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(sub.id)}
                      className="text-xs text-blue-500 hover:underline font-semibold"
                    >
                      Toggle Status
                    </button>
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="text-slate-400 hover:text-rose-500 transition inline-block align-middle pb-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No directory records logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SME Registration Dialog */}
      {showAddSME && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-950/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl animate-fade-in ${isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"}`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-1.5">
                <Users className="w-5 h-5 text-blue-500" /> Administrative Client Register
              </h3>
              <button 
                onClick={() => setShowAddSME(false)} 
                className="text-xs text-slate-400 hover:text-slate-300 font-mono tracking-widest px-2- py-1 rounded"
              >
                Close ✕
              </button>
            </div>

            <form onSubmit={handleAddSMESubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Company Registered Name</label>
                <input
                  type="text"
                  required
                  value={newSMEBusiness}
                  onChange={(e) => setNewSMEBusiness(e.target.value)}
                  placeholder="e.g. Zenith Consulting Partners"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Contact Email</label>
                <input
                  type="email"
                  required
                  value={newSMEEmail}
                  onChange={(e) => setNewSMEEmail(e.target.value)}
                  placeholder="contact@zenith.com"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Membership Plan Enrollment</label>
                <select
                  value={newSMEPlan}
                  onChange={(e) => setNewSMEPlan(e.target.value as SubscriptionType)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                >
                  <option value="premium">Premium Suite Subscription ($29/mo)</option>
                  <option value="free">Free Tier Sandbox membership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Initial Monthly Revenue ($ USD)</label>
                <input
                  type="number"
                  value={newSMERev}
                  onChange={(e) => setNewSMERev(e.target.value)}
                  placeholder="14,500"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg transition"
                >
                  Confirm Account Registration
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
