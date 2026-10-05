import React, { useState, useEffect } from 'react';
import { 
  ViewMode, 
  UserProfile, 
  Project, 
  MediaFile, 
  Transfer, 
  FrameComment, 
  NotificationItem, 
  Annotation,
  UserRole
} from './types';
import { Header } from './components/layout/Header';
import { LandingView } from './components/features/landing/LandingView';
import { DashboardView } from './components/features/dashboard/DashboardView';
import { ProjectsView } from './components/features/projects/ProjectsView';
import { ProjectDetailView } from './components/features/projects/ProjectDetailView';
import { UploadEngineView } from './components/features/upload/UploadEngineView';
import { TransfersView } from './components/features/transfers/TransfersView';
import { MediaReviewSuite } from './components/features/review/MediaReviewSuite';
import { TeamManagementView } from './components/features/team/TeamManagementView';
import { SettingsView } from './components/features/settings/SettingsView';
import { ProfileView } from './components/features/profile/ProfileView';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { VerifyEmailPrompt } from './components/auth/VerifyEmailPrompt';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { NewProjectModal } from './components/features/projects/NewProjectModal';
import { NewTransferWizardModal } from './components/features/transfers/NewTransferWizardModal';
import { PublicTransferDownloadView } from './components/features/transfers/PublicTransferDownloadView';
import { CommandPalette } from './components/shared/CommandPalette';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-02');
  const [activeAssetId, setActiveAssetId] = useState<string>('med-02');
  const [activePublicShareLink, setActivePublicShareLink] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string>('elena.rostova@studio.com');

  // Modals & Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState<boolean>(false);
  const [transferModalInitialAssetIds, setTransferModalInitialAssetIds] = useState<string[]>([]);
  const [uploadPreselectedFolder, setUploadPreselectedFolder] = useState<string>('Dailies');

  // User profile & Auth state
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-main',
    name: 'Elena Rostova',
    firstName: 'Elena',
    lastName: 'Rostova',
    displayName: 'Elena Rostova',
    email: 'elena.rostova@studio.com',
    role: 'admin',
    avatar: 'ER',
    teamName: 'Apex CinePost Global',
    plan: 'STUDIO_ENTERPRISE',
    status: 'active',
    timezone: 'Europe/Berlin (CET)',
    locale: 'en-US',
    company: 'Legendary Post Productions',
    jobTitle: 'Supervising Colorist & Technical Director',
    bio: 'Specializing in ACEScg color conform workflows and high-speed multi-gigabyte camera card offloads.'
  });

  const storageLimit = 10000000000000; // 10 TB

  // State arrays initialized with rich cinema data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-01',
      name: 'Dune: Awakening — Commercial Campaign',
      client: 'Legendary Pictures / Warner',
      description: '4K Anamorphic Arri RAW turn-overs, VFX plates and sound mix review.',
      status: 'ACTIVE',
      storageUsed: 1420000000000,
      assetCount: 18,
      color: '#3b82f6',
      createdAt: '2026-09-15T08:00:00Z',
      updatedAt: '2026-10-04T18:30:00Z',
      folders: ['Dailies_Day01', 'Dailies_Day02', 'VFX_Passes', 'Color_Grades', 'Sound_Mix_5.1']
    },
    {
      id: 'proj-02',
      name: 'Porsche 911 GT3 — European Launch Film',
      client: 'Porsche AG / Anton Media',
      description: 'High-speed track footage shot in 8K REDCODE RAW with HDR grade.',
      status: 'IN_REVIEW',
      storageUsed: 2890000000000,
      assetCount: 34,
      color: '#10b981',
      createdAt: '2026-09-20T10:00:00Z',
      updatedAt: '2026-10-05T01:15:00Z',
      folders: ['Camera_A_Rushes', 'Camera_B_Helicopter', 'Master_Edits', 'Final_Deliverables']
    },
    {
      id: 'proj-03',
      name: 'Apex Robotics — Product Teaser Keynote',
      client: 'Apex Industrial Inc.',
      description: '3D CGI render passes, UI overlays, and 60fps ProRes 4444 master.',
      status: 'ACTIVE',
      storageUsed: 620000000000,
      assetCount: 12,
      color: '#8b5cf6',
      createdAt: '2026-09-28T14:20:00Z',
      updatedAt: '2026-10-04T22:10:00Z',
      folders: ['Render_Passes_EXR', 'Edit_Versions', 'Audio_Stems']
    },
    {
      id: 'proj-04',
      name: 'Horizon Zero — Episode 3 Post & Color',
      client: 'Netflix Original Series',
      description: 'ACEScg workflow color conform and Dolby Vision mastering package.',
      status: 'DELIVERED',
      storageUsed: 4100000000000,
      assetCount: 52,
      color: '#f59e0b',
      createdAt: '2026-08-10T09:00:00Z',
      updatedAt: '2026-09-30T11:00:00Z',
      folders: ['ACES_Renders', 'Dolby_Vision_XML', 'Archived_Deliverables']
    }
  ]);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: 'med-01',
      name: 'A004_C012_0928QT_001.mov',
      projectId: 'proj-02',
      folderPath: 'Camera_A_Rushes',
      size: 28400000000,
      mimeType: 'video/quicktime',
      duration: 84.5,
      resolution: '3840x2160 (4K UHD)',
      fps: 24.0,
      codec: 'Apple ProRes 4444 XQ',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'READY',
      version: 1,
      uploadedAt: '2026-10-04T12:00:00Z',
      uploadedBy: 'Marcus Vance'
    },
    {
      id: 'med-02',
      name: 'Porsche_GT3_Launch_Master_v03_Rec709.mp4',
      projectId: 'proj-02',
      folderPath: 'Master_Edits',
      size: 8900000000,
      mimeType: 'video/mp4',
      duration: 128.0,
      resolution: '3840x2160 (4K UHD)',
      fps: 24.0,
      codec: 'H.265 / HEVC 10-bit',
      checksum: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      status: 'READY',
      version: 3,
      uploadedAt: '2026-10-04T20:15:00Z',
      uploadedBy: 'Elena Rostova'
    },
    {
      id: 'med-03',
      name: 'Dune_Campaign_Teaser_VFX_Turnover_v02.mov',
      projectId: 'proj-01',
      folderPath: 'VFX_Passes',
      size: 19400000000,
      mimeType: 'video/quicktime',
      duration: 62.0,
      resolution: '4096x2160 (4K DCI)',
      fps: 24.0,
      codec: 'Apple ProRes 422 HQ',
      checksum: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      status: 'READY',
      version: 2,
      uploadedAt: '2026-10-03T16:40:00Z',
      uploadedBy: 'Elena Rostova'
    },
    {
      id: 'med-04',
      name: 'Apex_Keynote_Audio_5.1_Master_Mix.wav',
      projectId: 'proj-03',
      folderPath: 'Audio_Stems',
      size: 3200000000,
      mimeType: 'audio/wav',
      duration: 180.0,
      resolution: '24-bit / 48kHz (6 Channels)',
      fps: 24.0,
      codec: 'Linear PCM Uncompressed',
      checksum: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
      status: 'READY',
      version: 1,
      uploadedAt: '2026-10-04T10:12:00Z',
      uploadedBy: 'Kai Sorensen'
    }
  ]);

  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: 'tr-9842',
      title: 'Porsche 911 GT3 — High-Res Dailies Package',
      shareLink: 'porsche-gt3-dailies-2026',
      projectId: 'proj-02',
      fileIds: ['med-01', 'med-02'],
      totalSize: 37300000000,
      transferredSize: 24800000000,
      speed: 345000000,
      progress: 66.5,
      status: 'IN_PROGRESS',
      expiresAt: '2026-10-12T23:59:59Z',
      maxDownloads: 10,
      downloadCount: 3,
      recipients: ['client.review@porsche.de', 'post.supervisor@antonmedia.com'],
      senderEmail: 'viswafc29@gmail.com',
      createdAt: '2026-10-05T01:30:00Z',
      message: 'Please review the 4K color conform and check high-speed turn footage on frame 412.'
    },
    {
      id: 'tr-8210',
      title: 'Dune Commercial — VFX Turnover Pack B',
      shareLink: 'dune-vfx-pack-b-rqa',
      projectId: 'proj-01',
      fileIds: ['med-03'],
      totalSize: 19400000000,
      transferredSize: 19400000000,
      speed: 0,
      progress: 100,
      status: 'COMPLETED',
      expiresAt: '2026-10-19T23:59:59Z',
      maxDownloads: 25,
      downloadCount: 14,
      recipients: ['vfx.lead@framestore.com', 'director@legendary.com'],
      senderEmail: 'viswafc29@gmail.com',
      createdAt: '2026-10-04T14:00:00Z',
      message: 'Passes include Sandstorm FX layers and lighting passes with EXR depth maps.'
    },
    {
      id: 'tr-7104',
      title: 'Apex Keynote 3D Audio Stems Release',
      shareLink: 'apex-keynote-audio-master',
      projectId: 'proj-03',
      fileIds: ['med-04'],
      totalSize: 3200000000,
      transferredSize: 3200000000,
      speed: 0,
      progress: 100,
      status: 'COMPLETED',
      expiresAt: '2026-10-15T00:00:00Z',
      maxDownloads: 5,
      downloadCount: 5,
      recipients: ['sound@skywalker.com'],
      senderEmail: 'viswafc29@gmail.com',
      createdAt: '2026-10-03T18:00:00Z',
      message: 'Clean uncompressed 5.1 stems ready for Dolby Atmos theatrical mix.'
    }
  ]);

  const [comments, setComments] = useState<FrameComment[]>([
    {
      id: 'comm-101',
      assetId: 'med-02',
      author: {
        name: 'Elena Rostova',
        avatar: 'ER',
        role: 'Supervising Colorist'
      },
      timecode: '00:00:14:18',
      timestampSeconds: 14.75,
      content: 'The specular highlight on the rear carbon-fiber wing is clipping by 3 IRE in Rec.709. Pull down the luminance curve in Node 4.',
      isResolved: false,
      createdAt: '2026-10-04T22:30:00Z',
      annotation: {
        type: 'rect',
        points: [{ x: 420, y: 180 }, { x: 680, y: 310 }],
        color: '#ef4444',
        text: 'Pull down highlights -3 IRE'
      },
      replies: [
        {
          id: 'rep-01',
          author: { name: 'Marcus Vance', avatar: 'MV', role: 'Lead Editor' },
          content: 'Adjusted in Baselight grade v04 pass. Re-exporting now.',
          createdAt: '2026-10-04T23:10:00Z'
        }
      ]
    },
    {
      id: 'comm-102',
      assetId: 'med-02',
      author: {
        name: 'Kai Sorensen',
        avatar: 'KS',
        role: 'Audio Director'
      },
      timecode: '00:00:48:06',
      timestampSeconds: 48.25,
      content: 'Downshift audio transient hits early by 2 frames relative to the paddle flick animation.',
      isResolved: true,
      createdAt: '2026-10-04T21:15:00Z',
      annotation: {
        type: 'arrow',
        points: [{ x: 300, y: 400 }, { x: 480, y: 320 }],
        color: '#3b82f6',
        text: 'Align engine downshift'
      }
    },
    {
      id: 'comm-103',
      assetId: 'med-02',
      author: {
        name: 'Sara Lindqvist',
        avatar: 'SL',
        role: 'Executive Producer'
      },
      timecode: '00:01:12:00',
      timestampSeconds: 72.0,
      content: 'Client loves this tracking shot! Ensure the typography fade-in is timed exactly as the vehicle enters the bridge shadow.',
      isResolved: false,
      createdAt: '2026-10-05T00:45:00Z'
    }
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-01',
      type: 'FRAME_COMMENT',
      title: 'New Grade Note from Elena Rostova',
      message: 'Frame 00:00:14:18 — Highlight clipping on rear carbon-fiber wing.',
      timestamp: '15m ago',
      read: false
    },
    {
      id: 'notif-02',
      type: 'TRANSFER_COMPLETE',
      title: 'VFX Pack B Transfer Downloaded',
      message: 'Framestore VFX team completed downloading Dune turnover package.',
      timestamp: '2h ago',
      read: false
    },
    {
      id: 'notif-03',
      type: 'NEW_ASSET',
      title: 'High-Speed Camera Card Ingested',
      message: '28.4 GB Apple ProRes 4444 XQ offload verified in Porsche project.',
      timestamp: '4h ago',
      read: true
    }
  ]);

  // Compute total storage used across all files
  const totalStorageUsed = mediaFiles.reduce((sum, f) => sum + f.size, 0) + 4200000000000;

  // Handle URL hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#share/')) {
        const shareLink = hash.replace('#share/', '');
        setActivePublicShareLink(shareLink);
        setCurrentView('share-view');
      } else if (hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#signup') {
        setCurrentView('signup');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handlers
  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-detail');
  };

  const handleSelectAssetForReview = (id: string) => {
    setActiveAssetId(id);
    setCurrentView('review');
  };

  const handleCreateProject = (data: {
    name: string;
    client: string;
    description: string;
    color: string;
    folders: string[];
  }) => {
    const newProj: Project = {
      id: `proj-${Date.now().toString(36)}`,
      name: data.name,
      client: data.client,
      description: data.description,
      status: 'ACTIVE',
      storageUsed: 0,
      assetCount: 0,
      color: data.color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folders: data.folders
    };
    setProjects([newProj, ...projects]);
    setSelectedProjectId(newProj.id);
    setCurrentView('project-detail');
  };

  const handleCreateTransfer = (data: {
    title: string;
    projectId: string;
    fileIds: string[];
    recipients: string[];
    message: string;
    password?: string;
    maxDownloads: number;
    expiryDays: number;
  }) => {
    const selectedFiles = mediaFiles.filter(f => data.fileIds.includes(f.id));
    const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0) || 12000000000;
    const linkSlug = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24) + '-' + Math.random().toString(36).substring(2, 6);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + data.expiryDays);

    const newTransfer: Transfer = {
      id: `tr-${Date.now().toString(36)}`,
      title: data.title,
      shareLink: linkSlug,
      projectId: data.projectId,
      fileIds: data.fileIds,
      totalSize,
      transferredSize: 0,
      speed: 390000000,
      progress: 0,
      status: 'IN_PROGRESS',
      password: data.password,
      expiresAt: expiryDate.toISOString(),
      maxDownloads: data.maxDownloads,
      downloadCount: 0,
      recipients: data.recipients,
      senderEmail: user.email,
      createdAt: new Date().toISOString(),
      message: data.message
    };

    setTransfers([newTransfer, ...transfers]);
    setCurrentView('transfers');
  };

  const handleUploadCompleted = (assetData: {
    name: string;
    size: number;
    mimeType: string;
    projectId: string;
    folderPath: string;
    checksum: string;
  }) => {
    const newAsset: MediaFile = {
      id: `med-${Date.now().toString(36)}`,
      name: assetData.name,
      projectId: assetData.projectId,
      folderPath: assetData.folderPath,
      size: assetData.size,
      mimeType: assetData.mimeType,
      duration: 90.0,
      resolution: '3840x2160 (4K UHD)',
      fps: 24.0,
      codec: 'Apple ProRes 4444 XQ',
      checksum: assetData.checksum,
      status: 'READY',
      version: 1,
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.name
    };

    setMediaFiles(prev => [newAsset, ...prev]);

    setProjects(prev => prev.map(p => {
      if (p.id === assetData.projectId) {
        return {
          ...p,
          storageUsed: p.storageUsed + assetData.size,
          assetCount: p.assetCount + 1,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        type: 'NEW_ASSET',
        title: 'New Footage Ingest Complete',
        message: `${assetData.name} verified and ready for frame review.`,
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const handleAddComment = (data: {
    assetId: string;
    timecode: string;
    timestampSeconds: number;
    content: string;
    annotation?: Annotation;
  }) => {
    const newComment: FrameComment = {
      id: `comm-${Date.now().toString(36)}`,
      assetId: data.assetId,
      author: {
        name: user.name,
        avatar: user.avatar,
        role: user.role
      },
      timecode: data.timecode,
      timestampSeconds: data.timestampSeconds,
      content: data.content,
      isResolved: false,
      createdAt: new Date().toISOString(),
      annotation: data.annotation,
      replies: []
    };
    setComments([newComment, ...comments]);
  };

  const handleToggleResolveComment = (commentId: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        return { ...c, isResolved: !c.isResolved };
      }
      return c;
    }));
  };

  const handleAddReply = (commentId: string, content: string) => {
    setComments(comments.map(c => {
      if (c.id === commentId) {
        const reply = {
          id: `rep-${Date.now().toString(36)}`,
          author: { name: user.name, avatar: user.avatar, role: user.role },
          content,
          createdAt: new Date().toISOString()
        };
        return {
          ...c,
          replies: [...(c.replies || []), reply]
        };
      }
      return c;
    }));
  };

  const handleDeleteAsset = (assetId: string) => {
    setMediaFiles(mediaFiles.filter(m => m.id !== assetId));
  };

  const handleCancelTransfer = (transferId: string) => {
    setTransfers(transfers.filter(t => t.id !== transferId));
  };

  // Auth Handlers
  const handleLoginSuccess = (userData: { name: string; email: string; role: UserRole; avatar: string }) => {
    setUser({
      ...user,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar,
      firstName: userData.name.split(' ')[0],
      lastName: userData.name.split(' ')[1] || '',
      status: 'active'
    });
    setCurrentView('dashboard');
  };

  const handleSignupSuccess = (email: string) => {
    setVerificationEmail(email);
    setCurrentView('verify-email');
  };

  const handleVerificationComplete = () => {
    setUser(prev => ({ ...prev, status: 'active' }));
    setCurrentView('dashboard');
  };

  // Auth Pages Rendering
  if (currentView === 'login') {
    return (
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onNavigate={setCurrentView}
      />
    );
  }

  if (currentView === 'signup') {
    return (
      <SignupForm
        onSignupSuccess={handleSignupSuccess}
        onNavigate={setCurrentView}
      />
    );
  }

  if (currentView === 'verify-email') {
    return (
      <VerifyEmailPrompt
        email={verificationEmail}
        onVerificationComplete={handleVerificationComplete}
        onNavigate={setCurrentView}
      />
    );
  }

  if (currentView === 'forgot-password') {
    return (
      <ForgotPasswordForm
        onRequestReset={(email) => setVerificationEmail(email)}
        onNavigate={setCurrentView}
      />
    );
  }

  if (currentView === 'reset-password') {
    return (
      <ResetPasswordForm
        onPasswordResetComplete={() => setCurrentView('login')}
        onNavigate={setCurrentView}
      />
    );
  }

  // If in public share link download view
  if (currentView === 'share-view') {
    const targetTransfer = transfers.find(t => t.shareLink === activePublicShareLink) || transfers[0];
    const targetAssets = mediaFiles.filter(m => targetTransfer.fileIds.includes(m.id));

    return (
      <PublicTransferDownloadView
        transfer={targetTransfer}
        assets={targetAssets}
        onBackToWorkspace={() => {
          window.location.hash = '';
          setCurrentView('transfers');
        }}
        onNavigate={(v) => {
          window.location.hash = '';
          setCurrentView(v);
        }}
      />
    );
  }

  // If in Landing page
  if (currentView === 'landing') {
    return (
      <LandingView
        onEnterWorkspace={() => setCurrentView('dashboard')}
        onNavigate={(v) => setCurrentView(v)}
      />
    );
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const projectAssets = mediaFiles.filter(m => m.projectId === selectedProject?.id);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        notifications={notifications}
        onMarkNotificationRead={(id) => {
          setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        }}
        onOpenUpload={() => setCurrentView('upload')}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        storageUsed={totalStorageUsed}
        storageLimit={storageLimit}
      />

      {/* Main Viewport */}
      <main className="flex-1 pb-16">
        {currentView === 'dashboard' && (
          <DashboardView
            projects={projects}
            transfers={transfers}
            mediaFiles={mediaFiles}
            storageUsed={totalStorageUsed}
            storageLimit={storageLimit}
            onNavigate={setCurrentView}
            onSelectProject={handleSelectProject}
            onSelectAssetForReview={handleSelectAssetForReview}
            onOpenUpload={() => setCurrentView('upload')}
            onOpenNewTransfer={() => setIsNewTransferModalOpen(true)}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsView
            projects={projects}
            onSelectProject={handleSelectProject}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'project-detail' && selectedProject && (
          <ProjectDetailView
            project={selectedProject}
            assets={projectAssets}
            onBackToProjects={() => setCurrentView('projects')}
            onSelectAssetForReview={handleSelectAssetForReview}
            onOpenUploadForProject={(projId, folder) => {
              setSelectedProjectId(projId);
              setUploadPreselectedFolder(folder);
              setCurrentView('upload');
            }}
            onCreateTransferFromAssets={(fileIds, projId) => {
              setTransferModalInitialAssetIds(fileIds);
              setSelectedProjectId(projId);
              setIsNewTransferModalOpen(true);
            }}
            onDeleteAsset={handleDeleteAsset}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'upload' && (
          <UploadEngineView
            projects={projects}
            preselectedProjectId={selectedProjectId}
            preselectedFolder={uploadPreselectedFolder}
            onUploadCompleted={handleUploadCompleted}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'transfers' && (
          <TransfersView
            transfers={transfers}
            mediaFiles={mediaFiles}
            projects={projects}
            onOpenNewTransfer={() => {
              setTransferModalInitialAssetIds([]);
              setIsNewTransferModalOpen(true);
            }}
            onOpenPublicShare={(link) => {
              setActivePublicShareLink(link);
              window.location.hash = `share/${link}`;
              setCurrentView('share-view');
            }}
            onCancelTransfer={handleCancelTransfer}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'review' && (
          <MediaReviewSuite
            mediaFiles={mediaFiles}
            activeAssetId={activeAssetId}
            comments={comments}
            projects={projects}
            onSelectAsset={(id) => setActiveAssetId(id)}
            onAddComment={handleAddComment}
            onToggleResolveComment={handleToggleResolveComment}
            onAddReply={handleAddReply}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'team' && (
          <TeamManagementView
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            user={user}
            onUpdateProfile={(updated) => setUser({ ...user, ...updated })}
            onNavigate={setCurrentView}
            onSignOut={() => setCurrentView('login')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            user={user}
            storageUsed={totalStorageUsed}
            storageLimit={storageLimit}
            onUpdateUser={(updated) => setUser({ ...user, ...updated })}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* New Transfer Wizard Modal */}
      <NewTransferWizardModal
        isOpen={isNewTransferModalOpen}
        onClose={() => {
          setIsNewTransferModalOpen(false);
          setTransferModalInitialAssetIds([]);
        }}
        projects={projects}
        mediaFiles={mediaFiles}
        initialSelectedAssetIds={transferModalInitialAssetIds}
        initialProjectId={selectedProjectId}
        onCreateTransfer={handleCreateTransfer}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        projects={projects}
        mediaFiles={mediaFiles}
        transfers={transfers}
        onNavigate={setCurrentView}
        onSelectProject={handleSelectProject}
        onSelectAssetForReview={handleSelectAssetForReview}
        onOpenUpload={() => setCurrentView('upload')}
        onOpenNewTransfer={() => setIsNewTransferModalOpen(true)}
      />
    </div>
  );
}
