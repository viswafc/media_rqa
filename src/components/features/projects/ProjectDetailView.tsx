import React, { useState } from 'react';
import { Project, MediaFile, ViewMode } from '../../../types';
import { 
  ChevronRight, 
  Folder, 
  FolderPlus, 
  FileVideo, 
  ArrowLeftRight, 
  Download, 
  Trash2, 
  Eye, 
  UploadCloud, 
  CheckSquare, 
  Square, 
  HardDrive, 
  Clock, 
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Info,
  X,
  Copy,
  Check,
  Film,
  Sparkles
} from 'lucide-react';
import { formatBytes, formatRelativeTime } from '../../../lib/utils';

interface ProjectDetailViewProps {
  project: Project;
  assets: MediaFile[];
  onBackToProjects: () => void;
  onSelectAssetForReview: (assetId: string) => void;
  onOpenUploadForProject: (projectId: string, folder: string) => void;
  onCreateTransferFromAssets: (fileIds: string[], projectId: string) => void;
  onDeleteAsset: (assetId: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  assets,
  onBackToProjects,
  onSelectAssetForReview,
  onOpenUploadForProject,
  onCreateTransferFromAssets,
  onDeleteAsset,
  onNavigate
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [inspectedAssetId, setInspectedAssetId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const inspectedAsset = assets.find(a => a.id === inspectedAssetId) || null;

  const displayedAssets = assets.filter(a => {
    const matchesFolder = selectedFolder === 'ALL' || a.folderPath === selectedFolder;
    const matchesSearch = a.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          (a.codec && a.codec.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedFileIds.length === displayedAssets.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(displayedAssets.map(a => a.id));
    }
  };

  const toggleSelectFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds(selectedFileIds.filter(fId => fId !== id));
    } else {
      setSelectedFileIds([...selectedFileIds, id]);
    }
  };

  const handleCreateTransfer = () => {
    if (selectedFileIds.length === 0) return;
    onCreateTransferFromAssets(selectedFileIds, project.id);
  };

  const handleCopyChecksum = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <button 
          onClick={onBackToProjects}
          className="hover:text-blue-400 transition-colors cursor-pointer"
        >
          Projects
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-semibold">{project.name}</span>
        {selectedFolder !== 'ALL' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-mono">/{selectedFolder}</span>
          </>
        )}
      </div>

      {/* Project Overview Card */}
      <div className="p-6 sm:p-7 rounded-2xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div 
          className="absolute top-0 left-0 bottom-0 w-1.5" 
          style={{ backgroundColor: project.color || '#3b82f6' }}
        />

