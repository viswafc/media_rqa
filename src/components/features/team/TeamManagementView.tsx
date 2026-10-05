import React, { useState } from 'react';
import { TeamMember, ViewMode } from '../../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  HardDrive, 
  Check, 
  X,
  Search
} from 'lucide-react';
import { formatRelativeTime } from '../../../lib/utils';

interface TeamManagementViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({ onNavigate }) => {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'usr-01',
      name: 'Elena Rostova',
      email: 'elena.rostova@posthouse.com',
      role: 'COLORIST',
      status: 'ACTIVE',
      joinedAt: '2026-08-01T10:00:00Z',
      avatar: 'ER',
      storageQuota: '2.5 TB'
    },
    {
      id: 'usr-02',
      name: 'Marcus Vance',
      email: 'marcus.vance@studio.com',
      role: 'EDITOR',
      status: 'ACTIVE',
      joinedAt: '2026-08-15T12:00:00Z',
      avatar: 'MV',
      storageQuota: '3.0 TB'
    },
    {
      id: 'usr-03',
      name: 'Kai Sorensen',
      email: 'kai.sorensen@soundworks.io',
      role: 'OWNER',
      status: 'ACTIVE',
      joinedAt: '2026-07-10T09:00:00Z',
      avatar: 'KS',
      storageQuota: 'Unlimited'
    },
    {
      id: 'usr-04',
      name: 'Sara Lindqvist',
      email: 'sara.producer@netflix.com',
      role: 'CLIENT_REVIEWER',
      status: 'ACTIVE',
      joinedAt: '2026-09-01T15:00:00Z',
      avatar: 'SL',
      storageQuota: '500 GB'
    }
  ]);

  const [search, setSearch] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('EDITOR');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'INVITED',
      joinedAt: new Date().toISOString(),
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
      storageQuota: '1.0 TB'
    };

    setMembers([newMember, ...members]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Team & Access Control (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage production suite collaborators, colorists, editors, and external client reviewer seats.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Collaborator</span>
        </button>
      </div>

      {/* Search and Member Count */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span>{members.length} Total Members (4 Active · 1 Invited)</span>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Member</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role Permission</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Storage Allocation</th>
              <th className="py-3.5 px-4 text-right">Joined</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredMembers.map(member => (
              <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {member.avatar}
                  </div>
                  <span className="font-semibold text-white">{member.name}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400">{member.email}</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800">
                    {member.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                    member.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      member.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`} />
                    {member.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300">{member.storageQuota}</td>
                <td className="py-3.5 px-4 text-right font-mono text-slate-500">{formatRelativeTime(member.joinedAt)}</td>
                <td className="py-3.5 px-4 text-right">
                  {member.role !== 'OWNER' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 hover:text-rose-400 text-slate-500 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-200 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="editor@postproduction.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1.5">Role Preset</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="ADMIN">Studio Admin (Full control)</option>
                  <option value="COLORIST">Supervising Colorist (Review & Grade notes)</option>
                  <option value="EDITOR">Lead Editor (Uploads & Transfers)</option>
                  <option value="VFX_ARTIST">VFX Artist (Turnover upload)</option>
                  <option value="CLIENT_REVIEWER">Client Reviewer (Review only, no upload)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
