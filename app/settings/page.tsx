'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Info,
  MonitorSmartphone,
  Palette,
  Trash,
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4 pb-20'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='max-w-4xl mx-auto'
      >
        <motion.div
          variants={itemVariants}
          className='flex items-center mb-6 bg-white dark:bg-blue-800/30 p-3 rounded-lg shadow-sm'
        >
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-4 hover:bg-blue-100 dark:hover:bg-blue-700/50'
          >
            <ArrowLeft className='h-6 w-6 text-blue-600 dark:text-blue-300' />
          </Button>
          <h1 className='text-2xl font-bold text-blue-800 dark:text-white'>
            {t('settings.title')}
          </h1>
          <div className='ml-auto'>
            <LanguageSelector />
          </div>
        </motion.div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='grid grid-cols-4 mb-6 bg-blue-100/50 dark:bg-blue-800/30 p-1 rounded-xl'>
            <TabsTrigger
              value='general'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <Globe className='h-4 w-4 mr-2' />
              {t('settings.general')}
            </TabsTrigger>
            <TabsTrigger
              value='notifications'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <Bell className='h-4 w-4 mr-2' />
              {t('common.notifications')}
            </TabsTrigger>
            <TabsTrigger
              value='display'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <Palette className='h-4 w-4 mr-2' />
              {t('settings.displaySettings')}
            </TabsTrigger>
            <TabsTrigger
              value='system'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <Smartphone className='h-4 w-4 mr-2' />
              {t('settings.systemSettings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-4'>
            <motion.div variants={itemVariants}>
              <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                  <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                    <Globe className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                    {t('settings.generalSettings')}
                  </CardTitle>
                  <CardDescription className='text-blue-700/70 dark:text-blue-300/70'>
                    {t('settings.generalDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6 pt-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div className='flex items-center'>
                        <Globe className='h-5 w-5 mr-3 text-blue-600 dark:text-blue-400' />
                        <div>
                          <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>
                            {t('settings.language')}
                          </h4>
                          <p className='text-sm text-blue-600/80 dark:text-blue-300/80'>
                            {t('settings.selectLanguage')}
                          </p>
                        </div>
                      </div>
                      <LanguageSelector className='w-[140px]' />
                    </div>
                  </div>

                  <Separator className='bg-blue-100 dark:bg-blue-700/50' />

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div className='flex items-center'>
                        {settings.theme === 'light' ? (
                          <Sun className='h-5 w-5 mr-3 text-amber-500 dark:text-amber-400' />
                        ) : (
                          <Moon className='h-5 w-5 mr-3 text-indigo-500 dark:text-indigo-400' />
                        )}
                        <div>
                          <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>
                            {t('settings.theme')}
                          </h4>
                          <p className='text-sm text-blue-600/80 dark:text-blue-300/80'>
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
                          className={
                            settings.theme === 'light'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-blue-200 text-blue-700 dark:border-blue-600 dark:text-blue-300'
                          }
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
                          className={
                            settings.theme === 'dark'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-blue-200 text-blue-700 dark:border-blue-600 dark:text-blue-300'
                          }
                        >
                          <Moon className='h-4 w-4 mr-2' />
                          {t('settings.darkTheme')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Tab Content */}
          <TabsContent value='notifications' className='space-y-4'>
            <motion.div variants={itemVariants}>
              <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                  <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                    <Bell className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                    {t('settings.notificationSettings')}
                  </CardTitle>
                  <CardDescription className='text-blue-700/70 dark:text-blue-300/70'>
                    {t('settings.notificationDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6 pt-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div className='flex items-center'>
                        <Bell className='h-5 w-5 mr-3 text-blue-600 dark:text-blue-400' />
                        <div>
                          <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>
                            {t('settings.pushNotifications')}
                          </h4>
                          <p className='text-sm text-blue-600/80 dark:text-blue-300/80'>
                            {t('settings.receiveNotifications')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.pushEnabled}
                        onCheckedChange={(checked: any) =>
                          updateNotificationSettings('pushEnabled', checked)
                        }
                        className='data-[state=checked]:bg-blue-600'
                      />
                    </div>

                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div className='flex items-center'>
                        <Volume2 className='h-5 w-5 mr-3 text-blue-600 dark:text-blue-400' />
                        <div>
                          <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>
                            {t('settings.soundNotifications')}
                          </h4>
                          <p className='text-sm text-blue-600/80 dark:text-blue-300/80'>
                            {t('settings.enableSounds')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifications.sounds}
                        onCheckedChange={(checked: any) =>
                          updateNotificationSettings('sounds', checked)
                        }
                        className='data-[state=checked]:bg-blue-600'
                      />
                    </div>
                  </div>

                  <Separator className='bg-blue-100 dark:bg-blue-700/50' />

                  <div className='space-y-4'>
                    <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200 px-3'>
                      {t('settings.notificationTypes')}
                    </h4>

                    <div className='space-y-3'>
                      <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                        <div>
                          <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                            {t('settings.cargosAndRequests')}
                          </p>
                          <p className='text-xs text-blue-600/70 dark:text-blue-300/70'>
                            {t('settings.cargosNotificationDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.cargos}
                          onCheckedChange={(checked: any) =>
                            updateNotificationSettings('cargos', checked)
                          }
                          className='data-[state=checked]:bg-blue-600'
                        />
                      </div>

                      <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                        <div>
                          <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                            {t('settings.messages')}
                          </p>
                          <p className='text-xs text-blue-600/70 dark:text-blue-300/70'>
                            {t('settings.messagesNotificationDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.chat}
                          onCheckedChange={(checked: any) =>
                            updateNotificationSettings('chat', checked)
                          }
                          className='data-[state=checked]:bg-blue-600'
                        />
                      </div>

                      <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                        <div>
                          <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                            {t('settings.system')}
                          </p>
                          <p className='text-xs text-blue-600/70 dark:text-blue-300/70'>
                            {t('settings.systemNotificationDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.system}
                          onCheckedChange={(checked: any) =>
                            updateNotificationSettings('system', checked)
                          }
                          className='data-[state=checked]:bg-blue-600'
                        />
                      </div>

                      <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                        <div>
                          <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                            {t('settings.marketing')}
                          </p>
                          <p className='text-xs text-blue-600/70 dark:text-blue-300/70'>
                            {t('settings.marketingNotificationDesc')}
                          </p>
                        </div>
                        <Switch
                          checked={settings.notifications.marketing}
                          onCheckedChange={(checked: any) =>
                            updateNotificationSettings('marketing', checked)
                          }
                          className='data-[state=checked]:bg-blue-600'
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Display Settings Tab Content */}
          <TabsContent value='display' className='space-y-4'>
            <motion.div variants={itemVariants}>
              <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                  <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                    <MonitorSmartphone className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                    {t('settings.displaySettings')}
                  </CardTitle>
                  <CardDescription className='text-blue-700/70 dark:text-blue-300/70'>
                    {t('settings.displayDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6 pt-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div>
                        <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                          {t('settings.compactMode')}
                        </p>
                        <p className='text-xs text-blue-600/70 dark:text-blue-300/70'>
                          {t('settings.compactModeDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={settings.display.compactView}
                        onCheckedChange={(checked: any) =>
                          updateDisplaySettings('compactView', checked)
                        }
                        className='data-[state=checked]:bg-blue-600'
                      />
                    </div>

                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div>
                        <p className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                          {t('settings.highContrast')}
                        </p>
                        <p className='text-xs text-blue-600/70 dark:text-blue-300/70'>
                          {t('settings.highContrastDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={settings.display.highContrast}
                        onCheckedChange={(checked: any) =>
                          updateDisplaySettings('highContrast', checked)
                        }
                        className='data-[state=checked]:bg-blue-600'
                      />
                    </div>
                  </div>

                  <Separator className='bg-blue-100 dark:bg-blue-700/50' />

                  <div className='space-y-3 px-3'>
                    <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200 mb-2'>
                      {t('settings.fontSize')}
                    </h4>
                    <Select
                      value={settings.display.fontSize}
                      onValueChange={(value: any) =>
                        updateDisplaySettings('fontSize', value)
                      }
                    >
                      <SelectTrigger className='border-blue-200 dark:border-blue-700 w-full md:w-[200px]'>
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

                    <div className='mt-4 p-3 bg-blue-50/80 dark:bg-blue-800/20 rounded-lg'>
                      <div className='flex items-center'>
                        <Info className='h-4 w-4 text-blue-500 mr-2 flex-shrink-0' />
                        <p className='text-xs text-blue-600/90 dark:text-blue-300/90'>
                          {t('settings.fontSize')}{' '}
                          {settings.display.fontSize === 'small'
                            ? t('settings.small')
                            : settings.display.fontSize === 'medium'
                            ? t('settings.medium')
                            : t('settings.large')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* System Settings Tab Content */}
          <TabsContent value='system' className='space-y-4'>
            <motion.div variants={itemVariants}>
              <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                  <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                    <Smartphone className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                    {t('settings.systemSettings')}
                  </CardTitle>
                  <CardDescription className='text-blue-700/70 dark:text-blue-300/70'>
                    {t('settings.systemDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6 pt-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <div className='flex items-center'>
                        <RefreshCw className='h-5 w-5 mr-3 text-blue-600 dark:text-blue-400' />
                        <div>
                          <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>
                            {t('settings.autoCacheCleanup')}
                          </h4>
                          <p className='text-sm text-blue-600/80 dark:text-blue-300/80'>
                            {t('settings.autoCacheDesc')}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.cache.autoCleanup}
                        onCheckedChange={(checked: any) =>
                          updateCacheSettings('autoCleanup', checked)
                        }
                        className='data-[state=checked]:bg-blue-600'
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
                          <SelectTrigger className='border-blue-200 dark:border-blue-700 w-full md:w-[200px]'>
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

                  <div className='pt-2 px-3'>
                    <Button
                      variant='outline'
                      className='w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30'
                      onClick={() => {
                        toast.success(t('settings.clearCacheNow'));
                      }}
                    >
                      <RefreshCw className='h-4 w-4 mr-2' />
                      {t('settings.clearCacheNow')}
                    </Button>
                  </div>

                  <Separator className='bg-blue-100 dark:bg-blue-700/50' />

                  <div className='space-y-3 px-3'>
                    <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200 mb-2'>
                      {t('settings.appVersion')}
                    </h4>
                    <div className='flex justify-between items-center p-3 bg-blue-50/80 dark:bg-blue-800/20 rounded-lg'>
                      <p className='text-sm text-blue-600/90 dark:text-blue-300/90'>
                        1.3.5 (build 2025.03.16)
                      </p>
                      <div className='px-2 py-1 bg-blue-100 dark:bg-blue-700/30 rounded text-xs font-medium text-blue-700 dark:text-blue-300'>
                        Stable
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className='flex justify-between pt-6'>
                <Button
                  variant='outline'
                  onClick={handleReset}
                  className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30'
                >
                  <Trash className='h-4 w-4 mr-2' />
                  {t('settings.resetSettings')}
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  disabled={!isChanged || isSaving}
                  className='bg-blue-600 hover:bg-blue-700 text-white'
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
            </motion.div>
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
