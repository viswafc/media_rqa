import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Database for MEDIA RQA
interface MediaFile {
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
  status: 'READY' | 'PROCESSING' | 'UPLOADING';
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

interface Project {
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

interface Transfer {
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

interface FrameComment {
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
  annotation?: {
    type: 'arrow' | 'rect' | 'circle' | 'pen' | 'text';
    points?: Array<{ x: number; y: number }>;
    color: string;
    text?: string;
  };
}

// Initial In-Memory Seed State
let projects: Project[] = [
  {
    id: 'proj-01',
    name: 'Dune: Awakening — Commercial Campaign',
    client: 'Legendary Pictures / Warner',
    description: '4K Anamorphic Arri RAW turn-overs, VFX plates and sound mix review.',
    status: 'ACTIVE',
    storageUsed: 1420000000000, // 1.42 TB
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
    storageUsed: 2890000000000, // 2.89 TB
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
    storageUsed: 620000000000, // 620 GB
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
    storageUsed: 4100000000000, // 4.1 TB
    assetCount: 52,
    color: '#f59e0b',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-09-30T11:00:00Z',
    folders: ['ACES_Renders', 'Dolby_Vision_XML', 'Archived_Deliverables']
  }
];

let mediaFiles: MediaFile[] = [
  {
    id: 'med-01',
    name: 'A004_C012_0928QT_001.mov',
    projectId: 'proj-02',
    folderPath: 'Camera_A_Rushes',
    size: 28400000000, // 28.4 GB
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
    size: 8900000000, // 8.9 GB
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
    size: 19400000000, // 19.4 GB
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
    size: 3200000000, // 3.2 GB
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
];

let transfers: Transfer[] = [
  {
    id: 'tr-9842',
    title: 'Porsche 911 GT3 — High-Res Dailies Package',
    shareLink: 'porsche-gt3-dailies-2026',
    projectId: 'proj-02',
    fileIds: ['med-01', 'med-02'],
    totalSize: 37300000000, // 37.3 GB
    transferredSize: 24800000000, // 24.8 GB
    speed: 345000000, // 345 MB/s
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
];

let comments: FrameComment[] = [
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
];

let activeUploads: Record<string, any> = {};

// ================= API ROUTES (prefix: /api/v1) =================

// Health check
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'ONLINE',
    service: 'MEDIA RQA Accelerated Media Transfer Engine',
    version: '4.2.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Projects Endpoints
app.get('/api/v1/projects', (req: Request, res: Response) => {
  const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
  const status = typeof req.query.status === 'string' ? req.query.status : '';

  let filtered = [...projects];
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.client.toLowerCase().includes(search));
  }
  if (status && status !== 'ALL') {
    filtered = filtered.filter(p => p.status === status);
  }

  res.json({ success: true, data: filtered });
});

app.post('/api/v1/projects', (req: Request, res: Response) => {
  const { name, client, description, color, folders } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Project name is required.' });
  }

  const newProject: Project = {
    id: `proj-${Date.now().toString(36)}`,
    name,
    client: client || 'Internal Production',
    description: description || 'High-speed media asset workspace.',
    status: 'ACTIVE',
    storageUsed: 0,
    assetCount: 0,
    color: color || '#3b82f6',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folders: folders && Array.isArray(folders) ? folders : ['Dailies', 'Edits', 'VFX', 'Audio']
  };

  projects.unshift(newProject);
  res.status(201).json({ success: true, data: newProject });
});

app.get('/api/v1/projects/:id', (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  const assets = mediaFiles.filter(m => m.projectId === project.id);
  res.json({ success: true, data: { ...project, assets } });
});

app.get('/api/v1/projects/:id/assets', (req: Request, res: Response) => {
  const folder = typeof req.query.folder === 'string' ? req.query.folder : '';
  let assets = mediaFiles.filter(m => m.projectId === req.params.id);
  if (folder) {
    assets = assets.filter(m => m.folderPath === folder);
  }
  res.json({ success: true, data: assets });
});

// Transfers Endpoints
app.get('/api/v1/transfers', (req: Request, res: Response) => {
  res.json({ success: true, data: transfers });
});

app.post('/api/v1/transfers', (req: Request, res: Response) => {
  const { title, projectId, fileIds, recipients, message, password, maxDownloads, expiryDays } = req.body;

  if (!title || !fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    return res.status(400).json({ success: false, error: 'Title and at least one asset are required' });
  }

  const selectedFiles = mediaFiles.filter(f => fileIds.includes(f.id));
  const totalSize = selectedFiles.reduce((acc, f) => acc + f.size, 0) || 12000000000;
  const linkId = title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 32) + '-' + Math.random().toString(36).substring(2, 7);

  const days = Number(expiryDays) || 7;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + days);

