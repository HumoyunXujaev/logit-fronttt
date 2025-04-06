'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n';

export default function NotFoundPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center'
      >
        <div className='flex justify-center mb-6'>
          <div className='w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center'>
            <AlertCircle className='h-12 w-12 text-blue-600' />
          </div>
        </div>
        <h1 className='text-3xl font-bold mb-2 text-gray-800'>
          {t('notFound.pageNotFound')}
        </h1>
        <p className='text-gray-600 mb-8'>{t('notFound.pageNotFoundDesc')}</p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Button
            onClick={() => router.back()}
            variant='outline'
            className='flex items-center justify-center'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            {t('notFound.goBack')}
          </Button>
          <Link href='/home' passHref>
            <Button className='flex items-center justify-center bg-blue-600 hover:bg-blue-700'>
              <Home className='mr-2 h-4 w-4' />
              {t('notFound.goHome')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
