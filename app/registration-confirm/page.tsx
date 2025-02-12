'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthService from '@/lib/auth';
import { useUser } from '@/contexts/UserContext';

const RegistrationCompletionPage: React.FC = () => {
  const [stage, setStage] = useState<'contact-info' | 'confirmation'>(
    'contact-info'
  );
  const { userState } = useUser();
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // if (window.Telegram?.WebApp) {
      const webApp = window?.Telegram?.WebApp;

      // Отправляем регистрацию с полными данными
      const result = await AuthService.registerUser({
        telegramData: webApp,
        userData: {
          type: userState.type,
          role: userState.role,
          preferred_language: userState.language,
          phone_number: phone,
          whatsapp_number: whatsapp,
        },
      });

      console.log(result, 'result');
      // }
      // await setUserData({
      //   result,

      //   // role: userState.role,
      // });
      // await setUserRole(userState.role);
      // await setUserType(userState.type);
      // await setLanguage(userState.language);
      // await setUserType({ type: userState.type })

      // toast.success('Регистрация успешно завершена');

      // router.push('/menu');
    } catch (error) {
      // toast.error('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
      console.error('Registration error:', error);
    }
    // Здесь должна быть логика отправки данных на сервер
    setStage('confirmation');
  };

  const pageVariants = {
    initial: { opacity: 0, x: '-100%' },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: '100%' },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className='min-h-screen bg-blue-600 flex items-center justify-center p-4'>
      <AnimatePresence mode='wait'>
        {stage === 'contact-info' && (
          <motion.div
            key='contact-info'
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            transition={pageTransition}
            className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full'
          >
            <h1 className='text-3xl font-bold mb-6 text-blue-800 text-center'>
              Поздравляем!
            </h1>
            <p className='mb-6 text-gray-600 text-center'>
              Идентификация прошла успешно. В целях улучшения взаимодействия и
              связи с нашими логистами, пожалуйста, предоставьте актуальные
              контактные данные.
            </p>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                type='tel'
                placeholder='Мобильный телефон'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className='w-full'
              />
              <Input
                type='tel'
                placeholder='WhatsApp'
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
                className='w-full'
              />
              <Input
                type='text'
                placeholder='Telegram'
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                required
                className='w-full'
              />
              <Button
                type='submit'
                className='w-full bg-blue-500 hover:bg-blue-600 text-white'
              >
                Далее
              </Button>
            </form>
          </motion.div>
        )}

        {stage === 'confirmation' && (
          <motion.div
            key='confirmation'
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            transition={pageTransition}
            className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center'
          >
            <h1 className='text-3xl font-bold mb-6 text-blue-800'>
              Поздравляем!
            </h1>
            <p className='mb-6 text-gray-600'>
              Регистрация прошла успешно. Теперь вы можете полностью бесплатно
              пользоваться нашими услугами.
            </p>
            <p className='mb-6 text-gray-600'>
              Вы можете изменить все свои данные в разделе Меню - Личный
              кабинет.
            </p>
            <Button
              onClick={() => router.push('/menu')}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white'
            >
              Перейти в личный кабинет
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationCompletionPage;
