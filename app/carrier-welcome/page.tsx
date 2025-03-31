'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/contexts/i18n';

export default function CarrierWelcomePage() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col min-h-screen bg-red-700'>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white'>
          <h1 className='text-3xl font-bold mb-4 text-center text-white'>
            {t('home.carrierGreeting')}
          </h1>
          <section className='mb-8 text-center text-white'>
            <p>{t('home.greetingMessage')}</p>
            <br />
            <p>{t('home.workMessage')}</p>
            <p className='mt-4 font-semibold'>{t('home.thanks')}</p>
          </section>
        </div>
      </main>
      <footer className='p-4 fixed bottom-0 left-0 right-0 flex flex-col'>
        <Link
          href='/carrier-animation'
          className='w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center'
        >
          {t('home.start')} <ArrowRight className='ml-2' size={24} />
        </Link>
      </footer>
    </div>
  );
}
