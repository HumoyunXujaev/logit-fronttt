'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  KeyRound,
  Phone,
  ArrowRight,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '@/contexts/i18n';

export default function StudentPasswordPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate password verification
    setTimeout(() => {
      if (password === '1234') {
        // This is just a placeholder, real logic would check against API
        router.push('/registration');
      } else {
        setError(
          t('student.password.incorrectPassword') ||
            'Неверный пароль. Пожалуйста, проверьте пароль или обратитесь к администратору.'
        );
      }
      setIsLoading(false);
    }, 800);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-800 to-blue-900 flex flex-col'>
      {/* Background decoration */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/30 to-transparent'></div>
        <div className='absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl'></div>
        <div className='absolute top-1/3 -left-20 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl'></div>
      </div>

      <motion.main
        className='flex-grow flex items-center justify-center p-6 relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div className='w-full max-w-md' variants={itemVariants}>
          <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 overflow-hidden'>
            <div className='flex justify-center mb-6'>
              <div className='w-20 h-20 bg-blue-600/30 rounded-full flex items-center justify-center'>
                <GraduationCap className='h-10 w-10 text-white' />
              </div>
            </div>

            <h1 className='text-2xl font-bold mb-2 text-center text-white'>
              {t('student.password.botAccess')}
            </h1>

            <p className='mb-8 text-center text-blue-100'>
              {t('student.password.description')}
            </p>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                  <KeyRound className='h-5 w-5 text-blue-300' />
                </div>

                <Input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-10 pr-10 py-6 bg-white/10 border-white/20 text-white text-xl tracking-widest placeholder:text-blue-200/50 focus:border-blue-400 focus:ring-blue-400/30'
                  placeholder={t('student.password.enterPassword')}
                  required
                />

                <div
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                  onClick={togglePasswordVisibility}
                >
                  <Lock className='h-5 w-5 text-blue-300' />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg'
                >
                  <ShieldAlert className='h-5 w-5 text-red-300 flex-shrink-0' />
                  <p className='text-sm text-red-200'>{error}</p>
                </motion.div>
              )}

              <Button
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg font-semibold transition-all flex items-center justify-center'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2'></div>
                    {t('common.loading')}
                  </div>
                ) : (
                  <>
                    {t('student.password.confirm')}
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </>
                )}
              </Button>
            </form>
          </div>

          <motion.div className='mt-8' variants={itemVariants}>
            <Button
              onClick={() => alert('Calling administrator')}
              className='w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-center'
            >
              <Phone className='mr-2' size={20} />
              {t('student.password.callAdmin')}
            </Button>
          </motion.div>
        </motion.div>
      </motion.main>
    </div>
  );
}
