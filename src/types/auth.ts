export type UserRole = 'admin' | 'editor' | 'reviewer' | 'client';
export type UserStatus = 'active' | 'suspended' | 'deactivated' | 'pending_verification';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl?: string;
  avatarInitials: string;
  role: UserRole;
  status: UserStatus;
  timezone: string;
  locale: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AuthAuditEntry {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'signup' | 'password_reset' | 'password_change' | 'profile_update' | 'role_change';
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details?: string;
}
