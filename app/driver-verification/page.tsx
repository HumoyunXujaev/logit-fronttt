'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { toast } from 'sonner';

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

const DriverVerificationPage: React.FC = () => {
  const router = useRouter();
  const [stage, setStage] = useState<VerificationStage>('initial');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handleDocumentUpload = async (documentData: any, type: string) => {
  //   try {
  //     const response = await AuthService.uploadDocument(
  //       documentData.file,
  //       type
  //     );
  //     setDocuments((prev) => [...prev, response]);
  //     toast.success('Документ успешно загружен');
  //   } catch (error) {
  //     toast.error('Ошибка при загрузке документа');
  //     console.error('Document upload error:', error);
  //   }
  // };

  const handleVerification = async () => {
    if (documents.length < 2) {
      toast.error('Необходимо загрузить обе стороны водительских прав');
      return;
    }

    setStage('verifying');
    setIsModalOpen(false);
    setIsLoading(true);

    try {
      // Имитация процесса проверки
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isApproved = Math.random() > 0.1;
      setVerificationResult({
        isApproved,
        message: isApproved
          ? 'Ваша категория водительского права соответствует нашим требованиям. Теперь можете пройти идентификацию через платформу MyID.'
          : "К сожалению, ваша категория водительского права не соответствует нашим требованиям.\n Чтобы получить разрешение на прохождение идентификации, категория водительских прав должна быть как минимум 'C'. ",
      });
      setStage('result');
    } catch (error) {
      toast.error('Ошибка при проверке документов');
      console.error('Verification error:', error);
      setStage('initial');
    } finally {
      setIsLoading(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className='min-h-screen bg-blue-600 flex items-center justify-center p-4'>
      <AnimatePresence mode='wait'>
        {stage === 'initial' && (
          <motion.div
            key='initial'
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            transition={pageTransition}
            className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center'
          >
            <h1 className='text-2xl font-bold mb-6 text-blue-800'>
              Уважаемый перевозчик
            </h1>
            <p className='mb-8 text-gray-600'>
              Чтобы пользоваться нашим сервисом бесплатно, просим вас
              подтвердить вашу личность. Для этого сначала загрузите ваши
              водительские права.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className='bg-blue-500 hover:bg-blue-600 text-white'
            >
              Загрузить водительские права
            </Button>
          </motion.div>
        )}

        {stage === 'verifying' && (
          <motion.div
            key='verifying'
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            transition={pageTransition}
            className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center'
          >
            <Loader2 className='animate-spin h-16 w-16 text-blue-500 mx-auto mb-4' />
            <h2 className='text-xl font-semibold text-blue-800'>
              Проверка документов
            </h2>
            <p className='text-gray-600 mt-2'>
              Пожалуйста, подождите. Мы проверяем ваши документы.
            </p>
          </motion.div>
        )}

        {stage === 'result' && verificationResult && (
          <motion.div
            key='result'
            initial='initial'
            animate='in'
            exit='out'
            variants={pageVariants}
            transition={pageTransition}
            className='bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center'
          >
            <h1 className='text-2xl font-bold mb-6 text-blue-800'>
              Результат проверки
            </h1>
            <p
              className={`mb-8 ${
                verificationResult.isApproved
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {verificationResult.message}
            </p>
            {verificationResult.isApproved && (
              <Button
                className='bg-green-500 hover:bg-green-600 text-white'
                onClick={() => {
                  router.push('/registration-confirm');
                }}
              >
                Перейти к MyID
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-center text-xl font-semibold text-blue-800'>
              Загрузка водительских прав
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium mb-2 text-gray-700'>
                Передняя сторона
              </label>
              {/* <FileUpload
                type='driver_license_front'
                onUpload={(data) =>
                  handleDocumentUpload(data, 'driver_license_front')
                }
                allowedTypes={['image/jpeg', 'image/png']}
                maxSize={5 * 1024 * 1024}
                label='Загрузить переднюю сторону'
              /> */}
            </div>
            <div>
              <label className='block text-sm font-medium mb-2 text-gray-700'>
                Задняя сторона
              </label>
              {/* <FileUpload
                type='driver_license_back'
                onUpload={(data) =>
                  handleDocumentUpload(data, 'driver_license_back')
                }
                allowedTypes={['image/jpeg', 'image/png']}
                maxSize={5 * 1024 * 1024}
                label='Загрузить заднюю сторону'
              /> */}
            </div>
            <Button
              onClick={handleVerification}
              disabled={documents.length < 2 || isLoading}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white'
            >
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin h-4 w-4 mr-2' />
                  Проверка...
                </>
              ) : (
                'Отправить на проверку'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverVerificationPage;
