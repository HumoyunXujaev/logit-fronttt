'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/hooks/useFavorites';
import { useNotifications } from '@/hooks/useNotifications';
import { useApp } from '@/contexts/AppContext';

type UserRole = 'carrier' | 'other';

interface Order {
  id: number;
  cargo: string;
  weight: number;
  date: string;
  payment: string;
  price: string;
  from: string;
  to: string;
  vehicleType: string;
  description: string;
  isTop: boolean;
  isVerified: boolean;
  experience: number;
  rating: number;
  dimensions: string;
  loadingType: string;
  unloadingType: string;
  additionalRequirements: string;
}

interface FilterState {
  category: string;
  from: string;
  to: string;
  dateRange: Range;
  notifications: boolean;
}

const mockOrders: Order[] = [
  {
    id: 1,
    cargo: 'Металл',
    weight: 22,
    date: '12.12.2023 14:34',
    payment: 'Комбо',
    price: 'Договорная',
    from: 'Ташкент',
    to: 'Москва',
    vehicleType: 'Тент',
    description:
      'Ташкент-Москва, нужен-тент, груз-металл, вес:22т, оплата:комбо, дата сообщения: 12.12.2023',
    isTop: true,
    isVerified: true,
    experience: 2,
    rating: 4,
    dimensions: '5x2x2 м',
    loadingType: 'Боковая',
    unloadingType: 'Задняя',
    additionalRequirements: 'Требуется крепление груза',
  },
  {
    id: 2,
    cargo: 'Текстиль',
    weight: 15,
    date: '10.12.2023 11:00',
    payment: 'Безналичный расчет',
    price: '2500$',
    from: 'Бухара',
    to: 'Алматы',
    vehicleType: 'Рефрижератор',
    description:
      'Бухара-Алматы, требуется рефрижератор, текстильные изделия, вес: 15т, оплата: безналичный расчет, дата сообщения: 10.12.2023',
    isTop: false,
    isVerified: true,
    experience: 3,
    rating: 5,
    dimensions: '6x2.5x2.5 м',
    loadingType: 'Задняя',
    unloadingType: 'Задняя',
    additionalRequirements: 'Температурный контроль -5°C',
  },
  {
    id: 3,
    cargo: 'Автозапчасти',
    weight: 8,
    date: '08.12.2023 09:30',
    payment: 'Наличные',
    price: '1200$',
    from: 'Самарканд',
    to: 'Киев',
    vehicleType: 'Тент',
    description:
      'Самарканд-Киев, тент, автозапчасти, вес: 8т, оплата: наличные, дата сообщения: 08.12.2023',
    isTop: false,
    isVerified: true,
    experience: 1,
    rating: 3.5,
    dimensions: '4x2x2 м',
    loadingType: 'Боковая',
    unloadingType: 'Задняя',
    additionalRequirements: 'Нет дополнительных требований',
  },
  {
    id: 4,
    cargo: 'Строительные материалы',
    weight: 30,
    date: '05.12.2023 07:45',
    payment: 'Договорная',
    price: 'По запросу',
    from: 'Ташкент',
    to: 'Санкт-Петербург',
    vehicleType: 'Тент',
    description:
      'Ташкент-Санкт-Петербург, тент, строительные материалы, вес: 30т, оплата: договорная, дата сообщения: 05.12.2023',
    isTop: true,
    isVerified: false,
    experience: 5,
    rating: 4.5,
    dimensions: '10x3x3 м',
    loadingType: 'Задняя',
    unloadingType: 'Задняя',
    additionalRequirements: 'Требуются сертификаты соответствия материалов',
  },
  // Добавьте больше заказов с дополнительными полями
];

const cargoCategories = [
  'Металл',
  'Текстиль',
  'Продукты',
  'Техника',
  'Стройматериалы',
];

const cities = [
  'Ташкент',
  'Москва',
  'Бухара',
  'Андижан',
  'Самарканд',
  'Санкт-Петербург',
];

