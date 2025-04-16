'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import AuthService from '@/lib/auth';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/i18n';
import { toast } from 'sonner';
import {
  Smartphone,
  MessageSquare,
  Send,
  ArrowRight,
  CheckCircle2,
  Loader2,
  User,
  ShieldCheck,
} from 'lucide-react';

const RegistrationCompletionPage: React.FC = () => {
  const [stage, setStage] = useState<'contact-info' | 'confirmation'>(
    'contact-info'
  );
  const { userState, setUserData, setUserRole, setUserType, setLanguage } =
    useUser();
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error(t('cargo.requiredField'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the WebApp data
      if (window.Telegram?.WebApp) {
        const webApp = window?.Telegram?.WebApp;

        // Send registration with full data
        const result = await AuthService.registerUser({
          telegramData: webApp,
          userData: {
            type: userState.type,
            role: userState.role,
            preferred_language: userState.language,
            phone_number: phone,
            whatsapp_number: whatsapp,
            username: telegram,
          },
        });

        console.log(result, 'result');

        // Set the user data in context
        await setUserRole(userState.role);
        await setUserType(userState.type);
        await setLanguage(userState.language);

        toast.success(t('registration.successMessage'));

        // Move to confirmation stage
        setStage('confirmation');
      } else {
        // Handle case when not in Telegram WebApp
        toast.error('Telegram WebApp not available');
      }
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: '100%' },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: '-100%' },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4'>
      <AnimatePresence mode='wait'>
        {stage === 'contact-info' && (
          <motion.div
            key='contact-info'
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            transition={pageTransition}
            className='w-full max-w-md'
          >
            <Card className='shadow-xl border-0 overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-blue-600 to-blue-500 pb-6'>
                <div className='flex justify-center mb-4'>
                  <div className='bg-white/20 p-4 rounded-full'>
                    <ShieldCheck className='h-10 w-10 text-white' />
                  </div>
                </div>
                <CardTitle className='text-2xl text-center text-white'>
                  {t('registrationConfirm.congratulations')}
                </CardTitle>
              </CardHeader>

              <CardContent className='p-6 pt-8'>
                <p className='mb-6 text-gray-600 text-center'>
                  {t('registrationConfirm.identificationSuccess')}
                </p>

                <form onSubmit={handleSubmit} className='space-y-5'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      {t('registrationConfirm.mobilePhone')}*
                    </label>
                    <div className='relative'>
                      <Smartphone className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                      <Input
                        type='tel'
                        placeholder={t('registrationConfirm.mobilePhone')}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className='pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      {t('registrationConfirm.whatsApp')}
                    </label>
                    <div className='relative'>
                      <MessageSquare className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                      <Input
                        type='tel'
                        placeholder={t('registrationConfirm.whatsApp')}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className='pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      {t('registrationConfirm.telegram')}
                    </label>
                    <div className='relative'>
                      <Send className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                      <Input
                        type='text'
                        placeholder={t('registrationConfirm.telegram')}
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        className='pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                      />
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white mt-4'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('registrationConfirm.next')}
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
            className='w-full max-w-md'
          >
            <Card className='shadow-xl border-0 overflow-hidden'>
              <CardHeader className='bg-gradient-to-r from-green-600 to-green-500 pb-6'>
                <div className='flex justify-center mb-4'>
                  <div className='bg-white/20 p-4 rounded-full'>
                    <CheckCircle2 className='h-10 w-10 text-white' />
                  </div>
                </div>
                <CardTitle className='text-2xl text-center text-white'>
                  {t('registrationConfirm.congratulations')}
                </CardTitle>
              </CardHeader>

              <CardContent className='p-6 text-center'>
                <p className='mb-6 text-gray-600'>
                  {t('registrationConfirm.registrationSuccess')}
                </p>
                <p className='mb-8 text-gray-600'>
                  {t('registrationConfirm.profileEdit')}
                </p>

                <div className='bg-blue-50 rounded-lg p-4 mb-6 text-blue-700 flex items-start'>
                  <User className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-500' />
                  <p className='text-sm'>
                    {t('menu.personalInfo')} {t('menu.editProfile')}
                  </p>
                </div>
              </CardContent>

              <CardFooter className='p-6 pt-0'>
                <Button
                  onClick={() => router.push('/menu')}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                >
                  {t('registrationConfirm.goToProfile')}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationCompletionPage;
