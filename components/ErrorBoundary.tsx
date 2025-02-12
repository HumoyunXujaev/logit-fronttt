'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg shadow-xl p-6 max-w-md w-full text-center'>
            <AlertTriangle className='h-12 w-12 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-gray-800 mb-2'>
              Что-то пошло не так
            </h2>
            <p className='text-gray-600 mb-4'>
              Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте
              обновить страницу.
            </p>
            <Button onClick={() => window.location.reload()} className='w-full'>
              Обновить страницу
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
