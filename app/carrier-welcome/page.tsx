'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TruckIcon, Shield, Star, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/i18n';

export default function CarrierWelcomePage() {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex flex-col items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        {/* Welcome Card */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden mb-6'>
          {/* Header */}
          <div className='bg-blue-600 p-5 flex items-center justify-center'>
            <div className='bg-white/20 p-4 rounded-full'>
              <TruckIcon className='h-10 w-10 text-white' />
            </div>
          </div>

          {/* Content */}
          <div className='p-6'>
            <h1 className='text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-900'>
              {t('home.carrierGreeting')}
            </h1>
            <div className='space-y-4 text-gray-600'>
              <p className='text-center'>{t('home.greetingMessage')}</p>
              <p className='text-center'>{t('home.workMessage')}</p>
              <p className='mt-4 font-semibold text-center text-blue-600'>
                {t('home.thanks')}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className='bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6'
        >
          <h2 className='text-lg font-semibold text-white mb-4 flex items-center'>
            <Star className='h-5 w-5 mr-2 text-yellow-300' />
            {t('vehicle.title')}
          </h2>
          <div className='space-y-3'>
            <div className='flex items-center text-white'>
              <CheckCircle className='h-5 w-5 mr-3 text-green-400 flex-shrink-0' />
              <span className='text-sm'>
                Быстрый поиск и размещение заказов
              </span>
            </div>
            <div className='flex items-center text-white'>
              <CheckCircle className='h-5 w-5 mr-3 text-green-400 flex-shrink-0' />
              <span className='text-sm'>Надежная система верификации</span>
            </div>
            <div className='flex items-center text-white'>
              <CheckCircle className='h-5 w-5 mr-3 text-green-400 flex-shrink-0' />
              <span className='text-sm'>Постоянный поток заказов</span>
            </div>
            <div className='flex items-center text-white'>
              <CheckCircle className='h-5 w-5 mr-3 text-green-400 flex-shrink-0' />
              <span className='text-sm'>Оповещения о новых заказах</span>
            </div>
          </div>
        </motion.div>

        {/* Begin button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href='/carrier-animation'
            className='w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 text-center py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl'
          >
            {t('home.start')}
            <ArrowRight className='ml-2' size={24} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Protected by */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className='mt-8 flex items-center text-white/70 text-sm'
      >
        <Shield className='h-4 w-4 mr-2' />
        <span>Logit Smartbot © 2023-2025</span>
      </motion.div>
    </div>
  );
}
