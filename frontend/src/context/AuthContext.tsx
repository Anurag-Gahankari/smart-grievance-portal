import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/services/api";

export type UserRole = "user" | "officer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post("/auth/login", { email, password });
    const userData: User = {
      id: data.data?.user?.id || data.user?.id || data.userId || data._id,
      name: data.data?.user?.name || data.user?.name || data.name,
      email: data.data?.user?.email || data.user?.email || email,
      role: (data.data?.user?.role || data.user?.role || data.role) as UserRole,
    };
    localStorage.setItem("token", data.data?.token || data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(data.data?.token || data.token);
    setUser(userData);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    await api.post("/auth/register", { name, email, password, role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
