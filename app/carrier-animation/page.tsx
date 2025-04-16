'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import img from '../blue.png';
import { useTranslation } from '@/contexts/i18n';
import { Truck, Users, Package, ArrowRight, Star } from 'lucide-react';

export default function CarrierAnimationPage() {
  const [animationStage, setAnimationStage] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 2000),
      setTimeout(() => setAnimationStage(2), 5000),
      setTimeout(() => setAnimationStage(3), 8000),
      setTimeout(() => router.push('/registration-confirm'), 12000), // Redirect after showing stats
    ];

    return () => timers.forEach(clearTimeout);
  }, [router]);

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        duration: 1,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  const statsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
        duration: 0.5,
      },
    },
  };

  const statsItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-blue-800 to-purple-900 overflow-hidden justify-center items-center'>
      <div className='fixed inset-0 z-0'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0,rgba(91,33,182,0)_70%)]'></div>
        <div className='absolute top-0 w-full h-1/3 bg-gradient-to-b from-blue-500/10 to-transparent'></div>
        <div className='absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-purple-900/30 to-transparent'></div>
      </div>

      <div className='relative z-10 w-full max-w-4xl px-4'>
        <AnimatePresence mode='wait'>
          {(animationStage === 0 || animationStage === 1) && (
            <motion.div
              key='logo'
              variants={logoVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              className='mx-auto flex flex-col items-center justify-center'
            >
              <div className='relative w-48 h-48 mb-6'>
                <div className='absolute -inset-4 rounded-full bg-blue-600/20 blur-xl animate-pulse'></div>
                <Image
                  src={img}
                  alt='Company Logo'
                  width={200}
                  height={200}
                  className='relative drop-shadow-2xl'
                />
              </div>

              {animationStage === 1 && (
                <motion.div
                  variants={textVariants}
                  initial='hidden'
                  animate='visible'
                  exit='exit'
                  className='text-center mb-8'
                >
                  <motion.h1
                    className='text-4xl sm:text-5xl font-bold text-white mb-4'
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                  >
                    {t('animation.followYourDream')}
                  </motion.h1>
                  <motion.p
                    className='text-xl text-blue-100 max-w-md mx-auto'
                    style={{ textShadow: '0 1px 5px rgba(0,0,0,0.2)' }}
                  >
                    {t('animation.togetherSuccess')}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}

          {animationStage === 2 && (
            <motion.div
              key='transition'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='text-center'
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className='mx-auto bg-blue-600/30 backdrop-blur-md w-24 h-24 rounded-full flex items-center justify-center mb-6'
              >
                <ArrowRight className='h-12 w-12 text-white' />
              </motion.div>
              <motion.p
                className='text-xl text-blue-100'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Подключаемся к платформе...
              </motion.p>
            </motion.div>
          )}

          {animationStage === 3 && (
            <motion.div
              key='stats'
              variants={statsContainerVariants}
              initial='hidden'
              animate='visible'
              className='w-full'
            >
              <h2 className='text-2xl sm:text-3xl font-bold text-center text-white mb-8'>
                Присоединяйтесь к лидерам рынка
              </h2>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                {[
                  {
                    icon: Users,
                    label: t('animation.stats.users'),
                    value: '+48,437',
                    color: 'from-blue-500 to-cyan-400',
                    iconBg: 'bg-blue-400/20',
                  },
                  {
                    icon: Truck,
                    label: t('animation.stats.carriers'),
                    value: '+43,743',
                    color: 'from-purple-500 to-pink-400',
                    iconBg: 'bg-purple-400/20',
                  },
                  {
                    icon: Package,
                    label: t('animation.stats.cargos'),
                    value: '+4,343',
                    color: 'from-amber-500 to-yellow-400',
                    iconBg: 'bg-amber-400/20',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={statsItemVariants}
                    className='bg-white/10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center justify-center text-center'
                  >
                    <div
                      className={`${stat.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}
                    >
                      <stat.icon className='h-8 w-8 text-white' />
                    </div>
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      {stat.label}
                    </h3>
                    <p
                      className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className='mt-8 text-center'
              >
                <p className='text-blue-200 mb-2'>Загрузка завершена</p>
                <div className='inline-flex items-center text-white/70 text-sm'>
                  <Star className='h-4 w-4 text-yellow-400 mr-1' />
                  <span>Перенаправление...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
