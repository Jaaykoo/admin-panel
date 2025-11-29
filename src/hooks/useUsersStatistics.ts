'use client';

import type { UsersStatistics } from '@/types/AnalyticType';
import { useEffect, useState } from 'react';

export function useUsersStatistics(role?: 'PARTICULIER' | 'ENTREPRISE') {
  const [statistics, setStatistics] = useState<UsersStatistics>({
    total: 0,
    active: 0,
    verified: 0,
    inactive: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const url = role
          ? `/api/analytics/users-statistics?role=${role}`
          : '/api/analytics/users-statistics';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }

        const data = await response.json();
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
        setError(err as Error);
        // Garder les valeurs par défaut en cas d'erreur
        setStatistics({
          total: 0,
          active: 0,
          verified: 0,
          inactive: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [role]);

  return { statistics, isLoading, error };
}
