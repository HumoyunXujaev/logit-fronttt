'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Truck, Package, Bell, Menu } from 'lucide-react';
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

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { DateRange, Range, RangeKeyDict } from 'react-date-range';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
// import {
//   Filter,
//   Star,
//   CheckCircle,
//   Clock,
//   Bell,
//   Heart,
//   ChevronDown,
//   ChevronUp,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';

// type UserRole = 'carrier' | 'other';

// interface Order {
//   id: number;
//   cargo: string;
//   weight: number;
//   date: string;
//   payment: string;
//   price: string;
//   from: string;
//   to: string;
//   vehicleType: string;
//   description: string;
//   isTop: boolean;
//   isVerified: boolean;
//   experience: number;
//   rating: number;
//   dimensions: string;
//   loadingType: string;
//   unloadingType: string;
//   additionalRequirements: string;
// }

// interface FilterState {
//   category: string;
//   from: string;
//   to: string;
//   dateRange: Range;
//   notifications: boolean;
// }

// const mockOrders: Order[] = [
//   {
//     id: 1,
//     cargo: 'Металл',
//     weight: 22,
//     date: '12.12.2023 14:34',
//     payment: 'Комбо',
//     price: 'Договорная',
//     from: 'Ташкент',
//     to: 'Москва',
//     vehicleType: 'Тент',
//     description:
//       'Ташкент-Москва, нужен-тент, груз-металл, вес:22т, оплата:комбо, дата сообщения: 12.12.2023',
//     isTop: true,
//     isVerified: true,
//     experience: 2,
//     rating: 4,
//     dimensions: '5x2x2 м',
//     loadingType: 'Боковая',
//     unloadingType: 'Задняя',
//     additionalRequirements: 'Требуется крепление груза',
//   },
//   // Добавьте больше заказов с дополнительными полями
// ];

// const cargoCategories = [
//   'Металл',
//   'Текстиль',
//   'Продукты',
//   'Техника',
//   'Стройматериалы',
// ];
// const cities = [
//   'Ташкент',
//   'Москва',
//   'Бухара',
//   'Андижан',
//   'Самарканд',
//   'Санкт-Петербург',
// ];

// const RoleConfirmationDialog: React.FC<{
//   onConfirm: (role: UserRole) => void;
// }> = ({ onConfirm }) => {
//   return (
//     <Dialog open={true}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Подтвердите вашу роль</DialogTitle>
//         </DialogHeader>
//         <div className='space-y-4'>
//           <Button onClick={() => onConfirm('carrier')} className='w-full'>
//             Я перевозчик
//           </Button>
//           <Button onClick={() => onConfirm('other')} className='w-full'>
//             Я другой пользователь
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// const FilterModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: FilterState) => void;
// }> = ({ isOpen, onClose, onApply }) => {
//   const [filters, setFilters] = useState<FilterState>({
//     category: '',
//     from: '',
//     to: '',
//     dateRange: {
//       startDate: undefined,
//       endDate: undefined,
//       key: 'selection',
//     },
//     notifications: false,
//   });

//   const handleSelectChange = (name: keyof FilterState, value: string) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateRangeChange = (ranges: RangeKeyDict) => {
//     setFilters((prev) => ({ ...prev, dateRange: ranges.selection }));
//   };

//   const handleCheckboxChange = (checked: boolean) => {
//     setFilters((prev) => ({ ...prev, notifications: checked }));
//   };

//   const handleApply = () => {
//     onApply(filters);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='bg-blue-600 text-white max-w-[90vw] h-[80vh] overflow-y-auto'>
//         <DialogHeader>
//           <DialogTitle className='text-white'>Поиск грузов</DialogTitle>
//         </DialogHeader>
//         <div className='space-y-4'>
//           <Select
//             onValueChange={(value) => handleSelectChange('category', value)}
//           >
//             <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
//               <SelectValue placeholder='Категория грузов' />
//             </SelectTrigger>
//             <SelectContent>
//               {cargoCategories.map((category) => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select onValueChange={(value) => handleSelectChange('from', value)}>
//             <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
//               <SelectValue placeholder='Откуда' />
//             </SelectTrigger>
//             <SelectContent>
//               {cities.map((city) => (
//                 <SelectItem key={city} value={city}>
//                   {city}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select onValueChange={(value) => handleSelectChange('to', value)}>
//             <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
//               <SelectValue placeholder='Куда' />
//             </SelectTrigger>
//             <SelectContent>
//               {cities.map((city) => (
//                 <SelectItem key={city} value={city}>
//                   {city}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <div className='bg-white rounded-md p-2'>
//             <DateRange
//               ranges={[filters.dateRange]}
//               onChange={handleDateRangeChange}
//               months={1}
//               direction='vertical'
//               className='w-full'
//             />
//           </div>

//           <div className='flex items-center space-x-2'>
//             <Checkbox
//               id='notifications'
//               checked={filters.notifications}
//               onCheckedChange={handleCheckboxChange}
//             />
//             <label htmlFor='notifications' className='text-white'>
//               Включить уведомления
//             </label>
//           </div>
//           <Button
//             onClick={handleApply}
//             className='w-full bg-yellow-400 text-blue-800 hover:bg-yellow-500'
//           >
//             Найти грузы
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default function OrdersPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [orders, setOrders] = useState<Order[]>(mockOrders);
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [showNotificationDialog, setShowNotificationDialog] = useState(false);
//   const [userRole, setUserRole] = useState<UserRole | null>(null);
//   const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

//   useEffect(() => {
//     const savedRole = localStorage.getItem('userRole') as UserRole | null;
//     if (savedRole) {
//       setUserRole(savedRole);
//     }