  const newTransfer: Transfer = {
    id: `tr-${Date.now().toString(36)}`,
    title,
    shareLink: linkId,
    projectId: projectId || 'proj-01',
    fileIds,
    totalSize,
    transferredSize: 0,
    speed: 380000000, // 380 MB/s simulated accelerated initial speed
    progress: 0,
    status: 'IN_PROGRESS',
    password: password || undefined,
    expiresAt: expiryDate.toISOString(),
    maxDownloads: Number(maxDownloads) || 20,
    downloadCount: 0,
    recipients: recipients || [],
    senderEmail: 'viswafc29@gmail.com',
    createdAt: new Date().toISOString(),
    message: message || ''
  };

  transfers.unshift(newTransfer);
  res.status(201).json({ success: true, data: newTransfer });
});

app.get('/api/v1/transfers/:id', (req: Request, res: Response) => {
  const transfer = transfers.find(t => t.id === req.params.id || t.shareLink === req.params.id);
  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Transfer not found' });
  }

  const files = mediaFiles.filter(f => transfer.fileIds.includes(f.id));
  res.json({ success: true, data: { ...transfer, files } });
});

// Public Share Download Verification
app.get('/api/v1/transfers/share/:shareLink', (req: Request, res: Response) => {
  const transfer = transfers.find(t => t.shareLink === req.params.shareLink);
  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Share link invalid or expired' });
  }

  const files = mediaFiles.filter(f => transfer.fileIds.includes(f.id));
  const isProtected = Boolean(transfer.password);

  res.json({
    success: true,
    data: {
      id: transfer.id,
      title: transfer.title,
      shareLink: transfer.shareLink,
      totalSize: transfer.totalSize,
      expiresAt: transfer.expiresAt,
      isProtected,
      fileCount: files.length,
      downloadCount: transfer.downloadCount,
      maxDownloads: transfer.maxDownloads,
      senderEmail: transfer.senderEmail,
      message: transfer.message,
      files: files.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        mimeType: f.mimeType,
        checksum: f.checksum,
        resolution: f.resolution,
        duration: f.duration,
        codec: f.codec
      }))
    }
  });
});

app.post('/api/v1/transfers/share/:shareLink/download', (req: Request, res: Response) => {
  const { password } = req.body;
  const transfer = transfers.find(t => t.shareLink === req.params.shareLink);
  if (!transfer) {
    return res.status(404).json({ success: false, error: 'Transfer not found' });
  }

  if (transfer.password && transfer.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid transfer password' });
  }

  if (transfer.downloadCount >= transfer.maxDownloads) {
    return res.status(403).json({ success: false, error: 'Transfer download limit reached' });
  }

  transfer.downloadCount += 1;
  res.json({
    success: true,
    message: 'Download authorized. Streaming media payload.',
    data: {
      downloadToken: `dl-${Date.now()}`,
      speedMbps: 450,
      protocol: 'RQA-UDP-Accelerated'
    }
  });
});

