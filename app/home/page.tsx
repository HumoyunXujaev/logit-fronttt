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
// import { useUser } from '@/contexts/UserContext';
// import { useRouter } from 'next/navigation';
// import { useFavorites } from '@/hooks/useFavorites';
// import { useNotifications } from '@/hooks/useNotifications';
// import { useApp } from '@/contexts/AppContext';

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
//   {
//     id: 2,
//     cargo: 'Текстиль',
//     weight: 15,
//     date: '10.12.2023 11:00',
//     payment: 'Безналичный расчет',
//     price: '2500$',
//     from: 'Бухара',
//     to: 'Алматы',
//     vehicleType: 'Рефрижератор',
//     description:
//       'Бухара-Алматы, требуется рефрижератор, текстильные изделия, вес: 15т, оплата: безналичный расчет, дата сообщения: 10.12.2023',
//     isTop: false,
//     isVerified: true,
//     experience: 3,
//     rating: 5,
//     dimensions: '6x2.5x2.5 м',
//     loadingType: 'Задняя',
//     unloadingType: 'Задняя',
//     additionalRequirements: 'Температурный контроль -5°C',
//   },
//   {
//     id: 3,
//     cargo: 'Автозапчасти',
//     weight: 8,
//     date: '08.12.2023 09:30',
//     payment: 'Наличные',
//     price: '1200$',
//     from: 'Самарканд',
//     to: 'Киев',
//     vehicleType: 'Тент',
//     description:
//       'Самарканд-Киев, тент, автозапчасти, вес: 8т, оплата: наличные, дата сообщения: 08.12.2023',
//     isTop: false,
//     isVerified: true,
//     experience: 1,
//     rating: 3.5,
//     dimensions: '4x2x2 м',
//     loadingType: 'Боковая',
//     unloadingType: 'Задняя',
//     additionalRequirements: 'Нет дополнительных требований',
//   },
//   {
//     id: 4,
//     cargo: 'Строительные материалы',
//     weight: 30,
//     date: '05.12.2023 07:45',
//     payment: 'Договорная',
//     price: 'По запросу',
//     from: 'Ташкент',
//     to: 'Санкт-Петербург',
//     vehicleType: 'Тент',
//     description:
//       'Ташкент-Санкт-Петербург, тент, строительные материалы, вес: 30т, оплата: договорная, дата сообщения: 05.12.2023',
//     isTop: true,
//     isVerified: false,
//     experience: 5,
//     rating: 4.5,
//     dimensions: '10x3x3 м',
//     loadingType: 'Задняя',
//     unloadingType: 'Задняя',
//     additionalRequirements: 'Требуются сертификаты соответствия материалов',
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
//   onConfirm: (role: 'carrier' | 'other') => void;
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
//       <DialogContent className='bg-blue-600 text-white'>
//         <DialogHeader>
//           <DialogTitle className='text-white text-center'>
//             Поиск грузов
//           </DialogTitle>
//         </DialogHeader>
//         <div className='space-y-4 max-w-[100vw] overflow-y-auto'>
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
//   const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

//   const { userState, setUserRole } = useUser();
//   // const router = useRouter();

//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

//   // const { userState } = useUser();
//   const router = useRouter();
//   const {
//     addNotification,
//     addToFavorites,
//     removeFromFavorites,
//     isFavorite,
//     notifications,
//     favorites,
//   } = useApp();
//   // const { addNotification } = useNotifications();
//   // const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

//   const [showErrorDialog, setShowErrorDialog] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     // if (!userState.isAuthenticated && !userState.role) {
//     //   router.push('/select-lang');
//     // }

//     // const savedRole = localStorage.getItem('userRole') as UserRole | null;
//     // if (savedRole) {
//     //   setUserRole(savedRole);
//     // }

//     setOrders(mockOrders);
//     const handleBeforeUnload = () => {
//       localStorage.clear();
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [
//     userState,
//     router,
//     addNotification,
//     addToFavorites,
//     removeFromFavorites,
//     isFavorite,
//     orders,
//   ]);

//   const handleRoleConfirm = (role: 'carrier' | 'other') => {
//     setUserRole(role === 'carrier' ? 'carrier' : 'cargo-owner');
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//     // Здесь должна быть логика фильтрации заказов
//   };

//   const handleApplyFilters = (filters: FilterState) => {
//     console.log('Applied filters:', filters);
//     // Здесь должна быть логика применения фильтров к заказам
//   };

//   const handleNotificationToggle = (order: Order) => {
//     if (
//       notifications.some(
//         (notification) =>
//           notification.orderId === order.id && !notification.isRead
//       )
//     ) {
//       setErrorMessage('Для этого груза уже включены нотификации');
//       setShowErrorDialog(true);
//     } else {
//       setCurrentOrder(order);
//       setShowNotificationDialog(true);
//     }
//   };

//   const handleEnableNotification = () => {
//     if (currentOrder) {
//       addNotification({
//         orderId: currentOrder.id,
//         type: 'cargo',
//         message: `Включены уведомления для груза: ${currentOrder.cargo} (${currentOrder.from} - ${currentOrder.to})`,
//       });
//       setShowNotificationDialog(false);
//     }
//   };

//   const handleFavoriteToggle = (order: Order) => {
//     // const favoriteId = `cargo-${order.id}`;
//     if (isFavorite(order.id)) {
//       setErrorMessage('Этот груз уже находится в избранном');
//       setShowErrorDialog(true);
//     } else {
//       addToFavorites({
//         orderId: order.id,
//         type: order.cargo,
//         title: `${order.cargo}: ${order.from} - ${order.to}`,
//         description: order.description,
//         details: {
//           Вес: `${order.weight} т`,
//           Габариты: order.dimensions,
//           'Тип погрузки': order.loadingType,
//           'Тип разгрузки': order.unloadingType,
//           Оплата: order.payment,
//           Цена: order.price,
//         },
//       });
//     }
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

//   if (!userState.role && !userState.isAuthenticated) {
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
//                       title='Топ заявки от наших студентов'
//                     >
//                       <Star className='h-4 w-4' />
//                     </Badge>
//                   )}
//                   {order.isVerified && (
//                     <Badge
//                       variant='secondary'
//                       className='bg-green-100 text-green-800'
//                       title='Профиль подтвержден'
//                     >
//                       <CheckCircle className='h-4 w-4' />
//                     </Badge>
//                   )}
//                   {order.experience > 1 && (
//                     <Badge
//                       variant='secondary'
//                       className='bg-blue-100 text-blue-800'
//                       title='Опыт логиста'
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
//                   onClick={() => handleNotificationToggle(order)}
//                 >
//                   <Bell className='h-4 w-4 mr-1' />
//                 </Button>

//                 {/* <Button
//                   variant='outline'
//                   size='sm'
//                   className='flex-1 ml-1 mr-1'
//                   onClick={() => setShowNotificationDialog(true)}
//                 >
//                   <Bell className='h-4 w-4 mr-1' />
//                 </Button> */}

//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className={`flex-1 ${
//                     isFavorite(order.id)
//                       ? 'text-red-500 hover:text-red-600'
//                       : ''
//                   }`}
//                   onClick={() => handleFavoriteToggle(order)}
//                 >
//                   <Heart className='h-4 w-4 mr-1' />
//                 </Button>
//                 {/* <Button variant='outline' size='sm' className='flex-1'>
//                   <Heart className='h-4 w-4 mr-1' />
//                 </Button> */}
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
//             Вы будете получать уведомления о новых предложениях по этому
//             направлению и типу груза.
//           </p>
//           <div className='flex justify-end space-x-2 mt-4'>
//             <Button
//               variant='outline'
//               onClick={() => setShowNotificationDialog(false)}
//             >
//               Отмена
//             </Button>
//             <Button onClick={handleEnableNotification}>Включить</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* <Dialog
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
//       </Dialog> */}

//       <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Внимание</DialogTitle>
//           </DialogHeader>
//           <p>{errorMessage}</p>
//           <div className='flex justify-end space-x-2 mt-4'>
//             <Button onClick={() => setShowErrorDialog(false)}>Понятно</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <NavigationMenu
//         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//       />
//     </div>
//   );

//   //     <NavigationMenu
//   //       userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//   //     />

//   //     {/* <NavigationMenu userRole={userRole} /> */}
//   //   </div>
//   // );
// }
// ...........................................................................................................................................................................................................................................................

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Filter,
//   Star,
//   CheckCircle,
//   Clock,
//   Bell,
//   Heart,
//   ChevronDown,
//   ChevronUp,
//   Search,
//   Loader2,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@/contexts/UserContext';
// import { useApp } from '@/contexts/AppContext';
// import { api } from '@/lib/api';
// import { toast } from 'sonner';

// interface CargoResponse {
//   results: Cargo[];
// }

// interface Cargo {
//   id: string;
//   title: string;
//   description: string;
//   owner: {
//     id: string;
//     role: string;
//     company_name?: string;
//     full_name: string;
//     rating?: number;
//     is_verified?: boolean;
//   };
//   weight: number;
//   volume?: number;
//   loading_point: string;
//   unloading_point: string;
//   loading_date: string;
//   vehicle_type: string;
//   payment_method: string;
//   price?: number;
//   status: string;
//   created_at: string;
// }

// export default function OrdersPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [cargos, setCargos] = useState<CargoResponse>({ results: [] });
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [showNotificationDialog, setShowNotificationDialog] = useState(false);
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentCargo, setCurrentCargo] = useState<Cargo | null>(null);
//   const [filters, setFilters] = useState({
//     vehicle_type: '',
//     loading_point: '',
//     unloading_point: '',
//   });

