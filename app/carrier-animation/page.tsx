'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import img from '../blue.png';
import { useTranslation } from '@/contexts/i18n';

export default function CarrierAnimationPage() {
  const [animationStage, setAnimationStage] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationStage(1), 4000),
      setTimeout(() => setAnimationStage(2), 8000),
      setTimeout(() => setAnimationStage(3), 10000),
      setTimeout(() => router.push('/registration-confirm'), 13000), // Redirect after showing stats
    ];
    return () => timers.forEach(clearTimeout);
  }, [router]);

  const logoVariants = {
    hidden: { x: '120%', opacity: 0, scale: 0.8 },
    visible: {
      x: '0%',
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20, duration: 3 },
    },
    exit: {
      x: '-120%',
      opacity: 0,
      scale: 0.8,
      transition: { type: 'spring', stiffness: 100, damping: 20, duration: 3 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10, delay: 0.5 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.5 } },
  };

  const statItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-purple-500 to-pink-500 overflow-hidden p-4'>
      <AnimatePresence mode='wait'>
        {animationStage < 3 && (
          <motion.div
            key='logo'
            variants={logoVariants}
            initial='hidden'
            animate={animationStage < 2 ? 'visible' : 'exit'}
            exit='exit'
            className='relative w-64 h-64 mb-8'
          >
            <Image
              src={img}
              alt='Company Logo'
              layout='fill'
              objectFit='contain'
            />
          </motion.div>
        )}

        {animationStage === 1 && (
          <motion.div
            key='text'
            variants={textVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='text-center mb-8'
          >
            <motion.h1
              className='text-4xl font-bold text-white mb-4'
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {t('animation.followYourDream')}
            </motion.h1>
            <motion.p className='text-xl text-white'>
              {t('animation.togetherSuccess')}
            </motion.p>
          </motion.div>
        )}

        {animationStage === 3 && (
          <motion.div
            key='stats'
            variants={statsVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            className='w-full max-w-4xl'
          >
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {[
                {
                  label: t('animation.stats.users'),
                  value: '+48,437',
                  icon: '👥',
                },
                {
                  label: t('animation.stats.carriers'),
                  value: '+43,743',
                  icon: '🚚',
                },
                {
                  label: t('animation.stats.cargos'),
                  value: '+4,343',
                  icon: '📦',
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={statItemVariants}
                  className='bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center text-center'
                >
                  <span className='text-5xl mb-4'>{stat.icon}</span>
                  <h3 className='text-2xl font-semibold text-white mb-2'>
                    {stat.label}
                  </h3>
                  <p className='text-4xl font-bold text-yellow-300'>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
