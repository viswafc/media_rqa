import React, { useState } from 'react';
import { X, FolderKanban, Plus, Check } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (data: {
    name: string;
    client: string;
    description: string;
    color: string;
    folders: string[];
  }) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [folders, setFolders] = useState<string[]>(['Dailies_Raw', 'Master_Edits', 'VFX_Passes', 'Audio_Stems']);
  const [newFolderInput, setNewFolderInput] = useState('');

  if (!isOpen) return null;

  const colorPalette = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  const handleAddFolder = () => {
    if (!newFolderInput.trim()) return;
    const clean = newFolderInput.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!folders.includes(clean)) {
      setFolders([...folders, clean]);
      setNewFolderInput('');
    }
  };

  const handleRemoveFolder = (folderName: string) => {
    setFolders(folders.filter(f => f !== folderName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject({
      name: name.trim(),
      client: client.trim() || 'Internal Production',
      description: description.trim() || 'High-speed media transfer workspace.',
      color,
      folders
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Project Workspace</h2>
              <p className="text-xs text-slate-400">Initialize a shared repository for production assets.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Porsche 911 GT3 European Launch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Client / Production Studio</label>
            <input
              type="text"
              placeholder="e.g. Anton Media / Warner Bros"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Description & Camera Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. 8K RAW anamorphic rushes, ACEScg color pipeline, delivery date Oct 24."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Color Accent Picker */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Project Color Accent</label>
            <div className="flex items-center gap-2">
              {colorPalette.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Folder Hierarchy Setup */}
          <div>
            <label className="block font-semibold text-slate-200 mb-1.5">Workspace Folder Hierarchy</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {folders.map(f => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-slate-300"
                >
                  /{f}
                  <button
                    type="button"
                    onClick={() => handleRemoveFolder(f)}
                    className="hover:text-rose-400 text-slate-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add folder (e.g. Dailies_Day03)"
                value={newFolderInput}
                onChange={(e) => setNewFolderInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFolder(); }}}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddFolder}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold"
              >
                Add
              </button>
            </div>
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
              className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 font-semibold shadow-md shadow-blue-600/20"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
