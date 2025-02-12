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

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>({});
  const router = useRouter();

  // useEffect(() => {
  //   const initUser = async () => {
  //     try {
  //       // Check if we're in Telegram WebApp
  //       if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  //         const webApp = window.Telegram.WebApp;
  //         console.log('WebApp data:', {
  //           initData: webApp.initData,
  //           initDataUnsafe: webApp.initDataUnsafe,
  //         });

  //         //   const initdata = webApp.initData;
  //         //   const initdataunsafe = webApp.initDataUnsafe
  //         //   const data = {initdataunsafe, initdata}
  //         if (webApp) {
  //           const response = await AuthService.telegramAuth(webApp);

  //           console.log(response);
  //           if (response.user) {
  //             setUserData(response.user);
  //           }
  //           // await AuthService.telegramAuth(webApp).catch((err) =>
  //           //   console.log(err)
  //           // );
  //           // setUserState((prev) => ({
  //           //   ...prev,
  //           //   isAuthenticated: true,

  //           // userData: {
  //           //   fullName: response.user?.username || '',
  //           // //   telegramNumber: telegramUser.user?.id?.toString() || '',
  //           // },
  //           // }));
  //           // Store user state
  //           // localStorage.setItem(
  //           //   USER_STORAGE_KEY,
  //           //   JSON.stringify({
  //           //     isAuthenticated: true,
  //           //   })
  //           // );
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Init user error:', error);
  //     }
  //   };

  //   initUser();
  // }, []);

  // Inside UserProvider component
  useEffect(() => {
    const initUser = async () => {
      try {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;

          if (webApp.initData && webApp.initDataUnsafe) {
            // Проверяем, существует ли пользователь
            const userExists = await AuthService.checkTelegramAuth(
              webApp
            ).catch((err) => {
              console.error('Auth check error:', err);
              return false;
            });

            if (userExists) {
              // Если пользователь существует, перенаправляем на home
              console.log('user exists');
              webApp.requestFullscreen();
              router.push('/menu');
            } else {
              // Если пользователь не существует, начинаем процесс регистрации
              router.push('/select-lang');
            }
          }
        }
      } catch (error) {
        console.error('Init user error:', error);
      }
    };

    initUser();
  }, []);

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
      // const updatedUser = await AuthService.updateProfile(data);
      updateUserState({
        type: data.type,
        role: data.role,
        language: data.preferred_language,

        isAuthenticated: true,
      });
      console.log(data.type, 'test');
    } catch (error) {
      console.error('Update user data error:', error);
    }
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUserState({});
    router.push('/select-lang');
  };

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserType,
        setUserRole,
        // updateUserState,
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