//   const { userState } = useUser();
//   const router = useRouter();
//   const {
//     addNotification,
//     addToFavorites,
//     removeFromFavorites,
//     isFavorite,
//     notifications,
//   } = useApp();

//   useEffect(() => {
//     fetchCargos();
//   }, [searchTerm, filters]);

//   const fetchCargos = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.getCargos({
//         search: searchTerm,
//         ...filters,
//       });
//       setCargos(response);
//       console.log(response, 'response bro');
//     } catch (error) {
//       toast.error('Ошибка при загрузке грузов');
//       console.error('Fetch cargos error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleNotificationToggle = (cargo: Cargo) => {
//     if (
//       notifications.some(
//         (notification) =>
//           notification.orderId === Number(cargo.id) && !notification.isRead
//       )
//     ) {
//       toast.error('Для этого груза уже включены уведомления');
//       return;
//     }
//     setCurrentCargo(cargo);
//     setShowNotificationDialog(true);
//   };

//   const handleEnableNotification = () => {
//     if (currentCargo) {
//       addNotification({
//         orderId: Number(currentCargo.id),
//         type: 'cargo',
//         message: `Включены уведомления для груза: ${currentCargo.title} (${currentCargo.loading_point} - ${currentCargo.unloading_point})`,
//       });
//       setShowNotificationDialog(false);
//     }
//   };

//   const handleFavoriteToggle = (cargo: Cargo) => {
//     if (isFavorite(Number(cargo.id))) {
//       toast.error('Этот груз уже находится в избранном');
//       return;
//     }

//     addToFavorites({
//       orderId: Number(cargo.id),
//       type: cargo.vehicle_type,
//       title: `${cargo.title}: ${cargo.loading_point} - ${cargo.unloading_point}`,
//       description: cargo.description,
//       details: {
//         Вес: `${cargo.weight} т`,
//         Объем: cargo.volume ? `${cargo.volume} м³` : 'Не указан',
//         'Тип транспорта': cargo.vehicle_type,
//         Оплата: cargo.payment_method,
//         Цена: cargo.price ? `${cargo.price} ₽` : 'Договорная',
//       },
//     });
//   };

//   const renderStars = (rating: number = 0) => {
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

//   const toggleOrderExpansion = (orderId: string) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (isLoading) {
//     return (
//       <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
//         <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
//       </div>
//     );
//   }

//   return (
//     <div className='min-h-screen bg-blue-600 p-4 pb-20'>
//       <div className='flex items-center mb-4 bg-white rounded-lg p-2'>
//         <Input
//           type='text'
//           placeholder='Поиск заказов...'
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
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

//       <div className='space-y-4 mb-20'>
//         {cargos?.results?.map((cargo) => (
//           <Card key={cargo.id} className='bg-white overflow-hidden'>
//             <CardContent className='p-4'>
//               {cargo.owner && (
//                 <>

//                 <div className='flex justify-between items-start mb-2'>
//                   <div className='flex space-x-1'>
//                     {cargo.owner && cargo.owner.rating && cargo.owner.rating > 4 && (
//                       <Badge
//                         variant='secondary'
//                         className='bg-yellow-100 text-yellow-800'
//                         title='Высокий рейтинг'
//                       >
//                         <Star className='h-4 w-4' />
//                       </Badge>
//                     )}
//                     {cargo.owner && cargo.owner.is_verified && (
//                       <Badge
//                         variant='secondary'
//                         className='bg-green-100 text-green-800'
//                         title='Профиль подтвержден'
//                       >
//                         <CheckCircle className='h-4 w-4' />
//                       </Badge>
//                     )}
//                   </div>

//                   <div className='flex items-center'>
//                     {cargo.owner && cargo.owner.rating && (
//                       <>
//                         <span className='font-bold mr-1'>
//                           {cargo.owner.rating}
//                         </span>
//                         <div className='flex'>
//                           {renderStars(cargo.owner.rating)}
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 </>
//               )}

//               <div className='flex justify-between items-center mb-2'>
//                 <span className='font-bold text-lg'>
//                   {cargo.loading_point} - {cargo.unloading_point}
//                 </span>
//                 <span className='text-sm text-gray-500'>
//                   {new Date(cargo.created_at).toLocaleString()}
//                 </span>
//               </div>

//               <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
//                 <span>Груз: {cargo.title}</span>
//                 <span>Вес: {cargo.weight} т</span>
//                 <span>Тип: {cargo.vehicle_type}</span>
//                 <span>Оплата: {cargo.payment_method}</span>
//               </div>

//               <div className='mb-2'>
//                 <span className='font-semibold'>
//                   Цена: {cargo.price ? `${cargo.price} ₽` : 'Договорная'}
//                 </span>
//               </div>

//               {expandedOrder === cargo.id && (
//                 <div className='mt-4 text-sm'>
//                   <p>Описание: {cargo.description}</p>
//                   {cargo.volume && <p>Объем: {cargo.volume} м³</p>}
//                   <p>
//                     Дата загрузки:{' '}
//                     {new Date(cargo.loading_date).toLocaleDateString()}
//                   </p>
//                 </div>
//               )}

//               <div className='flex justify-between mt-4'>
//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className='flex-1 mr-1'
//                   onClick={() => toggleOrderExpansion(cargo.id)}
//                 >
//                   {expandedOrder === cargo.id ? (
//                     <ChevronUp className='h-4 w-4 mr-1' />
//                   ) : (
//                     <ChevronDown className='h-4 w-4 mr-1' />
//                   )}
//                   {expandedOrder === cargo.id ? 'Скрыть' : 'Подробнее'}
//                 </Button>
//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className='flex-1 ml-1 mr-1'
//                   onClick={() => handleNotificationToggle(cargo)}
//                 >
//                   <Bell className='h-4 w-4 mr-1' />
//                 </Button>
//                 <Button
//                   variant='outline'
//                   size='sm'
//                   className={`flex-1 ${
//                     isFavorite(Number(cargo.id))
//                       ? 'text-red-500 hover:text-red-600'
//                       : ''
//                   }`}
//                   onClick={() => handleFavoriteToggle(cargo)}
//                 >
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
//             Вы будете получать уведомления о новых предложениях по этому
//             направлению и типу груза.
//           </p>
//           <div className='flex justify-end space-x-2 mt-4'>
//             <Button
//               variant='outline'
//               onClick={() => setShowNotificationDialog(false)}
//             >
//               Отмена
//             </Button>
//             <Button onClick={handleEnableNotification}>Включить</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <NavigationMenu
//         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//       />
//     </div>
//   );
// // }
// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
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
// import { ScrollArea } from '@/components/ui/scroll-area';
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
//   X,
//   Check,
//   Loader2,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';
// import { useUser } from '@/contexts/UserContext';
// import { useRouter } from 'next/navigation';
// import { useApp } from '@/contexts/AppContext';
// import { api } from '@/lib/api';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import { Slider } from '@/components/ui/slider';

// interface Location {
//   id: string;
//   name: string;
//   full_name?: string;
//   level?: number;
//   parent_name?: string;
//   country_name?: string;
//   latitude?: number;
//   longitude?: number;
// }

