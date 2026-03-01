import { User } from "@/utils/interfaces/user";
import { hasBackOfficeAccess } from "@/utils/roles";
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
  logout: (redirectPath?: string) => Promise<void>;
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

  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      const { data, status } = await api.get<User>("/auth/me");
      if (status !== 200) {
        setUser(null);
        return null;
      }
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
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
      const userData = await fetchUser();
      if (!userData || !hasBackOfficeAccess(userData.role?.name)) {
        clearTokens();
        setUser(null);
        throw new Error("BACK_OFFICE_ACCESS_DENIED");
      }
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
    [fetchUser]
  );

  const logout = useCallback(async (redirectPath = "/auth/login") => {
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
      window.location.href = redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`;
    }
  }, []);


  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
        {children}
    </AuthContext.Provider>
  )
};
