'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  enableUserSwitcher,
  disableUserSwitcher,
  isUserSwitcherEnabled,
} from '@/lib/userswitcherutils';
import { useRouter } from 'next/navigation';

export default function DebugPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsEnabled(isUserSwitcherEnabled());
  }, []);

  const handleEnable = () => {
    enableUserSwitcher();
  };

  const handleDisable = () => {
    disableUserSwitcher();
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Debug Tools</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <h3 className='text-lg font-medium'>User Switcher</h3>
            <p className='text-sm text-gray-500'>
              Current status:{' '}
              <span
                className={
                  isEnabled
                    ? 'text-green-500 font-bold'
                    : 'text-red-500 font-bold'
                }
              >
                {isEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </p>
            <div className='flex space-x-2'>
              <Button
                onClick={handleEnable}
                variant='default'
                className='w-full'
                disabled={isEnabled}
              >
                Enable User Switcher
              </Button>
              <Button
                onClick={handleDisable}
                variant='destructive'
                className='w-full'
                disabled={!isEnabled}
              >
                Disable User Switcher
              </Button>
            </div>
          </div>

          <div className='pt-4 border-t'>
            <Button
              onClick={() => router.push('/home')}
              variant='outline'
              className='w-full'
            >
              Return to Home
            </Button>
          </div>

          <div className='text-xs text-gray-500 pt-4'>
            <p>
              For testing purposes only. The user switcher allows you to test
              different user roles without creating actual Telegram accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
