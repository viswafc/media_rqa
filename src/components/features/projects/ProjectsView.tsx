import React, { useState } from 'react';
import { Project, ViewMode } from '../../../types';
import { 
  FolderKanban, 
  Search, 
  Plus, 
  LayoutGrid, 
  ListFilter, 
  Calendar, 
  HardDrive, 
  ChevronRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { formatBytes, formatRelativeTime } from '../../../lib/utils';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onOpenNewProject: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onOpenNewProject,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'IN_REVIEW' | 'DELIVERED' | 'ARCHIVED'>('ALL');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200">Projects</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            Production Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Organized workspace folders for footage offloads, edit passes, and deliverables.
          </p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Workspace</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter Tabs & Layout Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Segmented Filter Control (Allowed buttons with click handlers) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
            {(['ALL', 'ACTIVE', 'IN_REVIEW', 'DELIVERED'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Grid / List Layout toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewLayout === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewLayout === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or create a new project workspace.
          </p>
          <button
            onClick={onOpenNewProject}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : viewLayout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-lg"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-1.5" 
                style={{ backgroundColor: project.color || '#3b82f6' }}
              />

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300 truncate max-w-[180px]">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {project.client}
                  </span>
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Folder Pills preview */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.folders.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      /{f}
                    </span>
                  ))}
                  {project.folders.length > 3 && (
                    <span className="text-[11px] font-mono text-slate-500 px-1 py-0.5">
                      +{project.folders.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                  <span>{project.assetCount} assets · {formatBytes(project.storageUsed, 1)}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {formatRelativeTime(project.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Project Name</th>
                <th className="py-3.5 px-4">Client / Studio</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Assets</th>
                <th className="py-3.5 px-4 text-right">Storage</th>
                <th className="py-3.5 px-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProjects.map(proj => (
                <tr
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.color || '#3b82f6' }} />
                    <span className="hover:text-blue-400 transition-colors">{proj.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{proj.client}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {proj.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">{proj.assetCount}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-300">{formatBytes(proj.storageUsed, 1)}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">{formatRelativeTime(proj.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
