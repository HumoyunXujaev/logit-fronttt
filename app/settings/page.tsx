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
import NavigationMenu from '@/app/components/NavigationMenu';
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

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languageOptions: Language[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
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

      toast.success('Настройки успешно сохранены');
      setIsChanged(false);
    } catch (error) {
      toast.error('Ошибка при сохранении настроек');
      console.error('Settings save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
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

    toast.info('Настройки сброшены до значений по умолчанию');
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

  const handleLanguageChange = (value: string) => {
    setSettings({
      ...settings,
      language: value,
    });
  };

  const handleThemeChange = (value: string) => {
    setSettings({
      ...settings,
      theme: value,
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
          <h1 className='text-2xl font-bold'>Настройки приложения</h1>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='grid grid-cols-4 mb-6'>
            <TabsTrigger value='general'>Общие</TabsTrigger>
            <TabsTrigger value='notifications'>Уведомления</TabsTrigger>
            <TabsTrigger value='display'>Отображение</TabsTrigger>
            <TabsTrigger value='system'>Система</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Основные настройки</CardTitle>
                <CardDescription>
                  Настройте основные параметры приложения
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Globe className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>Язык</h4>
                        <p className='text-sm text-gray-500'>
                          Выберите язык интерфейса
                        </p>
                      </div>
                    </div>
                    <Select
                      value={settings.language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className='flex items-center'>
                              <span className='mr-2'>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        <h4 className='font-medium text-sm'>Тема</h4>
                        <p className='text-sm text-gray-500'>
                          Выберите тему оформления
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
                        Светлая
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
                        Тёмная
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='notifications' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>
                  Управляйте уведомлениями и оповещениями
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <Bell className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>
                          Push-уведомления
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Получать уведомления в приложении
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
                          Звуковые уведомления
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Включить звуки при уведомлениях
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
                  <h4 className='font-medium text-sm'>Типы уведомлений</h4>

                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm'>Грузы и заявки</p>
                      <p className='text-xs text-gray-500'>
                        Уведомления о новых грузах и заявках
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
                      <p className='text-sm'>Сообщения</p>
                      <p className='text-xs text-gray-500'>
                        Уведомления о новых сообщениях
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
                      <p className='text-sm'>Системные</p>
                      <p className='text-xs text-gray-500'>
                        Уведомления о статусе системы
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
                      <p className='text-sm'>Маркетинговые</p>
                      <p className='text-xs text-gray-500'>
                        Новости и специальные предложения
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
                <CardTitle>Настройки отображения</CardTitle>
                <CardDescription>
                  Настройте внешний вид приложения
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>Компактный режим</p>
                      <p className='text-xs text-gray-500'>
                        Уменьшает отступы и размеры элементов
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
                        Высокая контрастность
                      </p>
                      <p className='text-xs text-gray-500'>
                        Увеличивает контрастность текста и элементов
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
                  <h4 className='font-medium text-sm mb-2'>Размер шрифта</h4>
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
                      <SelectItem value='small'>Маленький</SelectItem>
                      <SelectItem value='medium'>Средний</SelectItem>
                      <SelectItem value='large'>Большой</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='system' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Системные настройки</CardTitle>
                <CardDescription>
                  Управление кэшем и системными параметрами
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <RefreshCw className='h-5 w-5 mr-2 text-blue-500' />
                      <div>
                        <h4 className='font-medium text-sm'>
                          Автоочистка кэша
                        </h4>
                        <p className='text-sm text-gray-500'>
                          Периодически очищать кэш приложения
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
                          <SelectItem value='daily'>Ежедневно</SelectItem>
                          <SelectItem value='weekly'>Еженедельно</SelectItem>
                          <SelectItem value='monthly'>Ежемесячно</SelectItem>
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
                      toast.success('Кэш очищен');
                    }}
                  >
                    Очистить кэш сейчас
                  </Button>
                </div>

                <Separator />

                <div className='space-y-2'>
                  <h4 className='font-medium text-sm mb-2'>
                    Версия приложения
                  </h4>
                  <p className='text-sm text-gray-500'>
                    1.3.5 (build 2025.03.16)
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className='flex justify-between pt-4'>
              <Button variant='outline' onClick={handleReset}>
                Сбросить настройки
              </Button>

              <Button
                onClick={handleSaveSettings}
                disabled={!isChanged || isSaving}
                className='bg-blue-600 hover:bg-blue-700'
              >
                {isSaving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Сохранить
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
