'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/i18n';
import NavigationMenu from '@/app/components/NavigationMenu';
import LanguageSelector from '@/components/LanguageSelector';
import {
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Volume2,
  RefreshCw,
  Languages,
  Smartphone,
  Save,
  Loader2,
} from 'lucide-react';

interface SettingsState {
  language: string;
  theme: 'light' | 'dark';
  notifications: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    cargos: boolean;
    chat: boolean;
    system: boolean;
    marketing: boolean;
    sounds: boolean;
  };
  cache: {
    autoCleanup: boolean;
    interval: 'daily' | 'weekly' | 'monthly';
  };
  display: {
    compactView: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsState>({
    language: 'ru',
    theme: 'light',
    notifications: {
      pushEnabled: true,
      emailEnabled: false,
      cargos: true,
      chat: true,
      system: true,
      marketing: false,
      sounds: true,
    },
    cache: {
      autoCleanup: true,
      interval: 'weekly',
    },
    display: {
      compactView: false,
      highContrast: false,
      fontSize: 'medium',
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const router = useRouter();
  const { userState } = useUser();
  const { t, currentLanguage } = useTranslation();

  // Update initial language from user state
  useEffect(() => {
    if (userState.language) {
      setSettings((prev) => ({
        ...prev,
        language: userState.language || 'ru',
      }));
    }
  }, [userState.language]);

  // Check for changes to enable/disable save button
  useEffect(() => {
    setIsChanged(true);
  }, [settings]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Save to localStorage for demo purposes
      localStorage.setItem('logit_app_settings', JSON.stringify(settings));
      toast.success(t('settings.saveSettings'));
      setIsChanged(false);
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Settings save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      language: currentLanguage,
      theme: 'light',
      notifications: {
        pushEnabled: true,
        emailEnabled: false,
        cargos: true,
        chat: true,
        system: true,
        marketing: false,
        sounds: true,
      },
      cache: {
        autoCleanup: true,
        interval: 'weekly',
      },
      display: {
        compactView: false,
        highContrast: false,
        fontSize: 'medium',
      },
    });
    toast.info(t('settings.resetSettings'));
  };

  const updateNotificationSettings = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const updateDisplaySettings = (key: string, value: any) => {
    setSettings({
      ...settings,
      display: {
        ...settings.display,
        [key]: value,
      },
    });
  };

  const updateCacheSettings = (key: string, value: any) => {
    setSettings({
      ...settings,
      cache: {
        ...settings.cache,
        [key]: value,
      },
    });
  };

  const handleThemeChange = (value: string) => {
    setSettings({
      ...settings,
      theme: value as 'light' | 'dark',
    });
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-4xl mx-auto'
      >
        <div className='flex items-center mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-4'
          >
            <ArrowLeft className='h-6 w-6' />
          </Button>
          <h1 className='text-2xl font-bold'>{t('settings.title')}</h1>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='grid grid-cols-4 mb-6'>
            <TabsTrigger value='general'>{t('settings.general')}</TabsTrigger>
            <TabsTrigger value='notifications'>
              {t('common.notifications')}
            </TabsTrigger>
            <TabsTrigger value='display'>
              {t('settings.displaySettings')}
            </TabsTrigger>
            <TabsTrigger value='system'>
              {t('settings.systemSettings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.generalSettings')}</CardTitle>
                <CardDescription>
                  {t('settings.generalDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Globe className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>
                          {t('settings.language')}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {t('settings.selectLanguage')}
                        </p>
                      </div>
                    </div>
                    <LanguageSelector />
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      {settings.theme === 'light' ? (
                        <Sun className='h-5 w-5 mr-2 text-amber-500' />
                      ) : (
                        <Moon className='h-5 w-5 mr-2 text-indigo-400' />
                      )}
                      <div>
                        <h4 className='font-medium text-sm'>
                          {t('settings.theme')}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {t('settings.selectTheme')}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button
                        variant={
                          settings.theme === 'light' ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => handleThemeChange('light')}
                        className='w-24'
                      >
                        <Sun className='h-4 w-4 mr-2' />
                        {t('settings.lightTheme')}
                      </Button>
                      <Button
                        variant={
                          settings.theme === 'dark' ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => handleThemeChange('dark')}
                        className='w-24'
                      >
                        <Moon className='h-4 w-4 mr-2' />
                        {t('settings.darkTheme')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content... */}
          <TabsContent value='notifications' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.notificationSettings')}</CardTitle>
                <CardDescription>
                  {t('settings.notificationDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Bell className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>
                          {t('settings.pushNotifications')}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {t('settings.receiveNotifications')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.pushEnabled}
                      onCheckedChange={(checked: any) =>
                        updateNotificationSettings('pushEnabled', checked)
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Volume2 className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>
                          {t('settings.soundNotifications')}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {t('settings.enableSounds')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.notifications.sounds}
                      onCheckedChange={(checked: any) =>
                        updateNotificationSettings('sounds', checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className='space-y-4'>
                  <h4 className='font-medium text-sm'>
                    {t('settings.notificationTypes')}
                  </h4>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm'>
                        {t('settings.cargosAndRequests')}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {t('settings.cargosNotificationDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.cargos}
                      onCheckedChange={(checked: any) =>
                        updateNotificationSettings('cargos', checked)
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm'>{t('settings.messages')}</p>
                      <p className='text-xs text-gray-500'>
                        {t('settings.messagesNotificationDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.chat}
                      onCheckedChange={(checked: any) =>
                        updateNotificationSettings('chat', checked)
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm'>{t('settings.system')}</p>
                      <p className='text-xs text-gray-500'>
                        {t('settings.systemNotificationDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.system}
                      onCheckedChange={(checked: any) =>
                        updateNotificationSettings('system', checked)
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm'>{t('settings.marketing')}</p>
                      <p className='text-xs text-gray-500'>
                        {t('settings.marketingNotificationDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked: any) =>
                        updateNotificationSettings('marketing', checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='display' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.displaySettings')}</CardTitle>
                <CardDescription>
                  {t('settings.displayDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>
                        {t('settings.compactMode')}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {t('settings.compactModeDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.display.compactView}
                      onCheckedChange={(checked: any) =>
                        updateDisplaySettings('compactView', checked)
                      }
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>
                        {t('settings.highContrast')}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {t('settings.highContrastDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={settings.display.highContrast}
                      onCheckedChange={(checked: any) =>
                        updateDisplaySettings('highContrast', checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm mb-2'>
                    {t('settings.fontSize')}
                  </h4>
                  <Select
                    value={settings.display.fontSize}
                    onValueChange={(value: any) =>
                      updateDisplaySettings('fontSize', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='small'>
                        {t('settings.small')}
                      </SelectItem>
                      <SelectItem value='medium'>
                        {t('settings.medium')}
                      </SelectItem>
                      <SelectItem value='large'>
                        {t('settings.large')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='system' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.systemSettings')}</CardTitle>
                <CardDescription>
                  {t('settings.systemDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <RefreshCw className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>
                          {t('settings.autoCacheCleanup')}
                        </h4>
                        <p className='text-sm text-gray-500'>
                          {t('settings.autoCacheDesc')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.cache.autoCleanup}
                      onCheckedChange={(checked: any) =>
                        updateCacheSettings('autoCleanup', checked)
                      }
                    />
                  </div>
                  {settings.cache.autoCleanup && (
                    <div className='ml-7 pl-2'>
                      <Select
                        value={settings.cache.interval}
                        onValueChange={(value: any) =>
                          updateCacheSettings('interval', value)
                        }
                      >
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='daily'>
                            {t('settings.daily')}
                          </SelectItem>
                          <SelectItem value='weekly'>
                            {t('settings.weekly')}
                          </SelectItem>
                          <SelectItem value='monthly'>
                            {t('settings.monthly')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className='pt-4'>
                  <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => {
                      toast.success(t('settings.clearCacheNow'));
                    }}
                  >
                    {t('settings.clearCacheNow')}
                  </Button>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm mb-2'>
                    {t('settings.appVersion')}
                  </h4>
                  <p className='text-sm text-gray-500'>
                    1.3.5 (build 2025.03.16)
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className='flex justify-between pt-4'>
              <Button variant='outline' onClick={handleReset}>
                {t('settings.resetSettings')}
              </Button>
              <Button
                onClick={handleSaveSettings}
                disabled={!isChanged || isSaving}
                className='bg-blue-600 hover:bg-blue-700'
              >
                {isSaving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
};

export default SettingsPage;
