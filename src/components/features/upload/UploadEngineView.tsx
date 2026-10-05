import React, { useState, useEffect, useRef } from 'react';
import { Project, UploadQueueItem, ViewMode } from '../../../types';
import { 
  UploadCloud, 
  FileVideo, 
  CheckCircle2, 
  Pause, 
  Play, 
  X, 
  ShieldCheck, 
  Zap, 
  HardDrive, 
  Clock, 
  ArrowLeftRight, 
  Sparkles, 
  Layers, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { formatBytes, formatSpeed, generateTransferChecksum } from '../../../lib/utils';

interface UploadEngineViewProps {
  projects: Project[];
  preselectedProjectId?: string;
  preselectedFolder?: string;
  onUploadCompleted: (assetData: {
    name: string;
    size: number;
    mimeType: string;
    projectId: string;
    folderPath: string;
    checksum: string;
  }) => void;
  onNavigate: (view: ViewMode) => void;
}

export const UploadEngineView: React.FC<UploadEngineViewProps> = ({
  projects,
  preselectedProjectId,
  preselectedFolder,
  onUploadCompleted,
  onNavigate
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(preselectedProjectId || projects[0]?.id || 'proj-01');
  const [selectedFolder, setSelectedFolder] = useState<string>(preselectedFolder || 'Dailies');
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [autoGenerateTransfer, setAutoGenerateTransfer] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Simulated chunk upload streamer
  useEffect(() => {
    const timer = setInterval(() => {
      setQueue(prevQueue => {
        let hasChanges = false;
        const updated = prevQueue.map(item => {
          if (item.status === 'UPLOADING') {
            hasChanges = true;
            const newChunks = item.chunksUploaded + 1;
            const progress = Math.min(100, Math.round((newChunks / item.totalChunks) * 100));
            const isFinished = newChunks >= item.totalChunks;

            if (isFinished) {
              // Trigger upload completed handler
              onUploadCompleted({
                name: item.name,
                size: item.size,
                mimeType: item.type,
                projectId: item.projectId,
                folderPath: item.folderPath,
                checksum: item.checksum || generateTransferChecksum()
              });

              return {
                ...item,
                chunksUploaded: item.totalChunks,
                progress: 100,
                status: 'COMPLETED' as const,
                speedMBs: 0
              };
            }

            return {
              ...item,
              chunksUploaded: newChunks,
              progress,
              speedMBs: 380 + Math.floor(Math.random() * 80) // 380 - 460 MB/s simulated accelerated UDP speed
            };
          }
          return item;
        });
        return hasChanges ? updated : prevQueue;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [onUploadCompleted]);

  const addFilesToQueue = (files: File[]) => {
    const newItems: UploadQueueItem[] = files.map(file => {
      const chunkSize = 10 * 1024 * 1024; // 10MB chunks
      const totalChunks = Math.max(1, Math.ceil(file.size / chunkSize));
      return {
        id: `upl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type || 'video/quicktime',
        progress: 0,
        speedMBs: 410,
        chunksUploaded: 0,
        totalChunks,
        status: 'UPLOADING',
        projectId: selectedProjectId,
        folderPath: selectedFolder,
        checksum: generateTransferChecksum()
      };
    });

    setQueue(prev => [...prev, ...newItems]);
  };

  const handleSimulateLargeFootage = (name: string, sizeGB: number) => {
    const mockFile = new File([new ArrayBuffer(1024)], name, { type: 'video/quicktime' });
    const sizeBytes = sizeGB * 1024 * 1024 * 1024;
    const totalChunks = Math.ceil(sizeBytes / (10 * 1024 * 1024));

    const item: UploadQueueItem = {
      id: `upl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file: mockFile,
      name,
      size: sizeBytes,
      type: 'video/quicktime',
      progress: 0,
      speedMBs: 435,
      chunksUploaded: 0,
      totalChunks: Math.min(40, totalChunks), // cap chunk iterations for smooth UI test
      status: 'UPLOADING',
      projectId: selectedProjectId,
      folderPath: selectedFolder,
      checksum: generateTransferChecksum()
    };

    setQueue(prev => [item, ...prev]);
  };

  const togglePauseResume = (id: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'UPLOADING' ? 'PAUSED' : 'UPLOADING'
        };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const activeCount = queue.filter(i => i.status === 'UPLOADING').length;
  const completedCount = queue.filter(i => i.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>RQA MULTI-THREAD ACCELERATION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Accelerated Ingestion & Transfer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ultra-fast chunked uploads with byte-level integrity checks and auto-retry on packet loss.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300">4 Parallel Socket Streams</span>
        </div>
      </div>

      {/* Target Destination Selectors */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Destination Workspace</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.client})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Target Folder</label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          >
            {currentProject?.folders.map(f => (
              <option key={f} value={f}>
                /{f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFilesToQueue(Array.from(e.dataTransfer.files));
          }
        }}
        className={`p-10 rounded-2xl border-2 border-dashed transition-all text-center relative overflow-hidden ${
          isDragging 
            ? 'border-blue-500 bg-blue-950/30' 
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              addFilesToQueue(Array.from(e.target.files));
            }
          }}
          className="hidden"
        />

        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-white">
            Drag and drop camera cards, rushes, or edit deliverables
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports Arri RAW, REDCODE R3D, Apple ProRes 4444 XQ, DNxHR, OpenEXR, and WAV stems. No file size ceiling.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              Browse Local Media Files
            </button>
          </div>

          {/* Quick Cinema Demo Simulation Launchers */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Simulate Large Production Footage Offloads
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                onClick={() => handleSimulateLargeFootage('A008_C004_1005QT_ArriRaw.mxf', 48.5)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
              >
                + 48.5 GB Arri RAW Dailies
              </button>
              <button
                onClick={() => handleSimulateLargeFootage('Porsche_GT3_Color_Baselight_v04.mov', 18.2)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
              >
                + 18.2 GB ProRes 4444 Pass
              </button>
              <button
                onClick={() => handleSimulateLargeFootage('Dune_VFX_Comp_Pass_EXR_Pack.zip', 32.0)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px] cursor-pointer"
              >
                + 32.0 GB VFX EXR Multi-Layer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Upload Queue */}
      {queue.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Transfer Pipeline Queue ({activeCount} active · {completedCount} completed)
            </h2>
            <button
              onClick={() => setQueue([])}
              className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear Queue
            </button>
          </div>

          <div className="space-y-3">
            {queue.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                      <FileVideo className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-md">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          /{item.folderPath}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                        <span>{formatBytes((item.size * item.progress) / 100)} / {formatBytes(item.size)}</span>
                        <span>·</span>
                        {item.status === 'COMPLETED' ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified Complete
                          </span>
                        ) : item.status === 'PAUSED' ? (
                          <span className="text-amber-400 font-semibold">Paused</span>
                        ) : (
                          <span className="text-blue-400 font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 animate-pulse" />
                            {item.speedMBs} MB/s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Percentage */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-white">{item.progress}%</span>
                      <div className="text-[10px] text-slate-500">Chunk {item.chunksUploaded}/{item.totalChunks}</div>
                    </div>

                    {item.status !== 'COMPLETED' && (
                      <button
                        onClick={() => togglePauseResume(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title={item.status === 'UPLOADING' ? 'Pause' : 'Resume'}
                      >
                        {item.status === 'UPLOADING' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.status === 'COMPLETED'
                        ? 'bg-emerald-500'
                        : item.status === 'PAUSED'
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick jump to project */}
          {completedCount > 0 && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>{completedCount} asset(s) ingested and verified in storage catalog.</span>
              </div>
              <button
                onClick={() => onNavigate('projects')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
              >
                View in Workspace
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
