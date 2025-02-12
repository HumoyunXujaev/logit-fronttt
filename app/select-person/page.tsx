'use client';

import Link from 'next/link';
import { User, Building2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PersonTypeSelection() {
  const { userState, setUserType } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userState.isAuthenticated) {
      router.push('/home');
    }
  }, [userState.isAuthenticated, router]);

  const handleTypeSelect = (type: 'individual' | 'legal') => {
    setUserType(type);
  };

  return (
    <div className='flex flex-col min-h-screen bg-red-700'>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white'>
          <h1 className='text-3xl font-bold mb-4 text-center text-white'>
            Выберите тип лица
          </h1>
          <section className='mb-8 text-center text-white'>
            <p>Пожалуйста, выберите тип лица</p>
          </section>
        </div>
      </main>
      <footer className='p-4 fixed bottom-0 left-0 right-0 flex justify-between'>
        <Link
          href='/select-role?type=individual'
          onClick={() => handleTypeSelect('individual')}
          className='w-[48%] bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center'
        >
          <User className='mr-2' size={24} />
          Физ. лицо
        </Link>
        <Link
          href='/select-role?type=legal'
          onClick={() => handleTypeSelect('legal')}
          className='w-[48%] bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center'
        >
          <Building2 className='mr-2' size={24} />
          Юр. лицо
        </Link>
      </footer>
    </div>
  );
}