        <div className="pl-2">
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-200">{project.client}</span>
            <span>·</span>
            <span className="font-mono uppercase px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {project.status.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            {project.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Storage stats */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-8">
          <div>
            <div className="text-xs text-slate-400">Total Footage</div>
            <div className="text-2xl font-bold font-mono text-white mt-0.5 tabular-nums">
              {formatBytes(project.storageUsed, 1)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Assets</div>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-0.5 tabular-nums">
              {assets.length}
            </div>
          </div>
        </div>
      </div>

      {/* Folder Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedFolder('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedFolder === 'ALL'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'glass-panel text-slate-400 hover:text-white'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>All Folders ({assets.length})</span>
        </button>

        {project.folders.map(folder => {
          const count = assets.filter(a => a.folderPath === folder).length;
          return (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFolder === folder
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'glass-panel text-slate-400 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4 text-amber-400" />
              <span>{folder}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Batch Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 glass-panel rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
          >
            {selectedFileIds.length === displayedAssets.length && displayedAssets.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-blue-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>Select All ({selectedFileIds.length}/{displayedAssets.length})</span>
          </button>

          {selectedFileIds.length > 0 && (
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800 animate-in fade-in duration-150">
              <button
                onClick={handleCreateTransfer}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Create Transfer Link ({selectedFileIds.length})</span>
              </button>

              <button
                onClick={() => alert(`Starting high-speed ZIP export for ${selectedFileIds.length} assets.`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Batch</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenUploadForProject(project.id, selectedFolder === 'ALL' ? 'Dailies' : selectedFolder)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload into {selectedFolder === 'ALL' ? 'Project' : selectedFolder}</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter assets..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-950/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Assets Grid and Side Inspector Layout */}
      <div className="flex gap-6 items-start">
        {/* Main Grid */}
        <div className="flex-1">
          {displayedAssets.length === 0 ? (
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                onOpenUploadForProject(project.id, selectedFolder === 'ALL' ? 'Dailies' : selectedFolder);
              }}
              className={`p-16 text-center rounded-2xl border-2 border-dashed transition-all ${
                isDragOver ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 glass-panel'
              }`}
            >
              <UploadCloud className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No assets in this folder</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Drag and drop camera cards or initiate an accelerated UDP upload session.
              </p>
              <button
                onClick={() => onOpenUploadForProject(project.id, selectedFolder === 'ALL' ? 'Dailies' : selectedFolder)}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/20 cursor-pointer"
              >
                Upload Media Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedAssets.map(asset => {
                const isSelected = selectedFileIds.includes(asset.id);
                const isInspected = inspectedAssetId === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setInspectedAssetId(asset.id)}
                    className={`group p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isInspected
                        ? 'glass-panel-glow border-blue-500'
                        : isSelected 
                        ? 'bg-blue-950/40 border-cyan-500 shadow-md' 
                        : 'glass-panel hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Top Bar with select and folder tag */}
                      <div className="flex items-center justify-between mb-2.5">
                        <button
                          onClick={(e) => toggleSelectFile(asset.id, e)}
                          className="p-1 hover:text-white text-slate-400 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                          )}
                        </button>

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                          /{asset.folderPath}
                        </span>
                      </div>

                      {/* Thumbnail container */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssetForReview(asset.id);
                          onNavigate('review');
                        }}
                        className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center relative overflow-hidden group/thumb"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                        <FileVideo className="w-9 h-9 text-indigo-400 relative z-20 group-hover/thumb:scale-110 transition-transform" />
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-600/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-20 backdrop-blur-xs">
                          <span className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Launch Review QA</span>
                          </span>
                        </div>

                        <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between text-[10px] font-mono text-slate-300">
                          <span>{asset.resolution || '4K DCI'}</span>
                          <span>{asset.duration ? `${asset.duration}s` : '01:24'}</span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <h3 className="text-xs font-semibold text-slate-200 mt-3 truncate" title={asset.name}>
                        {asset.name}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                        {asset.codec}
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{formatBytes(asset.size)}</span>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAssetForReview(asset.id);
                            onNavigate('review');
                          }}
                          className="p-1 hover:text-blue-400 text-slate-400 transition-colors"
                          title="Open in SMPTE Review Suite"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAsset(asset.id);
                          }}
                          className="p-1 hover:text-rose-400 text-slate-500 transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Media Inspector Side Panel (Slides in when asset selected) */}
        {inspectedAsset && (
          <div className="w-80 lg:w-96 glass-panel rounded-2xl p-5 space-y-5 shadow-2xl animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-display font-bold text-white text-sm">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Media Asset Inspector</span>
              </div>
              <button 
                onClick={() => setInspectedAssetId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Asset Preview Thumbnail */}
            <div className="aspect-video w-full rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <FileVideo className="w-10 h-10 text-indigo-400" />
              <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                <span>{inspectedAsset.resolution || '3840x2160'}</span>
                <span>{inspectedAsset.fps} FPS</span>
              </div>
            </div>

            {/* Metadata Breakdown */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500 block">File Name</label>
                <div className="font-semibold text-white break-all font-mono mt-0.5">{inspectedAsset.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 font-mono">
                <div>
                  <label className="text-[10px] uppercase text-slate-500 block">Codec</label>
                  <span className="text-slate-200">{inspectedAsset.codec}</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-500 block">Payload Size</label>
                  <span className="text-cyan-400 font-bold">{formatBytes(inspectedAsset.size)}</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-500 block">Duration</label>
                  <span className="text-slate-200">{inspectedAsset.duration}s</span>
                </div>
                <div>
                  <label className="text-[10px] uppercase text-slate-500 block">Color Space</label>
                  <span className="text-slate-200">ACEScg / Rec.709</span>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 mb-1">
                  <span>SHA-256 Checksum</span>
                  <button 
                    onClick={() => handleCopyChecksum(inspectedAsset.checksum)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg text-[10px] font-mono text-slate-400 break-all border border-slate-800">
                  {inspectedAsset.checksum}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  onSelectAssetForReview(inspectedAsset.id);
                  onNavigate('review');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Open in Frame Review</span>
              </button>

              <button
                onClick={() => {
                  onCreateTransferFromAssets([inspectedAsset.id], project.id);
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-400" />
                <span>Create Transfer Link</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