// Upload chunking initialization & completion
app.post('/api/v1/uploads/init', (req: Request, res: Response) => {
  const { fileName, fileSize, mimeType, projectId, folderPath } = req.body;
  const uploadId = `upl-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const totalChunks = Math.ceil(fileSize / (10 * 1024 * 1024)) || 1;

  activeUploads[uploadId] = {
    uploadId,
    fileName,
    fileSize,
    mimeType,
    projectId: projectId || 'proj-01',
    folderPath: folderPath || 'Dailies',
    totalChunks,
    receivedChunks: 0,
    status: 'IN_PROGRESS',
    startedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: {
      uploadId,
      chunkSize: 10 * 1024 * 1024,
      totalChunks,
      acceleratorNode: 'fra-node-04.mediarqa.internal'
    }
  });
});

app.post('/api/v1/uploads/:uploadId/chunk', (req: Request, res: Response) => {
  const upload = activeUploads[req.params.uploadId];
  if (!upload) {
    return res.status(404).json({ success: false, error: 'Upload session not found' });
  }

  upload.receivedChunks += 1;
  const progress = Math.min(100, Math.round((upload.receivedChunks / upload.totalChunks) * 100));

  res.json({
    success: true,
    data: {
      chunkIndex: upload.receivedChunks,
      totalChunks: upload.totalChunks,
      progress,
      speedMBs: 412.5
    }
  });
});

app.post('/api/v1/uploads/:uploadId/complete', (req: Request, res: Response) => {
  const upload = activeUploads[req.params.uploadId];
  if (!upload) {
    return res.status(404).json({ success: false, error: 'Upload session not found' });
  }

  const newAsset: MediaFile = {
    id: `med-${Date.now().toString(36)}`,
    name: upload.fileName,
    projectId: upload.projectId,
    folderPath: upload.folderPath,
    size: upload.fileSize,
    mimeType: upload.mimeType || 'video/quicktime',
    duration: 120.0,
    resolution: '3840x2160 (4K UHD)',
    fps: 24.0,
    codec: 'Apple ProRes 4444 XQ',
    checksum: 'a8f5f167f44f4964e6c998dee827110c',
    status: 'READY',
    version: 1,
    uploadedAt: new Date().toISOString(),
    uploadedBy: 'viswafc29@gmail.com'
  };

  mediaFiles.unshift(newAsset);
  delete activeUploads[req.params.uploadId];

  // Update project stats
  const proj = projects.find(p => p.id === upload.projectId);
  if (proj) {
    proj.storageUsed += upload.fileSize;
    proj.assetCount += 1;
    proj.updatedAt = new Date().toISOString();
  }

  res.json({ success: true, data: newAsset });
});

// Media & Comments
app.get('/api/v1/media/:id', (req: Request, res: Response) => {
  const asset = mediaFiles.find(m => m.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  const assetComments = comments.filter(c => c.assetId === asset.id);
  res.json({ success: true, data: { ...asset, comments: assetComments } });
});

app.put('/api/v1/media/:id/status', (req: Request, res: Response) => {
  const { reviewStatus } = req.body;
  const asset = mediaFiles.find(m => m.id === req.params.id);
  if (!asset) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  (asset as any).reviewStatus = reviewStatus || 'IN_REVIEW';
  res.json({ success: true, data: asset });
});

// Global Unified Search
app.get('/api/v1/search', (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
  if (!q) {
    return res.json({ success: true, data: { projects: [], assets: [], transfers: [] } });
  }

  const matchedProjects = projects.filter(p => 
    p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  const matchedAssets = mediaFiles.filter(m => 
    m.name.toLowerCase().includes(q) || (m.codec && m.codec.toLowerCase().includes(q))
  );

  const matchedTransfers = transfers.filter(t => 
    t.title.toLowerCase().includes(q) || t.shareLink.toLowerCase().includes(q) || t.recipients.some(r => r.toLowerCase().includes(q))
  );

  res.json({
    success: true,
    data: {
      projects: matchedProjects,
      assets: matchedAssets,
      transfers: matchedTransfers
    }
  });
});

app.delete('/api/v1/media/:id', (req: Request, res: Response) => {
  const index = mediaFiles.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Asset not found' });
  }
  const deleted = mediaFiles.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

app.get('/api/v1/media/:id/comments', (req: Request, res: Response) => {
  const assetComments = comments.filter(c => c.assetId === req.params.id);
  res.json({ success: true, data: assetComments });
});

app.post('/api/v1/media/:id/comments', (req: Request, res: Response) => {
  const { timecode, timestampSeconds, content, annotation } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, error: 'Comment content is required' });
  }

  const newComment: FrameComment = {
    id: `comm-${Date.now().toString(36)}`,
    assetId: req.params.id,
    author: {
      name: 'Elena Rostova',
      avatar: 'ER',
      role: 'Supervising Colorist'
    },
    timecode: timecode || '00:00:00:00',
    timestampSeconds: Number(timestampSeconds) || 0,
    content,
    isResolved: false,
    createdAt: new Date().toISOString(),
    annotation: annotation || undefined,
    replies: []
  };

  comments.unshift(newComment);
  res.status(201).json({ success: true, data: newComment });
});

app.put('/api/v1/comments/:id/resolve', (req: Request, res: Response) => {
  const comment = comments.find(c => c.id === req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, error: 'Comment not found' });
  }
  comment.isResolved = !comment.isResolved;
  res.json({ success: true, data: comment });
});

app.post('/api/v1/comments/:id/replies', (req: Request, res: Response) => {
  const { content } = req.body;
  const comment = comments.find(c => c.id === req.params.id);
  if (!comment) {
    return res.status(404).json({ success: false, error: 'Comment not found' });
  }

  const reply = {
    id: `rep-${Date.now().toString(36)}`,
    author: { name: 'Viswa (You)', avatar: 'VF', role: 'Technical Lead' },
    content,
    createdAt: new Date().toISOString()
  };

  if (!comment.replies) comment.replies = [];
  comment.replies.push(reply);

  res.status(201).json({ success: true, data: reply });
});

// Vite middleware mounting in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MEDIA RQA] Engine listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[MEDIA RQA] Server initialization failed:', err);
  process.exit(1);
});
