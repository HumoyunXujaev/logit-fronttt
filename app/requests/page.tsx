'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import NavigationMenu from '../components/NavigationMenu';

interface RequestType {
  title: string;
  count: number;
  color: string;
}

export default function RequestsPage() {
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([
    { title: 'Заявки от грузовладельцев', count: 15, color: 'bg-green-500' },
    { title: 'Заявки от экс. компаний', count: 8, color: 'bg-yellow-500' },
    { title: 'Заявки от перевозчиков', count: 12, color: 'bg-red-500' },
  ]);

  return (
    <div className='min-h-screen bg-blue-900 p-4 pb-20'>
      <h1 className='text-3xl font-bold text-white text-center mb-6'>Заявки</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-20'>
        {requestTypes.map((type, index) => (
          <div key={index} className='bg-white rounded-lg p-4 shadow-lg'>
            <div className='flex justify-between items-center mb-2'>
              <h2 className='text-lg font-semibold'>{type.title}</h2>
              <span
                className={`${type.color} text-white rounded-full w-8 h-8 flex items-center justify-center`}
              >
                {type.count}
              </span>
            </div>
            <Button className='w-full mt-2' variant='outline'>
              Просмотреть
            </Button>
          </div>
        ))}
      </div>

      <NavigationMenu userRole='other' />
    </div>
  );
}
