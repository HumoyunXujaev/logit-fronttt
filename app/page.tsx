'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from '@/contexts/i18n';
import {
  ArrowRight,
  Zap,
  Truck,
  Globe,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        colorScheme: string;
        themeParams: any;
        isExpanded: boolean;
        isFullscreen: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        enableClosingConfirmation(): unknown;
        ready(): unknown;
        expand(): unknown;
        close(): unknown;
        onEvent(eventType: any, eventHandler: any): unknown;
        requestFullscreen(): unknown;
        exitFullscreen(): unknown;
        offEvent(eventType: any, eventHandler: any): unknown;
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
          };
          auth_date: string;
          hash: string;
        };
      };
    };
  }
}

interface FeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const Feature: React.FC<FeatureProps> = ({
  title,
  description,
  icon: Icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg'
    >
      <div className='flex items-start space-x-4'>
        <div className='bg-blue-600/30 rounded-full p-3 mt-1'>
          <Icon className='h-6 w-6 text-blue-100' />
        </div>
        <div>
          <h3 className='font-bold text-lg text-white mb-2'>{title}</h3>
          <p className='text-blue-100'>{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [webAppData, setWebAppData] = useState<any>(null);
  const { t } = useTranslation();

  // Animation variants for containers
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for children
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  useEffect(() => {
    // Check if running in Telegram WebApp environment
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      // Get all available WebApp data
      const webAppInitData = {
        initDataRaw: tg.initData,
        initDataParsed: tg.initDataUnsafe,
        // You can add more WebApp properties here as needed
        colorScheme: tg.colorScheme,
        themeParams: tg.themeParams,
        isExpanded: tg.isExpanded,
        viewportHeight: tg.viewportHeight,
        viewportStableHeight: tg.viewportStableHeight,
      };
      // Enable closing confirmation if needed
      tg.enableClosingConfirmation();
      // Ready event to Telegram
      tg.ready();
      setWebAppData(tg);
    }
  }, []);

  const features = [
    {
      title: t('home.features.fastDelivery') || 'Быстрая доставка',
      description:
        t('home.features.fastDeliveryDesc') ||
        'Найдите перевозчиков и отправляйте грузы в любую точку',
      icon: Truck,
    },
    {
      title: t('home.features.verified') || 'Проверенные перевозчики',
      description:
        t('home.features.verifiedDesc') ||
        'Все перевозчики проходят строгую верификацию',
      icon: ShieldCheck,
    },
    {
      title: t('home.features.locations') || 'Международная логистика',
      description:
        t('home.features.locationsDesc') ||
        'Перевозки по всему миру и точный расчет маршрутов',
      icon: Globe,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-800 via-blue-700 to-blue-900 flex flex-col'>
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>

      <motion.main
        className='flex-grow flex flex-col justify-between px-4 py-12 z-10 relative'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='max-w-md mx-auto w-full'>
          <motion.div className='mb-12 text-center' variants={itemVariants}>
            <div className='flex justify-center mb-6'>
              <div className='w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shadow-lg'>
                <Zap className='h-10 w-10 text-yellow-300' />
              </div>
            </div>
            <h1 className='text-4xl font-bold mb-4 text-white text-center'>
              {t('home.whatBotCanDo')}
            </h1>
            <div className='space-y-2 text-center text-blue-100'>
              <p>{t('home.description')}</p>
              <p className='font-semibold text-white'>
                Logit-Smartbot - №1{' '}
                <span className='text-yellow-300'>
                  Крупнейшая ассоциация логистики
                </span>{' '}
                в Узбекистане
              </p>
            </div>
          </motion.div>

          <motion.div className='space-y-4 mb-12' variants={itemVariants}>
            {features.map((feature, index) => (
              <Feature
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className='max-w-md w-full mx-auto'>
          <Link href='/select-lang' className='w-full block'>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className='w-full bg-white text-blue-800 font-bold py-4 px-6 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <span className='text-xl'>{t('home.startButton')}</span>
              <ArrowRight className='ml-2 h-6 w-6' />
            </motion.button>
          </Link>

          <p className='text-center text-blue-300 text-sm mt-6'>
            Разработано Logit School © 2023-{new Date().getFullYear()}
          </p>
        </motion.div>
      </motion.main>
    </div>
  );
}
