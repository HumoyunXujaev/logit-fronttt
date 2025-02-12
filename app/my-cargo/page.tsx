// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   TruckIcon,
//   EyeIcon,
//   PencilIcon,
//   PowerIcon,
//   PlusIcon,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface Cargo {
//   id: string;
//   name: string;
//   route: string;
//   weight: string;
//   volume: string;
//   isActive: boolean;
// }

// export default function MyCargoPage() {
//   const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
//   const [cargos, setCargos] = useState<Cargo[]>([
//     {
//       id: '1',
//       name: 'Металл',
//       route: 'Москва - Санкт-Петербург',
//       weight: '20 тонн',
//       volume: '40 м³',
//       isActive: true,
//     },
//     // Добавьте больше грузов по необходимости
//   ]);

//   const activeCargos = cargos.filter((cargo) => cargo.isActive);
//   const inactiveCargos = cargos.filter((cargo) => !cargo.isActive);

//   const handleDeactivate = (id: string) => {
//     setCargos(
//       cargos.map((cargo) =>
//         cargo.id === id ? { ...cargo, isActive: false } : cargo
//       )
//     );
//   };

//   const renderCargoCard = (cargo: Cargo) => (
//     <Card key={cargo.id} className='mb-4'>
//       <CardContent className='p-4'>
//         <div className='flex justify-between items-start mb-2'>
//           <h3 className='font-semibold'>{cargo.name}</h3>
//           <Badge variant={cargo.isActive ? 'default' : 'secondary'}>
//             {cargo.isActive ? 'Активный' : 'Неактивный'}
//           </Badge>
//         </div>
//         <p className='text-sm text-gray-600 mb-2'>{cargo.route}</p>
//         <p className='text-sm text-gray-600 mb-4'>
//           {cargo.weight}, {cargo.volume}
//         </p>
//         <div className='flex justify-between'>
//           <Button variant='outline' size='sm'>
//             <EyeIcon className='h-4 w-4 mr-2' />
//             Показать
//           </Button>
//           <Button variant='outline' size='sm'>
//             <PencilIcon className='h-4 w-4 mr-2' />
//             Редактировать
//           </Button>
//           {cargo.isActive && (
//             <Button
//               variant='outline'
//               size='sm'
//               onClick={() => handleDeactivate(cargo.id)}
//             >
//               <PowerIcon className='h-4 w-4 mr-2' />
//               Деактивировать
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
//   return (
//     <div className='min-h-screen bg-gray-100 p-4 pb-24'>
//       <h1 className='text-3xl font-bold text-center mb-6'>Мои грузы</h1>

//       <div className='flex mb-4'>
//         <Button
//           variant={activeTab === 'active' ? 'default' : 'outline'}
//           className='flex-1 mr-2'
//           onClick={() => setActiveTab('active')}
//         >
//           Активные{' '}
//           <Badge variant='secondary' className='ml-2'>
//             {activeCargos.length}
//           </Badge>
//         </Button>
//         <Button
//           variant={activeTab === 'inactive' ? 'default' : 'outline'}
//           className='flex-1'
//           onClick={() => setActiveTab('inactive')}
//         >
//           Неактивные{' '}
//           <Badge variant='secondary' className='ml-2'>
//             {inactiveCargos.length}
//           </Badge>
//         </Button>
//       </div>

//       <ScrollArea className='h-[calc(100vh-250px)]'>
//         {cargos.length === 1 && cargos[0].isActive && (
//           <div
//             className='bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4'
//             role='alert'
//           >
//             <p className='font-bold'>Успех!</p>
//             <p>Ваш груз успешно создан и опубликован.</p>
//           </div>
//         )}

//         {activeTab === 'active'
//           ? activeCargos.map(renderCargoCard)
//           : inactiveCargos.map(renderCargoCard)}
//       </ScrollArea>

//       <div className='fixed bottom-20 left-4 right-4'>
//         <Button
//           className='w-full'
//           onClick={() => {
//             /* Navigate to add cargo page */
//           }}
//         >
//           <PlusIcon className='h-4 w-4 mr-2' />
//           Добавить еще груз
//         </Button>
//       </div>

//       <p className='text-sm text-gray-600 italic mt-4 mb-16 text-center'>
//         Хотим напомнить, что необходимо деактивировать заявку после успешной
//         сделки.
//       </p>

