"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/utils/axios";
import type { UsersListApiResponse, UserListItem } from "@/utils/types/users";
import { mapUserApiItemToListItem } from "@/utils/mappers/users";

type UseUsersListParams = {
  page: number;
  limit: number;
  search?: string;
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
  search,
}: UseUsersListParams): UseUsersListResult {
  const [data, setData] = useState<UserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await api.get<UsersListApiResponse>("/users", {
        params: {
          page,
          limit,
          ...(search?.trim() ? { search: search.trim() } : {}),
        },

      });
      setData(response.data.map(mapUserApiItemToListItem));
      setTotal(response.total);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, total, loading, error, refetch: fetchUsers };
}
