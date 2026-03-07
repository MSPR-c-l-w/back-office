"use client";

import { useCallback, useEffect, useState } from 'react';
import api from '@/utils/axios';
import type { UsersListApiResponse, UserListItem } from '@/utils/types/users';
import { mapUserApiItemToListItem } from '@/utils/mappers/users';

type UseUsersListParams = {
  page: number;
  limit: number;
};

type UseUsersListResult = {
  data: UserListItem[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useUsersList({
  page,
  limit,
}: UseUsersListParams): UseUsersListResult {
  const [data, setData] = useState<UserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.get<UsersListApiResponse>('/users', {
        params: { page, limit },
      });
      setData(response.data.map(mapUserApiItemToListItem));
      setTotal(response.total);
    } catch (err) {
      setError('Impossible de charger la liste des utilisateurs.');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, total, loading, error, refetch: fetchUsers };
}