const RoleConfirmationDialog: React.FC<{
  onConfirm: (role: 'carrier' | 'other') => void;
}> = ({ onConfirm }) => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтвердите вашу роль</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Button onClick={() => onConfirm('carrier')} className='w-full'>
            Я перевозчик
          </Button>
          <Button onClick={() => onConfirm('other')} className='w-full'>
            Я другой пользователь
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    from: '',
    to: '',
    dateRange: {
      startDate: undefined,
      endDate: undefined,
      key: 'selection',
    },
    notifications: false,
  });

  const handleSelectChange = (name: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (ranges: RangeKeyDict) => {
    setFilters((prev) => ({ ...prev, dateRange: ranges.selection }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, notifications: checked }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-blue-600 text-white'>
        <DialogHeader>
          <DialogTitle className='text-white text-center'>
            Поиск грузов
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 max-w-[100vw] overflow-y-auto'>
          <Select
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
              <SelectValue placeholder='Категория грузов' />
            </SelectTrigger>
            <SelectContent>
              {cargoCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleSelectChange('from', value)}>
            <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
              <SelectValue placeholder='Откуда' />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleSelectChange('to', value)}>
            <SelectTrigger className='bg-blue-500 text-white border-blue-400'>
              <SelectValue placeholder='Куда' />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              Включить уведомления
            </label>
          </div>
          <Button
            onClick={handleApply}
            className='w-full bg-yellow-400 text-blue-800 hover:bg-yellow-500'
          >
            Найти грузы
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const { userState, setUserRole } = useUser();
  // const router = useRouter();

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // const { userState } = useUser();
  const router = useRouter();
  const {
    addNotification,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    notifications,
    favorites,
  } = useApp();
  // const { addNotification } = useNotifications();
  // const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // if (!userState.isAuthenticated && !userState.role) {
    //   router.push('/select-lang');
    // }

    // const savedRole = localStorage.getItem('userRole') as UserRole | null;
    // if (savedRole) {
    //   setUserRole(savedRole);
    // }

    setOrders(mockOrders);
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [
    userState,
    router,
    addNotification,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    orders,
  ]);

  const handleRoleConfirm = (role: 'carrier' | 'other') => {
    setUserRole(role === 'carrier' ? 'carrier' : 'cargo-owner');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Здесь должна быть логика фильтрации заказов
  };

  const handleApplyFilters = (filters: FilterState) => {
    console.log('Applied filters:', filters);
    // Здесь должна быть логика применения фильтров к заказам
  };

  const handleNotificationToggle = (order: Order) => {
    if (
      notifications.some(
        (notification) =>
          notification.orderId === order.id && !notification.isRead
      )
    ) {
      setErrorMessage('Для этого груза уже включены нотификации');
      setShowErrorDialog(true);
    } else {
      setCurrentOrder(order);
      setShowNotificationDialog(true);
    }
  };

  const handleEnableNotification = () => {
    if (currentOrder) {
      addNotification({
        orderId: currentOrder.id,
        type: 'cargo',
        message: `Включены уведомления для груза: ${currentOrder.cargo} (${currentOrder.from} - ${currentOrder.to})`,
      });
      setShowNotificationDialog(false);
    }
  };

  const handleFavoriteToggle = (order: Order) => {
    // const favoriteId = `cargo-${order.id}`;
    if (isFavorite(order.id)) {
      setErrorMessage('Этот груз уже находится в избранном');
      setShowErrorDialog(true);
    } else {
      addToFavorites({
        orderId: order.id,
        type: order.cargo,
        title: `${order.cargo}: ${order.from} - ${order.to}`,
        description: order.description,
        details: {
          Вес: `${order.weight} т`,
          Габариты: order.dimensions,
          'Тип погрузки': order.loadingType,
          'Тип разгрузки': order.unloadingType,
          Оплата: order.payment,
          Цена: order.price,
        },
      });
    }
  };

  const renderStars = (rating: number) => {
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

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!userState.role && !userState.isAuthenticated) {
    return <RoleConfirmationDialog onConfirm={handleRoleConfirm} />;
  }

  return (
    <div className='min-h-screen bg-blue-600 p-4 pb-20'>
      <div className='flex items-center mb-4 bg-white rounded-lg p-2'>
        <Input
          type='text'
          placeholder='Поиск заказов...'
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
          Фильтры
        </Button>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />

      <div className='space-y-4 mb-20'>
        {orders.map((order) => (
          <Card key={order.id} className='bg-white overflow-hidden'>
            <CardContent className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <div className='flex space-x-1'>
                  {order.isTop && (
                    <Badge
                      variant='secondary'
                      className='bg-yellow-100 text-yellow-800'
                      title='Топ заявки от наших студентов'
                    >
                      <Star className='h-4 w-4' />
                    </Badge>
                  )}
                  {order.isVerified && (
                    <Badge
                      variant='secondary'
                      className='bg-green-100 text-green-800'
                      title='Профиль подтвержден'
                    >
                      <CheckCircle className='h-4 w-4' />
                    </Badge>
                  )}
                  {order.experience > 1 && (
                    <Badge
                      variant='secondary'
                      className='bg-blue-100 text-blue-800'
                      title='Опыт логиста'
                    >
                      <Clock className='h-4 w-4' /> {order.experience}г
                    </Badge>
                  )}
                </div>
                <div className='flex items-center'>
                  <span className='font-bold mr-1'>{order.rating}</span>
                  <div className='flex'>{renderStars(order.rating)}</div>
                </div>
              </div>
              <div className='flex justify-between items-center mb-2'>
                <span className='font-bold text-lg'>
                  {order.from} - {order.to}
                </span>
                <span className='text-sm text-gray-500'>{order.date}</span>
              </div>
              <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
                <span>Груз: {order.cargo}</span>
                <span>Вес: {order.weight} т</span>
                <span>Тип: {order.vehicleType}</span>
                <span>Оплата: {order.payment}</span>
              </div>
              <div className='mb-2'>
                <span className='font-semibold'>Цена: {order.price}</span>
              </div>
              {expandedOrder === order.id && (
                <div className='mt-4 text-sm'>
                  <p>Размеры: {order.dimensions}</p>
                  <p>Тип погрузки: {order.loadingType}</p>
                  <p>Тип разгрузки: {order.unloadingType}</p>
                  <p>Доп. требования: {order.additionalRequirements}</p>
                  <p className='mt-2'>Описание: {order.description}</p>
                </div>
              )}
              <div className='flex justify-between mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 mr-1'
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  {expandedOrder === order.id ? (
                    <ChevronUp className='h-4 w-4 mr-1' />
                  ) : (
                    <ChevronDown className='h-4 w-4 mr-1' />
                  )}
                  {expandedOrder === order.id ? 'Скрыть' : 'Подробнее'}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 ml-1 mr-1'
                  onClick={() => handleNotificationToggle(order)}
                >
                  <Bell className='h-4 w-4 mr-1' />
                </Button>

                {/* <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 ml-1 mr-1'
                  onClick={() => setShowNotificationDialog(true)}
                >
                  <Bell className='h-4 w-4 mr-1' />
                </Button> */}

                <Button
                  variant='outline'
                  size='sm'
                  className={`flex-1 ${
                    isFavorite(order.id)
                      ? 'text-red-500 hover:text-red-600'
                      : ''
                  }`}
                  onClick={() => handleFavoriteToggle(order)}
                >
                  <Heart className='h-4 w-4 mr-1' />
                </Button>
                {/* <Button variant='outline' size='sm' className='flex-1'>
                  <Heart className='h-4 w-4 mr-1' />
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Включить уведомления?</DialogTitle>
          </DialogHeader>
          <p>
            Вы будете получать уведомления о новых предложениях по этому
            направлению и типу груза.
          </p>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowNotificationDialog(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleEnableNotification}>Включить</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Dialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Включить уведомления?</DialogTitle>
          </DialogHeader>
          <p>
            Хотите включить уведомления по выбранным типам груза и направлениям?
          </p>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowNotificationDialog(false)}
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                // Логика включения уведомлений
                setShowNotificationDialog(false);
              }}
            >
              Включить
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Внимание</DialogTitle>
          </DialogHeader>
          <p>{errorMessage}</p>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button onClick={() => setShowErrorDialog(false)}>Понятно</Button>
          </div>
        </DialogContent>
      </Dialog>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );

  //     <NavigationMenu
  //       userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
  //     />

  //     {/* <NavigationMenu userRole={userRole} /> */}
  //   </div>
  // );
}
