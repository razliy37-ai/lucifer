import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { User, Transaction, Category } from "../types";

interface ReportsProps {
  user: User;
  companyName: string;
  transactions: Transaction[];
  categories: Category[];
  isDark: boolean;
}

export const Reports: React.FC<ReportsProps> = ({ user, companyName, transactions, categories, isDark }) => {
  const [reportMonth, setReportMonth] = useState("2026-06");
  
  // Computes
  const filteredTxs = transactions.filter(t => t.date.startsWith(reportMonth));
  
  const revenueTxs = filteredTxs.filter(t => t.type === "income");
  const expenseTxs = filteredTxs.filter(t => t.type === "expense");

  const totalRevenue = revenueTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTxs.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const marginPercentage = totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";

  // Category breakdown calculation
  const categorySummary = categories.map(cat => {
    const sum = filteredTxs
      .filter(t => t.categoryId === cat.id)
      .reduce((s, t) => s + t.amount, 0);
    return {
      ...cat,
      totalAmount: sum
    };
  }).filter(item => item.totalAmount > 0);

  // Group by type for category P&L
  const incomeCategorySums = categorySummary.filter(c => c.type === "income");
  const expenseCategorySums = categorySummary.filter(c => c.type === "expense");

  // Mock past month metrics (May 2026) for growth percentage comparisons
  const pastMonthRev = 15700;
  const pastMonthExp = 10180;
  const pastMonthProfit = pastMonthRev - pastMonthExp;

  const revenueMoM = pastMonthRev ? (((totalRevenue - pastMonthRev) / pastMonthRev) * 100).toFixed(1) : "0";
  const expenseMoM = pastMonthExp ? (((totalExpenses - pastMonthExp) / pastMonthExp) * 100).toFixed(1) : "0";
  const profitMoM = pastMonthProfit ? (((netProfit - pastMonthProfit) / pastMonthProfit) * 100).toFixed(1) : "0";

  const getCategoryColorClass = (color: string) => {
    const colors: Record<string, string> = {
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
    return colors[color] || "bg-blue-500";
  };

  // CSV Exporter
  const handleExportCSV = () => {
    // Generate actual valid CSV structure
    const headers = ["ID", "Date", "Type", "Category", "Amount ($)", "Description"];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      categories.find(c => c.id === t.categoryId)?.name || "Miscellaneous",
      t.amount,
      `"${t.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    // Explicit file naming
    link.setAttribute("download", `FinTrack_Ledger_Export_${reportMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel (Tab Separated CSV style) Exporter
  const handleExportExcel = () => {
    // Generates an XLS compatible file (uses Tab separation as per production targets)
    const headers = ["Transaction ID", "Booking Date", "Accounting Type", "Category Asset", "Outlay Value ($ USD)", "Description Notes"];
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      categories.find(c => c.id === t.categoryId)?.name || "Miscellaneous",
      t.amount,
      t.description
    ]);

    const excelContent = "data:text/plain;charset=utf-8,"
      + [headers.join("\t"), ...rows.map(e => e.join("\t"))].join("\n");
    
    const encodedUri = encodeURI(excelContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FinTrack_Financial_Excel_${reportMonth}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF / High-quality printable view triggering window.print()
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in print:bg-white print:text-black">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Financial Reporting Room</h1>
          <p className="text-sm text-slate-400 mt-1">Generate SME compliant Profit &amp; Loss ledgers, view cash flow forecasts, and download regulatory audits.</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={reportMonth}
            onChange={(e) => setReportMonth(e.target.value)}
            className={`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 text-slate-900"}`}
          >
            <option value="2026-06">June 2026 (Current)</option>
            <option value="2026-05">May 2026 (Past)</option>
          </select>

          {/* Excel Export Button */}
          <button
            onClick={handleExportExcel}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Download formatted XLS spreadsheet document"
          >
            <Download className="w-4 h-4 text-emerald-500" /> Export Excel
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Download CSV database layout files"
          >
            <Download className="w-4 h-4 text-blue-500" /> Export CSV
          </button>

          {/* PDF/Print Button */}
          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
            title="Configure print alignment & saving PDF files"
          >
            <Printer className="w-4 h-4" /> Print PDF Report
          </button>
        </div>
      </div>

      {/* MoM Performance Trends Comparer: Hidden in Print */}
      {reportMonth === "2026-06" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
          
          <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Revenue Growth MoM</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold font-mono">${totalRevenue.toLocaleString()}</h3>
              <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${parseFloat(revenueMoM) >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                {parseFloat(revenueMoM) >= 0 ? "+" : ""}{revenueMoM}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Compared to $15,700 registered in May</p>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Outflows Growth MoM</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold font-mono">${totalExpenses.toLocaleString()}</h3>
              <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${parseFloat(expenseMoM) <= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                {parseFloat(expenseMoM) >= 0 ? "+" : ""}{expenseMoM}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Compared to $10,180 registered in May</p>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net SME Margin MoM</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-extrabold font-mono">${netProfit.toLocaleString()}</h3>
              <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${parseFloat(profitMoM) >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
                {parseFloat(profitMoM) >= 0 ? "+" : ""}{profitMoM}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Compared to $5,520 registered in May</p>
          </div>

        </div>
      )}

      {/* Main Print Layout Shell (Formatted beautifully for window/printer PDF renders) */}
      <div className={`p-8 sm:p-12 border rounded-3xl space-y-8 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 text-slate-900"} print:border-none print:p-0`}>
        
        {/* Printable Invoice-style Header */}
        <div className="flex justify-between items-start border-b border-slate-800/25 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">{companyName}</h2>
            <p className="text-xs text-slate-400">FinTrack SME Auto-Report Engine Generation</p>
            <p className="text-[10px] text-slate-550 font-mono">Timestamp: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold uppercase py-1 px-3.5 bg-blue-600/10 text-blue-500 rounded-full">
              {reportMonth === "2026-06" ? "June 2026 Audit" : "May 2026 Audit"}
            </span>
            <p className="text-xs text-slate-500 mt-2">Jurisdiction: Standard SME Accountancy</p>
          </div>
        </div>

        {/* 1. Profit & Loss Statement (P&L) Section */}
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 pl-3">
            <h3 className="text-base font-extrabold uppercase tracking-widest">1. Profit &amp; Loss Statement (P&amp;L)</h3>
            <p className="text-xs text-slate-400">Statement of revenues, expenses, and net calculated earnings</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850/40 font-bold text-slate-400 bg-slate-950/[0.02] dark:bg-slate-950/20">
                  <th className="py-2.5 px-3">Classification Category</th>
                  <th className="py-2.5 px-3">Transaction Flow Type</th>
                  <th className="py-2.5 px-3 text-right">Amount Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/10 text-sm">
                
                {/* 1.1 Income Categories */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-blue-500" colSpan={3}>
                    1.1 Operating Inflow Revenues
                  </td>
                </tr>
                {incomeCategorySums.map(c => (
                  <tr key={c.id}>
                    <td className="py-2 px-6 text-xs">{c.name}</td>
                    <td className="py-2 px-3 text-xs text-slate-400">Income</td>
                    <td className="py-2 px-3 text-xs text-right font-mono font-bold">${c.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                
                <tr className="bg-slate-950/[0.01] dark:bg-slate-950/5">
                  <td className="py-2.5 px-3 font-extrabold" colSpan={2}>Total Operating Revenue</td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-500">${totalRevenue.toLocaleString()}</td>
                </tr>

                {/* 1.2 Expenses Categories */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-rose-500 pt-6" colSpan={3}>
                    1.2 Operating Outflow Expenses
                  </td>
                </tr>
                {expenseCategorySums.map(c => (
                  <tr key={c.id}>
                    <td className="py-2 px-6 text-xs">{c.name}</td>
                    <td className="py-2 px-3 text-xs text-slate-400 font-mono">Expense</td>
                    <td className="py-2 px-3 text-xs text-right font-mono font-bold text-rose-400">${c.totalAmount.toLocaleString()}</td>
                  </tr>
                ))}
                
                <tr className="bg-slate-950/[0.01] dark:bg-slate-950/5">
                  <td className="py-2.5 px-3 font-extrabold" colSpan={2}>Total Operating Expenses</td>
                  <td className="py-2.5 px-3 text-right font-mono font-extrabold text-rose-500">${totalExpenses.toLocaleString()}</td>
                </tr>

                {/* Summary Profit */}
                <tr className="bg-blue-600/10 border-t-2 border-slate-800">
                  <td className="py-3.5 px-3 text-sm font-black uppercase" colSpan={2}>Net Operating Profit</td>
                  <td className="py-3.5 px-3 text-sm text-right font-mono font-black text-blue-500">${netProfit.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Cash Flow Forecast & Balance Statement */}
        <div className="space-y-4 pt-4">
          <div className="border-l-4 border-emerald-500 pl-3">
            <h3 className="text-base font-extrabold uppercase tracking-widest">2. Statement of Cash Flows</h3>
            <p className="text-xs text-slate-400">Analysis of corporate liquids, cash intake, and closing balance sheets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Total Liquidity Intake (Inflow)</p>
              <h4 className="text-xl font-extrabold text-emerald-500">${totalRevenue.toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 mt-1">Cash received from sales &amp; retainers</p>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Total Fiscal Outflow</p>
              <h4 className="text-xl font-extrabold text-rose-500">${totalExpenses.toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 mt-1">Cash dispatched for salaries &amp; rent</p>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
              <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Ending Period Liquid Balance</p>
              <h4 className="text-xl font-extrabold text-blue-550">${(15000 + netProfit).toLocaleString()}</h4>
              <p className="text-[10px] text-slate-500 mt-1">Includes initial bank capital runway</p>
            </div>
          </div>
        </div>

        {/* 3. Category Spending Interactive Chart Structure */}
        <div className="space-y-4 pt-4 print:hidden">
          <div className="border-l-4 border-violet-500 pl-3">
            <h3 className="text-base font-extrabold uppercase tracking-widest">3. Category Expense Share Breakdown</h3>
            <p className="text-xs text-slate-400">Distribution analysis of outflow charges by department</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Visual SVG donut breakdown scale */}
            <div className="h-44 flex items-center justify-center p-3 relative bg-slate-950/10 dark:bg-slate-950/30 rounded-2xl border border-slate-800/10">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">June Expense outlays</span>
                <h4 className="text-2xl font-black font-mono">${totalExpenses.toLocaleString()}</h4>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest">Categorized across {expenseCategorySums.length} divisions</p>
              </div>
            </div>

            {/* Structured Table */}
            <div className="space-y-2">
              {expenseCategorySums.map(item => {
                const percentage = totalExpenses ? ((item.totalAmount / totalExpenses) * 100).toFixed(1) : "0";
                return (
                  <div key={item.id} className="text-xs space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${getCategoryColorClass(item.color)}`} />
                        {item.name}
                      </span>
                      <span className="font-mono text-slate-400">${item.totalAmount.toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800/20 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getCategoryColorClass(item.color)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {expenseCategorySums.length === 0 && (
                <p className="text-xs text-slate-550 text-center py-4">No logged expenses on this period.</p>
              )}
            </div>
          </div>
        </div>

        {/* Report validation seal footer */}
        <div className="pt-8 border-t border-slate-800/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Compiled &amp; locked digitally via <strong>FinTrack Automated Engine v1.1</strong></span>
          </div>
          <span>Report ID: SFT-{reportMonth}-MT-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>

      </div>

    </div>
  );
};
