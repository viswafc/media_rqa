import React, { useState, useEffect, useRef } from 'react';
import { MediaFile, FrameComment, Annotation, Project, ViewMode } from '../../../types';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  MessageSquare, 
  CheckCircle2, 
  Check, 
  Edit3, 
  Square, 
  ArrowUpRight, 
  Circle, 
  Type, 
  Send, 
  Layers, 
  Sliders, 
  SplitSquareVertical, 
  Columns, 
  Trash2, 
  X, 
  Sparkles, 
  Film,
  Activity,
  Grid,
  Eye,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { secondsToSMPTE, smpteToSeconds, formatBytes, formatRelativeTime } from '../../../lib/utils';

interface MediaReviewSuiteProps {
  mediaFiles: MediaFile[];
  activeAssetId: string;
  comments: FrameComment[];
  projects: Project[];
  onSelectAsset: (assetId: string) => void;
  onAddComment: (commentData: {
    assetId: string;
    timecode: string;
    timestampSeconds: number;
    content: string;
    annotation?: Annotation;
  }) => void;
  onToggleResolveComment: (commentId: string) => void;
  onAddReply: (commentId: string, content: string) => void;
  onNavigate: (view: ViewMode) => void;
}

export const MediaReviewSuite: React.FC<MediaReviewSuiteProps> = ({
  mediaFiles,
  activeAssetId,
  comments,
  projects,
  onSelectAsset,
  onAddComment,
  onToggleResolveComment,
  onAddReply,
  onNavigate
}) => {
  const currentAsset = mediaFiles.find(m => m.id === activeAssetId) || mediaFiles[0];
  const fps = currentAsset?.fps || 24.0;
  const duration = currentAsset?.duration || 128.0;

  // Playback & player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(14.75);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [activeVersion, setActiveVersion] = useState<'v1' | 'v2' | 'v3'>('v3');
  const [compareMode, setCompareMode] = useState<'single' | 'split' | 'side-by-side'>('single');
  const [splitPosition, setSplitPosition] = useState<number>(50);

  // Scopes & Overlays
  const [activeScope, setActiveScope] = useState<'none' | 'waveform' | 'rgb_parade' | 'vectorscope'>('none');
  const [showGridOverlay, setShowGridOverlay] = useState(false);

  // Audio VU Meter levels
  const [vuLeft, setVuLeft] = useState(0.65);
  const [vuRight, setVuRight] = useState(0.68);

  // Annotation Drawing state
  const [activeTool, setActiveTool] = useState<'none' | 'pen' | 'rect' | 'arrow' | 'circle' | 'text'>('none');
  const [drawColor, setDrawColor] = useState<string>('#ef4444');
  const [currentDrawing, setCurrentDrawing] = useState<Annotation | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [filterResolved, setFilterResolved] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [reviewStatus, setReviewStatus] = useState<'IN_REVIEW' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED'>('IN_REVIEW');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Filter comments for this active asset
  const assetComments = comments.filter(c => c.assetId === currentAsset?.id);
  const displayedComments = assetComments.filter(c => {
    if (filterResolved === 'OPEN') return !c.isResolved;
    if (filterResolved === 'RESOLVED') return c.isResolved;
    return true;
  });

  const matchingCommentWithAnnotation = assetComments.find(
    c => Math.abs(c.timestampSeconds - currentTime) < 0.2 && c.annotation
  );
  const activeOverlayAnnotation = currentDrawing || matchingCommentWithAnnotation?.annotation;

  // Video Render & VU Meter Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime(prev => {
          const next = prev + delta * playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });

        // Dynamic VU Meter simulation
        setVuLeft(0.4 + Math.sin(now * 0.008) * 0.35 + Math.random() * 0.15);
        setVuRight(0.45 + Math.cos(now * 0.007) * 0.32 + Math.random() * 0.15);
      } else {
        setVuLeft(0.05);
        setVuRight(0.05);
      }

      drawVideoFrame();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, playbackSpeed, currentTime, duration, activeVersion, compareMode, splitPosition, activeOverlayAnnotation, activeScope, showGridOverlay]);

  // Procedural Cinematic Frame Drawing
  const drawVideoFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const t = currentTime;
    const carX = (width * 0.2) + ((t % 15) / 15) * (width * 0.6);
    const carY = height * 0.58 + Math.sin(t * 4) * 2;

    // Horizon & sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    if (activeVersion === 'v1') {
      skyGradient.addColorStop(0, '#47505d');
      skyGradient.addColorStop(1, '#666e7b');
    } else if (activeVersion === 'v2') {
      skyGradient.addColorStop(0, '#0c1524');
      skyGradient.addColorStop(0.5, '#c25828');
      skyGradient.addColorStop(1, '#fba04b');
    } else {
      skyGradient.addColorStop(0, '#0f172a');
      skyGradient.addColorStop(0.5, '#ea580c');
      skyGradient.addColorStop(1, '#f59e0b');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height * 0.6);

    // Ocean / Coastal mountain ground
    const groundGradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
    groundGradient.addColorStop(0, activeVersion === 'v1' ? '#3b3f46' : '#171d27');
    groundGradient.addColorStop(1, activeVersion === 'v1' ? '#1f2227' : '#080c14');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height * 0.6, width, height * 0.4);

    // Mountain silhouettes in distance
    ctx.fillStyle = activeVersion === 'v1' ? '#33373e' : '#0f1522';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.6);
    ctx.lineTo(width * 0.25, height * 0.45);
    ctx.lineTo(width * 0.5, height * 0.6);
    ctx.lineTo(width * 0.75, height * 0.42);
    ctx.lineTo(width, height * 0.6);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Asphalt highway & perspective lines
    ctx.fillStyle = activeVersion === 'v1' ? '#2b2f36' : '#111622';
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.6);
    ctx.lineTo(width * 0.85, height * 0.6);
    ctx.lineTo(width * 1.15, height);
    ctx.lineTo(-width * 0.15, height);
    ctx.fill();

    // High-speed sports car
    ctx.save();
    ctx.translate(carX, carY);

    // Car shadow
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 120, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Car Body (Aerodynamic GT3 bodywork)
    ctx.fillStyle = activeVersion === 'v1' ? '#6b7280' : '#2563eb';
    ctx.beginPath();
    ctx.roundRect(-95, 0, 190, 32, [10, 24, 4, 8]);
    ctx.fill();

    // Cockpit / Glass
    ctx.fillStyle = '#0a0e17';
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(-24, -28);
    ctx.lineTo(38, -28);
    ctx.lineTo(65, 0);
    ctx.closePath();
    ctx.fill();

    // Racing wheels
    ctx.fillStyle = '#05070c';
    ctx.beginPath();
    ctx.arc(-60, 30, 19, 0, Math.PI * 2);
    ctx.arc(60, 30, 19, 0, Math.PI * 2);
    ctx.fill();

    // Ceramic brake calipers
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(-60, 30, 8, 0, Math.PI * 2);
    ctx.arc(60, 30, 8, 0, Math.PI * 2);
    ctx.fill();

    // Carbon rear spoiler
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-92, -18, 30, 6);
    ctx.fillRect(-82, -12, 4, 14);

    // Anamorphic headlight glare
    if (activeVersion !== 'v1') {
      const flare = ctx.createRadialGradient(90, 12, 0, 90, 12, 50);
      flare.addColorStop(0, 'rgba(255, 245, 210, 0.95)');
      flare.addColorStop(1, 'rgba(255, 180, 50, 0)');
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(90, 12, 50, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Grid overlays (Rule of Thirds + Safe Frame)
    if (showGridOverlay) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      // Thirds
      ctx.beginPath();
      ctx.moveTo(width / 3, 0);
      ctx.lineTo(width / 3, height);
      ctx.moveTo((width / 3) * 2, 0);
      ctx.lineTo((width / 3) * 2, height);
      ctx.moveTo(0, height / 3);
      ctx.lineTo(width, height / 3);
      ctx.moveTo(0, (height / 3) * 2);
      ctx.lineTo(width, (height / 3) * 2);
      ctx.stroke();

      // Safe Title 90% Box
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
    }

    // Split Screen wipe if active
    if (compareMode === 'split') {
      const splitX = (width * splitPosition) / 100;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();

      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(16, 16, 145, 26);
      ctx.fillRect(width - 165, 16, 150, 26);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText('v1 RAW LOG (Left)', 24, 33);
      ctx.fillStyle = '#34d399';
      ctx.fillText('v3 Rec.709 (Right)', width - 153, 33);
    }

    // Letterbox bars (2.39:1 Cinema Anamorphic format)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height * 0.08);
    ctx.fillRect(0, height * 0.92, width, height * 0.08);

    // Color Scopes Simulator (Waveform / Parade / Vectorscope)
    if (activeScope !== 'none') {
      drawScopeOverlay(ctx, activeScope, width, height);
    }

    // Drawing annotations
    if (activeOverlayAnnotation) {
      drawAnnotation(ctx, activeOverlayAnnotation, width, height);
    }
  };

  const drawScopeOverlay = (ctx: CanvasRenderingContext2D, scopeType: string, w: number, h: number) => {
    ctx.save();
    const scopeW = 260;
    const scopeH = 140;
    const scopeX = w - scopeW - 20;
    const scopeY = 24;

    ctx.fillStyle = 'rgba(5, 8, 15, 0.88)';
    ctx.fillRect(scopeX, scopeY, scopeW, scopeH);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.strokeRect(scopeX, scopeY, scopeW, scopeH);

    ctx.fillStyle = '#60a5fa';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`SCOPE: ${scopeType.toUpperCase()}`, scopeX + 8, scopeY + 14);

    if (scopeType === 'waveform') {
      // Draw luminous green luma waveform trace
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < scopeW - 16; x += 3) {
        const yVal = scopeY + 30 + (Math.sin((x + currentTime * 20) * 0.1) * 30 + Math.random() * 20 + 35);
        if (x === 0) ctx.moveTo(scopeX + 8 + x, yVal);
        else ctx.lineTo(scopeX + 8 + x, yVal);
      }
      ctx.stroke();
    } else if (scopeType === 'rgb_parade') {
      // Red, Green, Blue sub-panels
      const subW = (scopeW - 24) / 3;
      ['#ef4444', '#10b981', '#3b82f6'].forEach((color, idx) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        for (let x = 0; x < subW; x += 2) {
          const offX = scopeX + 8 + idx * (subW + 4) + x;
          const yVal = scopeY + 35 + (Math.cos((x + currentTime * 15) * 0.15) * 20 + Math.random() * 25 + 20);
          if (x === 0) ctx.moveTo(offX, yVal);
          else ctx.lineTo(offX, yVal);
        }
        ctx.stroke();
      });
    } else if (scopeType === 'vectorscope') {
      // Vectorscope radar circle
      const centerX = scopeX + scopeW / 2;
      const centerY = scopeY + scopeH / 2 + 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45, 0, Math.PI * 2);
      ctx.stroke();

      // Chroma trace cloud
      ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
      for (let i = 0; i < 35; i++) {
        const rad = Math.random() * 38;
        const ang = Math.random() * Math.PI * 2;
        ctx.fillRect(centerX + Math.cos(ang) * rad, centerY + Math.sin(ang) * rad, 1.5, 1.5);
      }
    }
    ctx.restore();
  };

  const drawAnnotation = (ctx: CanvasRenderingContext2D, ann: Annotation, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = ann.color || '#ef4444';
    ctx.fillStyle = ann.color || '#ef4444';
    ctx.lineWidth = 3;

    if (ann.type === 'rect' && ann.points && ann.points.length >= 2) {
      const p1 = ann.points[0];
      const p2 = ann.points[1];
      ctx.strokeRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
      if (ann.text) {
        ctx.font = '12px Plus Jakarta Sans';
        ctx.fillText(ann.text, p1.x, p1.y - 8);
      }
    } else if (ann.type === 'arrow' && ann.points && ann.points.length >= 2) {
      const from = ann.points[0];
      const to = ann.points[1];
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - 14 * Math.cos(angle - Math.PI / 6), to.y - 14 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(to.x - 14 * Math.cos(angle + Math.PI / 6), to.y - 14 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      if (ann.text) {
        ctx.font = '12px Plus Jakarta Sans';
        ctx.fillText(ann.text, to.x + 8, to.y - 8);
      }
    } else if (ann.type === 'circle' && ann.points && ann.points.length >= 2) {
      const p1 = ann.points[0];
      const p2 = ann.points[1];
      const radius = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (ann.type === 'pen' && ann.points && ann.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(ann.points[0].x, ann.points[0].y);
      for (let i = 1; i < ann.points.length; i++) {
        ctx.lineTo(ann.points[i].x, ann.points[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setIsPlaying(false);

    setCurrentDrawing({
      type: activeTool,
      points: [{ x, y }],
      color: drawColor
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'pen') {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        points: [...(prev.points || []), { x, y }]
      } : null);
    } else {
      setCurrentDrawing(prev => prev ? {
        ...prev,
        points: [prev.points![0], { x, y }]
      } : null);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleStepFrame = (deltaFrames: number) => {
    setIsPlaying(false);
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + deltaFrames / fps)));
  };

  const handleJumpToComment = (comment: FrameComment) => {
    setIsPlaying(false);
    setCurrentTime(comment.timestampSeconds);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment({
      assetId: currentAsset.id,
      timecode: secondsToSMPTE(currentTime, fps),
      timestampSeconds: currentTime,
      content: commentText.trim(),
      annotation: currentDrawing || undefined
    });

    setCommentText('');
    setCurrentDrawing(null);
    setActiveTool('none');
  };

  const handleSendReply = (commentId: string) => {
    const text = replyInputMap[commentId];
    if (!text || !text.trim()) return;
    onAddReply(commentId, text.trim());
    setReplyInputMap(prev => ({ ...prev, [commentId]: '' }));
  };

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Asset & Version Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
            <button onClick={() => onNavigate('projects')} className="hover:text-blue-400 transition-colors">
              Projects
            </button>
            <span>/</span>
            <span className="text-white font-semibold">{currentAsset.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display truncate">
              {currentAsset.name}
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/60 font-semibold shadow-xs">
              {currentAsset.codec}
            </span>
          </div>
        </div>

        {/* Action Controls & Review Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Asset Dropdown */}
          <select
            value={currentAsset.id}
            onChange={(e) => onSelectAsset(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {mediaFiles.map(f => (
              <option key={f.id} value={f.id}>{f.name} ({f.resolution})</option>
            ))}
          </select>

          {/* Color Scope Selector */}
          <select
            value={activeScope}
            onChange={(e) => setActiveScope(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="none">Scopes: Off</option>
            <option value="waveform">Waveform Monitor</option>
            <option value="rgb_parade">RGB Parade</option>
            <option value="vectorscope">Vectorscope</option>
          </select>

          {/* Grid Overlay Toggle */}
          <button
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              showGridOverlay ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 hover:text-white border-slate-700/80'
            }`}
            title="Toggle Rule of Thirds & Safe Framing"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Version Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            {(['v1', 'v2', 'v3'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveVersion(v)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  activeVersion === v ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {v === 'v1' ? 'v1 Log' : v === 'v2' ? 'v2 ACES' : 'v3 Rec709'}
              </button>
            ))}
          </div>

          {/* Compare Mode */}
          <button
            onClick={() => setCompareMode(compareMode === 'single' ? 'split' : 'single')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              compareMode === 'split'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>{compareMode === 'split' ? 'Exit Split' : 'Compare Wipe'}</span>
          </button>

          {/* Asset Review Status Selector */}
          <select
            value={reviewStatus}
            onChange={(e) => setReviewStatus(e.target.value as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${
              reviewStatus === 'APPROVED'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : reviewStatus === 'CHANGES_REQUESTED'
                ? 'bg-amber-950 text-amber-300 border-amber-700'
                : reviewStatus === 'REJECTED'
                ? 'bg-rose-950 text-rose-300 border-rose-700'
                : 'bg-blue-950 text-blue-300 border-blue-700'
            }`}
          >
            <option value="IN_REVIEW">● In Review</option>
            <option value="APPROVED">✓ Approved for Master</option>
            <option value="CHANGES_REQUESTED">⚠ Revision Requested</option>
            <option value="REJECTED">✕ Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Video Player Viewport & Scrubber */}
        <div className="xl:col-span-2 space-y-3">
          {/* Cinema Player Canvas Viewport */}
          <div 
            ref={videoContainerRef}
            className="relative w-full aspect-video rounded-2xl bg-black border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center group"
          >
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className={`w-full h-full object-contain ${
                activeTool !== 'none' ? 'cursor-crosshair' : 'cursor-default'
              }`}
            />

            {/* Split Screen interactive slider handle */}
            {compareMode === 'split' && (
              <input
                type="range"
                min="5"
                max="95"
                value={splitPosition}
                onChange={(e) => setSplitPosition(Number(e.target.value))}
                className="absolute inset-x-0 bottom-6 w-full opacity-75 hover:opacity-100 z-30 accent-cyan-400 cursor-ew-resize"
              />
            )}

            {/* Canvas Drawing HUD Indicator */}
            {activeTool !== 'none' && (
              <div className="absolute top-4 left-4 z-30 px-3.5 py-1.5 rounded-lg bg-black/85 border border-blue-500/80 text-xs text-blue-300 flex items-center gap-2 backdrop-blur-md shadow-xl">
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Annotation Mode: Click and drag on video canvas</span>
                <button
                  onClick={() => { setActiveTool('none'); setCurrentDrawing(null); }}
                  className="ml-2 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Timeline Scrubber & Integrated Audio VU Meter */}
          <div className="p-4 sm:p-5 rounded-2xl glass-panel space-y-3.5">
            {/* Audio Waveform Spectrum & VU Peak Meters */}
            <div className="flex items-center gap-3">
              {/* Stereo VU Levels (L/R) */}
              <div className="flex flex-col gap-1 w-16 shrink-0 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-1">
                  <span>L</span>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-75 ${vuLeft > 0.85 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${vuLeft * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span>R</span>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-75 ${vuRight > 0.85 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                      style={{ width: `${vuRight * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Waveform Visualization Bars */}
              <div className="h-6 flex-1 flex items-center gap-0.5 px-2 bg-slate-950/80 rounded-lg overflow-hidden border border-slate-800/80">
                {Array.from({ length: 72 }).map((_, i) => {
                  const heightPercent = 20 + Math.abs(Math.sin((i + 1) * 0.4) * 60) + (i % 4 === 0 ? 20 : 0);
                  const isPassed = (i / 72) <= (currentTime / duration);
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-xs transition-all duration-100 ${
                        isPassed ? 'bg-blue-500' : 'bg-slate-700/50'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Scrubber Bar */}
            <div className="relative w-full h-6 flex items-center cursor-pointer">
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(pos * duration);
                }}
                className="w-full bg-slate-800/80 h-2.5 rounded-full relative overflow-hidden"
              >
                <div 
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-full rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Comment Timeline Markers */}
              {assetComments.map(comment => {
                const markerPos = (comment.timestampSeconds / duration) * 100;
                return (
                  <button
                    key={comment.id}
                    onClick={() => handleJumpToComment(comment)}
                    style={{ left: `${markerPos}%` }}
                    className={`absolute -top-1 w-3.5 h-4.5 -translate-x-1/2 rounded-xs border transition-transform hover:scale-125 z-20 ${
                      comment.isResolved 
                        ? 'bg-emerald-500 border-emerald-300' 
                        : 'bg-amber-500 border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.9)]'
                    }`}
                    title={`${comment.timecode} — ${comment.author.name}: ${comment.content}`}
                  />
                );
              })}
            </div>

            {/* Transport Bar & SMPTE Digital Readout */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStepFrame(-1)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Step -1 Frame (Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
                  title="Play / Pause (Spacebar)"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => handleStepFrame(1)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Step +1 Frame (Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setIsPlaying(false); setCurrentTime(0); }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Return to Start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SMPTE Digital Timecode Readout with Luminescent Glow */}
              <div className="flex items-center gap-3 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 timecode-display">
                  {secondsToSMPTE(currentTime, fps)}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  @ {fps.toFixed(2)} fps
                </span>
              </div>

              {/* Speed & Volume */}
              <div className="flex items-center gap-2">
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value={0.25}>0.25x</option>
                  <option value={0.5}>0.5x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
                  <option value={4.0}>4.0x Shuttle</option>
                </select>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
                </button>
              </div>
            </div>

            {/* Visual Annotation Toolstrip */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold mr-1">Drawing Tools:</span>
                
                <button
                  onClick={() => setActiveTool(activeTool === 'rect' ? 'none' : 'rect')}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    activeTool === 'rect' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Rectangle Box"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'arrow' ? 'none' : 'arrow')}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    activeTool === 'arrow' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Arrow Callout"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTool(activeTool === 'pen' ? 'none' : 'pen')}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    activeTool === 'pen' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Freehand Pen"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color Palette */}
              <div className="flex items-center gap-1.5">
                {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ffffff'].map(color => (
                  <button
                    key={color}
                    onClick={() => setDrawColor(color)}
                    className="w-4 h-4 rounded-full transition-transform hover:scale-125 cursor-pointer"
                    style={{ backgroundColor: color, border: drawColor === color ? '2px solid white' : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Frame-Accurate Threaded Comments */}
        <div className="p-5 rounded-2xl glass-panel flex flex-col h-[750px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Review Comments ({assetComments.length})
              </h2>
              <p className="text-[11px] text-slate-400">Directly synchronized to SMPTE frames.</p>
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg text-[10px] font-semibold">
              {(['ALL', 'OPEN', 'RESOLVED'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterResolved(f)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    filterResolved === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Comments Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
            {displayedComments.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                No comments at this filter. Step through the timeline and add revision notes below.
              </div>
            ) : (
              displayedComments.map(comment => {
                const isSelected = Math.abs(comment.timestampSeconds - currentTime) < 0.2;
                return (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-500/10' 
                        : comment.isResolved
                        ? 'bg-slate-950/40 border-slate-800/40 opacity-75'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                          {comment.author.avatar}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-200">{comment.author.name}</span>
                          <span className="text-[10px] text-slate-400 block">{comment.author.role}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJumpToComment(comment)}
                        className="font-mono text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-900/30 hover:bg-blue-900/50 px-2 py-0.5 rounded border border-blue-800/60 transition-colors"
                        title="Jump to frame"
                      >
                        {comment.timecode}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {comment.content}
                    </p>

                    {comment.annotation && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                        <Edit3 className="w-3 h-3 text-rose-400" />
                        <span>Visual Annotation on Frame</span>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pl-3 border-l-2 border-slate-800 space-y-2">
                        {comment.replies.map(rep => (
                          <div key={rep.id} className="text-[11px]">
                            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                              <span>{rep.author.name}</span>
                              <span className="text-[9px] text-slate-500 font-mono">{formatRelativeTime(rep.createdAt)}</span>
                            </div>
                            <p className="text-slate-400 mt-0.5">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <button
                        onClick={() => onToggleResolveComment(comment.id)}
                        className={`flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                          comment.isResolved ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{comment.isResolved ? 'Resolved' : 'Mark Resolved'}</span>
                      </button>

                      <div className="flex items-center gap-1 flex-1 max-w-[180px] ml-2">
                        <input
                          type="text"
                          placeholder="Reply..."
                          value={replyInputMap[comment.id] || ''}
                          onChange={(e) => setReplyInputMap({ ...replyInputMap, [comment.id]: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendReply(comment.id); }}}
                          className="w-full px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-200 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleSendReply(comment.id)}
                          className="p-1 hover:text-blue-400 text-slate-400 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* New Comment Input Box */}
          <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Timecode Stamp:</span>
              <span className="text-emerald-400 font-bold">{secondsToSMPTE(currentTime, fps)}</span>
            </div>

            <textarea
              rows={2}
              placeholder="Type revision notes or color grade direction at this frame..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTool(activeTool === 'arrow' ? 'none' : 'arrow')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                  activeTool !== 'none' ? 'bg-blue-900/60 text-blue-300 border border-blue-700' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>{currentDrawing ? 'Drawing attached' : 'Draw on Frame'}</span>
              </button>

              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
