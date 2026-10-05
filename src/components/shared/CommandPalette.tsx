import React, { useState, useEffect, useRef } from 'react';
import { Project, MediaFile, Transfer, ViewMode } from '../../types';
import { 
  Search, 
  FolderKanban, 
  Film, 
  ArrowLeftRight, 
  Zap, 
  UploadCloud, 
  X, 
  Command, 
  ArrowRight,
  ShieldCheck,
  Users
} from 'lucide-react';
import { formatBytes } from '../../lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  mediaFiles: MediaFile[];
  transfers: Transfer[];
  onNavigate: (view: ViewMode) => void;
  onSelectProject: (id: string) => void;
  onSelectAssetForReview: (id: string) => void;
  onOpenUpload: () => void;
  onOpenNewTransfer: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  mediaFiles,
  transfers,
  onNavigate,
  onSelectProject,
  onSelectAssetForReview,
  onOpenUpload,
  onOpenNewTransfer
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled in parent, but can toggle if needed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedProjects = projects.filter(p => 
    p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)
  );

  const matchedAssets = mediaFiles.filter(m => 
    m.name.toLowerCase().includes(q) || (m.codec && m.codec.toLowerCase().includes(q))
  );

  const matchedTransfers = transfers.filter(t => 
    t.title.toLowerCase().includes(q) || t.shareLink.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#111827] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search projects, rushes, transfers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-800 text-slate-400 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions (when query is short or matches) */}
          {(!query || 'upload'.includes(q) || 'transfer'.includes(q) || 'review'.includes(q)) && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Quick Pipeline Commands
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { onOpenUpload(); onClose(); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <UploadCloud className="w-4 h-4 text-blue-400" />
                    <span>Launch Accelerated Ingestion & Upload</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">Action</span>
                </button>

                <button
                  onClick={() => { onOpenNewTransfer(); onClose(); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                    <span>Create New Media Transfer Link</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">Action</span>
                </button>

                <button
                  onClick={() => { onNavigate('review'); onClose(); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Film className="w-4 h-4 text-indigo-400" />
                    <span>Open SMPTE Frame Review Suite</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">Action</span>
                </button>
              </div>
            </div>
          )}

          {/* Matched Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Projects ({matchedProjects.length})
              </div>
              <div className="space-y-1">
                {matchedProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onSelectProject(p.id); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-white truncate">{p.name}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{p.client}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 pl-2">
                      {formatBytes(p.storageUsed, 1)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Media Assets */}
          {matchedAssets.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Media Rushes & Masters ({matchedAssets.length})
              </div>
              <div className="space-y-1">
                {matchedAssets.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { onSelectAssetForReview(a.id); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Film className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold font-mono text-white truncate">{a.name}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{a.codec} · {a.resolution}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 pl-2">
                      {formatBytes(a.size)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Transfers */}
          {matchedTransfers.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Transfers ({matchedTransfers.length})
              </div>
              <div className="space-y-1">
                {matchedTransfers.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { onNavigate('transfers'); onClose(); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/80 text-slate-200 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ArrowLeftRight className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-white truncate">{t.title}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Link: {t.shareLink}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 pl-2">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with ↵ Enter</span>
          <span>MEDIA RQA Studio Index</span>
        </div>
      </div>
    </div>
  );
};
