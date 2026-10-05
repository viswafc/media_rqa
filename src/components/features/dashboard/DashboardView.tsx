import React, { useState } from 'react';
import { 
  Project, 
  Transfer, 
  MediaFile, 
  ViewMode 
} from '../../../types';
import { 
  Zap, 
  ArrowUpRight, 
  UploadCloud, 
  ArrowLeftRight, 
  FolderKanban, 
  Film, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Activity, 
  Radio, 
  FileVideo, 
  Eye, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  Globe2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatBytes, formatSpeed, formatRelativeTime } from '../../../lib/utils';

interface DashboardViewProps {
  projects: Project[];
  transfers: Transfer[];
  mediaFiles: MediaFile[];
  storageUsed: number;
  storageLimit: number;
  onNavigate: (view: ViewMode) => void;
  onSelectProject: (projectId: string) => void;
  onSelectAssetForReview: (assetId: string) => void;
  onOpenUpload: () => void;
  onOpenNewTransfer: () => void;
  onOpenNewProject: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  transfers,
  mediaFiles,
  storageUsed,
  storageLimit,
  onNavigate,
  onSelectProject,
  onSelectAssetForReview,
  onOpenUpload,
  onOpenNewTransfer,
  onOpenNewProject
}) => {
  const [selectedEdgeNode, setSelectedEdgeNode] = useState('FRA-01');
  const activeTransfers = transfers.filter(t => t.status === 'IN_PROGRESS');
  const storagePercentage = ((storageUsed / storageLimit) * 100).toFixed(1);
  const currentTotalBandwidth = activeTransfers.reduce((acc, t) => acc + (t.speed || 0), 0);

  const edgeNodes = [
    { id: 'FRA-01', location: 'Frankfurt Central', ping: '12ms', status: 'Optimal', load: '38%' },
    { id: 'LHR-02', location: 'London Docklands', ping: '18ms', status: 'Optimal', load: '44%' },
    { id: 'LAX-04', location: 'Los Angeles Studio SAN', ping: '84ms', status: 'Accelerated', load: '62%' },
    { id: 'HND-01', location: 'Tokyo Bay Edge', ping: '110ms', status: 'Accelerated', load: '29%' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Production Command Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              UDP Multi-Thread Accelerator Online
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Studio NVMe cache active with 4 global relay edge nodes routing uncompressed camera payloads.
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Accelerated Upload</span>
          </button>

          <button
            onClick={onOpenNewTransfer}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span>New Transfer Link</span>
          </button>

          <button
            onClick={onOpenNewProject}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Transfer Streams */}
        <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between hover:border-blue-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Active Transfers</span>
            <ArrowLeftRight className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {activeTransfers.length} <span className="text-xs font-normal text-slate-400">Active / {transfers.length} Total</span>
            </div>
            <div className="text-xs text-cyan-400 font-mono mt-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{formatSpeed(currentTotalBandwidth || 345000000)} aggregate throughput</span>
            </div>
          </div>
        </div>

        {/* High-Speed Storage Cache */}
        <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>NVMe Flash Cache</span>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {formatBytes(storageUsed, 2)}
            </div>
            <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full" 
                style={{ width: `${Math.min(100, Number(storagePercentage))}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1.5 flex justify-between">
              <span>{storagePercentage}% of {formatBytes(storageLimit, 0)} Tier</span>
              <span>{formatBytes(storageLimit - storageUsed, 1)} free</span>
            </div>
          </div>
        </div>

        {/* Total Production Assets */}
        <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Media Assets Cataloged</span>
            <Film className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              {mediaFiles.length} <span className="text-xs font-normal text-slate-400">Master Rushes</span>
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>ProRes 4444 XQ & RED RAW</span>
            </div>
          </div>
        </div>

        {/* Global Edge Node Latency */}
        <div className="p-5 rounded-2xl glass-panel flex flex-col justify-between hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Relay Edge Nodes</span>
            <Globe2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
              4 / 4 <span className="text-xs font-normal text-slate-400">Online</span>
            </div>
            <div className="text-xs text-amber-400 font-mono mt-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Avg Latency: 14ms (Lossless)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Live Transfers Stream & Global Edge Node HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Transfer Telemetry Card (2 columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                Live Accelerated Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time UDP multi-socket chunk streams with zero packet loss.
              </p>
            </div>
            <button
              onClick={() => onNavigate('transfers')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <span>View All Transfers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {activeTransfers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No transfers currently in flight. Start a new accelerated transfer to stream packages.
              </div>
            ) : (
              activeTransfers.map(transfer => (
                <div 
                  key={transfer.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-white text-sm truncate max-w-xs sm:max-w-md">
                          {transfer.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-cyan-300 border border-blue-800/60 font-semibold">
                          {transfer.shareLink}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono">
                        <span>{formatBytes(transfer.transferredSize)} / {formatBytes(transfer.totalSize)}</span>
                        <span>·</span>
                        <span className="text-cyan-400 font-bold">{formatSpeed(transfer.speed)}</span>
                        <span>·</span>
                        <span>ETA: ~42s</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-mono text-white tabular-nums">
                        {transfer.progress.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${transfer.progress}%` }}
                    />
                  </div>

                  {/* Chunk Stream visualizer matrix */}
                  <div className="flex items-center gap-1 pt-1">
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const filled = idx < Math.floor((transfer.progress / 100) * 20);
                      return (
                        <div
                          key={idx}
                          className={`flex-1 h-1.5 rounded-xs transition-colors ${
                            filled 
                              ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' 
                              : 'bg-slate-800/60'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Edge Relay Status HUD (1 column) */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Globe2 className="w-4 h-4 text-blue-400" />
              Global Relay Edge Nodes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-region edge relays for high-speed delivery.
            </p>

            <div className="mt-4 space-y-2.5">
              {edgeNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedEdgeNode(node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    selectedEdgeNode === node.id
                      ? 'bg-blue-950/40 border-blue-500/80 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{node.location}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Node ID: {node.id}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-cyan-400 font-bold">{node.ping}</span>
                    <span className="text-[10px] text-slate-500 block">Load: {node.load}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Protocol: RQA-FASP UDP</span>
            <span className="text-emerald-400 font-semibold">Loss: 0.00%</span>
          </div>
        </div>
      </div>

      {/* Production Projects Shelf */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Active Production Projects</h2>
            <p className="text-xs text-slate-400">Explore rushes, camera turn-overs, and sound folders.</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map(proj => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className="group p-5 rounded-2xl glass-panel hover:border-blue-500/60 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-blue-500/10"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1.5" 
                style={{ backgroundColor: proj.color || '#3b82f6' }}
              />

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="truncate font-medium text-slate-300">{proj.client}</span>
                  <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                  {proj.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{proj.assetCount} assets · {formatBytes(proj.storageUsed, 1)}</span>
                <span className="text-[11px] text-slate-500">{formatRelativeTime(proj.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Media Assets Ready for Frame Review */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Featured Assets for Frame Review</h2>
            <p className="text-xs text-slate-400">Open directly into the SMPTE timecode player to annotate revision notes.</p>
          </div>
          <button
            onClick={() => onNavigate('review')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Review Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaFiles.map(asset => (
            <div
              key={asset.id}
              onClick={() => {
                onSelectAssetForReview(asset.id);
                onNavigate('review');
              }}
              className="group p-4 rounded-2xl glass-panel hover:border-indigo-500/60 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:border-indigo-500/50 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                  <FileVideo className="w-9 h-9 text-indigo-400 relative z-20 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span>{asset.resolution || '4K DCI'}</span>
                    <span>{asset.fps ? `${asset.fps} FPS` : '24 FPS'}</span>
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors mt-3 truncate">
                  {asset.name}
                </h3>
                <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                  {asset.codec}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{formatBytes(asset.size)}</span>
                <span className="text-indigo-400 flex items-center gap-1 text-[11px] font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review QA</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
