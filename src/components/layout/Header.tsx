import React, { useState } from 'react';
import { ViewMode, UserProfile, NotificationItem } from '../../types';
import { 
  Zap, 
  FolderKanban, 
  ArrowLeftRight, 
  Film, 
  Users, 
  Settings, 
  UploadCloud, 
  Bell, 
  HardDrive,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Search,
  User
} from 'lucide-react';
import { formatBytes } from '../../lib/utils';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  user: UserProfile;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onOpenUpload: () => void;
  onOpenCommandPalette: () => void;
  storageUsed: number;
  storageLimit: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  user,
  notifications,
  onMarkNotificationRead,
  onOpenUpload,
  onOpenCommandPalette,
  storageUsed,
  storageLimit
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const storagePercent = Math.round((storageUsed / storageLimit) * 100);

  const navItems: { view: ViewMode; label: string; icon: any }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: Zap },
    { view: 'projects', label: 'Projects', icon: FolderKanban },
    { view: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
    { view: 'review', label: 'Review & QA', icon: Film },
    { view: 'team', label: 'Team', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d121c]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Title */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              MEDIA<span className="text-blue-500 ml-1">RQA</span>
            </span>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view || (currentView === 'project-detail' && item.view === 'projects');
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Zone 3: Primary Actions & User Profile */}
        <div className="flex items-center gap-3">
          {/* Global Cmd+K Search Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950 text-slate-500 rounded border border-slate-800">
              ⌘K
            </kbd>
          </button>
          {/* Quick Storage Status Bar */}
          <div 
            onClick={() => onNavigate('settings')}
            className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700 transition-colors"
            title="Storage capacity (10 TB Tier)"
          >
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex flex-col text-[11px] leading-tight">
              <div className="flex items-center justify-between gap-3 text-slate-400 font-mono">
                <span>{formatBytes(storageUsed, 1)} / {formatBytes(storageLimit, 0)}</span>
                <span className="text-blue-400 font-semibold">{storagePercent}%</span>
              </div>
              <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Accelerated Upload CTA */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-lg shadow-md shadow-blue-600/20 hover:shadow-blue-500/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Accelerated Upload</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0d121c]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl z-50 p-3 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-300 font-semibold">
                  <span className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    Activity Notifications
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">{unreadCount} unread</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1.5">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onMarkNotificationRead(item.id);
                          if (item.type === 'FRAME_COMMENT') onNavigate('review');
                          if (item.type === 'TRANSFER_COMPLETE') onNavigate('transfers');
                          setShowNotifications(false);
                        }}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          item.read 
                            ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' 
                            : 'bg-blue-950/30 border-blue-800/40 text-slate-200 hover:border-blue-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {item.type === 'FRAME_COMMENT' && <MessageSquare className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                          {item.type === 'TRANSFER_COMPLETE' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                          {item.type === 'NEW_ASSET' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-100 truncate">{item.title}</p>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.message}</p>
                            <span className="text-[10px] text-slate-500 font-mono mt-1 block">{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors focus:outline-none"
            >
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                {user.avatar}
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                {user.name}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl z-50 p-2 text-xs">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-mono uppercase px-1.5 py-0.5 bg-blue-900/40 text-blue-300 border border-blue-800/50 rounded">
                    {user.role} · {user.plan.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>My Profile & Security</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Workspace Settings</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('team');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage Team</span>
                </button>
                <div className="border-t border-slate-800/80 my-1"></div>
                <button
                  onClick={() => {
                    onNavigate('login');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors text-left"
                >
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
