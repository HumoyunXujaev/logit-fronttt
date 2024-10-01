'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  User,
  Truck,
  Building2,
  Package,
  Briefcase,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';

export default function UserRoleSelection() {
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'individual' || type === 'legal') {
      setUserType(type);
    }
  }, [searchParams]);

  const renderButtons = () => {
    if (userType === 'individual') {
      return (
        <div className='grid grid-cols-2 gap-4 w-full mb-4'>
          <Link
            href='/student-password'
            className='bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-2 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center'
          >
            <User size={24} className='mb-1' />
            Студент
          </Link>

          <Link
            href='/start-mini'
            className='bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-2 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center'
          >
            <Truck size={24} className='mb-1' />
            Перевозчик
          </Link>
        </div>
      );
    } else if (userType === 'legal') {
      return (
        <div className='grid grid-cols-2 gap-4 w-full mb-4'>
          <Link
            href='/start-mini'
            className='bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-2 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center'
          >
            <Package size={24} className='mb-1' />
            Грузовладелец
          </Link>
          <Link
            href='/start-mini'
            className='bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-2 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center'
          >
            <Briefcase size={24} className='mb-1' />
            Экспедиторская компания
          </Link>
          <Link
            href='/start-mini'
            className='bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-2 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center'
          >
            <Truck size={24} className='mb-1' />
            Транспортная компания
          </Link>
          <Link
            href='/start-mini'
            className='bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-2 rounded-lg text-sm font-semibold transition duration-300 flex flex-col items-center justify-center'
          >
            <TrendingUp size={24} className='mb-1' />
            Логит транс
          </Link>
        </div>
      );
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-red-700'>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white'>
          <h1 className='text-3xl font-bold mb-4 text-center text-white'>
            Выберите вашу роль
          </h1>
          <section className='mb-8 text-center text-white'>
            <p>
              Пожалуйста обратите внимание! Сейчас вам необходимо выбрать кем вы
              являетесь: грузовладельцем, экспедиторской компанией или
              транспортной компанией
            </p>
            <p className='mt-4'>Выберите ваш статус</p>
          </section>
        </div>
      </main>
      <footer className='p-4 fixed bottom-0 left-0 right-0 flex flex-col'>
        {renderButtons()}
        <Link
          href='/select-person'
          className='w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center'
        >
          <ArrowLeft className='mr-2' size={24} />
          Назад
        </Link>
      </footer>
    </div>
  );
}
