'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Plus,
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  BellIcon,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CargoFormData {
  cargo: {
    name: string;
    weight: string;
    volume: string;
    length: string;
    width: string;
    height: string;
    diameter: string;
    packaging: string;
    notes: string;
  };
  route: {
    loading: string;
    unloading: string;
  };
  transport: {
    bodyType: string;
    loadingType: string;
  };
  when: {
    loadingDates: string;
    isConstant: boolean;
    isReady: boolean;
  };
  payment: {
    method: string;
    options: string[];
  };
  notifications: {
    enabled: boolean;
  };
}

const initialFormData: CargoFormData = {
  cargo: {
    name: '',
    weight: '',
    volume: '',
    length: '',
    width: '',
    height: '',
    diameter: '',
    packaging: '',
    notes: '',
  },
  route: { loading: '', unloading: '' },
  transport: { bodyType: '', loadingType: '' },
  when: { loadingDates: '', isConstant: false, isReady: false },
  payment: { method: '', options: [] },
  notifications: { enabled: false },
};

const sections = [
  { id: 'cargo', title: 'Груз', icon: TruckIcon },
  { id: 'route', title: 'Маршрут', icon: MapPinIcon },
  { id: 'transport', title: 'Транспорт', icon: TruckIcon },
  { id: 'when', title: 'Когда', icon: CalendarIcon },
  { id: 'payment', title: 'Оплата', icon: CreditCardIcon },
  { id: 'notifications', title: 'Уведомления', icon: BellIcon },
];

type CargoSection = {
  name: string;
  weight: string;
  volume: string;
  length: string;
  width: string;
  height: string;
  diameter: string;
  packaging: string;
  notes: string;
};

type RouteSection = {
  loading: string;
  unloading: string;
};

type TransportSection = {
  bodyType: string;
  loadingType: string;
};

type WhenSection = {
  loadingDates: string;
  isConstant: boolean;
  isReady: boolean;
};

type PaymentSection = {
  method: string;
  options: string[];
};

type NotificationsSection = {
  enabled: boolean;
};

// Обновленный интерфейс CargoFormData
interface CargoFormData {
  cargo: CargoSection;
  route: RouteSection;
  transport: TransportSection;
  when: WhenSection;
  payment: PaymentSection;
  notifications: NotificationsSection;
}

