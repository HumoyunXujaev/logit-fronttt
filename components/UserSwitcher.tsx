import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { Label } from '@/components/ui/label';
import { AuthService } from '@/lib/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define test users with different roles
const TEST_USERS = [
  {
    id: '1919191',
    name: 'Test Carrier',
    role: 'carrier',
    type: 'individual',
    telegram_data: {
      user: {
        id: 1919191,
        first_name: 'Test',
        last_name: 'Carrier',
        username: 'test_carrier',
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'mock_hash',
    },
  },
  {
    id: '2222222',
    name: 'Test Cargo Owner',
    role: 'cargo-owner',
    type: 'legal',
    telegram_data: {
      user: {
        id: 2222222,
        first_name: 'Test',
        last_name: 'Owner',
        username: 'test_owner',
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'mock_hash',
    },
  },
  {
    id: '3333333',
    name: 'Test Logistics Company',
    role: 'logistics-company',
    type: 'legal',
    telegram_data: {
      user: {
        id: 3333333,
        first_name: 'Test',
        last_name: 'LogisticsCompany',
        username: 'test_logistics',
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'mock_hash',
    },
  },
  {
    id: '1111111',
    name: 'Test Manager',
    role: 'manager',
    type: 'individual',
    telegram_data: {
      user: {
        id: 1111111,
        first_name: 'testmanager',
        last_name: 'testmanager',
        username: 'testmanager',
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'mock_hash',
    },
  },
];

// Store selected test user ID
const SELECTED_TEST_USER_KEY = 'selectedTestUser';

// Mock the Telegram WebApp data for testing
const mockTelegramWebApp = (userData: any) => {
  const webAppData = {
    initData: JSON.stringify({
      query_id: 'query123',
      user: userData.user,
      auth_date: userData.auth_date,
      hash: userData.hash,
    }),
    initDataUnsafe: {
      query_id: 'query123',
      user: userData.user,
      auth_date: userData.auth_date,
      hash: userData.hash,
    },
  };

  // Create a backup of the real Telegram WebApp if it exists
  const realTelegramWebApp = window.Telegram?.WebApp;

  // Set the mock WebApp
  window.Telegram = {
    WebApp: {
      ...webAppData,
      ready: () => console.log('Mock WebApp ready'),
      close: () => console.log('Mock WebApp close'),
      expand: () => console.log('Mock WebApp expand'),
      enableClosingConfirmation: () =>
        console.log('Mock closing confirmation enabled'),
    },
  } as any;

  return () => {
    // Restore the real Telegram WebApp if it existed
    if (realTelegramWebApp) {
      window.Telegram = { WebApp: realTelegramWebApp } as any;
    } else {
      delete window.Telegram;
    }
  };
};

// Function to set up persistent test user on page load
const setupPersistentTestUser = async () => {
  const selectedUserId = localStorage.getItem(SELECTED_TEST_USER_KEY);
  if (!selectedUserId) return false;

  const testUser = TEST_USERS.find((user) => user.id === selectedUserId);
  if (!testUser) return false;

  try {
    // Mock Telegram WebApp data
    const restoreTelegramWebApp = mockTelegramWebApp(testUser.telegram_data);

    // Authenticate with the mock data
    const response = await AuthService.checkTelegramAuth(
      window?.Telegram?.WebApp
    );

    // If user doesn't exist, create it
    if (response === false) {
      // Register new user
      await AuthService.registerUser({
        telegramData: window?.Telegram?.WebApp,
        userData: {
          type: testUser.type,
          role: testUser.role,
          preferred_language: 'ru',
        },
      });
    }

    // Restore original Telegram WebApp
    restoreTelegramWebApp();
    return true;
  } catch (error) {
    console.error('Error setting up persistent test user:', error);
    return false;
  }
};

const UserSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const { userState, logout, setUserData, setUserRole, setUserType } =
    useUser();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const router = useRouter();

  // Initialize with the stored test user on mount
  useEffect(() => {
    const initTestUser = async () => {
      setIsInitializing(true);
      const storedUserId = localStorage.getItem(SELECTED_TEST_USER_KEY);
      if (storedUserId) {
        setSelectedUser(storedUserId);
        await setupPersistentTestUser();
      }
      setIsInitializing(false);
    };

    initTestUser();
  }, []);

  // Show user switcher only in development or when manually enabled
  useEffect(() => {
    // You can add a localStorage flag to manually enable in production
    const isEnabled =
      process.env.NODE_ENV === 'development' ||
      localStorage.getItem('enableUserSwitcher') === 'true';
    if (!isEnabled || isInitializing) {
      return;
    }

    // Show user switcher button
    const button = document.createElement('button');
    button.innerText = '👤 Switch User';
    button.style.position = 'fixed';
    button.style.bottom = '80px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#0066ff';
    button.style.color = 'white';
    button.style.padding = '8px 12px';
    button.style.borderRadius = '4px';
    button.style.border = 'none';
    button.style.fontSize = '12px';
    button.onclick = () => setIsOpen(true);
    document.body.appendChild(button);

    return () => {
      document.body.removeChild(button);
    };
  }, [isInitializing]);

  const handleUserSwitch = async () => {
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    setIsSwitching(true);
    try {
      // Find the selected test user
      const testUser = TEST_USERS.find((user) => user.id === selectedUser);
      if (!testUser) {
        throw new Error('User not found');
      }

      // First logout current user
      logout();

      // Persist the selected user ID
      localStorage.setItem(SELECTED_TEST_USER_KEY, selectedUser);

      // Mock Telegram WebApp data
      const restoreTelegramWebApp = mockTelegramWebApp(testUser.telegram_data);

      // Now authenticate with the mock data
      const response = await AuthService.checkTelegramAuth(
        window?.Telegram?.WebApp
      );

      // If user doesn't exist, create it
      if (response === false) {
        // Register new user
        await AuthService.registerUser({
          telegramData: window?.Telegram?.WebApp,
          userData: {
            type: testUser.type,
            role: testUser.role,
            preferred_language: 'ru',
          },
        });

        toast.success(`Created and logged in as ${testUser.name}`);
      } else {
        toast.success(`Logged in as ${testUser.name}`);
      }

      // Restore original Telegram WebApp
      restoreTelegramWebApp();

      // Get user profile data
      try {
        const userData = await AuthService.getProfile();

        // Directly update the UserContext
        if (userData) {
          // Important: Update the user context with the new role and type
          await setUserRole(testUser.role as any);
          await setUserType(testUser.type as any);

          // Force manual update of userData for completeness
          await setUserData({
            ...userData,
            type: testUser.type,
            role: testUser.role,
            preferred_language: 'ru',
            isAuthenticated: true,
          });

          // Manually update the logit_user_state to ensure it has the correct role
          const userState = {
            type: testUser.type,
            role: testUser.role,
            language: 'ru',
            isAuthenticated: true,
          };
          localStorage.setItem('logit_user_state', JSON.stringify(userState));

          console.log('User context and localStorage updated with:', userState);
        }
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);

        // Even if profile fetch fails, still update user context with test user data
        await setUserRole(testUser.role as any);
        await setUserType(testUser.type as any);

        const userState = {
          type: testUser.type,
          role: testUser.role,
          language: 'ru',
          isAuthenticated: true,
        };
        localStorage.setItem('logit_user_state', JSON.stringify(userState));

        console.log(
          'User context and localStorage manually updated with:',
          userState
        );
      }

      // Close dialog
      setIsOpen(false);

      // Redirect to menu page using router instead of full page reload
      router.push('/menu');
    } catch (error) {
      console.error('Error switching user:', error);
      toast.error('Failed to switch user');
      localStorage.removeItem(SELECTED_TEST_USER_KEY);
    } finally {
      setIsSwitching(false);
    }
  };

  if (isInitializing) {
    return null; // Don't render anything while initializing
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Switch Test User</DialogTitle>
        </DialogHeader>
        <div className='py-4 space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='user'>Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder='Select a test user' />
              </SelectTrigger>
              <SelectContent>
                {TEST_USERS.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {userState.isAuthenticated && (
            <div className='text-sm text-amber-600'>
              <p>
                Currently logged in as:{' '}
                {userState.userData?.fullName || 'Unknown'}
              </p>
              <p>Role: {userState.role || 'None'}</p>
            </div>
          )}
          <div className='text-sm text-gray-500'>
            <p>
              This is a development tool to test the application with different
              user roles.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUserSwitch} disabled={isSwitching}>
            {isSwitching ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Switching...
              </>
            ) : (
              'Switch User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserSwitcher;
