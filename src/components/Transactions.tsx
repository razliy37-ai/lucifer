import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Filter, 
  Search, 
  Tag, 
  Sparkles, 
  FolderLock, 
  FolderPlus,
  HelpCircle,
  FileCheck2,
  ListRestart
} from "lucide-react";
import { User, Transaction, Category, TransactionType } from "../types";

interface TransactionsProps {
  user: User;
  transactions: Transaction[];
  categories: Category[];
  isDark: boolean;
  onAddTransaction: (t: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
  onAddCategory: (cat: Omit<Category, "id">) => void;
  onDeleteCategory: (id: string) => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  user,
  transactions,
  categories,
  isDark,
  onAddTransaction,
  onDeleteTransaction,
  onAddCategory,
  onDeleteCategory
}) => {
  // Filters
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Transaction Form State
  const [txType, setTxType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Create Custom Category Form State
  const [showCatPanel, setShowCatPanel] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<TransactionType>("expense");
  const [newCatColor, setNewCatColor] = useState("blue");

  // Feedback trackers
  const [toast, setToast] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Compute stats
  const filteredCategoriesList = categories.filter(c => c.type === txType);
  const selectedCat = categoryId || (filteredCategoriesList[0]?.id || "");

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please input a logical, positive transaction dollar amount!");
      return;
    }

    if (user.subscription === "free" && transactions.length >= 100) {
      alert("Free Tiers are restricted to 100 maximum logs. Upgrade now to secure unlimited SaaS records!");
      return;
    }

    onAddTransaction({
      amount: parseFloat(amount),
      type: txType,
      categoryId: selectedCat,
      description: description || `Standard ${txType} log`,
      date
    });

    displayToast(`Transaction of $${amount} added successfully!`);
    
    // Clear
    setAmount("");
    setDescription("");
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    onAddCategory({
      name: newCatName.trim(),
      type: newCatType,
      color: newCatColor,
    });

    displayToast(`Category "${newCatName}" added successfully.`);
    setNewCatName("");
  };

  // Filter transactions
  const displayedTransactions = transactions.filter(t => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory = filterCategory === "all" || t.categoryId === filterCategory;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Miscellaneous";
  };

  const getCategoryColor = (id: string) => {
    const color = categories.find(c => c.id === id)?.color || "blue";
    const colors: Record<string, string> = {
      emerald: "bg-emerald-500 text-emerald-500",
      teal: "bg-teal-500 text-teal-500",
      indigo: "bg-indigo-500 text-indigo-500",
      rose: "bg-rose-500 text-rose-500",
      orange: "bg-orange-500 text-orange-500",
      blue: "bg-blue-500 text-blue-500",
      violet: "bg-violet-500 text-violet-500",
      amber: "bg-amber-500 text-amber-500",
      cyan: "bg-cyan-500 text-cyan-500",
      pink: "bg-pink-500 text-pink-500"
    };
    return colors[color] || "bg-blue-500 text-blue-500";
  };

  const formatTxDateFormatted = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[parseInt(parts[1], 10)-1]} ${parts[2]}, ${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-blue-600 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-blue-500/20">
          <FileCheck2 className="w-4 h-4 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Financial Ledger</h1>
        <p className="text-sm text-slate-400 mt-1">Bookkeeping workspace. Add new incomes, record bills, and configure custom classifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Write Section: Forms */}
        <div className="space-y-6">
          
          {/* Main Transaction Form */}
          <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-1.5 text-blue-500">
              <Plus className="w-5 h-5" /> Log Income or Expense
            </h3>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Flow Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTxType("income");
                      const matched = categories.find(c => c.type === "income");
                      if (matched) setCategoryId(matched.id);
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      txType === "income" 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" 
                        : "border-slate-800 hover:bg-slate-850"
                    }`}
                  >
                    Income (Inflow)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTxType("expense");
                      const matched = categories.filter(c => c.type === "expense");
                      if (matched && matched.length > 0) setCategoryId(matched[0].id);
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      txType === "expense" 
                        ? "bg-rose-500/10 border-rose-500 text-rose-500" 
                        : "border-slate-800 hover:bg-slate-850"
                    }`}
                  >
                    Expense (Outflow)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Outlay Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="250.00"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bookkeeping Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Allocation</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}
                >
                  {categories
                    .filter(c => c.type === txType)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description (Invoice info/Note)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Acme invoice #204, utilities bill"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-md transition"
              >
                Log to Corporate Ledger
              </button>
            </form>
          </div>

          {/* Toggle Category Management Drawer */}
          <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
            <button
              onClick={() => setShowCatPanel(!showCatPanel)}
              className="w-full flex items-center justify-between text-xs font-bold text-blue-500 uppercase tracking-wider hover:underline"
            >
              <span>⚙ Category Configuration Setup</span>
              <span>{showCatPanel ? "Hide" : "Expand"}</span>
            </button>

            {showCatPanel && (
              <div className="mt-4 pt-4 border-t border-slate-800/40 space-y-4 animate-fade-in">
                
                {/* List categories with delete */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Existing Categories</p>
                  {categories.map(c => (
                    <div key={c.id} className="flex justify-between items-center text-xs p-1.5 rounded hover:bg-slate-800/20">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(c.id).split(" ")[0]}`} />
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-[9px] text-slate-400 uppercase">({c.type})</span>
                      </div>
                      
                      {!c.isDefault ? (
                        <button
                          onClick={() => onDeleteCategory(c.id)}
                          className="text-rose-400 hover:text-rose-500 p-0.5 rounded"
                          title="Delete Custom Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <FolderLock className="w-3.5 h-3.5 text-slate-500" title="Locked System Category" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Form to create Category */}
                <form onSubmit={handleCreateCategory} className="border-t border-slate-800/20 pt-4 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Create Custom Category</p>
                  
                  <div>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Category Title (e.g. Subscriptions)"
                      className={`w-full px-3 py-2 rounded-lg text-xs border focus:outline-none ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCatType("expense")}
                      className={`py-1 text-[10px] font-bold uppercase rounded border transition ${
                        newCatType === "expense" ? "border-rose-400 text-rose-400" : "border-slate-800"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCatType("income")}
                      className={`py-1 text-[10px] font-bold uppercase rounded border transition ${
                        newCatType === "income" ? "border-emerald-400 text-emerald-400" : "border-slate-800"
                      }`}
                    >
                      Income
                    </button>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Color Accent</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["blue", "rose", "emerald", "teal", "orange", "violet", "pink", "cyan", "indigo", "amber"].map(col => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setNewCatColor(col)}
                          className={`w-4 h-4 rounded-full border border-slate-950 transition ${
                            newCatColor === col ? "ring-2 ring-blue-500 scale-110" : ""
                          }`}
                          style={{
                            backgroundColor: col === "emerald" ? "#10b981" : 
                                             col === "teal" ? "#14b8a6" :
                                             col === "indigo" ? "#6366f1" :
                                             col === "rose" ? "#f43f5e" :
                                             col === "orange" ? "#f97316" :
                                             col === "blue" ? "#3b82f6" :
                                             col === "violet" ? "#8b5cf6" :
                                             col === "pink" ? "#ec4899" :
                                             col === "cyan" ? "#06b6d4" : "#f59e0b"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center justify-center gap-1"
                  >
                    <FolderPlus className="w-3.5 h-3.5" /> Save Category Asset
                  </button>
                </form>

              </div>
            )}
          </div>

        </div>

        {/* Read Section: Filter & Visual Logs Table */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls Hub Card */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center gap-3 justify-between ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"
          }`}>
            
            {/* Search */}
            <div className="relative w-full md:w-48">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search description..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border focus:outline-none ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            </div>

            {/* Type Filter */}
            <div className="flex space-x-1 w-full md:w-auto">
              {["all", "income", "expense"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t as any)}
                  className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition ${
                    filterType === t 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : (isDark ? "border-slate-800 text-slate-400 hover:bg-slate-800/10" : "border-slate-200 text-slate-600 hover:bg-slate-50")
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full md:w-40 px-3 py-1.5 rounded-lg text-xs border focus:outline-none ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-150"}`}
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>

          </div>

          {/* Primary Logs Table */}
          <div className={`border rounded-2xl overflow-hidden ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/20 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-950/[0.02] dark:bg-slate-950/20">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-3">Flow</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/10 text-sm">
                  {displayedTransactions.slice().reverse().map((t) => (
                    <tr key={t.id} className="hover:bg-slate-805/10 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                        {formatTxDateFormatted(t.date)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          t.type === "income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${getCategoryColor(t.categoryId).split(" ")[0]}`} />
                          <span>{getCategoryName(t.categoryId)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-xs">{t.description}</td>
                      <td className={`py-3 px-3 font-mono font-bold text-right ${
                        t.type === "income" ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Do you wish to permanently delete ledger item: "${t.description || "Uncoded flow"}"?`)) {
                              onDeleteTransaction(t.id);
                              displayToast("Ledger record deleted.");
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                          title="Delete Ledger Line"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {displayedTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No financial records found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/[0.01] dark:bg-slate-950/10 border-t border-slate-800/10 flex justify-between text-xs text-slate-500">
              <span>Showing {displayedTransactions.length} records</span>
              <span>Total filtered value: ${displayedTransactions.reduce((acc, current) => acc + current.amount, 0).toLocaleString()}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
