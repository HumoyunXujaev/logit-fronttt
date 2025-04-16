'use client';
import Link from 'next/link';
import { User, Building2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from '@/contexts/i18n';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PersonTypeSelection() {
  const { userState, setUserType } = useUser();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (userState.isAuthenticated) {
      router.push('/home');
    }
  }, [userState.isAuthenticated, router]);

  const handleTypeSelect = (type: 'individual' | 'legal') => {
    setUserType(type);
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
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className='text-3xl font-bold mb-6 text-center text-white'>
                  {t('selectPerson.title')}
                </h1>
                <div className='mb-8 text-center text-blue-100'>
                  <p>{t('selectPerson.description')}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className='space-y-4'
              >
                <Link
                  href='/select-role?type=individual'
                  onClick={() => handleTypeSelect('individual')}
                >
                  <Button className='w-full h-20 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-lg font-medium transition-all flex items-center justify-center shadow-md hover:shadow-lg border border-blue-500'>
                    <div className='w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mr-4'>
                      <User className='h-6 w-6 text-white' />
                    </div>
                    <span>{t('selectPerson.individual')}</span>
                  </Button>
                </Link>

                <Link
                  href='/select-role?type=legal'
                  onClick={() => handleTypeSelect('legal')}
                >
                  <Button className='w-full h-20 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-lg font-medium transition-all flex items-center justify-center shadow-md hover:shadow-lg border border-blue-500'>
                    <div className='w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mr-4'>
                      <Building2 className='h-6 w-6 text-white' />
                    </div>
                    <span>{t('selectPerson.legal')}</span>
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
