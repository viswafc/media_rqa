import React, { useState } from 'react';
import { AuthCard } from './AuthCard';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { ViewMode, UserRole } from '../../types';

interface LoginFormProps {
  onLoginSuccess: (user: {
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
  }) => void;
  onNavigate: (view: ViewMode) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Determine role based on email or default
      const role: UserRole = email.includes('admin') ? 'admin' : email.includes('review') ? 'reviewer' : email.includes('client') ? 'client' : 'editor';
      const name = email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase());
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'MR';

      onLoginSuccess({
        name: name || 'Viswa C.',
        email: email.trim(),
        role,
        avatar: initials
      });
    }, 600);
  };

  const handleQuickDemo = (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('MediaRQA!2026');
    setErrorMessage('');
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Media RQA workspace"
      footer={
        <p>
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-[#0066FF] hover:underline font-semibold cursor-pointer"
          >
            Create account
          </button>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all font-sans"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-semibold text-slate-200">Password</label>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-[#0066FF] hover:underline text-[11px] cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/20 transition-all font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0066FF] bg-white/5 border-white/10 cursor-pointer"
            />
            <span className="text-slate-300 text-[11px]">Remember this browser (30 days)</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-[#0066FF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Quick Demo Credentials Bar */}
        <div className="pt-4 border-t border-white/10">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider text-center mb-2.5">
            Quick 1-Click Role Login
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('admin', 'admin@mediarqa.internal')}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 text-center transition-colors cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('editor', 'marcus.editor@studio.com')}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 text-center transition-colors cursor-pointer"
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('reviewer', 'elena.color@posthouse.com')}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 text-center transition-colors cursor-pointer"
            >
              Reviewer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('client', 'producer@netflix.com')}
              className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 text-center transition-colors cursor-pointer"
            >
              Client
            </button>
          </div>
        </div>
      </form>
    </AuthCard>
  );
};