//       <NavigationMenu userRole={'carrier'} />
//     </div>
//   );
// }
// app/my-cargo/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PlusIcon,
  Loader2,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CargoResponse {
  results: Cargo[];
}

interface Cargo {
  id: string;
  title: string;
  status: string;
  loading_point: string;
  unloading_point: string;
  weight: number;
  vehicle_type: string;
  payment_method: string;
  price?: number;
  loading_date: string;
  created_at: string;
}

export default function MyCargoPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [cargos, setCargos] = useState<CargoResponse>({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const { userState } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCargos();
      setCargos(response);
      console.log(response, 'cargos');
    } catch (error) {
      toast.error('Ошибка при загрузке грузов');
      console.error('Fetch cargos error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setActionInProgress(id);
      await api.updateCargo(id, { status });
      toast.success('Статус груза обновлен');
      await fetchCargos();
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
      console.error('Update status error:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'pending':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Активный',
      pending: 'Ожидает',
      completed: 'Завершен',
      cancelled: 'Отменен',
      draft: 'Черновик',
      inactive: 'Неактивный',
    };
    return labels[status] || status;
  };

  const activeCargos = cargos?.results?.filter((cargo) =>
    ['active', 'pending', 'draft'].includes(cargo.status)
  );

  const inactiveCargos = cargos?.results?.filter((cargo) =>
    ['completed', 'cancelled', 'inactive'].includes(cargo.status)
  );

  const handleView = (id: string) => {
    router.push(`/cargo/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/cargo/${id}/edit`);
  };

  const renderCargoCard = (cargo: Cargo) => (
    <Card key={cargo.id} className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-semibold'>{cargo.title}</h3>
          <Badge variant={getStatusBadgeVariant(cargo.status)}>
            {getStatusLabel(cargo.status)}
          </Badge>
        </div>

        <p className='text-sm text-gray-600 mb-2'>
          {cargo.loading_point} - {cargo.unloading_point}
        </p>

        <p className='text-sm text-gray-600 mb-4'>
          {cargo.weight} т, {cargo.vehicle_type}
          {cargo.price && `, ${cargo.price} ₽`}
        </p>

        <div className='flex justify-between'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleView(cargo.id)}
          >
            <EyeIcon className='h-4 w-4 mr-2' />
            Показать
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEdit(cargo.id)}
          >
            <PencilIcon className='h-4 w-4 mr-2' />
            Редактировать
          </Button>

          {cargo.status === 'active' && (
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleStatusChange(cargo.id, 'inactive')}
              disabled={actionInProgress === cargo.id}
            >
              {actionInProgress === cargo.id ? (
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              ) : (
                <PowerIcon className='h-4 w-4 mr-2' />
              )}
              Деактивировать
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100 p-4 flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 pb-24'>
      <h1 className='text-3xl font-bold text-center mb-6'>Мои грузы</h1>

      <div className='flex mb-4'>
        <Button
          variant={activeTab === 'active' ? 'default' : 'outline'}
          className='flex-1 mr-2'
          onClick={() => setActiveTab('active')}
        >
          Активные
          <Badge variant='secondary' className='ml-2'>
            {activeCargos?.length}
          </Badge>
        </Button>

        <Button
          variant={activeTab === 'inactive' ? 'default' : 'outline'}
          className='flex-1'
          onClick={() => setActiveTab('inactive')}
        >
          Неактивные
          <Badge variant='secondary' className='ml-2'>
            {inactiveCargos?.length}
          </Badge>
        </Button>
      </div>

      <ScrollArea className='h-[calc(100vh-250px)]'>
        {activeTab === 'active'
          ? activeCargos?.map(renderCargoCard)
          : inactiveCargos?.map(renderCargoCard)}

        {((activeTab === 'active' && activeCargos?.length === 0) ||
          (activeTab === 'inactive' && inactiveCargos?.length === 0)) && (
          <div className='text-center text-gray-500 mt-8'>
            Нет {activeTab === 'active' ? 'активных' : 'неактивных'} грузов
          </div>
        )}
      </ScrollArea>

      <div className='fixed bottom-20 left-4 right-4'>
        <Button className='w-full' onClick={() => router.push('/cargos')}>
          <PlusIcon className='h-4 w-4 mr-2' />
          Добавить еще груз
        </Button>
      </div>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
