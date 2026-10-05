import React, { useState } from 'react';
import { AuthCard } from './AuthCard';
import { Lock, Eye, EyeOff, Check, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ViewMode } from '../../types';

interface ResetPasswordFormProps {
  onPasswordResetComplete: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onPasswordResetComplete,
  onNavigate
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || passedCount < 3) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onPasswordResetComplete();
    }, 600);
  };

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Your new password must meet studio encryption standards"
      footer={
        <button
          onClick={() => onNavigate('login')}
          className="text-[#0066FF] hover:underline font-semibold cursor-pointer"
        >
          ← Return to Sign In
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-200 mb-1">New Password</label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Requirements list */}
          <div className="mt-2 space-y-1 text-[11px] font-mono">
            <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
              {hasMinLength ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">·</span>}
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasUpper && hasLower ? 'text-emerald-400' : 'text-slate-500'}`}>
              {hasUpper && hasLower ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">·</span>}
              <span>Uppercase & lowercase letters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${hasNumber || hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
              {hasNumber || hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3 h-3 text-center">·</span>}
              <span>Numbers or special symbols</span>
            </div>
          </div>
        </div>

        {/* Confirm */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1">Confirm New Password</label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-9 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
            />
            {confirmPassword.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-rose-400" />
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !passwordsMatch || passedCount < 3}
          className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-[#0066FF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Update Password & Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
};
