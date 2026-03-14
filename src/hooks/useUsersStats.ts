"use client";

import { useCallback, useEffect, useState } from 'react';
import api from '@/utils/axios';
import type { UsersStats } from '@/utils/types/users';

type UseUsersStatsResult = {
  stats: UsersStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useUsersStats(): UseUsersStatsResult {
  const [stats, setStats] = useState<UsersStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<UsersStats>('/users/stats');
      setStats(data);
    } catch {
      setError("Impossible de charger les statistiques utilisateurs.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}