// interface FilterState {
//   category: string;
//   loading_location: { id: string; name: string };
//   unloading_location: { id: string; name: string };
//   vehicleType: string;
//   dateRange: Range;
//   notifications: boolean;
//   radius: number; // Добавлено для радиуса поиска
// }

// interface CargoResponse {
//   results: Cargo[];
// }

// interface Cargo {
//   id: string;
//   title: string;
//   description: string;
//   owner: {
//     id: string;
//     role: string;
//     company_name?: string;
//     full_name: string;
//     rating?: number;
//     is_verified?: boolean;
//   };
//   weight: number;
//   volume?: number;
//   loading_point: string;
//   unloading_point: string;
//   loading_location?: string;
//   unloading_location?: string;
//   loading_date: string;
//   vehicle_type: string;
//   payment_method: string;
//   price?: number;
//   status: string;
//   created_at: string;
// }

// const cargoCategories = [
//   'Металл',
//   'Текстиль',
//   'Продукты',
//   'Техника',
//   'Стройматериалы',
// ];

// const vehicleTypes = [
//   'tent',
//   'refrigerator',
//   'isothermal',
//   'container',
//   'car_carrier',
//   'board',
// ];

// const LocationSelector = ({
//   value,
//   onChange,
//   placeholder,
//   error,
//   errorMessage,
// }: {
//   value: { id: string; name: string };
//   onChange: (value: { id: string; name: string }) => void;
//   placeholder: string;
//   error?: boolean;
//   errorMessage?: string;
// }) => {
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Обработка клика вне компонента для закрытия выпадающего списка
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Поиск локаций при вводе
//   useEffect(() => {
//     if (searchQuery.length >= 2) {
//       setIsLoading(true);
//       setOpen(true); // Открываем список при вводе

//       const timer = setTimeout(() => {
//         api
//           .searchLocations(searchQuery)
//           .then((data) => {
//             setLocations(Array.isArray(data) ? data : []);
//             setIsLoading(false);
//           })
//           .catch((err) => {
//             console.error('Search error:', err);
//             setLocations([]);
//             setIsLoading(false);
//           });
//       }, 300);

//       return () => clearTimeout(timer);
//     } else {
//       setLocations([]);
//       if (searchQuery.length === 0) {
//         setOpen(false);
//       }
//     }
//   }, [searchQuery]);

//   const handleSelect = (location: Location) => {
//     onChange({
//       id: location.id,
//       name: location.full_name || location.name,
//     });
//     setSearchQuery('');
//     setOpen(false);
//   };

//   return (
//     <div className='relative w-full' ref={containerRef}>
//       <Input
//         placeholder={placeholder}
//         value={searchQuery}
//         onChange={(e) => setSearchQuery(e.target.value)}
//         onFocus={() => searchQuery.length >= 2 && setOpen(true)}
//         className={cn(error && 'border-red-500')}
//       />

//       {/* Показываем выбранное значение если оно есть и поиск пустой */}
//       {value.name && searchQuery === '' && (
//         <div className='absolute right-0 top-0 h-full flex items-center pr-3 text-sm text-muted-foreground'>
//           {value.name}
//         </div>
//       )}

//       {open && (
//         <div className='absolute z-10 w-full mt-1 bg-white rounded-md border shadow-md'>
//           <div className='p-1'>
//             {isLoading ? (
//               <div className='p-4 text-center text-sm text-muted-foreground'>
//                 Загрузка...
//               </div>
//             ) : locations.length === 0 ? (
//               <div className='p-4 text-center text-sm text-muted-foreground'>
//                 {searchQuery.length < 2
//                   ? 'Введите минимум 2 символа для поиска'
//                   : 'Ничего не найдено'}
//               </div>
//             ) : (
//               <ScrollArea className='h-[300px]'>
//                 {locations.map((location) => (
//                   <div
//                     key={location.id}
//                     onClick={() => handleSelect(location)}
//                     className={cn(
//                       'flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer',
//                       'hover:bg-blue-50'
//                     )}
//                   >
//                     <div className='flex-1'>
//                       <p className='text-sm font-medium'>
//                         {location.name}
//                         {location.level === 3 && location.parent_name && (
//                           <span className='text-gray-500'>
//                             {' - '}
//                             {location.parent_name}
//                           </span>
//                         )}
//                         {location.country_name && location.level !== 1 && (
//                           <span className='text-gray-500'>
//                             {', '}
//                             {location.country_name}
//                           </span>
//                         )}
//                       </p>
//                       {location.full_name && (
//                         <p className='text-xs text-gray-500'>
//                           {location.full_name}
//                         </p>
//                       )}
//                     </div>
//                     {value.id === location.id && <Check className='h-4 w-4' />}
//                   </div>
//                 ))}
//               </ScrollArea>
//             )}
//           </div>
//         </div>
//       )}

//       {error && errorMessage && (
//         <p className='text-sm text-red-500 mt-1'>{errorMessage}</p>
//       )}
//     </div>
//   );
// };

// const FilterModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onApply: (filters: any) => void;
// }> = ({ isOpen, onClose, onApply }) => {
//   const [filters, setFilters] = useState<FilterState>({
//     category: '',
//     loading_location: { id: '', name: '' },
//     unloading_location: { id: '', name: '' },
//     vehicleType: '',
//     dateRange: {
//       startDate: undefined,
//       endDate: undefined,
//       key: 'selection',
//     },
//     notifications: false,
//     radius: 100, // Значение по умолчанию
//   });

//   const handleSelectChange = (name: string, value: string) => {
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateRangeChange = (ranges: RangeKeyDict) => {
//     setFilters((prev) => ({ ...prev, dateRange: ranges.selection }));
//   };

//   const handleCheckboxChange = (checked: boolean) => {
//     setFilters((prev) => ({ ...prev, notifications: checked }));
//   };

//   const handleRadiusChange = (value: number[]) => {
//     setFilters((prev) => ({ ...prev, radius: value[0] }));
//   };

//   const handleApply = () => {
//     onApply({
//       category: filters.category,
//       loading_location_id: filters.loading_location.id, // Изменено с loading_location
//       unloading_location_id: filters.unloading_location.id, // Изменено с unloading_location
//       vehicle_type: filters.vehicleType,
//       date_from: filters.dateRange.startDate
//         ? new Date(filters.dateRange.startDate).toISOString().split('T')[0]
//         : undefined,
//       date_to: filters.dateRange.endDate
//         ? new Date(filters.dateRange.endDate).toISOString().split('T')[0]
//         : undefined,
//       notifications: filters.notifications,
//       radius: filters.radius, // Добавляем радиус в фильтры
//     });
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className='bg-blue-600 text-white max-w-lg'>
//         <DialogHeader>
//           <DialogTitle className='text-white text-center'>
//             Поиск грузов
//           </DialogTitle>
//         </DialogHeader>
//         <ScrollArea className='pr-4 h-[70vh] max-h-[600px]'>
//           <div className='space-y-4 px-1'>
//             <Select
//               onValueChange={(value) => handleSelectChange('category', value)}
//             >
//               <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
//                 <SelectValue placeholder='Категория грузов' />
//               </SelectTrigger>
//               <SelectContent>
//                 {cargoCategories.map((category) => (
//                   <SelectItem key={category} value={category}>
//                     {category}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select
//               onValueChange={(value) =>
//                 handleSelectChange('vehicleType', value)
//               }
//             >
//               <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
//                 <SelectValue placeholder='Тип транспорта' />
//               </SelectTrigger>
//               <SelectContent>
//                 {vehicleTypes.map((type) => (
//                   <SelectItem key={type} value={type}>
//                     {type === 'tent'
//                       ? 'Тент'
//                       : type === 'refrigerator'
//                       ? 'Рефрижератор'
//                       : type === 'isothermal'
//                       ? 'Изотерм'
//                       : type === 'container'
//                       ? 'Контейнер'
//                       : type === 'car_carrier'
//                       ? 'Автовоз'
//                       : 'Борт'}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <div className='space-y-2'>
//               <label className='text-white text-sm'>Откуда</label>
//               <LocationSelector
//                 value={filters.loading_location}
//                 onChange={(value) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     loading_location: value,
//                   }))
//                 }
//                 placeholder='Выберите пункт погрузки'
//               />
//             </div>

//             <div className='space-y-2'>
//               <label className='text-white text-sm'>Куда</label>
//               <LocationSelector
//                 value={filters.unloading_location}
//                 onChange={(value) =>
//                   setFilters((prev) => ({
//                     ...prev,
//                     unloading_location: value,
//                   }))
//                 }
//                 placeholder='Выберите пункт выгрузки'
//               />
//             </div>

//             {/* Радиус поиска */}
//             <div className='space-y-2'>
//               <div className='flex justify-between items-center'>
//                 <label className='text-white text-sm'>
//                   Радиус поиска: {filters.radius} км
//                 </label>
//               </div>
//               <Slider
//                 defaultValue={[100]}
//                 max={500}
//                 min={0}
//                 step={10}
//                 value={[filters.radius]}
//                 onValueChange={handleRadiusChange}
//                 className='py-4'
//               />
//               <p className='text-xs text-blue-200'>
//                 Поиск грузов в радиусе до {filters.radius} км от выбранных точек
//               </p>
//             </div>

//             <div className='bg-white rounded-md p-2'>
//               <DateRange
//                 ranges={[filters.dateRange]}
//                 onChange={handleDateRangeChange}
//                 months={1}
//                 direction='vertical'
//                 className='w-full'
//               />
//             </div>

//             <div className='flex items-center space-x-2'>
//               <Checkbox
//                 id='notifications'
//                 checked={filters.notifications}
//                 onCheckedChange={handleCheckboxChange}
//               />
//               <label htmlFor='notifications' className='text-white'>
//                 Включить уведомления
//               </label>
//             </div>

//             <Button
//               onClick={handleApply}
//               className='w-full bg-yellow-400 text-blue-800 hover:bg-yellow-500'
//             >
//               Найти грузы
//             </Button>
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default function OrdersPage() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [cargos, setCargos] = useState<CargoResponse>({ results: [] });
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
//   const [showNotificationDialog, setShowNotificationDialog] = useState(false);
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentCargo, setCurrentCargo] = useState<Cargo | null>(null);
//   const [filterParams, setFilterParams] = useState<any>({});
//   const [showErrorDialog, setShowErrorDialog] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   const { userState } = useUser();
//   const router = useRouter();
//   const {
//     addNotification,
//     addToFavorites,
//     removeFromFavorites,
//     isFavorite,
//     notifications,
//   } = useApp();

