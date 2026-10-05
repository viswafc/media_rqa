import React, { useState, useEffect } from 'react';
import { AuthCard } from './AuthCard';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Copy, Check } from 'lucide-react';
import { ViewMode } from '../../types';

interface VerifyEmailPromptProps {
  email: string;
  onVerificationComplete: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const VerifyEmailPrompt: React.FC<VerifyEmailPromptProps> = ({
  email,
  onVerificationComplete,
  onNavigate
}) => {
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    setCanResend(false);
    setCountdown(45);
    setResendSuccess(true);
    setTimeout(() => setResendSuccess(false), 3000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AuthCard
      title="Check your email"
      subtitle="We sent an activation link to verify your workspace identity"
      footer={
        <p>
          Need to change email?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-[#0066FF] hover:underline font-semibold cursor-pointer"
          >
            Sign up again
          </button>
        </p>
      }
    >
      <div className="space-y-5 text-center text-xs">
        {/* Large Mail Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#0066FF]/10 border border-[#0066FF]/25 flex items-center justify-center text-[#0066FF] mx-auto shadow-lg shadow-[#0066FF]/15">
          <Mail className="w-8 h-8" />
        </div>

        {/* Email badge */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between font-mono">
          <span className="text-white font-semibold truncate max-w-[240px]">{email || 'elena@studio.com'}</span>
          <button
            onClick={handleCopyEmail}
            className="text-slate-400 hover:text-white p-1"
            title="Copy email"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-slate-400 leading-relaxed text-[11px]">
          Click the secure verification button in the email to activate your account. If you don't see it within a minute, check your spam folder.
        </p>

        {/* Instant Demo Confirmation Button */}
        <button
          onClick={onVerificationComplete}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0066FF] to-indigo-600 hover:from-[#0052CC] hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Simulate Email Link Click & Enter Workspace</span>
        </button>

        {/* Resend button */}
        <div className="pt-2 border-t border-white/10 flex flex-col items-center gap-2">
          {resendSuccess && (
            <span className="text-emerald-400 font-semibold text-[11px] animate-in fade-in">
              Verification email re-sent!
            </span>
          )}
          <button
            onClick={handleResend}
            disabled={!canResend}
            className="text-slate-400 hover:text-white disabled:opacity-40 font-mono text-[11px] cursor-pointer"
          >
            {canResend ? 'Resend verification email' : `Resend available in 0:${countdown.toString().padStart(2, '0')}`}
          </button>
        </div>
      </div>
    </AuthCard>
  );
};
