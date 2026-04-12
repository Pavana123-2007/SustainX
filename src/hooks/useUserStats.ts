import { useState, useEffect } from 'react';
import { getUserStats } from '@/api/sustainability';

interface UserStats {
  totalPoints: number;
  goodActionsCount: number;
  badActionsCount: number;
  allTimePoints: number;
}

interface UseUserStatsReturn {
  stats: UserStats;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserStats(): UseUserStatsReturn {
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    goodActionsCount: 0,
    badActionsCount: 0,
    allTimePoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('[useUserStats] Fetching stats...');
      const response = await getUserStats();
      console.log('[useUserStats] Response:', response);

      if (response.success && response.data) {
        console.log('[useUserStats] Setting stats:', response.data.today);
        setStats({
          totalPoints: response.data.today.totalPoints,
          goodActionsCount: response.data.today.goodActionsCount,
          badActionsCount: response.data.today.badActionsCount,
          allTimePoints: response.data.allTime.totalPoints,
        });
      } else {
        console.error('[useUserStats] Failed to fetch stats:', response.error);
        setError(response.error || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('[useUserStats] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
