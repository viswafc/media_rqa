import React, { useState } from 'react';
import { AuthCard } from './AuthCard';
import { KeyRound, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ViewMode } from '../../types';

interface ForgotPasswordFormProps {
  onRequestReset: (email: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onRequestReset,
  onNavigate
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      onRequestReset(email);
    }, 600);
  };

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a password reset link"
      footer={
        <button
          onClick={() => onNavigate('login')}
          className="text-[#0066FF] hover:underline font-semibold cursor-pointer"
        >
          ← Back to Sign In
        </button>
      }
    >
      {isSubmitted ? (
        <div className="space-y-4 text-center text-xs animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-white">Reset link sent!</h3>
          <p className="text-slate-400 leading-relaxed">
            If an account exists for <strong className="text-white font-mono">{email}</strong>, you will receive a password reset link shortly.
          </p>

          <button
            onClick={() => onNavigate('reset-password')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
          >
            Proceed with Reset Code Demo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                className="w-full pl-10 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold text-xs shadow-lg shadow-[#0066FF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Send Password Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
};
