import React, { useState } from 'react';
import { Transfer, MediaFile, ViewMode } from '../../../types';
import { 
  ArrowLeftRight, 
  Download, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  FileVideo, 
  Clock, 
  Zap, 
  ArrowLeft, 
  Activity, 
  Copy, 
  Check, 
  Film 
} from 'lucide-react';
import { formatBytes, formatSpeed, formatRelativeTime } from '../../../lib/utils';

interface PublicTransferDownloadViewProps {
  transfer: Transfer;
  assets: MediaFile[];
  onBackToWorkspace: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const PublicTransferDownloadView: React.FC<PublicTransferDownloadViewProps> = ({
  transfer,
  assets,
  onBackToWorkspace,
  onNavigate
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!transfer.password);
  const [passwordError, setPasswordError] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === transfer.password || transfer.password === undefined) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleStartDownload = () => {
    setDownloadProgress(0);
    setDownloadSpeed(440000000); // 440 MB/s

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDownloadProgress(progress);
      setDownloadSpeed(420000000 + Math.floor(Math.random() * 50000000));

      if (progress >= 100) {
        clearInterval(interval);
        setDownloadSpeed(0);
        setIsDownloaded(true);

        // Trigger dummy file download
        const blob = new Blob([`MEDIA RQA High-Speed Transfer Package\nTransfer: ${transfer.title}\nID: ${transfer.id}\nFiles:\n` + assets.map(a => `${a.name} (${a.codec})`).join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${transfer.shareLink}_manifest.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-slate-800 bg-[#0d121c]/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Film className="w-4 h-4" />
          </div>
          <span className="font-bold text-white tracking-tight font-display text-lg">
            MEDIA<span className="text-blue-500 ml-1">RQA</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500 ml-2 hidden sm:inline">
            Secure Delivery Portal
          </span>
        </div>

        <button
          onClick={onBackToWorkspace}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>RQA ACCELERATED MEDIA PACKAGE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              {transfer.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-2">
              <span>Dispatched by <strong className="text-slate-200">{transfer.senderEmail}</strong></span>
              <span>·</span>
              <span>{assets.length} file(s)</span>
              <span>·</span>
              <span className="text-blue-400 font-bold">{formatBytes(transfer.totalSize)}</span>
              <span>·</span>
              <span>Expires {formatRelativeTime(transfer.expiresAt)}</span>
            </div>

            {transfer.message && (
              <div className="mt-4 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-400 block mb-0.5">Sender Note:</span>
                {transfer.message}
              </div>
            )}
          </div>

          {/* Password Protection Gate */}
          {!isUnlocked ? (
            <div className="py-10 max-w-sm mx-auto text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">This transfer is PIN-protected</h3>
              <p className="text-xs text-slate-400">
                Please enter the passcode provided by the production supervisor to access high-res files.
              </p>

              <form onSubmit={handleUnlock} className="space-y-3">
                <input
                  type="password"
                  placeholder="Enter passcode"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-center text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono tracking-widest text-lg"
                />
                {passwordError && (
                  <p className="text-xs text-rose-400">Incorrect passcode. Try again.</p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
                >
                  Unlock Transfer Package
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked View: Files list and Download Streamer */
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Enclosed Media Files ({assets.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {assets.map(file => (
                    <div
                      key={file.id}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileVideo className="w-5 h-5 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white truncate font-mono">{file.name}</h4>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                            <span>{file.codec || 'Apple ProRes 4444'}</span>
                            <span>·</span>
                            <span>{file.resolution || '4K UHD'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-slate-300 font-semibold shrink-0 pl-3">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Streamer Interface */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-950 border border-blue-500/30 space-y-4">
                {downloadProgress === null ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-400" />
                        Accelerated UDP Wire Protocol
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Parallel stream downloads saturating available local fiber bandwidth.
                      </p>
                    </div>

                    <button
                      onClick={handleStartDownload}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download All Files ({formatBytes(transfer.totalSize)})</span>
                    </button>
                  </div>
                ) : isDownloaded ? (
                  <div className="text-center py-4 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Transfer Download Complete</h4>
                    <p className="text-xs text-slate-400">
                      All media segments assembled and verified via SHA-256 integrity hash.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-blue-400 font-bold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        {formatSpeed(downloadSpeed)} Peak Velocity
                      </span>
                      <span className="text-white font-bold">{downloadProgress}%</span>
                    </div>

                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 h-full rounded-full transition-all duration-150"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        MEDIA RQA Engine · End-to-End Encrypted Transfer Protocol
      </footer>
    </div>
  );
};
