// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import AuthService from '@/lib/auth';

interface User {
  id: string;
  telegram_id: string;
  username?: string;
  full_name: string;
  type?: 'individual' | 'legal';
  role?: 'student' | 'carrier' | 'cargo-owner' | 'logistics-company';
  is_verified: boolean;
  preferred_language?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (telegramData: any) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  handleTelegramWebAppInit: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface TelegramWebAppData {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date: string;
    hash: string;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleTelegramWebAppInit = async () => {
    try {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const webApp = window.Telegram.WebApp;
        if (webApp.initData) {
          const webAppData = {
            initData: webApp.initData,
            user: webApp.initDataUnsafe.user,
            auth_date: webApp.initDataUnsafe.auth_date,
            hash: webApp.initDataUnsafe.hash,
          };
          await login(webAppData);
        }
      }
    } catch (error) {
      console.error('Telegram WebApp init error:', error);
      toast.error('Failed to initialize Telegram WebApp');
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const userData = await api.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Update in contexts/AuthContext.tsx - modify the login method
  const login = async (telegramData: any) => {
    try {
      setIsLoading(true);

      // First try regular authentication
      let userData;
      try {
        userData = await api.telegramAuth(telegramData);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          // User not found - check if they exist in smartbot
          const telegramId = telegramData.user.id;

          // Check and potentially import from smartbot
          const smartbotResponse = await AuthService.checkSmartbotUser(
            telegramId
          );

          // If user was imported or found in smartbot
          if (
            smartbotResponse &&
            (smartbotResponse.imported || smartbotResponse.in_local_db)
          ) {
            userData = smartbotResponse.user;

            // If tokens were provided (user was imported)
            if (smartbotResponse.access && smartbotResponse.refresh) {
              localStorage.setItem('access_token', smartbotResponse.access);
              localStorage.setItem('refresh_token', smartbotResponse.refresh);
            }
          } else {
            // User doesn't exist in either database
            throw error;
          }
        } else {
          // Other errors - rethrow
          throw error;
        }
      }

      setUser(userData);

      // Redirect based on user type and verification status
      if (!userData.type || !userData.role) {
        router.push('/');
      } else if (userData.role === 'carrier' && !userData.is_verified) {
        router.push('/driver-verification');
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/');
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await api.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    handleTelegramWebAppInit,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
