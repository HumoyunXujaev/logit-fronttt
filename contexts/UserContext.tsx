import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { UserState } from '@/types';

interface UserContextType {
  userState: UserState;
  setUserType: (type: UserState['type']) => void;
  setUserRole: (role: UserState['role']) => void;
  setLanguage: (language: UserState['language']) => void;
  setUserData: (data: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const USER_STORAGE_KEY = 'logit_user_state';
const SELECTED_TEST_USER_KEY = 'selectedTestUser';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Initialize user state
  useEffect(() => {
    const initUser = async () => {
      try {
        // Check if we have a stored user state
        const storedUserState = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUserState) {
          setUserState(JSON.parse(storedUserState));
        }

        // Check if we're in Telegram WebApp
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;

          if (webApp.initData && webApp.initDataUnsafe) {
            // Check if we have a selected test user
            const hasSelectedTestUser = localStorage.getItem(
              SELECTED_TEST_USER_KEY
            );

            // Proceed with auth check
            const userExists = await AuthService.checkTelegramAuth(
              webApp
            ).catch((err) => {
              console.error('Auth check error:', err);
              return false;
            });

            if (userExists) {
              // If user exists, try to retrieve their profile
              try {
                const userData = await AuthService.getProfile();
                if (userData) {
                  updateUserState({
                    type: userData.type,
                    role: userData.role,
                    language: userData.preferred_language,
                    isAuthenticated: true,
                  });

                  // If we're on the select-lang page but already authenticated, redirect to home
                  if (
                    window.location.pathname === '/select-lang' ||
                    window.location.pathname === '/'
                  ) {
                    router.push('/menu');
                  }
                }
              } catch (profileError) {
                console.error('Error fetching profile:', profileError);
              }
            } else if (!hasSelectedTestUser) {
              // If user doesn't exist and we don't have a selected test user,
              // start registration process
              router.push('/');
            }
          }
        }
      } catch (error) {
        console.error('Init user error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initUser();
  }, [router]);

  const updateUserState = (newState: Partial<UserState>) => {
    const updatedState = { ...userState, ...newState };
    setUserState((prev) => ({ ...prev, ...newState }));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedState));
  };

  const setUserType = (type: UserState['type']) => {
    updateUserState({ type });
  };

  const setUserRole = (role: UserState['role']) => {
    updateUserState({ role });
  };

  const setLanguage = (language: UserState['language']) => {
    updateUserState({ language });
  };

  const setUserData = async (data: any) => {
    try {
      updateUserState({
        type: data.type,
        role: data.role,
        language: data.preferred_language,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Update user data error:', error);
    }
  };

  const logout = () => {
    // Use the modified logout that preserves selectedTestUser
    AuthService.logout();

    // Remove user state from local storage but keep the test user selection
    localStorage.removeItem(USER_STORAGE_KEY);

    // Reset context state
    setUserState({});

    // Redirect to login
    router.push('/select-lang');
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserType,
        setUserRole,
        setLanguage,
        setUserData,
        logout,
        isAuthenticated: Boolean(userState.isAuthenticated),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
