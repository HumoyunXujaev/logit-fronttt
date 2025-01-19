'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Bell, Globe, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uz', name: 'Ozbek', flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

const NotificationToggle: React.FC<{
  enabled: boolean;
  toggle: () => void;
}> = ({ enabled, toggle }) => {
  return (
    <motion.div
      className='relative w-64 h-64 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full cursor-pointer overflow-hidden'
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className='absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500'
        initial={{ scale: 0 }}
        animate={{ scale: enabled ? 1 : 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
      />
      <motion.div
        className='absolute inset-0 flex items-center justify-center'
        animate={{ rotate: enabled ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Bell
          className={`h-24 w-24 ${enabled ? 'text-white' : 'text-gray-300'}`}
        />
      </motion.div>
      <AnimatePresence>
        {enabled && (
          <motion.div
            className='absolute inset-0'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className='absolute'
                initial={{ x: '50%', y: '50%', scale: 0 }}
                animate={{
                  x: `${50 + 35 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                  y: `${50 + 35 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.1,
                }}
              >
                <Star className='h-4 w-4 text-white' />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LanguageSelector: React.FC<{
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}> = ({ selectedLanguage, setSelectedLanguage }) => {
  const [showLanguages, setShowLanguages] = useState(false);

  return (
    <div className='mt-6 relative'>
      <Button
        variant='outline'
        onClick={() => setShowLanguages(!showLanguages)}
        className='w-full justify-between'
      >
        <span>
          {languages.find((lang) => lang.code === selectedLanguage)?.name}
        </span>
        <Globe className='h-5 w-5' />
      </Button>
      <AnimatePresence>
        {showLanguages && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-10'
          >
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant='ghost'
                className='w-full justify-start'
                onClick={() => {
                  setSelectedLanguage(lang.code);
                  setShowLanguages(false);
                }}
              >
                <span className='mr-2'>{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AppSettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ru');
  const router = useRouter();
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex items-center mb-8'
      >
        <Button
          variant='ghost'
          className='mr-4 text-white'
          onClick={() => {
            router.push('/menu');
          }}
        >
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-3xl font-bold'>Настройки</h1>
      </motion.div>

      <Card className='bg-gray-800 border-gray-700'>
        <CardContent className='p-6'>
          <h2 className='text-xl font-semibold mb-4 text-center'>
            Уведомления
          </h2>
          <div className='flex justify-center mb-4'>
            <NotificationToggle
              enabled={notificationsEnabled}
              toggle={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>
          <p className='text-center text-lg'>
            {notificationsEnabled
              ? 'Уведомления включены'
              : 'Уведомления выключены'}
          </p>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