//   useEffect(() => {
//     fetchCargos();
//   }, [searchTerm, filterParams]);

//   // const fetchCargos = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     console.log(searchTerm, 'searchterm');
//   //     console.log(filterParams, 'filterparams');
//   //     const response = await api.getCargos({
//   //       search: searchTerm,
//   //       ...filterParams,
//   //     });
//   //     setCargos(response);
//   //     console.log(response, 'res');
//   //   } catch (error) {
//   //     toast.error('Ошибка при загрузке грузов');
//   //     console.error('Fetch cargos error:', error);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   // Also modify the fetchCargos function to use different approaches based on whether filters are active
//   const fetchCargos = async () => {
//     try {
//       setIsLoading(true);

//       // If we have active filters, use searchCargo
//       if (Object.keys(filterParams).length > 0) {
//         const queryParams = {
//           search: searchTerm,
//           ...filterParams,
//         };
//         const response = await api.searchCargo(queryParams);
//         setCargos(response);
//       } else {
//         // Otherwise use the regular getCargos API
//         const response = await api.getCargos({ search: searchTerm });
//         setCargos(response);
//       }

//       console.log('Cargo response:', cargos);
//     } catch (error) {
//       toast.error('Ошибка при загрузке грузов');
//       console.error('Fetch cargos error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update the handleSearch function to use the appropriate API based on filter state
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newSearchTerm = e.target.value;
//     setSearchTerm(newSearchTerm);

//     // Debounce search to avoid too many API calls
//     if (searchTimeout.current) {
//       clearTimeout(searchTimeout.current);
//     }

//     searchTimeout.current = setTimeout(() => {
//       setIsLoading(true);

//       // If we have active filters, use searchCargo with combined parameters
//       if (Object.keys(filterParams).length > 0) {
//         const queryParams = {
//           search: newSearchTerm,
//           ...filterParams,
//         };

//         api
//           .searchCargo(queryParams)
//           .then((response) => {
//             setCargos(response);
//             console.log('Search results with filters:', response);
//           })
//           .catch((error) => {
//             toast.error('Ошибка при поиске грузов');
//             console.error('Search error:', error);
//           })
//           .finally(() => {
//             setIsLoading(false);
//           });
//       } else {
//         // Otherwise use the regular getCargos API
//         api
//           .getCargos({ search: newSearchTerm })
//           .then((response) => {
//             setCargos(response);
//             console.log('Search results:', response);
//           })
//           .catch((error) => {
//             toast.error('Ошибка при поиске грузов');
//             console.error('Search error:', error);
//           })
//           .finally(() => {
//             setIsLoading(false);
//           });
//       }
//     }, 300); // 300ms debounce
//   };

//   // Add this to the component's state
//   const searchTimeout = useRef<NodeJS.Timeout | null>(null);

//   const handleApplyFilters = async (filters: any) => {
//     console.log('Applied filters:', filters);
//     setIsLoading(true);

//     try {
//       // Create a combined query object with both search term and filters
//       const queryParams = {
//         search: searchTerm, // Include the current search term
//         ...filters, // Include all filter parameters
//       };

//       // Use searchCargo API with the combined parameters
//       const response = await api.searchCargo(queryParams);
//       setCargos(response);
//       console.log('Filtered results:', response);

//       // Store the filters in state (but don't trigger another fetch)
//       setFilterParams(filters);

//       // If notifications are enabled, add a notification for the filter
//       if (filters.notifications) {
//         const notificationMessage = `Включены уведомления для поиска: ${
//           filters.category ? `${filters.category}, ` : ''
//         }${
//           filters.loading_location_id ? `Из: ${filters.loading_location}, ` : ''
//         }${
//           filters.unloading_location_id
//             ? `В: ${filters.unloading_location}`
//             : ''
//         }${filters.radius ? `, Радиус: ${filters.radius} км` : ''}`;

//         addNotification({
//           orderId: Date.now(), // Use timestamp as ID
//           type: 'filter',
//           message: notificationMessage,
//         });
//         toast.success('Уведомления о новых грузах включены');
//       }
//     } catch (error) {
//       toast.error('Ошибка при поиске грузов');
//       console.error('Search cargo error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // const handleApplyFilters = (filters: any) => {
//   //   console.log('Applied filters:', filters);
//   //   setFilterParams(filters);

//   //   // If notifications are enabled, add a notification for the filter
//   //   if (filters.notifications) {
//   //     const notificationMessage = `Включены уведомления для поиска: ${
//   //       filters.category ? `${filters.category}, ` : ''
//   //     }${filters.loading_location ? `Из: ${filters.loading_location}, ` : ''}${
//   //       filters.unloading_location ? `В: ${filters.unloading_location}` : ''
//   //     }${filters.radius ? `, Радиус: ${filters.radius} км` : ''}`;

//   //     addNotification({
//   //       orderId: Date.now(), // Use timestamp as ID
//   //       type: 'filter',
//   //       message: notificationMessage,
//   //     });

//   //     toast.success('Уведомления о новых грузах включены');
//   //   }
//   // };

//   const handleNotificationToggle = (cargo: Cargo) => {
//     if (
//       notifications.some(
//         (notification) =>
//           notification.orderId === Number(cargo.id) && !notification.isRead
//       )
//     ) {
//       setErrorMessage('Для этого груза уже включены нотификации');
//       setShowErrorDialog(true);
//       return;
//     }
//     setCurrentCargo(cargo);
//     setShowNotificationDialog(true);
//   };

//   const handleEnableNotification = () => {
//     if (currentCargo) {
//       addNotification({
//         orderId: Number(currentCargo.id),
//         type: 'cargo',
//         message: `Включены уведомления для груза: ${currentCargo.title} (${currentCargo.loading_point} - ${currentCargo.unloading_point})`,
//       });
//       setShowNotificationDialog(false);
//       toast.success('Уведомления включены');
//     }
//   };

//   const handleFavoriteToggle = (cargo: Cargo) => {
//     if (isFavorite(Number(cargo.id))) {
//       removeFromFavorites(Number(cargo.id));
//       toast.success('Груз удален из избранного');
//     } else {
//       addToFavorites({
//         orderId: Number(cargo.id),
//         type: cargo.vehicle_type,
//         title: `${cargo.title}: ${cargo.loading_point} - ${cargo.unloading_point}`,
//         description: cargo.description,
//         details: {
//           Вес: `${cargo.weight} т`,
//           Объем: cargo.volume ? `${cargo.volume} м³` : 'Не указан',
//           'Тип транспорта': cargo.vehicle_type,
//           Оплата: cargo.payment_method,
//           Цена: cargo.price ? `${cargo.price} ₽` : 'Договорная',
//         },
//       });
//       toast.success('Груз добавлен в избранное');
//     }
//   };

