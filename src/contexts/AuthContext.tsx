import { User } from "@/utils/interfaces/user";
import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "@/utils/axios";
import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "@/utils/tokenStorage";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

type Props = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data, status } = await api.get<User>("/auth/me");
      if (status !== 200) {
        setUser(null);
        return;
      }
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<{
        access_token: string;
        refresh_token: string;
      }>("/auth/login", { email, password });
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      await fetchUser();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
    [fetchUser]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refresh_token: refreshToken });
      } catch {
        // ignore network errors on logout
      }
    }
    clearTokens();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser: fetchUser
      }}
    >
        {children}
    </AuthContext.Provider>
  )
};
