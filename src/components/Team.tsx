import React, { useState } from "react";
import { Users, UserPlus, ShieldAlert, Sparkles, Trash2, Check, ShieldCheck, Mail } from "lucide-react";
import { User } from "../types";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "administrator" | "editor" | "viewer";
  status: "active" | "pending";
}

interface TeamProps {
  user: User;
  isDark: boolean;
}

export const Team: React.FC<TeamProps> = ({ user, isDark }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "tm1", name: "Sarah Connor", email: "sarah@company-example.com", role: "administrator", status: "active" },
    { id: "tm2", name: "David Miller", email: "david.cpa@accounting-sme.net", role: "editor", status: "active" },
    { id: "tm3", name: "Elena Rostova", email: "elena@audits-board.org", role: "viewer", status: "pending" },
  ]);

  // Form states to invite new staff members
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memberRole, setMemberRole] = useState<"administrator" | "editor" | "viewer">("viewer");
  
  const [toast, setToast] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newInvite: TeamMember = {
      id: "tm" + (teamMembers.length + 1),
      name: name.trim(),
      email: email.trim(),
      role: memberRole,
      status: "pending"
    };

    setTeamMembers([...teamMembers, newInvite]);
    displayToast(`Secured invitation logged! Dispatched permission link email to ${email}.`);
    
    // Clear
    setName("");
    setEmail("");
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm("Disconnect this team administrator/viewer from shared cashbooks? This locks their active keys instantly.")) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
      displayToast("Team access updated.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative text-left">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-blue-600 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-blue-500/20">
          <Mail className="w-4 h-4 text-emerald-300" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Team Collaboration</h1>
        <p className="text-sm text-slate-400 mt-1">Configure co-founder space coordinates, assign ledger roles, and allow CPAs and executives to view reports under full cryptographic safety.</p>
      </div>

      {user.subscription !== "premium" && (
        <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-slate-300 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-500 text-sm">Multi-User Space Requires Upgrade</h4>
              <p className="text-xs text-slate-400 mt-1">
                Inviting team editors and configuring fine-grained permissions are restricted to Premium members. Your account remains linked to a single user workspace.
              </p>
              <div className="mt-4 p-3 bg-slate-900 border border-slate-850 text-xs italic">
                💡 <strong>Trial Tip:</strong> Head back to Authentication or Sign Out, click "Start Free Trial" and register specifying <strong>"Premium Tier Plan"</strong> to unlock multi-user invitations and permissions management!
              </div>
            </div>
          </div>
        </div>
      )}

      {user.subscription === "premium" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Invite board form */}
          <div>
            <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow"}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-1.5 text-blue-500">
                <UserPlus className="w-5 h-5" /> Send Stakeholder Invitation
              </h3>

              <form onSubmit={handleInvite} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-400 mb-1">Stakeholder Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"}`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Corporate Email coordinates</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="partner@sme.com"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200"}`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Access privilege level</label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value as any)}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-600 ${isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-100 border-slate-200"}`}
                  >
                    <option value="viewer">Viewer (Read-only financials)</option>
                    <option value="editor">Editor (Log transactions, download files)</option>
                    <option value="administrator">Platform Co-Administrator (Full rights)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-xs mt-2"
                >
                  Confirm dispatch of Invite Coordinates
                </button>
              </form>
            </div>
          </div>

          {/* Directory lists */}
          <div className="lg:col-span-2">
            
            <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-150 shadow"}`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold">Active Staff &amp; Share Permissions Directory</h3>
                <p className="text-xs text-slate-400">Manage credentials and monitor shared user statuses inside your SME cloud instance.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850/20 text-slate-450 uppercase font-bold tracking-widest bg-slate-950/[0.01]">
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">Email Coordinates</th>
                      <th className="py-2.5 px-3">Role privilege</th>
                      <th className="py-2.5 px-3 text-center">Status state</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/10 text-sm">
                    {teamMembers.map(m => (
                      <tr key={m.id} className="hover:bg-slate-850/10 transition">
                        <td className="py-3 px-3 font-bold flex items-center gap-2">
                          <div className="w-7 h-7 bg-blue-600/10 text-blue-500 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                            {m.name.slice(0, 2)}
                          </div>
                          <span>{m.name}</span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-400 font-mono">{m.email}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500 border border-blue-500/15">
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            m.status === "active" ? "bg-emerald-500/10 text-emerald-500 animate-pulse" : "bg-amber-500/10 text-amber-500"
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition whitespace-nowrap"
                            title="Disconnect team members key"
                          >
                            <Trash2 className="w-4 h-4 inline-block pb-0.5" /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
