'use client';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '@/contexts/i18n';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export default function LanguageSelection() {
  const { userState, setLanguage } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (userState.isAuthenticated) {
      router.push('/home');
    }
  }, [userState.isAuthenticated, router]);

  const handleLanguageSelect = (language: 'ru' | 'uz') => {
    setLanguage(language);
  };

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-blue-800 to-blue-600'>
      <main className='flex-grow flex items-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          <Card className='bg-blue-700/20 backdrop-blur-sm rounded-lg shadow-2xl border border-blue-400/30 overflow-hidden'>
            <CardContent className='p-8'>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex flex-col items-center'
              >
                <div className='w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-4'>
                  <Languages className='h-8 w-8 text-white' />
                </div>

                <h1 className='text-3xl font-bold mb-6 text-center text-white'>
                  {t('selectLang.title')}
                </h1>

                <div className='mb-8 text-center text-blue-100'>
                  <p>{t('selectLang.description')}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className='grid grid-cols-2 gap-4'
              >
                <Link
                  href='/select-person'
                  onClick={() => handleLanguageSelect('ru')}
                  className='block'
                >
                  <Button className='w-full h-24 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-lg font-medium transition-all flex flex-col items-center justify-center shadow-md hover:shadow-lg border border-blue-500'>
                    <span className='text-2xl mb-2'>🇷🇺</span>
                    <span>Русский</span>
                  </Button>
                </Link>

                <Link
                  href='/select-person'
                  onClick={() => handleLanguageSelect('uz')}
                  className='block'
                >
                  <Button className='w-full h-24 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-lg font-medium transition-all flex flex-col items-center justify-center shadow-md hover:shadow-lg border border-blue-500'>
                    <span className='text-2xl mb-2'>🇺🇿</span>
                    <span>O'zbekcha</span>
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
