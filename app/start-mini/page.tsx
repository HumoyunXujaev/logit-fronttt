'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Truck,
  Package,
  MapPin,
} from 'lucide-react';
import { useTranslation } from '@/contexts/i18n';

export default function StartMiniWebsite() {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const features = [
    {
      icon: Truck,
      title: t('home.features.fastDelivery') || 'Быстрая доставка',
      description:
        t('home.features.fastDeliveryDesc') ||
        'Найдите перевозчиков и отправляйте грузы в любую точку',
    },
    {
      icon: CheckCircle,
      title: t('home.features.verified') || 'Проверенные перевозчики',
      description:
        t('home.features.verifiedDesc') ||
        'Все перевозчики проходят строгую верификацию',
    },
    {
      icon: Package,
      title: t('home.features.tracking') || 'Отслеживание грузов',
      description:
        t('home.features.trackingDesc') ||
        'Следите за перемещением вашего груза в реальном времени',
    },
    {
      icon: Star,
      title: t('home.features.rating') || 'Система рейтинга',
      description:
        t('home.features.ratingDesc') ||
        'Оценивайте качество услуг и выбирайте лучших перевозчиков',
    },
    {
      icon: MapPin,
      title: t('home.features.locations') || 'Международная логистика',
      description:
        t('home.features.locationsDesc') ||
        'Перевозки по всему миру и точный расчет маршрутов',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-blue-700 to-blue-900'>
      <main className='flex-grow flex items-center justify-center p-6'>
        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='w-full max-w-md'
        >
          {/* Welcome Card */}
          <motion.div
            variants={itemVariants}
            className='bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6'
          >
            <h1 className='text-3xl font-bold mb-4 text-center text-white'>
              {t('home.greeting')}
            </h1>
            <div className='mb-6 text-center text-blue-100'>
              <p className='mb-4'>{t('home.greetingMessage')}</p>
              <p>{t('home.workMessage')}</p>
              <p className='mt-4 font-semibold text-yellow-300'>
                {t('home.thanks')}
              </p>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className='space-y-3 mb-8'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 flex items-center'
              >
                <div className='bg-blue-600/70 rounded-full p-2 mr-4'>
                  <feature.icon className='h-6 w-6 text-white' />
                </div>
                <div>
                  <h3 className='font-semibold text-white'>{feature.title}</h3>
                  <p className='text-sm text-blue-100'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Begin button (mobile-optimized positioning) */}
          <motion.div variants={itemVariants}>
            <Link
              href='/registration'
              className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 
              text-white text-center py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 
              flex items-center justify-center shadow-lg hover:shadow-xl border border-blue-400'
            >
              {t('home.start')}
              <ArrowRight className='ml-2' size={20} />
            </Link>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className='text-center text-blue-200 text-sm mt-4 opacity-80'
          >
            {t('home.startNote') ||
              'Нажмите, чтобы начать использовать платформу'}
          </motion.p>
        </motion.div>
      </main>

      <footer className='py-4 px-6 text-center text-blue-300 text-xs bg-black/10 backdrop-blur-sm'>
        <p>Logit-Smartbot © 2023 - {new Date().getFullYear()}</p>
        <p className='mt-1'>№1 Крупнейшая ассоциация логистики в Узбекистане</p>
      </footer>
    </div>
  );
}
