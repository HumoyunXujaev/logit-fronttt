'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone } from 'lucide-react';

export default function StudentPasswordPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Здесь должна быть логика проверки пароля
    // Для демонстрации, просто перенаправляем на страницу старта мини-вебсайта
    router.push('/start-mini');
  };

  return (
    <div className='flex flex-col min-h-screen bg-red-700'>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white'>
          <h1 className='text-3xl font-bold mb-4 text-center text-white'>
            Доступ к боту
          </h1>
          <section className='mb-8 text-center text-white'>
            <p>
              Чтобы получить доступ к боту, введите пароль, который предоставлен
              вашим куратором, или обратитесь к администратору бота.
            </p>
          </section>
          <form onSubmit={handleSubmit} className='mt-4'>
            <input
              type='number'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 rounded-lg bg-white text-black text-center text-2xl tracking-widest'
              placeholder='Введите пароль'
              required
            />
            <button
              type='submit'
              className='w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300'
            >
              Подтвердить
            </button>
          </form>
        </div>
      </main>
      <footer className='p-4 fixed bottom-0 left-0 right-0'>
        <button
          onClick={() => alert('Вызов администратора')}
          className='w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center'
        >
          <Phone className='mr-2' size={24} />
          Вызвать администратора
        </button>
      </footer>
    </div>
  );
}
