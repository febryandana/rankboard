import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Challenge, type CreateChallengeData, type UpdateChallengeData } from '../types';
import { challenges as challengesApi } from '../lib/api';

interface ChallengeContextType {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  createChallenge: (data: CreateChallengeData) => Promise<Challenge>;
  updateChallenge: (id: number, data: UpdateChallengeData) => Promise<Challenge>;
  deleteChallenge: (id: number) => Promise<void>;
  refreshChallenges: () => Promise<void>;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await challengesApi.getAll();
      if (response.success && response.data) {
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setChallenges(sorted);
      } else {
        setError(response.error || 'Failed to fetch challenges');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  };

  const createChallenge = async (data: CreateChallengeData): Promise<Challenge> => {
    try {
      const response = await challengesApi.create(data);
      if (response.success && response.data) {
        setChallenges((prev) => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create challenge');
      }
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to create challenge';
      throw new Error(message);
    }
  };

  const updateChallenge = async (id: number, data: UpdateChallengeData): Promise<Challenge> => {
    try {
      const response = await challengesApi.update(id, data);
      if (response.success && response.data) {
        setChallenges((prev) => prev.map((c) => (c.id === id ? response.data! : c)));
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update challenge');
      }
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to update challenge';
      throw new Error(message);
    }
  };

  const deleteChallenge = async (id: number): Promise<void> => {
    try {
      const response = await challengesApi.delete(id);
      if (response.success) {
        setChallenges((prev) => prev.filter((c) => c.id !== id));
      } else {
        throw new Error(response.error || 'Failed to delete challenge');
      }
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Failed to delete challenge';
      throw new Error(message);
    }
  };

  const refreshChallenges = async () => {
    await fetchChallenges();
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        loading,
        error,
        fetchChallenges,
        createChallenge,
        updateChallenge,
        deleteChallenge,
        refreshChallenges,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallenges() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenges must be used within a ChallengeProvider');
  }
  return context;
}
