import React, { useState, useEffect } from "react";
import { User, Transaction, Category, PlatformNotification } from "./types";
import { DEFAULT_CATEGORIES, PRE_POPULATED_TRANSACTIONS, INITIAL_NOTIFICATIONS } from "./data";
import { LandingPage } from "./components/LandingPage";
import { Auth } from "./components/Auth";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Reports } from "./components/Reports";
import { AIInsights } from "./components/AIInsights";
import { Team } from "./components/Team";
import { Admin } from "./components/Admin";
import { TrendingUp, UserCheck, ShieldCheck, Mail, Sparkles } from "lucide-react";

export const App: React.FC = () => {
  // Global View States
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("fintrack_user");
    return cached ? JSON.parse(cached) : null;
  });
  
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDark, setIsDark] = useState(true);

  // Databases Loaded with Local Persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const cached = localStorage.getItem("fintrack_transactions_db");
    return cached ? JSON.parse(cached) : PRE_POPULATED_TRANSACTIONS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const cached = localStorage.getItem("fintrack_categories_db");
    return cached ? JSON.parse(cached) : DEFAULT_CATEGORIES;
  });

  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => {
    const cached = localStorage.getItem("fintrack_notifications_db");
    return cached ? JSON.parse(cached) : INITIAL_NOTIFICATIONS;
  });

  const [companyName, setCompanyName] = useState(() => {
    return localStorage.getItem("fintrack_company_name") || "Alpha Consulting Ltd";
  });

  // Settings Drawer View Toggle
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempCompanyName, setTempCompanyName] = useState(companyName);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("fintrack_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("fintrack_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("fintrack_transactions_db", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fintrack_categories_db", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("fintrack_notifications_db", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("fintrack_company_name", companyName);
  }, [companyName]);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthMode(null);
    setActiveTab("dashboard");
    // Clear localized credentials but keep ledger databases for preview safety
    localStorage.removeItem("fintrack_user");
  };

  const handleStartDemo = (plan: "free" | "premium") => {
    const demoUser: User = {
      id: "usr-demo",
      name: "Demo Owner",
      email: plan === "premium" ? "owner@prime-sme.com" : "owner@starter-sme.com",
      role: "user",
      subscription: plan,
      businessId: "bus-demo"
    };

    setCompanyName(plan === "premium" ? "Apex Software Agency" : "Local Retail Shop");
    setTempCompanyName(plan === "premium" ? "Apex Software Agency" : "Local Retail Shop");
    setCurrentUser(demoUser);
    setAuthMode(null);
    setActiveTab("dashboard");
  };

  // State mutation actions passed to components
  const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
    const fresh: Transaction = {
      ...newTx,
      id: "tx-" + Math.random().toString(36).substring(3, 9)
    };
    const updated = [...transactions, fresh];
    setTransactions(updated);

    // Add automated notifications for high expenses
    if (fresh.type === "expense" && fresh.amount > 1500) {
      const expenseNotice: PlatformNotification = {
        id: "n-auto-" + Date.now(),
        title: "Major Outflow Registered",
        message: `Registered a high-volume expense flow segment of $${fresh.amount} under category allocation. Run an immediate ROI check.`,
        type: "alert",
        date: new Date().toISOString(),
        read: false
      };
      setNotifications([expenseNotice, ...notifications]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddCategory = (newCat: Omit<Category, "id">) => {
    const fresh: Category = {
      ...newCat,
      id: "cat-" + Math.random().toString(36).substring(3, 9)
    };
    setCategories(prev => [...prev, fresh]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Reset demo databases to defaults
  const handleResetData = () => {
    if (confirm("Reset financial logs and categories to initial default templates?")) {
      setTransactions(PRE_POPULATED_TRANSACTIONS);
      setCategories(DEFAULT_CATEGORIES);
      setNotifications(INITIAL_NOTIFICATIONS);
      setCompanyName("Alpha Consulting Ltd");
      setTempCompanyName("Alpha Consulting Ltd");
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"} transition-colors`}>
      
      {/* Route Render logic */}
      {!currentUser && !authMode && (
        <LandingPage 
          onStartDemo={handleStartDemo} 
          onNavigateToAuth={(mode) => setAuthMode(mode)} 
          isDark={isDark} 
        />
      )}

      {!currentUser && authMode && (
        <Auth 
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            setAuthMode(null);
            setActiveTab("dashboard");
          }} 
          onBackToLanding={() => setAuthMode(null)} 
          isDark={isDark} 
          defaultMode={authMode}
        />
      )}

      {currentUser && (
        <div className="flex flex-col md:flex-row">
          
          {/* Main Sidebar */}
          <Sidebar 
            user={currentUser} 
            companyName={companyName}
            activeTab={activeTab} 
            onNavigateTab={(tab) => {
              if (tab === "notifications") {
                setActiveTab("dashboard");
                // Open setting trigger or notifications alert
              } else {
                setActiveTab(tab);
              }
            }} 
            isDark={isDark} 
            onToggleTheme={handleToggleTheme} 
            onSignOut={handleSignOut}
            notifications={notifications}
            onMarkNotificationsRead={handleMarkAllRead}
          />

          {/* Unified Content Container */}
          <main className="flex-1 md:ml-64 p-6 sm:p-10 space-y-8 min-h-screen">
            
            {/* Context Tab Routing */}
            {activeTab === "dashboard" && (
              <Dashboard 
                user={currentUser} 
                companyName={companyName} 
                transactions={transactions} 
                categories={categories} 
                isDark={isDark}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onAddTransaction={handleAddTransaction}
              />
            )}

            {activeTab === "transactions" && (
              <Transactions 
                user={currentUser} 
                transactions={transactions} 
                categories={categories} 
                isDark={isDark} 
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                onAddCategory={handleAddCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === "reports" && (
              <Reports 
                user={currentUser} 
                companyName={companyName} 
                transactions={transactions} 
                categories={categories} 
                isDark={isDark} 
              />
            )}

            {activeTab === "aiassistant" && (
              <AIInsights 
                user={currentUser} 
                companyName={companyName} 
                transactions={transactions} 
                categories={categories} 
                isDark={isDark} 
              />
            )}

            {activeTab === "team" && (
              <Team 
                user={currentUser} 
                isDark={isDark} 
              />
            )}

            {activeTab === "admin" && (
              <Admin 
                user={currentUser} 
                isDark={isDark} 
              />
            )}

            {/* Quick access settings floating indicator or trigger */}
            <div className="pt-8 border-t border-slate-800/10 dark:border-slate-800/55 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 print:hidden">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="hover:text-blue-500 font-bold flex items-center gap-1"
                >
                  <Settings className="w-4 h-4 text-slate-400" /> Platform Settings Configure
                </button>
                <span>|</span>
                <button
                  onClick={handleResetData}
                  className="hover:text-rose-500 font-bold"
                >
                  Reset Template Data
                </button>
              </div>
              <p>© 2026 FinTrack Bookkeeping Hub. All Rights Secure.</p>
            </div>

          </main>

        </div>
      )}

      {/* Corporate Settings Configuration Modal Drawer */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-950/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl animate-fade-in ${
            isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-250 text-slate-900"
          }`}>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-1.5">
                <Settings className="w-5 h-5 text-blue-500" /> Tenant Configuration Setup
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="text-xs text-slate-400 hover:text-slate-350"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 mb-1">Registered Enterprise Name</label>
                <input
                  type="text"
                  value={tempCompanyName}
                  onChange={(e) => setTempCompanyName(e.target.value)}
                  placeholder="e.g. Acme Tech Ltd"
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>

              <div className="pt-2 text-[11px] leading-relaxed text-slate-500 border-t border-slate-800/10 dark:border-slate-800/40 space-y-2">
                <p><strong>Configured SME Workspace Limits:</strong></p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Active Database: Secure Client-Side Local State Engines</li>
                  <li>Server-proxied advisory routing targets: Gemini 3.5 API</li>
                  <li>SaaS subscriber: {companyName}</li>
                </ul>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className={`flex-1 py-3 border rounded-xl text-center font-bold ${
                    isDark ? "border-slate-800 hover:bg-slate-850" : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tempCompanyName.trim()) {
                      setCompanyName(tempCompanyName.trim());
                      setShowSettingsModal(false);
                    }
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Apply Workspace Changes
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
