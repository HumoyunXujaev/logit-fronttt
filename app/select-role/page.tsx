'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import {
  User,
  Truck,
  Building2,
  Package,
  Briefcase,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function UserRoleSelection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userState, setUserRole } = useUser();

  useEffect(() => {
    if (userState.isAuthenticated) {
      router.push('/home');
    }
    // if (!userState.type || !userState.language) {
    //   router.push('/select-lang');
    // }
    console.log(userState.language, 'userstatelang')
    console.log(userState.type, 'userstatetype')
  }, [userState, router]);

  const handleRoleSelect = (role: string) => {
    setUserRole(role as any);
    if (role === 'student') {
      router.push('/student-password');
    } else if (role === 'carrier') {
      router.push('/carrier-welcome');
    } else {
      router.push('/start-mini');
    }
  };

  const renderIndividualButtons = () => (
    <div className='grid grid-cols-2 gap-4 w-full mb-4'>
      <Button
        onClick={() => handleRoleSelect('student')}
        className='bg-blue-500 hover:bg-blue-600 text-white text-center py-6 px-4 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center h-32'
      >
        <User size={32} className='mb-2' />
        <span>Студент</span>
        <span className='text-xs mt-1 text-blue-100'>
          Для учащихся Logit School
        </span>
      </Button>

      <Button
        onClick={() => handleRoleSelect('carrier')}
        className='bg-blue-500 hover:bg-blue-600 text-white text-center py-6 px-4 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center h-32'
      >
        <Truck size={32} className='mb-2' />
        <span>Перевозчик</span>
        <span className='text-xs mt-1 text-blue-100'>
          Для владельцев транспорта
        </span>
      </Button>
    </div>
  );

  const renderLegalButtons = () => (
    <div className='grid grid-cols-2 gap-4 w-full mb-4'>
      <Button
        onClick={() => handleRoleSelect('cargo-owner')}
        className='bg-blue-500 hover:bg-blue-600 text-white text-center py-6 px-4 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center h-32'
      >
        <Package size={32} className='mb-2' />
        <span>Грузовладелец</span>
        <span className='text-xs mt-1 text-blue-100'>
          Для владельцев грузов
        </span>
      </Button>

      <Button
        onClick={() => handleRoleSelect('logistics-company')}
        className='bg-blue-500 hover:bg-blue-600 text-white text-center py-6 px-4 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center h-32'
      >
        <Briefcase size={32} className='mb-2' />
        <span>Экспедиторская компания</span>
        <span className='text-xs mt-1 text-blue-100'>
          Для логистических компаний
        </span>
      </Button>

      <Button
        onClick={() => handleRoleSelect('transport-company')}
        className='bg-blue-500 hover:bg-blue-600 text-white text-center py-6 px-4 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center h-32'
      >
        <Truck size={32} className='mb-2' />
        <span>Транспортная компания</span>
        <span className='text-xs mt-1 text-blue-100'>
          Для транспортных компаний
        </span>
      </Button>

      <Button
        onClick={() => handleRoleSelect('logit-trans')}
        className='bg-blue-500 hover:bg-blue-600 text-white text-center py-6 px-4 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center h-32'
      >
        <TrendingUp size={32} className='mb-2' />
        <span>Логит транс</span>
        <span className='text-xs mt-1 text-blue-100'>Для партнеров Logit</span>
      </Button>
    </div>
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
    <div className='min-h-screen bg-red-700'>
      <div className='p-4'>
        <Button
          variant='ghost'
          className='text-white mb-4'
          onClick={() => router.push('/select-person')}
        >
          <ArrowLeft className='mr-2' size={24} />
          Назад
        </Button>
      </div>

      <main className='flex-grow flex items-center justify-center p-4'>
        <Card className='bg-red-700 rounded-lg shadow-lg p-6 max-w-2xl w-full border-2 border-white'>
          <h1 className='text-3xl font-bold mb-4 text-center text-white'>
            Выберите вашу роль
          </h1>
          <section className='mb-8 text-center text-white'>
            <p className='mb-4'>
              Пожалуйста обратите внимание! Сейчас вам необходимо выбрать кем вы
              являетесь
            </p>
            <p>Выберите ваш статус</p>
          </section>

          {renderContent()}
        </Card>
      </main>
    </div>
  );
}
