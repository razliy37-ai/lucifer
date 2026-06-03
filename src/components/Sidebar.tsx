import React, { useState } from "react";
import { 
  TrendingUp, 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  Brain, 
  ShieldAlert, 
  Bell, 
  Users, 
  Moon, 
  Sun, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Sparkles,
  HeartHandshake
} from "lucide-react";
import { User, PlatformNotification } from "../types";

interface SidebarProps {
  user: User;
  companyName: string;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
  notifications: PlatformNotification[];
  onMarkNotificationsRead: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  companyName,
  activeTab,
  onNavigateTab,
  isDark,
  onToggleTheme,
  onSignOut,
  notifications,
  onMarkNotificationsRead
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    onMarkNotificationsRead();
    setShowNotificationsDropdown(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "transactions", label: "Ledger Entries", icon: Wallet },
    { id: "reports", label: "Financial Reports", icon: FileText },
    { id: "aiassistant", label: "AI Assistant", icon: Brain, isPremium: true },
    { id: "team", label: "Team Space", icon: Users, isPremium: true },
    ...(user.role === "administrator" ? [{ id: "admin", label: "Admin Console", icon: ShieldAlert }] : []),
  ];

  return (
    <div className="font-sans relative">
      {/* Mobile Header Bar */}
      <div className={`md:hidden p-4 border-b flex items-center justify-between ${
        isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
      }`}>
        <div className="flex items-center space-x-2.5">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-black text-blue-600">FinTrack</span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications Mobile Icon */}
          <button 
            onClick={() => {
              onNavigateTab("notifications");
              handleMarkAllRead();
            }} 
            className="relative"
          >
            <Bell className="w-5 h-5 text-slate-400 hover:text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-[9px] text-white font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Sidebar Container (Desktop Sidebar) */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen border-r transition-transform -translate-x-full md:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : ""
      } ${
        isDark ? "bg-slate-950 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-800"
      }`}>
        
        {/* Core shell wrapper */}
        <div className="h-full flex flex-col justify-between py-6 px-4">
          
          <div className="space-y-8">
            {/* Platform Brand */}
            <div className="flex items-center space-x-3 pl-2">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                FinTrack
              </span>
            </div>

            {/* Profile Context */}
            <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/40 border-slate-900" : "bg-slate-100 border-slate-200"}`}>
              <div className="flex items-center space-x-3 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-blue-500">
                  {user.name.slice(0,2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-extrabold truncate text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[10px] text-slate-450 truncate">{user.email}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/10 dark:border-slate-800/50">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Subscription:</span>
                  <span className={user.subscription === "premium" ? "text-amber-500 flex items-center gap-0.5" : "text-slate-500"}>
                    {user.subscription === "premium" && <Sparkles className="w-3 h-3 text-amber-500" />}
                    {user.subscription}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-400">Org Role:</span>
                  <span className="text-blue-500 uppercase">{user.role}</span>
                </div>
              </div>
            </div>

            {/* Navigation Lists */}
            <nav className="space-y-1">
              <p className="text-[10px] font-extrabold uppercase text-slate-500 px-3 tracking-wider mb-2">Primary Space</p>
              
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 scale-102"
                        : (isDark ? "text-slate-400 hover:bg-slate-900 hover:text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.isPremium && user.subscription !== "premium" && (
                      <span className="text-[8px] bg-amber-500/15 text-amber-500 px-1 py-0.5 rounded font-black border border-amber-500/10">PR</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer controls: theme togglers, notification dropdowns, signouts */}
          <div className="space-y-4">
            
            {/* Unread system notification alert hub */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold ${
                  isDark ? "bg-slate-900/60 hover:bg-slate-900 border border-slate-900 text-slate-300" : "bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-500" /> System Alerts
                </span>
                {unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown details */}
              {showNotificationsDropdown && (
                <div className={`absolute bottom-full left-0 w-64 mb-2 rounded-2xl border p-4 text-xs space-y-3 shadow-2xl z-50 ${
                  isDark ? "bg-slate-905 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800/20 font-bold">
                    <span>Recent Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-blue-500 hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {notifications.slice(0, 3).map(n => (
                      <div key={n.id} className="p-2 rounded bg-slate-950/20 space-y-1">
                        <p className="font-extrabold text-[11px] text-slate-200 flex items-center gap-1.5">
                          {n.type === "alert" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                          {n.type === "summary" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          {n.type === "reminder" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          {n.title}
                        </p>
                        <p className="text-[10.5px] text-slate-400 leading-normal">{n.message}</p>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-[10px] text-slate-500 text-center py-4">No notifications.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Light/Dark Toggle & Sign Out */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/20 dark:border-slate-800/50 text-slate-400 text-xs">
              
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl hover:bg-slate-900 hover:text-white transition flex items-center gap-1.5 font-bold"
                title="Toggle system interface background colors"
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" /> <span className="text-[10px]">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-blue-400" /> <span className="text-[10px]">Dark</span>
                  </>
                )}
              </button>

              <button
                onClick={onSignOut}
                className="p-2 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition flex items-center gap-1 font-bold"
                title="End FinTrack secure session"
                id="sidebar-signout"
              >
                <LogOut className="w-4 h-4" /> <span className="text-[10px]">Sign Out</span>
              </button>
            </div>

          </div>

        </div>
      </aside>

      {/* Screen blur overlay for active mobile drawers */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}
    </div>
  );
};
