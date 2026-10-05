import React, { useState } from 'react';
import { AuthCard } from './AuthCard';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Film, 
  Check, 
  X, 
  Download, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ViewMode, UserRole } from '../../types';

interface SignupFormProps {
  onSignupSuccess: (email: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSignupSuccess, onNavigate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('editor');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password rules
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strength = passedCount <= 2 ? 'Weak' : passedCount === 3 ? 'Fair' : passedCount === 4 ? 'Good' : 'Strong';
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms || !passwordsMatch || passedCount < 3) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignupSuccess(email);
    }, 700);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start collaborating with your post-production team"
      footer={
        <p>
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#0066FF] hover:underline font-semibold cursor-pointer"
          >
            Sign in
          </button>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">First Name *</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Elena"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Last Name *</label>
            <input
              type="text"
              required
              placeholder="Rostova"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="elena@studio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* Visual Role Selector */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1.5">What's your primary production role?</label>
          <div className="grid grid-cols-3 gap-2">
            {/* Editor */}
            <button
              type="button"
              onClick={() => setRole('editor')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'editor'
                  ? 'bg-[#0066FF]/15 border-[#0066FF] shadow-xs'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <Film className={`w-4 h-4 ${role === 'editor' ? 'text-[#0066FF]' : 'text-slate-400'}`} />
                {role === 'editor' && <Check className="w-3 h-3 text-[#0066FF]" />}
              </div>
              <span className="font-semibold text-white block mt-1.5">Editor / DIT</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Upload & cut</span>
            </button>

            {/* Reviewer */}
            <button
              type="button"
              onClick={() => setRole('reviewer')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'reviewer'
                  ? 'bg-[#0066FF]/15 border-[#0066FF] shadow-xs'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <Sparkles className={`w-4 h-4 ${role === 'reviewer' ? 'text-[#0066FF]' : 'text-slate-400'}`} />
                {role === 'reviewer' && <Check className="w-3 h-3 text-[#0066FF]" />}
              </div>
              <span className="font-semibold text-white block mt-1.5">Reviewer</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Color & QA</span>
            </button>

            {/* Client */}
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                role === 'client'
                  ? 'bg-[#0066FF]/15 border-[#0066FF] shadow-xs'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <Download className={`w-4 h-4 ${role === 'client' ? 'text-[#0066FF]' : 'text-slate-400'}`} />
                {role === 'client' && <Check className="w-3 h-3 text-[#0066FF]" />}
              </div>
              <span className="font-semibold text-white block mt-1.5">Client</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Download & approve</span>
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1">Password *</label>
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

          {/* Strength Meter Bar */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">Password Strength:</span>
                <span className={
                  strength === 'Strong' ? 'text-emerald-400 font-bold' :
                  strength === 'Good' ? 'text-blue-400 font-bold' :
                  strength === 'Fair' ? 'text-amber-400' : 'text-rose-400'
                }>{strength}</span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1">
                <div className={`rounded-full ${passedCount >= 1 ? (passedCount >= 4 ? 'bg-emerald-500' : passedCount >= 3 ? 'bg-blue-500' : 'bg-rose-500') : 'bg-white/10'}`} />
                <div className={`rounded-full ${passedCount >= 2 ? (passedCount >= 4 ? 'bg-emerald-500' : passedCount >= 3 ? 'bg-blue-500' : 'bg-rose-500') : 'bg-white/10'}`} />
                <div className={`rounded-full ${passedCount >= 3 ? (passedCount >= 4 ? 'bg-emerald-500' : 'bg-blue-500') : 'bg-white/10'}`} />
                <div className={`rounded-full ${passedCount >= 4 ? 'bg-emerald-500' : 'bg-white/10'}`} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-semibold text-slate-200 mb-1">Confirm Password *</label>
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

        {/* Terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0066FF] mt-0.5"
            />
            <span className="text-slate-400 text-[11px] leading-relaxed">
              I agree to the <span className="text-[#0066FF]">Terms of Service</span> and <span className="text-[#0066FF]">Privacy Policy</span>.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !agreeTerms || !passwordsMatch || passedCount < 3}
          className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-[#0066FF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
};
