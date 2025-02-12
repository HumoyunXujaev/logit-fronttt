// import Link from 'next/link';

// export default function Home() {
//   return (
//     <div className='flex flex-col min-h-screen bg-red-700'>
//       <main className='flex-grow flex items-center justify-center p-4'>
//         <div className='bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white-500 text-white'>
//           <h1 className='text-3xl font-bold mb-4 text-center text-white'>
//             Что Умеет Бот?
//           </h1>
//           <section className='mb-8 text-center text-white'>
//             <p>
//               Logit-Smartbot - №1 Крупнейшая ассоциация логистики в Узбекистане
//             </p>
//           </section>
//         </div>
//       </main>

//       <footer className='p-4 fixed bottom-0 left-0 right-0'>
//         <Link
//           href='/select-lang'
//           className='block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300'
//         >
//           START
//         </Link>
//       </footer>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        colorScheme: any;
        themeParams: any;
        isExpanded: any;
        isFullscreen: any;
        viewportHeight: any;
        viewportStableHeight: any;
        enableClosingConfirmation(): unknown;
        ready(): unknown;
        expand(): unknown;
        close(): unknown;
        onEvent(eventType: any, eventHandler: any): unknown;
        requestFullscreen(): unknown;
        exitFullscreen(): unknown;
        offEvent(eventType: any, eventHandler: any): unknown;
        initData: string;
        initDataUnsafe: {
          query_id: string;
          user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code: string;
          };
          auth_date: string;
          hash: string;
        };
      };
    };
  }
}

export default function Home() {
  const [webAppData, setWebAppData] = useState<any>(null);

  useEffect(() => {
    // Check if running in Telegram WebApp environment
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      // Get all available WebApp data
      const webAppInitData = {
        initDataRaw: tg.initData,
        initDataParsed: tg.initDataUnsafe,
        // You can add more WebApp properties here as needed
        colorScheme: tg.colorScheme,
        themeParams: tg.themeParams,
        isExpanded: tg.isExpanded,
        viewportHeight: tg.viewportHeight,
        viewportStableHeight: tg.viewportStableHeight,
      };

      // setWebAppData(webAppInitData);

      // Enable closing confirmation if needed
      tg.enableClosingConfirmation();

      // Ready event to Telegram
      tg.ready();
      setWebAppData(tg);
    }
  }, []);

  return (
    <div className='flex flex-col min-h-screen bg-red-700'>
      <main className='flex-grow flex items-center justify-center p-4'>
        <div className='bg-red-700 rounded-lg shadow-lg p-6 max-w-sm w-full border-2 border-white-500 text-white'>
          <h1 className='text-3xl font-bold mb-4 text-center text-white'>
            Что Умеет Бот?
          </h1>
          <section className='mb-8 text-center text-white'>
            <p>
              Logit-Smartbot - №1 Крупнейшая ассоциация логистики в Узбекистане
            </p>
          </section>

          {/* Display WebApp Data */}
          {/* {webAppData && (
            <div className='mt-4 p-4 bg-white/10 rounded-lg'>
              <h2 className='text-xl font-bold mb-2'>Telegram WebApp Data:</h2>
              <pre className='whitespace-pre-wrap text-sm'>
                {JSON.stringify(webAppData, null, 2)}
              </pre>
            </div>
          )} */}
        </div>
      </main>

      <footer className='p-4 fixed bottom-0 left-0 right-0'>
        <Link
          href='/select-lang'
          className='block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-lg text-lg font-semibold transition duration-300'
        >
          START
        </Link>
      </footer>
    </div>
  );
}
