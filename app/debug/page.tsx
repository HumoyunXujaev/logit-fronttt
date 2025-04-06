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
import { useTranslation } from '@/contexts/i18n';

export default function DebugPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setIsEnabled(isUserSwitcherEnabled());
  }, []);

  const handleEnable = () => {
    enableUserSwitcher();
    setIsEnabled(true);
  };

  const handleDisable = () => {
    disableUserSwitcher();
    setIsEnabled(false);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>{t('debug.debugTools')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-2'>
            <h3 className='text-lg font-medium'>{t('debug.userSwitcher')}</h3>
            <p className='text-sm text-gray-500'>
              {t('debug.currentStatus')}{' '}
              <span
                className={
                  isEnabled
                    ? 'text-green-500 font-bold'
                    : 'text-red-500 font-bold'
                }
              >
                {isEnabled ? t('debug.enabled') : t('debug.disabled')}
              </span>
            </p>
            <div className='flex space-x-2'>
              <Button
                onClick={handleEnable}
                variant='default'
                className='w-full'
                disabled={isEnabled}
              >
                {t('debug.enableUserSwitcher')}
              </Button>
              <Button
                onClick={handleDisable}
                variant='destructive'
                className='w-full'
                disabled={!isEnabled}
              >
                {t('debug.disableUserSwitcher')}
              </Button>
            </div>
          </div>
          <div className='pt-4 border-t'>
            <Button
              onClick={() => router.push('/home')}
              variant='outline'
              className='w-full'
            >
              {t('debug.returnToHome')}
            </Button>
          </div>
          <div className='text-xs text-gray-500 pt-4'>
            <p>{t('debug.testingPurposes')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
