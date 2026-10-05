import React, { useState } from 'react';
import { Project, MediaFile } from '../../../types';
import { 
  X, 
  ArrowLeftRight, 
  Lock, 
  Calendar, 
  Mail, 
  FileVideo, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { formatBytes } from '../../../lib/utils';

interface NewTransferWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  mediaFiles: MediaFile[];
  initialSelectedAssetIds?: string[];
  initialProjectId?: string;
  onCreateTransfer: (data: {
    title: string;
    projectId: string;
    fileIds: string[];
    recipients: string[];
    message: string;
    password?: string;
    maxDownloads: number;
    expiryDays: number;
  }) => void;
}

export const NewTransferWizardModal: React.FC<NewTransferWizardModalProps> = ({
  isOpen,
  onClose,
  projects,
  mediaFiles,
  initialSelectedAssetIds = [],
  initialProjectId,
  onCreateTransfer
}) => {
  const [title, setTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId || projects[0]?.id || '');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>(initialSelectedAssetIds);
  const [recipientsInput, setRecipientsInput] = useState('');
  const [message, setMessage] = useState('');
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [maxDownloads, setMaxDownloads] = useState(25);

  if (!isOpen) return null;

  const projectAssets = mediaFiles.filter(m => m.projectId === selectedProjectId);

  const toggleAsset = (id: string) => {
    if (selectedAssetIds.includes(id)) {
      setSelectedAssetIds(selectedAssetIds.filter(a => a !== id));
    } else {
      setSelectedAssetIds([...selectedAssetIds, id]);
    }
  };

  const totalPayloadSize = mediaFiles
    .filter(m => selectedAssetIds.includes(m.id))
    .reduce((sum, a) => sum + a.size, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedAssetIds.length === 0) return;

    const recipients = recipientsInput
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    onCreateTransfer({
      title: title.trim(),
      projectId: selectedProjectId,
      fileIds: selectedAssetIds,
      recipients,
      message: message.trim(),
      password: enablePassword ? password.trim() : undefined,
      maxDownloads,
      expiryDays
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Accelerated Media Transfer</h2>
              <p className="text-xs text-slate-400">Generate a high-velocity download package for client distribution.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* Transfer Title */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Transfer Package Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Porsche GT3 Launch — 4K ProRes Dailies Pass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Project & Asset Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">Select Source Project & Assets *</label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedAssetIds([]);
                }}
                className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="border border-slate-800 rounded-xl bg-slate-950/60 max-h-48 overflow-y-auto p-2 space-y-1">
              {projectAssets.length === 0 ? (
                <div className="text-center py-6 text-slate-500">No assets in this project</div>
              ) : (
                projectAssets.map(asset => {
                  const isChecked = selectedAssetIds.includes(asset.id);
                  return (
                    <div
                      key={asset.id}
                      onClick={() => toggleAsset(asset.id)}
                      className={`flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer ${
                        isChecked 
                          ? 'bg-blue-950/40 border-blue-500/60 text-white' 
                          : 'bg-slate-900/40 border-transparent text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isChecked ? <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                        <FileVideo className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate font-mono">{asset.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0 pl-2">
                        {formatBytes(asset.size)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-1.5 flex justify-between text-[11px] text-slate-400 font-mono">
              <span>{selectedAssetIds.length} assets selected</span>
              <span className="text-blue-400 font-bold">Total Payload: {formatBytes(totalPayloadSize)}</span>
            </div>
          </div>

          {/* Recipients & Message */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">Recipient Emails (comma separated)</label>
              <input
                type="text"
                placeholder="client@porsche.de, editor@studio.com"
                value={recipientsInput}
                onChange={(e) => setRecipientsInput(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1.5">Expiration Lifespan</label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value={1}>1 Day (Ephemeral)</option>
                <option value={7}>7 Days (Standard Review)</option>
                <option value={14}>14 Days (Extended)</option>
                <option value={30}>30 Days (Archive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Recipient Delivery Note</label>
            <textarea
              rows={2}
              placeholder="e.g. Please verify frame 240 highlights and check uncompressed 5.1 audio downmix."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Security & Access Controls */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Require PIN Password Protection</span>
              </div>
              <input
                type="checkbox"
                checked={enablePassword}
                onChange={(e) => setEnablePassword(e.target.checked)}
                className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {enablePassword && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Enter secure passcode (e.g. 9842-GT3)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedAssetIds.length === 0 || !title.trim()}
              className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md shadow-blue-600/20"
            >
              Dispatch Transfer Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
