import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { PortalSessionData } from "../types";
import {
  portalService,
  PORTAL_TOKEN_KEY,
  PORTAL_SESSION_KEY,
} from "../api/services/portalService";

interface PortalContextType {
  session: PortalSessionData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  login: (data: PortalSessionData) => void;
  logout: () => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(PORTAL_TOKEN_KEY);
  });

  const [session, setSession] = useState<PortalSessionData | null>(() => {
    const raw = localStorage.getItem(PORTAL_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PortalSessionData;
    } catch {
      localStorage.removeItem(PORTAL_SESSION_KEY);
      return null;
    }
  });

  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(PORTAL_TOKEN_KEY);
    const savedSession = localStorage.getItem(PORTAL_SESSION_KEY);

    if (savedToken && savedSession) {
      try {
        setToken(savedToken);
        setSession(JSON.parse(savedSession));
      } catch {
        localStorage.removeItem(PORTAL_TOKEN_KEY);
        localStorage.removeItem(PORTAL_SESSION_KEY);
        setToken(null);
        setSession(null);
      }
    } else {
      setToken(null);
      setSession(null);
    }
    setIsLoadingSession(false);
  }, []);

  const login = useCallback((data: PortalSessionData) => {
    localStorage.setItem(PORTAL_TOKEN_KEY, data.token);
    localStorage.setItem(PORTAL_SESSION_KEY, JSON.stringify(data));
    setToken(data.token);
    setSession(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await portalService.logout();
    } finally {
      localStorage.removeItem(PORTAL_TOKEN_KEY);
      localStorage.removeItem(PORTAL_SESSION_KEY);
      setToken(null);
      setSession(null);
    }
  }, []);

  const value: PortalContextType = {
    session,
    token,
    isAuthenticated: !!token && !!session,
    isLoadingSession,
    login,
    logout,
  };

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortalContext(): PortalContextType {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortalContext must be used within a PortalProvider");
  }
  return context;
}
