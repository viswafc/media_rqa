import React from 'react';
import { Film } from 'lucide-react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  subtitle,
  children,
  footer
}) => {
  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Subtle radial background glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#0066FF]/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Bar Logo */}
      <div className="max-w-md w-full mx-auto flex items-center justify-center gap-2.5 z-10 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0066FF] to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Film className="w-4 h-4" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white font-display">
          MEDIA<span className="text-[#0066FF] ml-1">RQA</span>
        </span>
      </div>

      {/* Main Glass Card */}
      <div className="max-w-md w-full mx-auto relative z-10">
        <div className="glass-panel-glow rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-xs text-slate-500">
            {footer}
          </div>
        )}
      </div>

      {/* Legal Footer */}
      <div className="text-center text-[11px] text-slate-600 font-mono z-10 mt-6">
        © 2026 Media RQA Technologies Inc. · Enterprise Zero-Trust Architecture
      </div>
    </div>
  );
};