//   const renderStars = (rating: number = 0) => {
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

//   const toggleOrderExpansion = (orderId: string) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

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

//       {isLoading ? (
//         <div className='flex items-center justify-center h-64'>
//           <Loader2 className='h-8 w-8 animate-spin text-white' />
//         </div>
//       ) : (
//         <div className='space-y-4 mb-20'>
//           {filterParams.radius &&
//             (filterParams.loading_location ||
//               filterParams.unloading_location) && (
//               <div className='bg-white p-3 rounded-lg mb-2 text-sm'>
//                 <Badge
//                   variant='secondary'
//                   className='bg-blue-100 text-blue-800'
//                 >
//                   Поиск в радиусе {filterParams.radius} км
//                 </Badge>
//                 {filterParams.loading_location && (
//                   <span className='ml-2'>от точки погрузки</span>
//                 )}
//                 {filterParams.loading_location &&
//                   filterParams.unloading_location && <span> и </span>}
//                 {filterParams.unloading_location && (
//                   <span>от точки выгрузки</span>
//                 )}
//               </div>
//             )}

//           {cargos.results && cargos.results.length > 0 ? (
//             cargos.results.map((cargo) => (
//               <Card key={cargo.id} className='bg-white overflow-hidden'>
//                 <CardContent className='p-4'>
//                   <div className='flex justify-between items-start mb-2'>
//                     <div className='flex space-x-1'>
//                       {cargo.owner &&
//                         cargo.owner.rating &&
//                         cargo.owner.rating > 4 && (
//                           <Badge
//                             variant='secondary'
//                             className='bg-yellow-100 text-yellow-800'
//                             title='Высокий рейтинг'
//                           >
//                             <Star className='h-4 w-4' />
//                           </Badge>
//                         )}
//                       {cargo.owner && cargo.owner.is_verified && (
//                         <Badge
//                           variant='secondary'
//                           className='bg-green-100 text-green-800'
//                           title='Профиль подтвержден'
//                         >
//                           <CheckCircle className='h-4 w-4' />
//                         </Badge>
//                       )}
//                     </div>
//                     <div className='flex items-center'>
//                       {cargo.owner && cargo.owner.rating && (
//                         <>
//                           <span className='font-bold mr-1'>
//                             {cargo.owner.rating}
//                           </span>
//                           <div className='flex'>
//                             {renderStars(cargo.owner.rating)}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   <div className='flex justify-between items-center mb-2'>
//                     <span className='font-bold text-lg'>
//                       {cargo.loading_point} - {cargo.unloading_point}
//                     </span>
//                     <span className='text-sm text-gray-500'>
//                       {new Date(cargo.created_at).toLocaleString('ru-RU', {
//                         day: '2-digit',
//                         month: '2-digit',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                       })}
//                     </span>
//                   </div>

//                   <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
//                     <span>Груз: {cargo.title}</span>
//                     <span>Вес: {cargo.weight} т</span>
//                     <span>Тип: {cargo.vehicle_type}</span>
//                     <span>Оплата: {cargo.payment_method}</span>
//                   </div>

//                   <div className='mb-2'>
//                     <span className='font-semibold'>
//                       Цена: {cargo.price ? `${cargo.price} ₽` : 'Договорная'}
//                     </span>
//                   </div>

//                   {expandedOrder === cargo.id && (
//                     <div className='mt-4 text-sm'>
//                       <p>Описание: {cargo.description}</p>
//                       {cargo.volume && <p>Объем: {cargo.volume} м³</p>}
//                       <p>
//                         Дата загрузки:{' '}
//                         {new Date(cargo.loading_date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   )}

//                   <div className='flex justify-between mt-4'>
//                     <Button
//                       variant='outline'
//                       size='sm'
//                       className='flex-1 mr-1'
//                       onClick={() => toggleOrderExpansion(cargo.id)}
//                     >
//                       {expandedOrder === cargo.id ? (
//                         <ChevronUp className='h-4 w-4 mr-1' />
//                       ) : (
//                         <ChevronDown className='h-4 w-4 mr-1' />
//                       )}
//                       {expandedOrder === cargo.id ? 'Скрыть' : 'Подробнее'}
//                     </Button>
//                     <Button
//                       variant='outline'
//                       size='sm'
//                       className='flex-1 ml-1 mr-1'
//                       onClick={() => handleNotificationToggle(cargo)}
//                     >
//                       <Bell className='h-4 w-4 mr-1' />
//                     </Button>
//                     <Button
//                       variant='outline'
//                       size='sm'
//                       className={`flex-1 ${
//                         isFavorite(Number(cargo.id))
//                           ? 'text-red-500 hover:text-red-600'
//                           : ''
//                       }`}
//                       onClick={() => handleFavoriteToggle(cargo)}
//                     >
//                       <Heart className='h-4 w-4 mr-1' />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <div className='bg-white p-6 rounded-lg text-center text-gray-600'>
//               Грузы не найдены. Попробуйте изменить параметры поиска.
//             </div>
//           )}
//         </div>
//       )}

