'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from '@/contexts/i18n';
import { api } from '@/lib/api'; // Добавлен импорт API
import {
  Loader2,
  ShieldCheck,
  Upload,
  IdCard,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
} from 'lucide-react';

type VerificationStage = 'initial' | 'uploading' | 'verifying' | 'result';

interface VerificationResult {
  isApproved: boolean;
  message: string;
}

interface Document {
  id: string;
  type: string;
  url: string;
}

interface DocumentFormData {
  file: File;
  type: 'driver_license' | 'passport' | 'company_certificate' | 'other';
  title: string;
}

const DriverVerificationPage: React.FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState<VerificationStage>('initial');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'front' | 'back'>('front');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const { t } = useTranslation();

  const handleVerification = async () => {
    if (!frontUploaded || !backUploaded) {
      toast.error(t('verification.licenseRequired'));
      return;
    }
    setStage('verifying');
    setIsModalOpen(false);
    setIsLoading(true);

    try {
      // Небольшая задержка для индикации обработки
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Всегда успешно - без проверки, как требуется
      setVerificationResult({
        isApproved: true,
        message: t('verification.documentsUploaded'),
      });

      setStage('result');
    } catch (error) {
      toast.error(t('verification.verificationError'));
      console.error('Verification error:', error);
      setStage('initial');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка документа через API, как в меню
  const handleDocumentUpload = async (side: 'front' | 'back') => {
    // Используем скрытый input для выбора файла
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,application/pdf';

    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Проверка размера файла
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('fileUpload.fileTooBig', { size: '5MB' }));
        return;
      }

      setIsLoading(true);

      try {
        // Создаем объект документа для отправки на сервер, как в меню
        const documentData: DocumentFormData = {
          file,
          type: 'driver_license', // Тип "водительские права"
          title:
            side === 'front'
              ? t('verification.frontSide') +
                ' ' +
                t('verification.driverLicense')
              : t('verification.backSide') +
                ' ' +
                t('verification.driverLicense'),
        };

        // Используем такой же API метод, как в меню
        await api.addUserDocument(documentData);

        if (side === 'front') {
          setFrontUploaded(true);
          toast.success(t('verification.frontSideUploaded'));
        } else {
          setBackUploaded(true);
          toast.success(t('verification.backSideUploaded'));
        }
      } catch (error) {
        toast.error(t('fileUpload.uploadError'));
        console.error('Upload error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fileInput.click();
  };

  const stageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-700 to-blue-900 flex flex-col items-center justify-center p-4'>
      <AnimatePresence mode='wait'>
        {stage === 'initial' && (
          <motion.div
            key='initial'
            initial='initial'
            animate='animate'
            exit='exit'
            variants={stageVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='w-full max-w-md'
          >
            <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
              <div className='bg-blue-600 p-6 flex justify-center'>
                <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center'>
                  <IdCard className='h-10 w-10 text-white' />
                </div>
              </div>
              <div className='p-6'>
                <h1 className='text-2xl font-bold mb-6 text-blue-900'>
                  {t('verification.title')}
                </h1>
                <div className='space-y-4'>
                  <p className='text-gray-600'>
                    {t('verification.verificationRequest')}
                  </p>
                  <div className='bg-blue-50 rounded-lg p-4 border border-blue-100'>
                    <div className='flex items-start'>
                      <ShieldCheck className='h-5 w-5 text-blue-600 mt-1 mr-3 flex-shrink-0' />
                      <p className='text-sm text-blue-800'>
                        Для доступа к платформе необходимо загрузить обе стороны
                        водительских прав. Требуется категория прав не ниже 'C'.
                      </p>
                    </div>
                  </div>

                  <div className='flex space-x-3'>
                    <div className='flex-1'>
                      <div
                        className={`bg-gray-100 rounded-lg p-3 flex flex-col items-center ${
                          frontUploaded
                            ? 'border-2 border-green-500'
                            : 'border border-gray-200'
                        }`}
                      >
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2'>
                          <CreditCard className='h-6 w-6 text-blue-600' />
                        </div>
                        <p className='text-xs text-center text-gray-500 mb-2'>
                          Передняя сторона
                        </p>
                        {frontUploaded ? (
                          <CheckCircle2 className='h-5 w-5 text-green-600' />
                        ) : (
                          <p className='text-2xs text-center text-gray-400'>
                            Не загружено
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='flex-1'>
                      <div
                        className={`bg-gray-100 rounded-lg p-3 flex flex-col items-center ${
                          backUploaded
                            ? 'border-2 border-green-500'
                            : 'border border-gray-200'
                        }`}
                      >
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2'>
                          <FileText className='h-6 w-6 text-blue-600' />
                        </div>
                        <p className='text-xs text-center text-gray-500 mb-2'>
                          Задняя сторона
                        </p>
                        {backUploaded ? (
                          <CheckCircle2 className='h-5 w-5 text-green-600' />
                        ) : (
                          <p className='text-2xs text-center text-gray-400'>
                            Не загружено
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mt-8 space-y-3'>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5'
                  >
                    <Upload className='h-4 w-4 mr-2' />
                    {t('verification.uploadLicense')}
                  </Button>

                  <Button
                    variant='outline'
                    disabled={!frontUploaded || !backUploaded || isLoading}
                    onClick={handleVerification}
                    className='w-full border-blue-200 text-blue-600 hover:bg-blue-50 font-medium py-2.5'
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    ) : (
                      <ChevronRight className='h-4 w-4 mr-2' />
                    )}
                    {t('verification.submitVerification')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'verifying' && (
          <motion.div
            key='verifying'
            initial='initial'
            animate='animate'
            exit='exit'
            variants={stageVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='w-full max-w-md'
          >
            <div className='bg-white rounded-2xl shadow-xl p-8 text-center'>
              <div className='flex flex-col items-center justify-center'>
                <div className='relative mb-8'>
                  <div className='w-24 h-24 border-t-4 border-blue-600 border-solid rounded-full animate-spin'></div>
                  <div className='w-24 h-24 border-4 border-blue-100 border-solid rounded-full absolute top-0'></div>
                </div>
                <h2 className='text-xl font-semibold text-blue-900 mb-3'>
                  {t('verification.processing')}
                </h2>
                <p className='text-gray-600 max-w-xs mx-auto'>
                  {t('verification.pleaseWait')}
                </p>
                <div className='w-full max-w-xs mt-6 bg-gray-200 rounded-full h-1.5'>
                  <motion.div
                    className='bg-blue-600 h-1.5 rounded-full'
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'result' && verificationResult && (
          <motion.div
            key='result'
            initial='initial'
            animate='animate'
            exit='exit'
            variants={stageVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='w-full max-w-md'
          >
            <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
              <div className='bg-green-600 p-6 flex justify-center'>
                <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center'>
                  <CheckCircle2 className='h-10 w-10 text-white' />
                </div>
              </div>
              <div className='p-6'>
                <h1 className='text-2xl font-bold mb-2 text-center text-blue-900'>
                  {t('verification.documentsUploaded')}
                </h1>
                <div className='mt-4 p-4 rounded-lg bg-green-50 border border-green-100'>
                  <p className='whitespace-pre-line text-green-800'>
                    Спасибо! Ваши документы успешно загружены и будут проверены
                    в ближайшее время. После проверки вы получите уведомление о
                    результате.
                  </p>
                </div>
                <div className='mt-8'>
                  <Button
                    className='w-full bg-green-600 hover:bg-green-700 text-white'
                    onClick={() => router.push('/menu')}
                  >
                    <ChevronRight className='h-4 w-4 mr-2' />
                    {t('registrationConfirm.goToProfile')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-center text-xl font-semibold text-blue-800'>
              {t('verification.uploadLicense')}
            </DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <div className='flex border-b border-gray-200'>
              <button
                onClick={() => setSelectedTab('front')}
                className={`flex-1 py-3 font-medium text-sm ${
                  selectedTab === 'front'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {t('verification.frontSide')}
              </button>
              <button
                onClick={() => setSelectedTab('back')}
                className={`flex-1 py-3 font-medium text-sm ${
                  selectedTab === 'back'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500'
                }`}
              >
                {t('verification.backSide')}
              </button>
            </div>
            <div className='mt-5'>
              <div
                onClick={() => handleDocumentUpload(selectedTab)}
                className='bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer'
              >
                <div className='mx-auto bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4'>
                  <Upload className='h-8 w-8 text-blue-600' />
                </div>
                <p className='font-medium text-gray-700'>
                  {selectedTab === 'front'
                    ? 'Загрузить переднюю сторону'
                    : 'Загрузить заднюю сторону'}
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  Drag and drop или нажмите для загрузки
                </p>
              </div>
            </div>
            <div className='flex justify-end mt-6 space-x-3'>
              <Button variant='outline' onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => handleDocumentUpload(selectedTab)}
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Upload className='h-4 w-4 mr-2' />
                )}
                {t('common.upload')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverVerificationPage;
