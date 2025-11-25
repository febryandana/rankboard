import axios, { type AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import type {
  ApiResponse,
  User,
  Challenge,
  Submission,
  Score,
  LeaderboardEntry,
  LoginCredentials,
  CreateUserData,
  UpdateUserData,
  CreateChallengeData,
  UpdateChallengeData,
  CreateScoreData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure retry logic
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500
    );
  },
  onRetry: (retryCount, _error, requestConfig) => {
    console.log(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSessionCheck = error.config?.url?.includes('/auth/session');

    if (error.response?.status === 401 && !isSessionCheck) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async getSession(): Promise<ApiResponse<{ authenticated: boolean; user: User | null }>> {
    const response = await apiClient.get('/auth/session');
    return response.data;
  },
};

export const users = {
  async getAll(role?: 'admin' | 'user'): Promise<ApiResponse<User[]>> {
    const response = await apiClient.get('/users', {
      params: role ? { role } : {},
    });
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<User>> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async create(data: CreateUserData): Promise<ApiResponse<User>> {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  async update(id: number, data: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  async uploadAvatar(id: number, file: File): Promise<ApiResponse<{ avatar_filename: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteAvatar(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete(`/users/${id}/avatar`);
    return response.data;
  },
};

export const challenges = {
  async getAll(): Promise<ApiResponse<Challenge[]>> {
    const response = await apiClient.get('/challenges');
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Challenge>> {
    const response = await apiClient.get(`/challenges/${id}`);
    return response.data;
  },

  async create(data: CreateChallengeData): Promise<ApiResponse<Challenge>> {
    const response = await apiClient.post('/challenges', data);
    return response.data;
  },

  async update(id: number, data: UpdateChallengeData): Promise<ApiResponse<Challenge>> {
    const response = await apiClient.put(`/challenges/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete(`/challenges/${id}`);
    return response.data;
  },
};

export const submissions = {
  async getByChallengeId(challengeId: number): Promise<ApiResponse<Submission[]>> {
    const response = await apiClient.get(`/challenges/${challengeId}/submissions`);
    return response.data;
  },

  async create(challengeId: number, file: File): Promise<ApiResponse<Submission>> {
    const formData = new FormData();
    formData.append('submission', file);

    const response = await apiClient.post(`/challenges/${challengeId}/submissions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async update(challengeId: number, file: File): Promise<ApiResponse<Submission>> {
    const formData = new FormData();
    formData.append('submission', file);

    const response = await apiClient.put(`/challenges/${challengeId}/submissions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async download(submissionId: number): Promise<Blob> {
    const response = await apiClient.get(`/submissions/${submissionId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const scores = {
  async getByChallengeId(
    challengeId: number
  ): Promise<ApiResponse<{ leaderboard: LeaderboardEntry[] }>> {
    const response = await apiClient.get(`/challenges/${challengeId}/scores`);
    return response.data;
  },

  async createOrUpdate(submissionId: number, data: CreateScoreData): Promise<ApiResponse<Score>> {
    const response = await apiClient.post(`/submissions/${submissionId}/scores`, data);
    return response.data;
  },

  async getMyScores(submissionId: number): Promise<
    ApiResponse<{
      submission_id: number;
      scores: Array<{
        admin_id: number;
        admin_username: string;
        score: number;
        feedback: string | null;
      }>;
      total_score: number;
    }>
  > {
    const response = await apiClient.get(`/submissions/${submissionId}/scores/me`);
    return response.data;
  },
};

export default apiClient;
