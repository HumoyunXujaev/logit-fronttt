'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/i18n';
import {
  User,
  Truck,
  Building2,
  Package,
  Briefcase,
  TrendingUp,
  ArrowLeft,
  LockIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function UserRoleSelection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userState, setUserRole } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    if (userState.isAuthenticated) {
      router.push('/home');
    }
  }, [userState, router]);

  const handleRoleSelect = (role: string) => {
    // Disabled roles should not be selectable
    if (role === 'transport-company' || role === 'logit-trans') {
      return;
    }
    setUserRole(role as any);
    if (role === 'student') {
      router.push('/student-password');
    } else if (role === 'carrier') {
      router.push('/carrier-welcome');
    } else {
      router.push('/start-mini');
    }
  };

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
    visible: { opacity: 1, y: 0 },
  };

  const renderIndividualButtons = () => (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4'
    >
      <motion.div variants={itemVariants}>
        <Button
          onClick={() => handleRoleSelect('student')}
          className='w-full h-36 bg-blue-600 hover:bg-blue-700 text-white text-center p-6 rounded-lg transition-all flex flex-col items-center justify-center shadow-md hover:shadow-lg border border-blue-500'
        >
          <div className='w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-3'>
            <User size={32} className='text-white' />
          </div>
          <span className='text-lg font-medium'>{t('selectRole.student')}</span>
          <span className='text-xs mt-1 text-blue-100'>
            {t('selectRole.studentDesc')}
          </span>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          onClick={() => handleRoleSelect('carrier')}
          className='w-full h-36 bg-blue-600 hover:bg-blue-700 text-white text-center p-6 rounded-lg transition-all flex flex-col items-center justify-center shadow-md hover:shadow-lg border border-blue-500'
        >
          <div className='w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-3'>
            <Truck size={32} className='text-white' />
          </div>
          <span className='text-lg font-medium'>{t('selectRole.carrier')}</span>
          <span className='text-xs mt-1 text-blue-100'>
            {t('selectRole.carrierDesc')}
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderLegalButtons = () => (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4'
    >
      <motion.div variants={itemVariants}>
        <Button
          onClick={() => handleRoleSelect('cargo-owner')}
          className='w-full h-36 bg-blue-600 hover:bg-blue-700 text-white text-center p-6 rounded-lg transition-all flex flex-col items-center justify-center shadow-md hover:shadow-lg border border-blue-500'
        >
          <div className='w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-3'>
            <Package size={32} className='text-white' />
          </div>
          <span className='text-lg font-medium'>
            {t('selectRole.cargoOwner')}
          </span>
          <span className='text-xs mt-1 text-blue-100'>
            {t('selectRole.cargoOwnerDesc')}
          </span>
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          onClick={() => handleRoleSelect('logistics-company')}
          className='w-full h-36 bg-blue-600 hover:bg-blue-700 text-white text-center p-6 rounded-lg transition-all flex flex-col items-center justify-center shadow-md hover:shadow-lg border border-blue-500'
        >
          <div className='w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mb-3'>
            <Briefcase size={32} className='text-white' />
          </div>
          <span className='text-lg font-medium'>
            {t('selectRole.logisticsCompany')}
          </span>
          <span className='text-xs mt-1 text-blue-100'>
            {t('selectRole.logisticsCompanyDesc')}
          </span>
        </Button>
      </motion.div>

      {/* Disabled Transport Company button */}
      <motion.div variants={itemVariants} className='relative'>
        <Button
          disabled
          className='w-full h-36 bg-blue-600 bg-opacity-50 text-white text-center p-6 rounded-lg text-sm font-semibold flex flex-col items-center justify-center cursor-not-allowed shadow-md border border-blue-500/50'
        >
          <div className='w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-3'>
            <Truck size={32} className='text-white/70' />
          </div>
          <span className='text-lg font-medium'>
            {t('selectRole.transportCompany')}
          </span>
          <span className='text-xs mt-1 text-blue-100/70'>
            {t('selectRole.transportCompanyDesc')}
          </span>
        </Button>
        <div className='absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-blue-800/60 rounded-lg'>
          <LockIcon className='h-8 w-8 text-yellow-400 mb-2' />
          <Badge
            variant='outline'
            className='bg-blue-900/80 text-white border-blue-400'
          >
            Coming Soon
          </Badge>
          <p className='text-xs mt-2 text-center text-white px-2'>
            This role is not available yet
          </p>
        </div>
      </motion.div>

      {/* Disabled Logit Trans button */}
      <motion.div variants={itemVariants} className='relative'>
        <Button
          disabled
          className='w-full h-36 bg-blue-600 bg-opacity-50 text-white text-center p-6 rounded-lg text-sm font-semibold flex flex-col items-center justify-center cursor-not-allowed shadow-md border border-blue-500/50'
        >
          <div className='w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-3'>
            <TrendingUp size={32} className='text-white/70' />
          </div>
          <span className='text-lg font-medium'>
            {t('selectRole.logitTrans')}
          </span>
          <span className='text-xs mt-1 text-blue-100/70'>
            {t('selectRole.logitTransDesc')}
          </span>
        </Button>
        <div className='absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm bg-blue-800/60 rounded-lg'>
          <LockIcon className='h-8 w-8 text-yellow-400 mb-2' />
          <Badge
            variant='outline'
            className='bg-blue-900/80 text-white border-blue-400'
          >
            Coming Soon
          </Badge>
          <p className='text-xs mt-2 text-center text-white px-2'>
            This role is not available yet
          </p>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderContent = () => {
    const type = searchParams.get('type');
    if (type === 'individual') {
      return renderIndividualButtons();
    }
    if (type === 'legal') {
      return renderLegalButtons();
    }
    return null;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-800 to-blue-600'>
      <div className='p-4'>
        <Button
          variant='ghost'
          className='text-white hover:bg-white/10 mb-4 flex items-center'
          onClick={() => router.push('/select-person')}
        >
          <ArrowLeft className='mr-2' size={20} />
          {t('common.back')}
        </Button>
      </div>
      <main className='flex-grow flex items-center justify-center p-4'>
        <Card className='bg-blue-700/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl border border-blue-400/30 w-full max-w-2xl'>
          <CardContent className='p-8'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className='text-3xl font-bold mb-4 text-center text-white'>
                {t('selectRole.title')}
              </h1>
              <div className='mb-8 text-center text-white'>
                <p className='mb-4 text-blue-100'>
                  {t('selectRole.description')}
                </p>
                <p className='text-blue-100 font-medium'>
                  {t('selectRole.selectStatus')}
                </p>
              </div>
            </motion.div>
            {renderContent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
