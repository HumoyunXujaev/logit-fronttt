'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppProvider } from '@/contexts/AppContext';
import { LoadingProvider } from '@/components/LoadingProvider';
import { ToastProvider } from '@/components/ToastProvider';
import { TranslationProvider } from '@/contexts/i18n';
import Script from 'next/script';
import { UserProvider } from '@/contexts/UserContext';
import UserSwitcher from '@/components/UserSwitcher';
import { Suspense } from 'react';
import { ApiInitializer } from '@/components/ApiInitializer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <Script
          src='https://telegram.org/js/telegram-web-app.js'
          strategy='beforeInteractive'
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AppProvider>
            <UserProvider>
              <TranslationProvider>
                <Suspense>
                  <LoadingProvider>
                    <ApiInitializer />
                    <ToastProvider />
                    <UserSwitcher />
                    {children}
                  </LoadingProvider>
                </Suspense>
              </TranslationProvider>
            </UserProvider>
          </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
