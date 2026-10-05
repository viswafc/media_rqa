export type ViewMode = 
  | 'landing' 
  | 'dashboard' 
  | 'projects' 
  | 'project-detail' 
  | 'upload' 
  | 'transfers' 
  | 'review' 
  | 'team' 
  | 'settings' 
  | 'share-view'
  | 'login'
  | 'signup'
  | 'verify-email'
  | 'forgot-password'
  | 'reset-password'
  | 'profile';

export type UserRole = 'admin' | 'editor' | 'reviewer' | 'client';
export type UserStatus = 'active' | 'suspended' | 'deactivated' | 'pending_verification';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'COLORIST' | 'EDITOR' | 'VFX_LEAD' | 'VIEWER' | 'admin' | 'editor' | 'reviewer' | 'client';
  avatar: string;
  avatarUrl?: string;
  teamName: string;
  plan: 'STUDIO_ENTERPRISE' | 'PRO' | 'TEAM';
  firstName?: string;
  lastName?: string;
  displayName?: string;
  status?: UserStatus;
  timezone?: string;
  locale?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  projectId: string;
  folderPath: string;
  size: number;
  mimeType: string;
  duration?: number;
  resolution?: string;
  fps?: number;
  codec?: string;
  checksum: string;
  status: 'READY' | 'PROCESSING' | 'UPLOADING' | 'ERROR';
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  status: 'ACTIVE' | 'IN_REVIEW' | 'DELIVERED' | 'ARCHIVED';
  storageUsed: number;
  assetCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
  folders: string[];
}

export interface Transfer {
  id: string;
  title: string;
  shareLink: string;
  projectId: string;
  fileIds: string[];
  totalSize: number;
  transferredSize: number;
  speed: number;
  progress: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  password?: string;
  expiresAt: string;
  maxDownloads: number;
  downloadCount: number;
  recipients: string[];
  senderEmail: string;
  createdAt: string;
  message?: string;
}

export interface Annotation {
  type: 'arrow' | 'rect' | 'circle' | 'pen' | 'text';
  points?: Array<{ x: number; y: number }>;
  color: string;
  text?: string;
}

export interface FrameComment {
  id: string;
  assetId: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  timecode: string;
  timestampSeconds: number;
  content: string;
  isResolved: boolean;
  createdAt: string;
  replies?: Array<{
    id: string;
    author: { name: string; avatar: string; role: string };
    content: string;
    createdAt: string;
  }>;
  annotation?: Annotation;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'COLORIST' | 'EDITOR' | 'VFX_ARTIST' | 'CLIENT_REVIEWER';
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  joinedAt: string;
  avatar: string;
  storageQuota: string;
}

export interface NotificationItem {
  id: string;
  type: 'TRANSFER_COMPLETE' | 'FRAME_COMMENT' | 'NEW_ASSET' | 'TEAM_INVITE';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkId?: string;
}

export interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  speedMBs: number;
  chunksUploaded: number;
  totalChunks: number;
  status: 'QUEUED' | 'UPLOADING' | 'PAUSED' | 'COMPLETED' | 'ERROR';
  projectId: string;
  folderPath: string;
  checksum?: string;
}
