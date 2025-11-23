import { Request } from 'express';

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  avatar_filename: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar_filename: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  created_at: string;
  deadline: string;
  created_by_admin_id: number;
  updated_at: string;
}

export interface Submission {
  id: number;
  challenge_id: number;
  user_id: number;
  filename: string;
  submitted_at: string;
  updated_at: string;
}

export interface Score {
  id: number;
  submission_id: number;
  admin_id: number;
  score: number;
  feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionData {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
    email?: string;
    role?: UserRole;
  }
}

export interface AuthRequest extends Request {
  session: Request['session'] & SessionData;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar_filename: string | null;
  submission_id: number | null;
  scores: Array<{
    admin_id: number;
    admin_username: string;
    score: number;
    feedback: string | null;
  }>;
  total_score: number;
}
