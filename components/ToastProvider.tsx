'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position='top-center'
      toastOptions={{
        style: {
          background: 'white',
          color: 'black',
          border: '1px solid #E2E8F0',
        },
        className: 'shadow-lg',
      }}
    />
  );
}
