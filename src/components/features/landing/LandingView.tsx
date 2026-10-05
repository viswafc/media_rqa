import React, { useState } from 'react';
import { 
  Zap, 
  Film, 
  ArrowRight, 
  ShieldCheck, 
  Sliders, 
  UploadCloud, 
  HardDrive, 
  Lock, 
  Globe2, 
  Check, 
  PlayCircle,
  Clock,
  Gauge,
  Layers,
  Sparkles
} from 'lucide-react';
import { ViewMode } from '../../../types';

interface LandingViewProps {
  onEnterWorkspace: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterWorkspace, onNavigate }) => {
  const [fileSizeBenchmarkGB, setFileSizeBenchmarkGB] = useState<number>(100);
  const [connectionSpeedMbps, setConnectionSpeedMbps] = useState<number>(1000);

  // Transfer duration math
  const standardTcpSec = (fileSizeBenchmarkGB * 8192) / (connectionSpeedMbps * 0.45); // ~45% efficiency with standard TCP latency
  const rqaUdpSec = (fileSizeBenchmarkGB * 8192) / (connectionSpeedMbps * 0.96); // ~96% efficiency with RQA proprietary acceleration

  const formatSec = (sec: number) => {
    if (sec < 60) return `${Math.round(sec)} sec`;
    const mins = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${mins}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Next-Gen Media Transfer & Review Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1] text-balance">
              The high-speed pipeline for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400">cinema & video production</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed text-balance">
              Transfer multi-gigabyte ProRes 4444 RAW rushes, stream frame-accurate dailies, draw on live video canvases, and collaborate with globally distributed post-production teams with zero packet loss.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onEnterWorkspace}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
              >
                <span>Launch Production Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('review')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-900/90 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-blue-400" />
                <span>Interactive Frame Review Demo</span>
              </button>
            </div>
          </div>

          {/* Live Transfer Speed Benchmark Interactive Widget */}
          <div className="mt-14 max-w-4xl mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-blue-400" />
                  RQA Fast Transfer Velocity Benchmark
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Compare proprietary UDP chunk streaming against standard browser HTTP uploads across global transit routes.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Node: FRA-01 to LAX-04</span>
              </div>
            </div>

            {/* Benchmark Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                  <span>Footage Payload Size</span>
                  <span className="text-blue-400 font-mono font-bold">{fileSizeBenchmarkGB} GB (8K RAW)</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={fileSizeBenchmarkGB}
                  onChange={(e) => setFileSizeBenchmarkGB(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>5 GB</span>
                  <span>100 GB</span>
                  <span>500 GB</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-2">
                  <span>Studio Uplink Bandwidth</span>
                  <span className="text-indigo-400 font-mono font-bold">{connectionSpeedMbps} Mbps (Fiber)</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={connectionSpeedMbps}
                  onChange={(e) => setConnectionSpeedMbps(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                  <span>100 Mbps</span>
                  <span>1 Gbps</span>
                  <span>5 Gbps</span>
                </div>
              </div>
            </div>

            {/* Comparison results */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400">Standard HTTPS / Cloud Drive</div>
                <div className="text-2xl font-bold font-mono text-slate-300 mt-1">
                  {formatSec(standardTcpSec)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Throttled by TCP window congestion & high round-trip latency.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/50 to-indigo-950/30 border border-blue-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    MEDIA RQA Accelerated
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                    ~{Math.round(standardTcpSec / Math.max(1, rqaUdpSec))}x Faster
                  </span>
                </div>
                <div className="text-3xl font-extrabold font-mono text-white mt-1">
                  {formatSec(rqaUdpSec)}
                </div>
                <p className="text-[11px] text-blue-300/80 mt-1">
                  Saturates 96% wire speed via parallel multi-socket UDP packet streams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Engineered for Hollywood, Commercials, and High-End Dailies
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Everything your editorial, color grading, VFX turnover, and sound mixing teams need to deliver under tight deadlines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Resumable Chunked Transfer</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Never lose an upload halfway through a 150GB camera card offload. Automatic packet recovery, chunk verification, and instant auto-resume upon network drops.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <span>SHA-256 Checksum Verification</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Frame-Accurate Video Review</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Step frame-by-frame with SMPTE timecode precision. Draw shapes, arrows, and notes right on canvas frames, and resolve comments in real-time threads.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <span>23.98 / 24 / 29.97 / 60 FPS Sync</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enterprise Vault Security</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Tokenized time-expiring share links, custom PIN authentication, download limit throttles, and SOC2 / TPN-ready media isolation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <span>AES-256 In-Transit & At-Rest</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison Matrix */}
      <section className="py-16 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Transparent Production Pricing
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Scale bandwidth on-demand with no hidden overage penalties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Pro Plan */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-300">Indie / Pro</div>
                <div className="text-3xl font-bold font-mono text-white mt-2">$49 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
                <p className="text-xs text-slate-400 mt-2">For freelance colorists and boutique directors.</p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> 2 TB High-Speed Storage</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Up to 50 GB per Transfer</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Frame-Accurate Review Suite</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> 3 Team Collaborators</li>
                </ul>
              </div>
              <button 
                onClick={onEnterWorkspace}
                className="mt-8 w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Select Pro
              </button>
            </div>

            {/* Studio Enterprise Plan - Highlighted */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950/60 to-slate-900/90 border-2 border-blue-500/60 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-[10px] font-bold tracking-wider text-white uppercase">
                Most Popular
              </div>
              <div>
                <div className="text-sm font-semibold text-blue-400">Studio & Post House</div>
                <div className="text-3xl font-bold font-mono text-white mt-2">$149 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
                <p className="text-xs text-slate-300 mt-2">For commercial studios, VFX pipelines, and agency post.</p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> 10 TB Ultra-Fast NVMe Cache</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Unlimited File Size (Up to 500GB+)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Hardware Acceleration Protocols</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Unlimited Team & Client Reviewers</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Custom Branding & Password Links</li>
                </ul>
              </div>
              <button 
                onClick={onEnterWorkspace}
                className="mt-8 w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
              >
                Launch Studio Workspace
              </button>
            </div>

            {/* Custom Enterprise Plan */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-300">Studio Custom</div>
                <div className="text-3xl font-bold font-mono text-white mt-2">Custom</div>
                <p className="text-xs text-slate-400 mt-2">For film studios, broadcast networks, and on-prem deployments.</p>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Petabyte-Scale Cloud/S3/GCS</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Dedicated Relay Edge Nodes</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> SSO / SAML & Custom RBAC</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> 24/7 Priority SLA & Dedicated TAM</li>
                </ul>
              </div>
              <button 
                onClick={onEnterWorkspace}
                className="mt-8 w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 bg-[#0a0d14] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-white">
            <Film className="w-4 h-4 text-blue-500" />
            <span>MEDIA RQA</span>
            <span className="text-slate-500 font-normal font-sans ml-2">© 2026 Media RQA Technologies Inc.</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Workspace</button>
            <button onClick={() => onNavigate('transfers')} className="hover:text-white transition-colors">Transfers</button>
            <button onClick={() => onNavigate('review')} className="hover:text-white transition-colors">Review Suite</button>
            <button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors">Security & Docs</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