//     const handleBeforeUnload = () => {
//       localStorage.clear();
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//   const handleRoleConfirm = (role: UserRole) => {
//     setUserRole(role);
//     localStorage.setItem('userRole', role);
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     // Здесь должна быть логика фильтрации заказов
//   };

//   const handleApplyFilters = (filters: FilterState) => {
//     console.log('Applied filters:', filters);
//     // Здесь должна быть логика применения фильтров к заказам
//   };

//   const renderStars = (rating: number) => {
//     return Array(5)
//       .fill(0)
//       .map((_, i) => (
//         <Star
//           key={i}
//           className={`h-4 w-4 ${
//             i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
//           }`}
//         />
//       ));
//   };

//   const toggleOrderExpansion = (orderId: number) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (userRole === null) {
//     return <RoleConfirmationDialog onConfirm={handleRoleConfirm} />;
//   }

//   return (
//     <div className='min-h-screen bg-blue-600 p-4 pb-20'>
//       <div className='flex items-center mb-4 bg-white rounded-lg p-2'>
//         <Input
//           type='text'
//           placeholder='Поиск заказов...'
//           value={searchTerm}
//           onChange={handleSearch}
//           className='mr-2 flex-grow'
//         />
//         <Button
//           variant='default'
//           size='sm'
//           className='bg-yellow-400 text-black hover:bg-yellow-500 whitespace-nowrap'
//           onClick={() => setIsFilterModalOpen(true)}
//         >
//           <Filter className='h-4 w-4 mr-2' />
//           Фильтры
//         </Button>
//       </div>

//       <FilterModal
//         isOpen={isFilterModalOpen}
//         onClose={() => setIsFilterModalOpen(false)}
//         onApply={handleApplyFilters}
//       />

//       <div className='space-y-4 mb-20'>
//         {orders.map((order) => (
//           <Card key={order.id} className='bg-white overflow-hidden'>
//             <CardContent className='p-4'>
//               <div className='flex justify-between items-start mb-2'>
//                 <div className='flex space-x-1'>
//                   {order.isTop && (
//                     <Badge
//                       variant='secondary'
//                       className='bg-yellow-100 text-yellow-800'
//                     >
//                       <Star className='h-4 w-4' />
//                     </Badge>
//                   )}
//                   {order.isVerified && (
//                     <Badge
//                       variant='secondary'
//                       className='bg-green-100 text-green-800'
//                     >
//                       <CheckCircle className='h-4 w-4' />
//                     </Badge>
//                   )}
//                   {order.experience > 1 && (
//                     <Badge
//                       variant='secondary'
//                       className='bg-blue-100 text-blue-800'
//                     >
//                       <Clock className='h-4 w-4' /> {order.experience}г
//                     </Badge>
//                   )}
//                 </div>
//                 <div className='flex items-center'>
//                   <span className='font-bold mr-1'>{order.rating}</span>
//                   <div className='flex'>{renderStars(order.rating)}</div>
//                 </div>
//               </div>
//               <div className='flex justify-between items-center mb-2'>
//                 <span className='font-bold text-lg'>
//                   {order.from} - {order.to}
//                 </span>
//                 <span className='text-sm text-gray-500'>{order.date}</span>
//               </div>
//               <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
//                 <span>Груз: {order.cargo}</span>
//                 <span>Вес: {order.weight} т</span>
//                 <span>Тип: {order.vehicleType}</span>
//                 <span>Оплата: {order.payment}</span>
//               </div>
//               <div className='mb-2'>
//                 <span className='font-semibold'>Цена: {order.price}</span>
//               </div>
//               {expandedOrder === order.id && (
//                 <div className='mt-4 text-sm'>
//                   <p>Размеры: {order.dimensions}</p>
//                   <p>Тип погрузки: {order.loadingType}</p>
//                   <p>Тип разгрузки: {order.unloadingType}</p>
//                   <p>Доп. требования: {order.additionalRequirements}</p>
//                   <p className='mt-2'>Описание: {order.description}</p>
//                 </div>
//               )}
//               <div className='flex justify-between mt-4'>
//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className='flex-1 mr-1'
//                   onClick={() => toggleOrderExpansion(order.id)}
//                 >
//                   {expandedOrder === order.id ? (
//                     <ChevronUp className='h-4 w-4 mr-1' />
//                   ) : (
//                     <ChevronDown className='h-4 w-4 mr-1' />
//                   )}
//                   {expandedOrder === order.id ? 'Скрыть' : 'Подробнее'}
//                 </Button>
//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className='flex-1 ml-1 mr-1'
//                   onClick={() => setShowNotificationDialog(true)}
//                 >
//                   <Bell className='h-4 w-4 mr-1' />
//                 </Button>
//                 <Button variant='outline' size='sm' className='flex-1'>
//                   <Heart className='h-4 w-4 mr-1' />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <Dialog
//         open={showNotificationDialog}
//         onOpenChange={setShowNotificationDialog}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Включить уведомления?</DialogTitle>
//           </DialogHeader>
//           <p>
//             Хотите включить уведомления по выбранным типам груза и направлениям?
//           </p>
//           <div className='flex justify-end space-x-2 mt-4'>
//             <Button
//               variant='outline'
//               onClick={() => setShowNotificationDialog(false)}
//             >
//               Отмена
//             </Button>
//             <Button
//               onClick={() => {
//                 // Логика включения уведомлений
//                 setShowNotificationDialog(false);
//               }}
//             >
//               Включить
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <NavigationMenu userRole={userRole} />
//     </div>
//   );
// }