//       <Dialog
//         open={showNotificationDialog}
//         onOpenChange={setShowNotificationDialog}
//       >
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Включить уведомления?</DialogTitle>
//           </DialogHeader>
//           <p>
//             Вы будете получать уведомления о новых предложениях по этому
//             направлению и типу груза.
//           </p>
//           <div className='flex justify-end space-x-2 mt-4'>
//             <Button onClick={() => setShowErrorDialog(false)}>Понятно</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <NavigationMenu
//         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//       />
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {
  Filter,
  Star,
  CheckCircle,
  Clock,
  Bell,
  Heart,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { api } from '@/lib/api';
import { useTranslation } from '@/contexts/i18n';
import { AnimatePresence, motion } from 'framer-motion';
interface Location {
  id: string;
  name: string;
  full_name?: string;
  level?: number;
  parent_name?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
}

interface FilterState {
  loading_location: { id: string; name: string };
  unloading_location: { id: string; name: string };
  vehicle_type: string;
  dateRange: Range;
  notifications: boolean;
  radius: number;
  weight_min?: number;
  weight_max?: number;
}

interface CargoResponse {
  results: Cargo[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

interface Cargo {
  id: string;
  title: string;
  description: string;
  owner: {
    id: string;
    role: string;
    company_name?: string;
    full_name: string;
    rating?: number;
    is_verified?: boolean;
  };
  weight: number;
  volume?: number;
  loading_point: string;
  unloading_point: string;
  loading_location?: string;
  unloading_location?: string;
  loading_date: string;
  vehicle_type: string;
  payment_method: string;
  price?: number;
  status: string;
  created_at: string;
}

interface SearchFilterSubscription {
  id: string;
  name: string;
  filter_data: any;
  notifications_enabled: boolean;
}

const vehicleTypes = [
  { value: 'tent', label: 'Тент' },
  { value: 'refrigerator', label: 'Рефрижератор' },
  { value: 'isothermal', label: 'Изотерм' },
  { value: 'container', label: 'Контейнер' },
  { value: 'car_carrier', label: 'Автовоз' },
  { value: 'board', label: 'Борт' },
];

const getVehicleTypeLabel = (value: string): string => {
  const vehicleType = vehicleTypes.find((vt) => vt.value === value);
  return vehicleType ? vehicleType.label : value;
};

// const LocationSelector = ({
//   value,
//   onChange,
//   placeholder,
//   error,
//   errorMessage,
// }: {
//   value: { id: string; name: string };
//   onChange: (value: { id: string; name: string }) => void;
//   placeholder: string;
//   error?: boolean;
//   errorMessage?: string;
// }) => {
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [locations, setLocations] = useState<Location[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Handle outside click to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Search locations when typing
//   useEffect(() => {
//     if (searchQuery.length >= 2) {
//       setIsLoading(true);
//       setOpen(true);

//       const timer = setTimeout(() => {
//         api
//           .searchLocations(searchQuery)
//           .then((data) => {
//             setLocations(Array.isArray(data) ? data : []);
//             setIsLoading(false);
//           })
//           .catch((err) => {
//             console.error('Search location error:', err);
//             setLocations([]);
//             setIsLoading(false);
//           });
//       }, 300);

//       return () => clearTimeout(timer);
//     } else {
//       setLocations([]);
//       if (searchQuery.length === 0) {
//         setOpen(false);
//       }
//     }
//   }, [searchQuery]);

//   const handleSelect = (location: Location) => {
//     onChange({
//       id: location.id,
//       name: location.full_name || location.name,
//     });
//     setSearchQuery('');
//     setOpen(false);
//   };

//   const clearSelection = () => {
//     onChange({ id: '', name: '' });
//     setSearchQuery('');
//   };

//   return (
//     <div className='relative w-full' ref={containerRef}>
//       <div className='relative'>
//         <Input
//           placeholder={placeholder}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onFocus={() => searchQuery.length >= 2 && setOpen(true)}
//           className={cn(error && 'border-red-500')}
//         />

//         {/* Show selected value */}
//         {value.name && searchQuery === '' && (
//           <div className='absolute right-8 top-0 h-full flex items-center pr-3 text-sm text-muted-foreground'>
//             {value.name}
//           </div>
//         )}

//         {/* Clear button */}
//         {value.name && searchQuery === '' && (
//           <button
//             onClick={clearSelection}
//             className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
//           >
//             <X className='h-4 w-4' />
//           </button>
//         )}
//       </div>

//       {open && (
//         <div className='absolute z-10 w-full mt-1 bg-white rounded-md border shadow-md'>
//           <div className='p-1'>
//             {isLoading ? (
//               <div className='p-4 text-center text-sm text-muted-foreground'>
//                 Загрузка...
//               </div>
//             ) : locations.length === 0 ? (
//               <div className='p-4 text-center text-sm text-muted-foreground'>
//                 {searchQuery.length < 2
//                   ? 'Введите минимум 2 символа для поиска'
//                   : 'Ничего не найдено'}
//               </div>
//             ) : (
//               <ScrollArea className='h-[300px]'>
//                 {locations.map((location) => (
//                   <div
//                     key={location.id}
//                     onClick={() => handleSelect(location)}
//                     className={cn(
//                       'flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer',
//                       'hover:bg-blue-50'
//                     )}
//                   >
//                     <div className='flex-1'>
//                       <p className='text-sm font-medium'>
//                         {location.name}
//                         {location.level === 3 && location.parent_name && (
//                           <span className='text-gray-500'>
//                             {' - '}
//                             {location.parent_name}
//                           </span>
//                         )}
//                         {location.country_name && location.level !== 1 && (
//                           <span className='text-gray-500'>
//                             {', '}
//                             {location.country_name}
//                           </span>
//                         )}
//                       </p>
//                       {location.full_name && (
//                         <p className='text-xs text-gray-500'>
//                           {location.full_name}
//                         </p>
//                       )}
//                     </div>
//                     {value.id === location.id && <Check className='h-4 w-4' />}
//                   </div>
//                 ))}
//               </ScrollArea>
//             )}
//           </div>
//         </div>
//       )}

//       {error && errorMessage && (
//         <p className='text-sm text-red-500 mt-1'>{errorMessage}</p>
//       )}
//     </div>
//   );
// };

// Enhanced LocationSelector for home page filter
const LocationSelector = ({
  value,
  onChange,
  placeholder,
  error,
  errorMessage,
}: any) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search locations when typing
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setIsLoading(true);
      setOpen(true);
      const timer = setTimeout(() => {
        api
          .searchLocations(searchQuery)
          .then((data) => {
            setLocations(Array.isArray(data) ? data : []);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error('Search error:', err);
            setLocations([]);
            setIsLoading(false);
          });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setLocations([]);
      if (searchQuery.length === 0) {
        setOpen(false);
      }
    }
  }, [searchQuery]);

  const handleSelect = (location: any) => {
    onChange({
      id: location.id,
      name: location.full_name || location.name,
    });
    setSearchQuery('');
    setOpen(false);
  };

  const clearSelection = () => {
    onChange({ id: '', name: '' });
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className='relative w-full' ref={containerRef}>
      <div className='relative flex items-center'>
        {/* Custom styled input for blue theme */}
        <input
          ref={inputRef}
          type='text'
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setOpen(true)}
          className={cn(
            'w-full p-2.5 rounded-md transition-all duration-200',
            // Special styling for filter modal in blue theme
            'bg-blue-500 text-white border-blue-400 placeholder:text-blue-200',
            'focus:outline-none focus:ring-2 focus:ring-yellow-300/30 focus:border-yellow-400',
            'hover:bg-blue-600',
            error ? 'border-red-500' : 'border',
            value.name && !searchQuery ? 'pr-8' : ''
          )}
        />

        {/* Selected location display */}
        {value.name && !searchQuery && (
          <div className='absolute left-0 right-8 px-3 pointer-events-none flex items-center h-full'>
            <div className='truncate text-white font-medium'>{value.name}</div>
          </div>
        )}

        {/* Clear button */}
        {value.name && !searchQuery && (
          <button
            type='button'
            onClick={clearSelection}
            className='absolute right-3 text-blue-200 hover:text-white transition-colors'
            aria-label='Clear selection'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className='absolute z-50 w-full mt-1 bg-blue-700 border border-blue-500 rounded-md shadow-lg'
          >
            <div className='py-1'>
              {isLoading ? (
                <div className='p-4 text-center'>
                  <Loader2 className='h-5 w-5 animate-spin text-yellow-400 mx-auto mb-2' />
                  <p className='text-sm text-blue-200'>{t('common.loading')}</p>
                </div>
              ) : locations.length === 0 ? (
                <div className='p-4 text-center text-sm text-blue-200'>
                  {searchQuery.length < 2
                    ? t('cargo.enterMinimum2Chars')
                    : t('cargo.nothingFound')}
                </div>
              ) : (
                <ScrollArea className='max-h-[300px]'>
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      onClick={() => handleSelect(location)}
                      className={cn(
                        'flex items-center gap-2 mx-1 my-0.5 px-3 py-2 rounded cursor-pointer',
                        'hover:bg-blue-600 active:bg-blue-500 transition-colors',
                        value.id === location.id && 'bg-blue-600'
                      )}
                    >
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-white truncate'>
                          {location.name}
                          {location.level === 3 && location.parent_name && (
                            <span className='font-normal text-blue-200'>
                              {' '}
                              - {location.parent_name}
                            </span>
                          )}
                        </p>
                        {location.country_name && location.level !== 1 && (
                          <p className='text-xs text-blue-200 truncate'>
                            {location.country_name}
                          </p>
                        )}
                        {location.full_name && (
                          <p className='text-xs text-blue-200 truncate'>
                            {location.full_name}
                          </p>
                        )}
                      </div>
                      {value.id === location.id && (
                        <Check className='h-4 w-4 text-yellow-400 flex-shrink-0' />
                      )}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && errorMessage && (
        <p className='text-sm text-red-300 mt-1'>{errorMessage}</p>
      )}
    </div>
  );
};

const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters?: any;
}> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    loading_location: { id: '', name: '' },
    unloading_location: { id: '', name: '' },
    vehicle_type: '',
    dateRange: {
      startDate: undefined,
      endDate: undefined,
      key: 'selection',
    },
    notifications: false,
    radius: 100,
    weight_min: undefined,
    weight_max: undefined,
  });

  const [filterName, setFilterName] = useState('');
  const [saveFilter, setSaveFilter] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize with existing filters if provided
  useEffect(() => {
    if (initialFilters) {
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));
    }
  }, [initialFilters, isOpen]);

  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (ranges: RangeKeyDict) => {
    setFilters((prev) => ({ ...prev, dateRange: ranges.selection }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, notifications: checked }));

    // If enabling notifications, also enable saving filter
    if (checked) {
      setSaveFilter(true);
    }
  };

  const handleRadiusChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, radius: value[0] }));
  };

  const handleWeightChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? Number(value) : undefined;
    setFilters((prev) => ({
      ...prev,
      [type === 'min' ? 'weight_min' : 'weight_max']: numValue,
    }));
  };

  const validateFilters = () => {
    const newErrors: Record<string, string> = {};

    // Validate filter name if saving
    if (saveFilter && !filterName.trim()) {
      newErrors.filterName = 'Введите название фильтра';
    }

    // Validate at least one main filter is set
    if (
      !filters.loading_location.id &&
      !filters.unloading_location.id &&
      !filters.vehicle_type
    ) {
      newErrors.general = 'Укажите хотя бы один критерий фильтрации';
    }

    // Validate weight range if both values are provided
    if (
      filters.weight_min !== undefined &&
      filters.weight_max !== undefined &&
      filters.weight_min > filters.weight_max
    ) {
      newErrors.weight = 'Минимальный вес не может быть больше максимального';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = async () => {
    if (!validateFilters()) {
      return;
    }

    // Prepare filter data
    const filterData = {
      loading_location_id: filters.loading_location.id || undefined,
      unloading_location_id: filters.unloading_location.id || undefined,
      vehicle_type: filters.vehicle_type || undefined,
      date_from: filters.dateRange.startDate
        ? new Date(filters.dateRange.startDate).toISOString().split('T')[0]
        : undefined,
      date_to: filters.dateRange.endDate
        ? new Date(filters.dateRange.endDate).toISOString().split('T')[0]
        : undefined,
      radius: filters.radius,
      min_weight: filters.weight_min,
      max_weight: filters.weight_max,
    };

    // If saving filter with notifications, create search filter in backend
    if (saveFilter && filters.notifications) {
      try {
        await api.post('/core/search-filters/', {
          name: filterName,
          filter_data: filterData,
          notifications_enabled: true,
        });
        toast.success('Фильтр сохранен с уведомлениями');
      } catch (error) {
        console.error('Error saving filter:', error);
        toast.error('Ошибка при сохранении фильтра');
      }
    }

    onApply({
      ...filterData,
      notifications: filters.notifications,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-blue-600 text-white max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-white text-center'>
            Поиск грузов
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='pr-4 h-[70vh] max-h-[600px]'>
          <div className='space-y-4 px-1'>
            {errors.general && (
              <div className='bg-red-500 text-white p-2 rounded text-sm'>
                {errors.general}
              </div>
            )}

            <Select
              value={filters.vehicle_type}
              onValueChange={(value) =>
                handleSelectChange('vehicle_type', value)
              }
            >
              <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
                <SelectValue placeholder='Тип транспорта' />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='space-y-2'>
              <label className='text-white text-sm'>Откуда</label>
              <LocationSelector
                value={filters.loading_location}
                onChange={(value: any) =>
                  setFilters((prev) => ({
                    ...prev,
                    loading_location: value,
                  }))
                }
                placeholder='Выберите пункт погрузки'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-white text-sm'>Куда</label>
              <LocationSelector
                value={filters.unloading_location}
                onChange={(value: any) =>
                  setFilters((prev) => ({
                    ...prev,
                    unloading_location: value,
                  }))
                }
                placeholder='Выберите пункт выгрузки'
              />
            </div>

            {/* Weight range */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-white text-sm'>Вес от (т)</label>
                <Input
                  type='number'
                  min='0'
                  placeholder='Минимум'
                  value={filters.weight_min || ''}
                  onChange={(e) => handleWeightChange('min', e.target.value)}
                  className='bg-blue-500 text-white border-blue-400 placeholder:text-blue-300'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-white text-sm'>Вес до (т)</label>
                <Input
                  type='number'
                  min='0'
                  placeholder='Максимум'
                  value={filters.weight_max || ''}
                  onChange={(e) => handleWeightChange('max', e.target.value)}
                  className='bg-blue-500 text-white border-blue-400 placeholder:text-blue-300'
                />
              </div>
            </div>
            {errors.weight && (
              <div className='text-yellow-300 text-sm'>{errors.weight}</div>
            )}

            {/* Radius search */}
            <div className='space-y-2'>
              <div className='flex justify-between items-center'>
                <label className='text-white text-sm'>
                  Радиус поиска: {filters.radius} км
                </label>
              </div>
              <Slider
                defaultValue={[100]}
                max={500}
                min={0}
                step={10}
                value={[filters.radius]}
                onValueChange={handleRadiusChange}
                className='py-4'
              />
              <p className='text-xs text-blue-200'>
                Поиск грузов в радиусе до {filters.radius} км от выбранных точек
              </p>
            </div>

            <div className='bg-white rounded-md p-2'>
              <DateRange
                ranges={[filters.dateRange]}
                onChange={handleDateRangeChange}
                months={1}
                direction='vertical'
                className='w-full'
              />
            </div>

            <div className='flex items-center space-x-2'>
              <Checkbox
                id='notifications'
                checked={filters.notifications}
                onCheckedChange={handleCheckboxChange}
              />
              <label htmlFor='notifications' className='text-white'>
                Включить уведомления о новых грузах
              </label>
            </div>

            {filters.notifications && (
              <div className='space-y-2'>
                <div className='flex items-center space-x-2 mb-2'>
                  <Checkbox
                    id='saveFilter'
                    checked={saveFilter}
                    onCheckedChange={(checked) => setSaveFilter(!!checked)}
                  />
                  <label htmlFor='saveFilter' className='text-white'>
                    Сохранить фильтр
                  </label>
                </div>

                {saveFilter && (
                  <div>
                    <Input
                      placeholder='Название фильтра'
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      className={cn(
                        'bg-blue-500 border-blue-400 text-white placeholder:text-blue-300',
                        errors.filterName && 'border-red-400'
                      )}
                    />
                    {errors.filterName && (
                      <p className='text-yellow-300 text-sm mt-1'>
                        {errors.filterName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleApply}
              className='w-full bg-yellow-400 text-blue-800 hover:bg-yellow-500'
            >
              Применить фильтр
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cargos, setCargos] = useState<CargoResponse>({ results: [] });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCargo, setCurrentCargo] = useState<Cargo | null>(null);
  const [filterParams, setFilterParams] = useState<any>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [nextPage, setNextPage] = useState<string | null>(null);

  const { userState } = useUser();
  const router = useRouter();
  const { t } = useTranslation();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await api.getFavorites();
        const favoriteIds =
          response.results?.map((fav: any) => Number(fav.object_id)) || [];
        setFavorites(favoriteIds);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Fetch cargos on mount and when search/filters change
  useEffect(() => {
    fetchCargos();
  }, [searchTerm, filterParams]);

  // Function to fetch cargos from API
  const fetchCargos = async (resetResults = true) => {
    try {
      setIsLoading(resetResults);

      // Prepare query params
      const params = {
        search: searchTerm,
        ...filterParams,
      };

      // Use search endpoint if we have active filters
      let response;
      if (Object.keys(filterParams).length > 0) {
        response = await api.searchCargo(params);
      } else {
        response = await api.getCargos(params);
      }

      // Update state with results
      if (resetResults) {
        setCargos(response);
      } else {
        setCargos((prev) => ({
          ...response,
          results: [...prev.results, ...response.results],
        }));
      }

      // Store next page URL if pagination is available
      setNextPage(response.next);
    } catch (error) {
      toast.error('Ошибка при загрузке грузов');
      console.error('Fetch cargos error:', error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  // Load more results when user scrolls to bottom
  const loadMoreResults = async () => {
    if (!nextPage || isMoreLoading) return;

    setIsMoreLoading(true);
    try {
      const response = await fetch(nextPage);
      const data = await response.json();

      setCargos((prev) => ({
        ...data,
        results: [...prev.results, ...data.results],
      }));

      setNextPage(data.next);
    } catch (error) {
      toast.error('Ошибка при загрузке дополнительных результатов');
      console.error('Load more error:', error);
    } finally {
      setIsMoreLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Debounce search requests
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setFilterParams((prev: any) => ({
        ...prev,
        search: newSearchTerm,
      }));
    }, 500);
  };

  // Apply filters from filter modal
  const handleApplyFilters = async (filters: any) => {
    console.log('Applied filters:', filters);
    setIsLoading(true);

    // Update active filters list for UI
    const newActiveFilters = [];
    if (filters.loading_location_id)
      newActiveFilters.push(t('cargo.loadingPoint'));
    if (filters.unloading_location_id)
      newActiveFilters.push(t('cargo.unloadingPoint'));
    if (filters.vehicle_type) newActiveFilters.push(t('cargo.vehicleType'));
    if (filters.date_from || filters.date_to)
      newActiveFilters.push(t('cargo.loadingDate'));
    if (filters.min_weight || filters.max_weight)
      newActiveFilters.push(t('cargo.weight'));

    setActiveFilters(newActiveFilters);
    setFilterParams(filters);
  };

  // Reset all filters
  const clearFilters = () => {
    setFilterParams({});
    setActiveFilters([]);
    toast.info(t('common.filtersReset'));
  };

  // Subscribe to cargo notifications
  const handleNotificationToggle = (cargo: Cargo) => {
    setCurrentCargo(cargo);
    setShowNotificationDialog(true);
  };

  // Handle notification subscription via backend
  const handleEnableNotification = async () => {
    if (!currentCargo) return;

    try {
      // Create a search filter with notifications enabled
      await api.post('/core/search-filters/', {
        name: `${currentCargo.loading_point} - ${currentCargo.unloading_point}`,
        filter_data: {
          loading_location_id: currentCargo.loading_location,
          unloading_location_id: currentCargo.unloading_location,
          vehicle_type: currentCargo.vehicle_type,
        },
        notifications_enabled: true,
      });

      toast.success(t('notifications.notificationsEnabled'));
      setShowNotificationDialog(false);
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      toast.error(t('notifications.enableNotificationsError'));
    }
  };

  // Toggle favorite status
  const handleFavoriteToggle = async (cargo: Cargo) => {
    const cargoId = Number(cargo.id);
    const isFav = favorites.includes(cargoId);

    try {
      if (isFav) {
        // Find the favorite ID and delete it
        const favResponse = await api.getFavorites();
        const favorite = favResponse.results.find(
          (fav: any) => Number(fav.object_id) === cargoId
        );

        if (favorite) {
          await api.delete(`/core/favorites/${favorite.id}/`);
          setFavorites((prev) => prev.filter((id) => id !== cargoId));
          toast.success(t('favorites.removedFromFavorites'));
        }
      } else {
        // Add to favorites
        await api.addToFavorites({
          content_type: 'cargo',
          object_id: cargo.id,
        });

        setFavorites((prev) => [...prev, cargoId]);
        toast.success(t('favorites.addedToFavorites'));
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error(t('favorites.favoriteToggleError'));
    }
  };

  // Render star rating
  const renderStars = (rating: number = 0) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ));
  };

  // Toggle expanded cargo details
  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='min-h-screen bg-blue-600 p-4 pb-20' ref={pageRef}>
      <div className='flex items-center mb-4 bg-white rounded-lg p-2'>
        <Input
          type='text'
          placeholder={t('cargo.searchPlaceholder')}
          value={searchTerm}
          onChange={handleSearch}
          className='mr-2 flex-grow'
        />
        <Button
          variant='default'
          size='sm'
          className='bg-yellow-400 text-black hover:bg-yellow-500 whitespace-nowrap'
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter className='h-4 w-4 mr-2' />
          {t('common.filter')}
        </Button>
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className='bg-white rounded-lg p-2 mb-4 flex flex-wrap items-center gap-2'>
          <span className='text-sm font-medium'>
            {t('cargo.activeFilters')}:
          </span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant='secondary'
              className='bg-blue-100 text-blue-800'
            >
              {filter}
            </Badge>
          ))}
          <Button
            variant='ghost'
            size='sm'
            className='ml-auto h-7 text-red-500 hover:text-red-700 hover:bg-red-50'
            onClick={clearFilters}
          >
            {t('common.clear')}
          </Button>
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filterParams}
      />
      {isLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-white' />
        </div>
      ) : (
        <div className='space-y-4 mb-20'>
          {filterParams.radius &&
            (filterParams.loading_location_id ||
              filterParams.unloading_location_id) && (
              <div className='bg-white p-3 rounded-lg mb-2 text-sm'>
                <Badge
                  variant='secondary'
                  className='bg-blue-100 text-blue-800'
                >
                  {t('cargo.radiusSearch')} {filterParams.radius}{' '}
                  {t('cargo.kmFromLoadingPoint')}
                </Badge>
                {filterParams.loading_location_id && (
                  <span className='ml-2'>{t('cargo.kmFromLoadingPoint')}</span>
                )}
                {filterParams.loading_location_id &&
                  filterParams.unloading_location_id && (
                    <span> {t('cargo.and')} </span>
                  )}
                {filterParams.unloading_location_id && (
                  <span>{t('cargo.kmFromUnloadingPoint')}</span>
                )}
              </div>
            )}

          {cargos.results && cargos.results.length > 0 ? (
            <>
              {cargos.results.map((cargo) => (
                <Card key={cargo.id} className='bg-white overflow-hidden'>
                  <CardContent className='p-4'>
                    <div className='flex justify-between items-start mb-2'>
                      <div className='flex space-x-1'>
                        {cargo.owner &&
                          cargo.owner.rating &&
                          cargo.owner.rating > 4 && (
                            <Badge
                              variant='secondary'
                              className='bg-yellow-100 text-yellow-800'
                              title={t('cargo.highRating')}
                            >
                              <Star className='h-4 w-4' />
                            </Badge>
                          )}
                        {cargo.owner && cargo.owner.is_verified && (
                          <Badge
                            variant='secondary'
                            className='bg-green-100 text-green-800'
                            title={t('cargo.verifiedProfile')}
                          >
                            <CheckCircle className='h-4 w-4' />
                          </Badge>
                        )}
                      </div>
                      <div className='flex items-center'>
                        {cargo.owner && cargo.owner.rating && (
                          <>
                            <span className='font-bold mr-1'>
                              {cargo.owner.rating}
                            </span>
                            <div className='flex'>
                              {renderStars(cargo.owner.rating)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='font-bold text-lg'>
                        {cargo.loading_point} - {cargo.unloading_point}
                      </span>
                      <span className='text-sm text-gray-500'>
                        {formatDate(cargo.created_at)}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
                      <span>
                        {t('cargo.name')}: {cargo.title}
                      </span>
                      <span>
                        {t('cargo.weight')}: {cargo.weight} {t('common.ton')}
                      </span>
                      <span>
                        {t('cargo.vehicleType')}:{' '}
                        {getVehicleTypeLabel(cargo.vehicle_type)}
                      </span>
                      <span>
                        {t('cargo.payment')}: {cargo.payment_method}
                      </span>
                    </div>
                    <div className='mb-2'>
                      <span className='font-semibold'>
                        {t('cargo.price')}:{' '}
                        {cargo.price
                          ? `${cargo.price} ₽`
                          : t('cargo.negotiablePrice')}
                      </span>
                    </div>
                    {expandedOrder === cargo.id && (
                      <div className='mt-4 text-sm'>
                        <p>
                          {t('cargo.description')}: {cargo.description}
                        </p>
                        {cargo.volume && (
                          <p>
                            {t('cargo.volume')}: {cargo.volume} m³
                          </p>
                        )}
                        <p>
                          {t('cargo.loadingDate')}:{' '}
                          {new Date(cargo.loading_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    <div className='flex justify-between mt-4'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 mr-1'
                        onClick={() => toggleOrderExpansion(cargo.id)}
                      >
                        {expandedOrder === cargo.id ? (
                          <ChevronUp className='h-4 w-4 mr-1' />
                        ) : (
                          <ChevronDown className='h-4 w-4 mr-1' />
                        )}
                        {expandedOrder === cargo.id
                          ? t('cargo.hideDetails')
                          : t('cargo.showDetails')}
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className='flex-1 ml-1 mr-1'
                        onClick={() => handleNotificationToggle(cargo)}
                      >
                        <Bell className='h-4 w-4 mr-1' />
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        className={`flex-1 ${
                          favorites.includes(Number(cargo.id))
                            ? 'text-red-500 hover:text-red-600'
                            : ''
                        }`}
                        onClick={() => handleFavoriteToggle(cargo)}
                      >
                        <Heart className='h-4 w-4 mr-1' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {nextPage && (
                <div className='flex justify-center mt-4'>
                  <Button
                    onClick={loadMoreResults}
                    disabled={isMoreLoading}
                    variant='outline'
                    className='bg-white'
                  >
                    {isMoreLoading ? (
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    ) : null}
                    {t('cargo.loadMore')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className='bg-white p-6 rounded-lg text-center text-gray-600'>
              {t('cargo.noMatchingCargos')}
            </div>
          )}
        </div>
      )}

      <Dialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('notifications.enableNotifications')}</DialogTitle>
          </DialogHeader>
          <p>
            {t('notifications.notificationsOnNewCargos')}
            {currentCargo && (
              <strong>
                {' '}
                {currentCargo.loading_point} - {currentCargo.unloading_point}
              </strong>
            )}
          </p>
          <DialogFooter className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowNotificationDialog(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button onClick={handleEnableNotification}>
              {t('notifications.enableButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
};

export default OrdersPage;
