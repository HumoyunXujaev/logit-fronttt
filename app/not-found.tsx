'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n';

export default function NotFoundPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-white rounded-2xl shadow-xl overflow-hidden'
        >
          {/* Header with 404 */}
          <div className='bg-blue-600 p-8 flex flex-col items-center justify-center relative overflow-hidden'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,rgba(255,255,255,0)_70%)]'></div>
            <AlertTriangle className='h-16 w-16 text-white mb-4' />
            <h1 className='text-5xl font-bold text-white mb-2'>404</h1>
            <p className='text-blue-100 text-lg'>
              {t('notFound.pageNotFound')}
            </p>
          </div>

          {/* Content */}
          <div className='p-8'>
            <p className='text-gray-600 mb-8 text-center'>
              {t('notFound.pageNotFoundDesc')}
            </p>

            <div className='space-y-4'>
              <Button
                onClick={() => router.back()}
                variant='outline'
                className='w-full flex items-center justify-center border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700'
              >
                <ArrowLeft className='mr-2 h-5 w-5' />
                {t('notFound.goBack')}
              </Button>
              <br/>

              <Link href='/home' passHref>
                <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 flex items-center justify-center'>
                  <Home className='mr-2 h-5 w-5' />
                  {t('notFound.goHome')}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='mt-6 text-center text-sm text-blue-300'
        >
          Logit Smartbot © {new Date().getFullYear()}
        </motion.p>
      </div>
    </div>
  );
}
