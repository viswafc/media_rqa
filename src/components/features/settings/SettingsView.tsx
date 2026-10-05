import React, { useState } from 'react';
import { UserProfile, ViewMode } from '../../../types';
import { 
  Settings, 
  User, 
  Zap, 
  Bell, 
  HardDrive, 
  ShieldCheck, 
  Save, 
  Check, 
  Sliders, 
  Radio, 
  Key,
  Globe2
} from 'lucide-react';
import { formatBytes } from '../../../lib/utils';

interface SettingsViewProps {
  user: UserProfile;
  storageUsed: number;
  storageLimit: number;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onNavigate: (view: ViewMode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  storageUsed,
  storageLimit,
  onUpdateUser,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'acceleration' | 'notifications' | 'storage'>('acceleration');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [name, setName] = useState(user.name);
  const [teamName, setTeamName] = useState(user.teamName);
  const [defaultFps, setDefaultFps] = useState('24.00');
  const [chunkSizeMB, setChunkSizeMB] = useState('10');
  const [parallelSockets, setParallelSockets] = useState('4');
  const [enableUdp, setEnableUdp] = useState(true);
  const [notifyOnComplete, setNotifyOnComplete] = useState(true);
  const [notifyOnComment, setNotifyOnComment] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, teamName });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800/80">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
          Workspace & Pipeline Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Configure UDP transport protocols, default frame rates, storage quotas, and client review preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('acceleration')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'acceleration' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Transfer Acceleration</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'profile' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'storage' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Storage & Tiers</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 text-xs">
        {activeTab === 'acceleration' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                RQA Hardware-Accelerated Protocol Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimizes wire throughput across high-latency cross-continental links (e.g., London to Los Angeles).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <label className="font-semibold text-slate-200 block">Chunk Block Partition Size</label>
                <select
                  value={chunkSizeMB}
                  onChange={(e) => setChunkSizeMB(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="5">5 MB (Standard DSL / 4G)</option>
                  <option value="10">10 MB (Recommended for Fiber)</option>
                  <option value="25">25 MB (High Speed 10Gbps Studio SAN)</option>
                  <option value="50">50 MB (Maximum Chunk Aggregation)</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Larger chunks reduce HTTP overhead on fast gigabit lines.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <label className="font-semibold text-slate-200 block">Concurrent Socket Threads</label>
                <select
                  value={parallelSockets}
                  onChange={(e) => setParallelSockets(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="2">2 Concurrent Sockets</option>
                  <option value="4">4 Sockets (Balanced)</option>
                  <option value="8">8 Sockets (High Performance)</option>
                  <option value="16">16 Sockets (Maximum Saturation)</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Enables parallel multiplexing across available NIC cards.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block">Enable UDP Multi-Route Acceleration</span>
                <span className="text-[11px] text-slate-400">
                  Bypasses TCP congestion window throttling with custom selective ACK packet retransmission.
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableUdp}
                onChange={(e) => setEnableUdp(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Profile & Studio Identity</h3>
              <p className="text-xs text-slate-400 mt-1">Configure your personal information and studio team branding.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1.5">Production Studio / House</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">Default Timecode Standard</label>
              <select
                value={defaultFps}
                onChange={(e) => setDefaultFps(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="23.98">23.976 FPS (Cinema Standard NTSC)</option>
                <option value="24.00">24.000 FPS (Film Master Standard)</option>
                <option value="29.97">29.970 FPS (Broadcast Drop-Frame)</option>
                <option value="59.94">59.940 FPS (High-Frame-Rate Live)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                Storage & Plan Management
              </h3>
              <p className="text-xs text-slate-400 mt-1">High-speed NVMe flash caching layer for active transfers.</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-sm">Studio Enterprise Tier</span>
                  <span className="text-xs text-slate-400 block mt-0.5">10 TB High-Speed Bandwidth Allocation</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(storageUsed / storageLimit) * 100}%` }}
                />
              </div>

              <div className="flex justify-between font-mono text-[11px] text-slate-400">
                <span>Used: {formatBytes(storageUsed, 2)}</span>
                <span>Limit: {formatBytes(storageLimit, 0)}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Event Notifications</h3>
              <p className="text-xs text-slate-400 mt-1">Choose which pipeline events alert your team.</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Transfer Completion Alerts</span>
                  <span className="text-[11px] text-slate-400">Receive in-app & email notification when clients finish downloading packages.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnComplete}
                  onChange={(e) => setNotifyOnComplete(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Frame Review & Comment Mentions</span>
                  <span className="text-[11px] text-slate-400">Notify immediately when supervisors or clients leave revision notes on video frames.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnComment}
                  onChange={(e) => setNotifyOnComment(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit button with toast feedback */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Protocol: RQA-v4.2-Accelerated
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4" />
                Settings Saved Successfully
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
