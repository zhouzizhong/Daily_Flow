'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession } from '@/actions/auth-actions';

type User = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
};

type Session = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: User;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const sessionData = await getCurrentSession();
      
      if (sessionData) {
        setUser(sessionData.user as User);
        setSession(sessionData as Session);
      }
    } catch (error) {
      console.error('加载会话失败:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refresh() {
    await loadSession();
  }

  const value = {
    user,
    session,
    isLoading,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  
  return context;
}
