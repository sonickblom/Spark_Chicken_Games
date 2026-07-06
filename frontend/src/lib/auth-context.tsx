"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import { api } from "@/services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ user: User; token: string }>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<{ user: User; token: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    const result = await api.login(email, password);
    localStorage.setItem("auth_token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const result = await api.register({ username, email, password });
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setUser(result.user);
      return result;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to check if user can access admin.
 * Returns { isAuthorized, isLoading }.
 * Only allows access if the user is authenticated AND username is "Samuteg".
 */
export function useAdminAccess() {
  const { user, isAuthenticated, loading } = useAuthContext();
  const router = useRouter();

  const isAuthorized = isAuthenticated && user?.username === "Samuteg";

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin");
    } else if (!isAuthorized) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAuthorized, router]);

  return { isAuthorized, isLoading: loading };
}