export default function MyCargoPage() {
  const [isAddingCargo, setIsAddingCargo] = useState<boolean>(false);
  const [cargoCount, setCargoCount] = useState<number>(1);
  const [formData, setFormData] = useState<CargoFormData>(initialFormData);
  const [activeSection, setActiveSection] = useState<string>('cargo');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    checkAllFilled();
  }, [formData]);

  const checkAllFilled = () => {
    const isFilled = Object.values(formData).every((section) =>
      Object.values(section).every((value) =>
        typeof value === 'boolean'
          ? true
          : Array.isArray(value)
          ? value.length > 0
          : value !== ''
      )
    );
    setIsAllFilled(isFilled);
  };

  const handleInputChange = (
    section: keyof CargoFormData,
    field: string,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const clearSection = (section: keyof CargoFormData) => {
    setFormData((prev) => ({
      ...prev,
      [section]: initialFormData[section],
    }));
  };

  const goToNextSection = () => {
    const currentIndex = sections.findIndex(
      (section) => section.id === activeSection
    );
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    } else {
      setIsDialogOpen(false);
    }
  };
  // Типы-защитники
  function isCargo(section: any): section is CargoSection {
    return 'name' in section && 'weight' in section && 'volume' in section;
  }

  function isRoute(section: any): section is RouteSection {
    return 'loading' in section && 'unloading' in section;
  }

  function isTransport(section: any): section is TransportSection {
    return 'bodyType' in section && 'loadingType' in section;
  }

  function isWhen(section: any): section is WhenSection {
    return (
      'loadingDates' in section &&
      'isConstant' in section &&
      'isReady' in section
    );
  }

  function isPayment(section: any): section is PaymentSection {
    return (
      'method' in section &&
      'options' in section &&
      Array.isArray(section.options)
    );
  }

  function isNotifications(section: any): section is NotificationsSection {
    return 'enabled' in section;
  }

  // Обновленная функция getSectionSummary
  const getSectionSummary = (sectionId: keyof CargoFormData): string => {
    const sectionData = formData[sectionId];

    if (isCargo(sectionData)) {
      return sectionData.name
        ? `${sectionData.name}, ${sectionData.weight} ${sectionData.volume}`
        : '';
    }

    if (isRoute(sectionData)) {
      return sectionData.loading && sectionData.unloading
        ? `${sectionData.loading} - ${sectionData.unloading}`
        : '';
    }

    if (isTransport(sectionData)) {
      return sectionData.bodyType || sectionData.loadingType
        ? `${sectionData.bodyType || ''}, ${sectionData.loadingType || ''}`
            .trim()
            .replace(/^,\s|,\s$/g, '')
        : '';
    }

    if (isWhen(sectionData)) {
      return sectionData.loadingDates
        ? `${sectionData.loadingDates}${
            sectionData.isConstant ? ', постоянно' : ''
          }`
        : '';
    }

    if (isPayment(sectionData)) {
      return sectionData.method
        ? `${sectionData.method}, ${sectionData.options.join(', ')}`
        : '';
    }

    if (isNotifications(sectionData)) {
      return sectionData.enabled ? 'Включены' : 'Выключены';
    }

    return '';
  };

  const renderSectionButton = (section: {
    id: string;
    title: string;
    icon: React.ElementType;
  }) => {
    const Icon = section.icon;
    const summary = getSectionSummary(section.id as keyof CargoFormData);

    return (
      <Button
        key={section.id}
        variant='outline'
        className='w-full text-left justify-start items-center flex p-4 h-auto'
        onClick={() => {
          setActiveSection(section.id);
          setIsDialogOpen(true);
        }}
      >
        <Icon className='mr-2 h-5 w-5' />
        <div className='flex flex-col items-start'>
          <span className='font-semibold'>{section.title}</span>
          {summary && (
            <span className='text-sm text-gray-500 mt-1 truncate w-full'>
              {summary}
            </span>
          )}
        </div>
      </Button>
    );
  };

  const renderCargoContent = () => (
    <div className='space-y-4'>
      <Input
        placeholder='Название груза*'
        value={formData.cargo.name}
        onChange={(e) => handleInputChange('cargo', 'name', e.target.value)}
      />
      <div className='grid grid-cols-2 gap-2'>
        <Input
          placeholder='Вес (тонн/кг)*'
          value={formData.cargo.weight}
          onChange={(e) => handleInputChange('cargo', 'weight', e.target.value)}
        />
        <Input
          placeholder='Объем (м³)*'
          value={formData.cargo.volume}
          onChange={(e) => handleInputChange('cargo', 'volume', e.target.value)}
        />
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <Input
          placeholder='Длина'
          value={formData.cargo.length}
          onChange={(e) => handleInputChange('cargo', 'length', e.target.value)}
        />
        <Input
          placeholder='Ширина'
          value={formData.cargo.width}
          onChange={(e) => handleInputChange('cargo', 'width', e.target.value)}
        />
        <Input
          placeholder='Высота'
          value={formData.cargo.height}
          onChange={(e) => handleInputChange('cargo', 'height', e.target.value)}
        />
        <Input
          placeholder='Диаметр'
          value={formData.cargo.diameter}
          onChange={(e) =>
            handleInputChange('cargo', 'diameter', e.target.value)
          }
        />
      </div>
      <Input
        placeholder='Упаковка'
        value={formData.cargo.packaging}
        onChange={(e) =>
          handleInputChange('cargo', 'packaging', e.target.value)
        }
      />
      <Textarea
        placeholder='Примечание'
        value={formData.cargo.notes}
        onChange={(e) => handleInputChange('cargo', 'notes', e.target.value)}
      />
    </div>
  );

  const renderRouteContent = () => (
    <div className='space-y-4'>
      <Input
        placeholder='Погрузка*'
        value={formData.route.loading}
        onChange={(e) => handleInputChange('route', 'loading', e.target.value)}
      />
      <Input
        placeholder='Выгрузка*'
        value={formData.route.unloading}
        onChange={(e) =>
          handleInputChange('route', 'unloading', e.target.value)
        }
      />
    </div>
  );

  const renderTransportContent = () => (
    <div className='space-y-4'>
      <Select
        onValueChange={(value) =>
          handleInputChange('transport', 'bodyType', value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder='Тип кузова' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='isothermal'>Изотермический</SelectItem>
          <SelectItem value='tented'>Тентованный</SelectItem>
          <SelectItem value='container'>Контейнер</SelectItem>
          <SelectItem value='van'>Фургон</SelectItem>
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) =>
          handleInputChange('transport', 'loadingType', value)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder='Тип погрузки' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ramps'>Аппарели</SelectItem>
          <SelectItem value='no-doors'>Без ворот</SelectItem>
          <SelectItem value='side'>Боковая</SelectItem>
          <SelectItem value='top'>Верхняя</SelectItem>
          <SelectItem value='hydroboard'>Гидроборт</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderWhenContent = () => (
    <div className='space-y-4'>
      <Input
        type='date'
        placeholder='Дата погрузки*'
        value={formData.when.loadingDates}
        onChange={(e) =>
          handleInputChange('when', 'loadingDates', e.target.value)
        }
      />
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='constant'
          checked={formData.when.isConstant}
          onCheckedChange={(checked) =>
            handleInputChange('when', 'isConstant', Boolean(checked))
          }
        />
        <label htmlFor='constant'>Постоянно</label>
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='ready'
          checked={formData.when.isReady}
          onCheckedChange={(checked) =>
            handleInputChange('when', 'isReady', Boolean(checked))
          }
        />
        <label htmlFor='ready'>Груз готов</label>
      </div>
    </div>
  );

  const renderPaymentContent = () => (
    <div className='space-y-4'>
      <Select
        onValueChange={(value) => handleInputChange('payment', 'method', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Метод оплаты' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='cash'>Наличные</SelectItem>
          <SelectItem value='card'>Карта</SelectItem>
          <SelectItem value='transfer'>Перечисление</SelectItem>
          <SelectItem value='advance'>Аванс</SelectItem>
        </SelectContent>
      </Select>
      <div className='space-y-2'>
        {[
          'Возможен торг',
          'Оплата на выгрузке',
          'Оплата после выгрузки',
          'Через несколько банковских дней',
          'Запрос ставки',
        ].map((option) => (
          <div key={option} className='flex items-center space-x-2'>
            <Checkbox
              id={option}
              checked={formData.payment.options.includes(option)}
              onCheckedChange={(checked) => {
                const newOptions = checked
                  ? [...formData.payment.options, option]
                  : formData.payment.options.filter((item) => item !== option);
                handleInputChange('payment', 'options', newOptions);
              }}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsContent = () => (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='notifications'
          checked={formData.notifications.enabled}
          onCheckedChange={(checked) =>
            handleInputChange('notifications', 'enabled', Boolean(checked))
          }
        />
        <label htmlFor='notifications'>Включить уведомления</label>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'cargo':
        return renderCargoContent();
      case 'route':
        return renderRouteContent();
      case 'transport':
        return renderTransportContent();
      case 'when':
        return renderWhenContent();
      case 'payment':
        return renderPaymentContent();
      case 'notifications':
        return renderNotificationsContent();
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
        Мои грузы
      </h1>

      <div className='space-y-4 mb-8'>
        <Button
          onClick={() => setIsAddingCargo(true)}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Plus className='mr-2 h-4 w-4' /> Добавить груз
        </Button>

        <Button
          variant='outline'
          className='w-full'
          onClick={() => {
            router.push('/my-cargo');
          }}
        >
          <TruckIcon className='mr-2 h-4 w-4' /> Мои грузы{' '}
          <Badge variant='secondary' className='ml-2'>
            {cargoCount}
          </Badge>
        </Button>
      </div>
      {isAddingCargo && (
        <Card className='mb-8 shadow-lg'>
          <CardContent className='p-6'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
              Добавить груз
            </h2>
            <ScrollArea className='h-[60vh]'>
              <div className='space-y-4'>
                {sections.map(renderSectionButton)}
              </div>
            </ScrollArea>
            {isAllFilled && (
              <Button
                onClick={() => {
                  router.push('/my-cargo');
                  /* Логика публикации */
                }}
                className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white'
              >
                Опубликовать
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {sections.find((s) => s.id === activeSection)?.title}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className='max-h-[60vh] pr-4'>
            {renderContent()}
          </ScrollArea>
          <div className='flex justify-between mt-6'>
            <Button
              variant='outline'
              onClick={() => clearSection(activeSection as keyof CargoFormData)}
            >
              <X className='mr-2 h-4 w-4' /> Очистить
            </Button>
            <Button onClick={goToNextSection}>
              Далее <Plus className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <NavigationMenu userRole={'carrier'} />
    </div>
  );
}
