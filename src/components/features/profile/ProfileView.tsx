import React, { useState, useRef } from 'react';
import { UserProfile, ViewMode, UserRole } from '../../../types';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Key, 
  Smartphone, 
  Laptop, 
  Globe, 
  Camera, 
  Save, 
  Check, 
  Trash2, 
  LogOut, 
  Building, 
  Briefcase, 
  Clock, 
  AlertCircle,
  X,
  UploadCloud
} from 'lucide-react';
import { formatRelativeTime } from '../../../lib/utils';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigate: (view: ViewMode) => void;
  onSignOut: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  onNavigate,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'security' | 'sessions'>('personal');
  
  // Profile forms
  const [firstName, setFirstName] = useState(user.firstName || user.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.lastName || user.name.split(' ')[1] || '');
  const [displayName, setDisplayName] = useState(user.displayName || user.name || '');
  const [email] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+1 (555) 384-9102');
  const [timezone, setTimezone] = useState(user.timezone || 'America/Los_Angeles (PST)');
  const [locale, setLocale] = useState(user.locale || 'en-US');

  // Professional form
  const [company, setCompany] = useState(user.company || 'Legendary Post Productions');
  const [jobTitle, setJobTitle] = useState(user.jobTitle || 'Lead Colorist & DIT Supervisor');
  const [bio, setBio] = useState(user.bio || 'Specializing in ACEScg color conform workflows and high-speed multi-gigabyte camera card offloads.');

  // Password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Avatar modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active Sessions
  const [sessions, setSessions] = useState([
    {
      id: 'sess-01',
      device: 'MacBook Pro 16" (M3 Max)',
      browser: 'Chrome 124.0.0',
      ip: '192.168.1.104',
      location: 'Frankfurt, Germany',
      lastActive: new Date().toISOString(),
      isCurrent: true
    },
    {
      id: 'sess-02',
      device: 'Mac Studio (DaVinci Suite)',
      browser: 'Safari 17.4',
      ip: '10.0.4.18',
      location: 'London, UK',
      lastActive: '2026-10-04T18:30:00Z',
      isCurrent: false
    },
    {
      id: 'sess-03',
      device: 'iPad Pro 12.9" (Client Review)',
      browser: 'Mobile Safari',
      ip: '172.56.21.9',
      location: 'Los Angeles, USA',
      lastActive: '2026-10-03T11:00:00Z',
      isCurrent: false
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${firstName} ${lastName}`.trim() || user.name;
    onUpdateProfile({
      name: fullName,
      firstName,
      lastName,
      displayName,
      phone,
      timezone,
      locale,
      company,
      jobTitle,
      bio,
      avatarUrl: avatarPreview || undefined
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const getRoleBadgeColor = (roleStr: string) => {
    const r = roleStr.toLowerCase();
    if (r.includes('admin') || r.includes('owner')) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (r.includes('editor')) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (r.includes('reviewer') || r.includes('colorist')) return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Profile Banner Card */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar with edit overlay */}
          <div 
            onClick={() => setShowAvatarModal(true)}
            className="relative w-24 h-24 rounded-full border-2 border-white/20 p-1 group cursor-pointer overflow-hidden shadow-xl"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt={user.name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0066FF] to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.avatar || 'VC'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-bold text-white font-display">
                {user.name}
              </h1>
              <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Verified
              </span>
            </div>

            <p className="text-xs font-mono text-slate-400 mt-1">{user.email}</p>
            <p className="text-xs text-slate-300 mt-1">{company} · {jobTitle}</p>
          </div>
        </div>

        {/* Sign Out CTA */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'personal' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab('professional')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'professional' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Professional Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'security' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'sessions' ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Active Sessions ({sessions.length})</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel space-y-6 text-xs">
        {/* Personal Details */}
        {activeTab === 'personal' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">Personal Identity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your display name and locale preferences.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Email (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3.5 py-2.5 bg-slate-950/50 border border-slate-800/60 rounded-xl text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST / UTC-8)</option>
                  <option value="America/New_York (EST)">America/New_York (EST / UTC-5)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT / UTC+0)</option>
                  <option value="Europe/Berlin (CET)">Europe/Berlin (CET / UTC+1)</option>
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST / UTC+9)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Language Locale</label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="en-GB">English (United Kingdom)</option>
                  <option value="de-DE">Deutsch (German)</option>
                  <option value="fr-FR">Français (French)</option>
                  <option value="ja-JP">日本語 (Japanese)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Profile updated successfully!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Professional Profile */}
        {activeTab === 'professional' && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">Professional & Studio Information</h2>
              <p className="text-xs text-slate-400 mt-0.5">Details displayed on project review tickets and transfers.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Production Company / Studio</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Job Title / Role</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF] resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Professional profile updated!
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Security & Change Password */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <div>
              <h2 className="text-base font-bold text-white font-display">Change Password</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ensure your account is protected with a strong passphrase.</p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Password updated securely!</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-200 mb-1">Current Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">New Password (Min 8 characters)</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              Update Password
            </button>
          </form>
        )}

        {/* Active Sessions */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-display">Active Sessions</h2>
                <p className="text-xs text-slate-400 mt-0.5">Devices currently authenticated with your account.</p>
              </div>

              <button
                onClick={() => setSessions(sessions.filter(s => s.isCurrent))}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                Sign out of all other devices
              </button>
            </div>

            <div className="space-y-2.5">
              {sessions.map(sess => (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                      {sess.device.includes('iPad') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            Current Session
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>{sess.browser}</span>
                        <span>·</span>
                        <span>{sess.location} ({sess.ip})</span>
                        <span>·</span>
                        <span>{formatRelativeTime(sess.lastActive)}</span>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="px-3 py-1 rounded-lg border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-display">Update Avatar Photo</h3>
              <button onClick={() => setShowAvatarModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="w-24 h-24 rounded-full border-2 border-blue-500 p-1 overflow-hidden shadow-xl">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.avatar}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Upload New Photo
                </button>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => setAvatarPreview(null)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-500 font-mono">
                Supports JPG, PNG, or WebP. Max 2MB.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
