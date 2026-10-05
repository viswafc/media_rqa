import React, { useState } from 'react';
import { Transfer, MediaFile, Project, ViewMode } from '../../../types';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  Link as LinkIcon, 
  Clock, 
  Download, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Users, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity 
} from 'lucide-react';
import { formatBytes, formatSpeed, formatRelativeTime } from '../../../lib/utils';

interface TransfersViewProps {
  transfers: Transfer[];
  mediaFiles: MediaFile[];
  projects: Project[];
  onOpenNewTransfer: () => void;
  onOpenPublicShare: (shareLink: string) => void;
  onCancelTransfer: (transferId: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  transfers,
  mediaFiles,
  projects,
  onOpenNewTransfer,
  onOpenPublicShare,
  onCancelTransfer,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTransfers = transfers.filter(t => {
    const matchesTab = activeTab === 'ALL' || t.status === activeTab;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.shareLink.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.recipients.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleCopyLink = (shareLink: string, id: string) => {
    const fullUrl = `${window.location.origin}/#share/${shareLink}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>ENCRYPTED UDP MEDIA DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Transfers & Distribution
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Deliver multi-gigabyte camera packages, color passes, and sound masters with tokenized expiry links.
          </p>
        </div>

        <button
          onClick={onOpenNewTransfer}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Transfer Link</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transfers by title, link, or recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Tab Controls (Functional buttons with active states) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
          {(['ALL', 'IN_PROGRESS', 'COMPLETED', 'EXPIRED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transfers List */}
      {filteredTransfers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <ArrowLeftRight className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No transfers matching criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create an accelerated transfer package to distribute deliverables securely to clients.
          </p>
          <button
            onClick={onOpenNewTransfer}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
          >
            Create Transfer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransfers.map(transfer => {
            const project = projects.find(p => p.id === transfer.projectId);
            const isCopied = copiedId === transfer.id;

            return (
              <div
                key={transfer.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
              >
                {/* Top Row: Title, Link & Status */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-white">
                        {transfer.title}
                      </h3>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                        transfer.status === 'IN_PROGRESS'
                          ? 'bg-blue-900/40 text-blue-300 border-blue-700/50'
                          : transfer.status === 'COMPLETED'
                          ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {transfer.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                      {project && <span className="text-slate-300">{project.name}</span>}
                      <span>·</span>
                      <span>{transfer.fileIds.length} asset(s)</span>
                      <span>·</span>
                      <span>{formatBytes(transfer.totalSize)}</span>
                      <span>·</span>
                      <span>Expires {formatRelativeTime(transfer.expiresAt)}</span>
                    </div>
                  </div>

                  {/* Actions (Copy link, Preview public page) */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    <button
                      onClick={() => handleCopyLink(transfer.shareLink, transfer.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isCopied 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Link Copied' : 'Copy Share Link'}</span>
                    </button>

                    <button
                      onClick={() => onOpenPublicShare(transfer.shareLink)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 transition-colors cursor-pointer"
                      title="Open Public Download Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Recipient Portal</span>
                    </button>

                    <button
                      onClick={() => onCancelTransfer(transfer.id)}
                      className="p-2 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Transfer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* In-Progress Progress Bar & Velocity */}
                {transfer.status === 'IN_PROGRESS' && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-400 font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        {formatSpeed(transfer.speed)} Throughput
                      </span>
                      <span className="text-white font-bold">{transfer.progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${transfer.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Footer details: Recipients, Security, Download Counter */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">Recipients:</span>
                    {transfer.recipients.length === 0 ? (
                      <span className="text-slate-500">Public Link Only</span>
                    ) : (
                      transfer.recipients.map((r, i) => (
                        <span key={i} className="font-mono text-slate-300 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {r}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    {transfer.password && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Lock className="w-3 h-3" />
                        PIN Protected
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-300">
                      <Download className="w-3 h-3 text-slate-500" />
                      {transfer.downloadCount} / {transfer.maxDownloads} downloads
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
