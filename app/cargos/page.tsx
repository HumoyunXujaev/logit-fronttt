// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   X,
//   Plus,
//   TruckIcon,
//   MapPinIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   BellIcon,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';
// import { Router } from 'next/router';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { useUser } from '@/contexts/UserContext';

// interface CargoFormData {
//   cargo: {
//     name: string;
//     weight: string;
//     volume: string;
//     length: string;
//     width: string;
//     height: string;
//     diameter: string;
//     packaging: string;
//     notes: string;
//   };
//   route: {
//     loading: string;
//     unloading: string;
//   };
//   transport: {
//     bodyType: string;
//     loadingType: string;
//   };
//   when: {
//     loadingDates: string;
//     isConstant: boolean;
//     isReady: boolean;
//   };
//   payment: {
//     method: string;
//     options: string[];
//   };
//   notifications: {
//     enabled: boolean;
//   };
// }

// const initialFormData: CargoFormData = {
//   cargo: {
//     name: '',
//     weight: '',
//     volume: '',
//     length: '',
//     width: '',
//     height: '',
//     diameter: '',
//     packaging: '',
//     notes: '',
//   },
//   route: { loading: '', unloading: '' },
//   transport: { bodyType: '', loadingType: '' },
//   when: { loadingDates: '', isConstant: false, isReady: false },
//   payment: { method: '', options: [] },
//   notifications: { enabled: false },
// };

// const sections = [
//   { id: 'cargo', title: 'Груз', icon: TruckIcon },
//   { id: 'route', title: 'Маршрут', icon: MapPinIcon },
//   { id: 'transport', title: 'Транспорт', icon: TruckIcon },
//   { id: 'when', title: 'Когда', icon: CalendarIcon },
//   { id: 'payment', title: 'Оплата', icon: CreditCardIcon },
//   { id: 'notifications', title: 'Уведомления', icon: BellIcon },
// ];

// type CargoSection = {
//   name: string;
//   weight: string;
//   volume: string;
//   length: string;
//   width: string;
//   height: string;
//   diameter: string;
//   packaging: string;
//   notes: string;
// };

// type RouteSection = {
//   loading: string;
//   unloading: string;
// };

// type TransportSection = {
//   bodyType: string;
//   loadingType: string;
// };

// type WhenSection = {
//   loadingDates: string;
//   isConstant: boolean;
//   isReady: boolean;
// };

// type PaymentSection = {
//   method: string;
//   options: string[];
// };

// type NotificationsSection = {
//   enabled: boolean;
// };

// // Обновленный интерфейс CargoFormData
// interface CargoFormData {
//   cargo: CargoSection;
//   route: RouteSection;
//   transport: TransportSection;
//   when: WhenSection;
//   payment: PaymentSection;
//   notifications: NotificationsSection;
// }

// export default function MyCargoPage() {
//   const [isAddingCargo, setIsAddingCargo] = useState<boolean>(false);
//   const [cargoCount, setCargoCount] = useState<number>(1);
//   const { userState } = useUser();
//   const [formData, setFormData] = useState<CargoFormData>(initialFormData);
//   const [activeSection, setActiveSection] = useState<string>('cargo');
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
//   const router = useRouter();
//   useEffect(() => {
//     checkAllFilled();
//   }, [formData]);

//   const checkAllFilled = () => {
//     const isFilled = Object.values(formData).every((section) =>
//       Object.values(section).every((value) =>
//         typeof value === 'boolean'
//           ? true
//           : Array.isArray(value)
//           ? value.length > 0
//           : value !== ''
//       )
//     );
//     setIsAllFilled(isFilled);
//   };

//   const handleInputChange = (
//     section: keyof CargoFormData,
//     field: string,
//     value: string | boolean | string[]
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   const clearSection = (section: keyof CargoFormData) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: initialFormData[section],
//     }));
//   };

//   const goToNextSection = () => {
//     const currentIndex = sections.findIndex(
//       (section) => section.id === activeSection
//     );
//     if (currentIndex < sections.length - 1) {
//       setActiveSection(sections[currentIndex + 1].id);
//     } else {
//       setIsDialogOpen(false);
//     }
//   };
//   // Типы-защитники
//   function isCargo(section: any): section is CargoSection {
//     return 'name' in section && 'weight' in section && 'volume' in section;
//   }

//   function isRoute(section: any): section is RouteSection {
//     return 'loading' in section && 'unloading' in section;
//   }

//   function isTransport(section: any): section is TransportSection {
//     return 'bodyType' in section && 'loadingType' in section;
//   }

//   function isWhen(section: any): section is WhenSection {
//     return (
//       'loadingDates' in section &&
//       'isConstant' in section &&
//       'isReady' in section
//     );
//   }

//   function isPayment(section: any): section is PaymentSection {
//     return (
//       'method' in section &&
//       'options' in section &&
//       Array.isArray(section.options)
//     );
//   }

//   function isNotifications(section: any): section is NotificationsSection {
//     return 'enabled' in section;
//   }

//   // Обновленная функция getSectionSummary
//   const getSectionSummary = (sectionId: keyof CargoFormData): string => {
//     const sectionData = formData[sectionId];

//     if (isCargo(sectionData)) {
//       return sectionData.name
//         ? `${sectionData.name}, ${sectionData.weight} ${sectionData.volume}`
//         : '';
//     }

//     if (isRoute(sectionData)) {
//       return sectionData.loading && sectionData.unloading
//         ? `${sectionData.loading} - ${sectionData.unloading}`
//         : '';
//     }

//     if (isTransport(sectionData)) {
//       return sectionData.bodyType || sectionData.loadingType
//         ? `${sectionData.bodyType || ''}, ${sectionData.loadingType || ''}`
//             .trim()
//             .replace(/^,\s|,\s$/g, '')
//         : '';
//     }

//     if (isWhen(sectionData)) {
//       return sectionData.loadingDates
//         ? `${sectionData.loadingDates}${
//             sectionData.isConstant ? ', постоянно' : ''
//           }`
//         : '';
//     }

//     if (isPayment(sectionData)) {
//       return sectionData.method
//         ? `${sectionData.method}, ${sectionData.options.join(', ')}`
//         : '';
//     }

//     if (isNotifications(sectionData)) {
//       return sectionData.enabled ? 'Включены' : 'Выключены';
//     }

//     return '';
//   };

//   const renderSectionButton = (section: {
//     id: string;
//     title: string;
//     icon: React.ElementType;
//   }) => {
//     const Icon = section.icon;
//     const summary = getSectionSummary(section.id as keyof CargoFormData);

//     return (
//       <Button
//         key={section.id}
//         variant='outline'
//         className='w-full text-left justify-start items-center flex p-4 h-auto'
//         onClick={() => {
//           setActiveSection(section.id);
//           setIsDialogOpen(true);
//         }}
//       >
//         <Icon className='mr-2 h-5 w-5' />
//         <div className='flex flex-col items-start'>
//           <span className='font-semibold'>{section.title}</span>
//           {summary && (
//             <span className='text-sm text-gray-500 mt-1 truncate w-full'>
//               {summary}
//             </span>
//           )}
//         </div>
//       </Button>
//     );
//   };

//   const renderCargoContent = () => (
//     <div className='space-y-4'>
//       <Input
//         placeholder='Название груза*'
//         value={formData.cargo.name}
//         onChange={(e) => handleInputChange('cargo', 'name', e.target.value)}
//       />
//       <div className='grid grid-cols-2 gap-2'>
//         <Input
//           placeholder='Вес (тонн/кг)*'
//           value={formData.cargo.weight}
//           onChange={(e) => handleInputChange('cargo', 'weight', e.target.value)}
//         />
//         <Input
//           placeholder='Объем (м³)*'
//           value={formData.cargo.volume}
//           onChange={(e) => handleInputChange('cargo', 'volume', e.target.value)}
//         />
//       </div>
//       <div className='grid grid-cols-2 gap-2'>
//         <Input
//           placeholder='Длина'
//           value={formData.cargo.length}
//           onChange={(e) => handleInputChange('cargo', 'length', e.target.value)}
//         />
//         <Input
//           placeholder='Ширина'
//           value={formData.cargo.width}
//           onChange={(e) => handleInputChange('cargo', 'width', e.target.value)}
//         />
//         <Input
//           placeholder='Высота'
//           value={formData.cargo.height}
//           onChange={(e) => handleInputChange('cargo', 'height', e.target.value)}
//         />
//         <Input
//           placeholder='Диаметр'
//           value={formData.cargo.diameter}
//           onChange={(e) =>
//             handleInputChange('cargo', 'diameter', e.target.value)
//           }
//         />
//       </div>
//       <Input
//         placeholder='Упаковка'
//         value={formData.cargo.packaging}
//         onChange={(e) =>
//           handleInputChange('cargo', 'packaging', e.target.value)
//         }
//       />
//       <Textarea
//         placeholder='Примечание'
//         value={formData.cargo.notes}
//         onChange={(e) => handleInputChange('cargo', 'notes', e.target.value)}
//       />
//     </div>
//   );

//   const renderRouteContent = () => (
//     <div className='space-y-4'>
//       <Input
//         placeholder='Погрузка*'
//         value={formData.route.loading}
//         onChange={(e) => handleInputChange('route', 'loading', e.target.value)}
//       />
//       <Input
//         placeholder='Выгрузка*'
//         value={formData.route.unloading}
//         onChange={(e) =>
//           handleInputChange('route', 'unloading', e.target.value)
//         }
//       />
//     </div>
//   );

//   const renderTransportContent = () => (
//     <div className='space-y-4'>
//       <Select
//         onValueChange={(value) =>
//           handleInputChange('transport', 'bodyType', value)
//         }
//       >
//         <SelectTrigger>
//           <SelectValue placeholder='Тип кузова' />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value='isothermal'>Изотермический</SelectItem>
//           <SelectItem value='tented'>Тентованный</SelectItem>
//           <SelectItem value='container'>Контейнер</SelectItem>
//           <SelectItem value='van'>Фургон</SelectItem>
//         </SelectContent>
//       </Select>
//       <Select
//         onValueChange={(value) =>
//           handleInputChange('transport', 'loadingType', value)
//         }
//       >
//         <SelectTrigger>
//           <SelectValue placeholder='Тип погрузки' />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value='ramps'>Аппарели</SelectItem>
//           <SelectItem value='no-doors'>Без ворот</SelectItem>
//           <SelectItem value='side'>Боковая</SelectItem>
//           <SelectItem value='top'>Верхняя</SelectItem>
//           <SelectItem value='hydroboard'>Гидроборт</SelectItem>
//         </SelectContent>
//       </Select>
//     </div>
//   );

//   const renderWhenContent = () => (
//     <div className='space-y-4'>
//       <Input
//         type='date'
//         placeholder='Дата погрузки*'
//         value={formData.when.loadingDates}
//         onChange={(e) =>
//           handleInputChange('when', 'loadingDates', e.target.value)
//         }
//       />
//       <div className='flex items-center space-x-2'>
//         <Checkbox
//           id='constant'
//           checked={formData.when.isConstant}
//           onCheckedChange={(checked) =>
//             handleInputChange('when', 'isConstant', Boolean(checked))
//           }
//         />
//         <label htmlFor='constant'>Постоянно</label>
//       </div>
//       <div className='flex items-center space-x-2'>
//         <Checkbox
//           id='ready'
//           checked={formData.when.isReady}
//           onCheckedChange={(checked) =>
//             handleInputChange('when', 'isReady', Boolean(checked))
//           }
//         />
//         <label htmlFor='ready'>Груз готов</label>
//       </div>
//     </div>
//   );

//   const renderPaymentContent = () => (
//     <div className='space-y-4'>
//       <Select
//         onValueChange={(value) => handleInputChange('payment', 'method', value)}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder='Метод оплаты' />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value='cash'>Наличные</SelectItem>
//           <SelectItem value='card'>Карта</SelectItem>
//           <SelectItem value='transfer'>Перечисление</SelectItem>
//           <SelectItem value='advance'>Аванс</SelectItem>
//         </SelectContent>
//       </Select>
//       <div className='space-y-2'>
//         {[
//           'Возможен торг',
//           'Оплата на выгрузке',
//           'Оплата после выгрузки',
//           'Через несколько банковских дней',
//           'Запрос ставки',
//         ].map((option) => (
//           <div key={option} className='flex items-center space-x-2'>
//             <Checkbox
//               id={option}
//               checked={formData.payment.options.includes(option)}
//               onCheckedChange={(checked) => {
//                 const newOptions = checked
//                   ? [...formData.payment.options, option]
//                   : formData.payment.options.filter((item) => item !== option);
//                 handleInputChange('payment', 'options', newOptions);
//               }}
//             />
//             <label htmlFor={option}>{option}</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderNotificationsContent = () => (
//     <div className='space-y-4'>
//       <div className='flex items-center space-x-2'>
//         <Checkbox
//           id='notifications'
//           checked={formData.notifications.enabled}
//           onCheckedChange={(checked) =>
//             handleInputChange('notifications', 'enabled', Boolean(checked))
//           }
//         />
//         <label htmlFor='notifications'>Включить уведомления</label>
//       </div>
//     </div>
//   );

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'cargo':
//         return renderCargoContent();
//       case 'route':
//         return renderRouteContent();
//       case 'transport':
//         return renderTransportContent();
//       case 'when':
//         return renderWhenContent();
//       case 'payment':
//         return renderPaymentContent();
//       case 'notifications':
//         return renderNotificationsContent();
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className='min-h-screen bg-gray-50 p-4 pb-20'>
//       <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
//         Мои грузы
//       </h1>

//       <div className='space-y-4 mb-8'>
//         <Button
//           onClick={() => setIsAddingCargo(true)}
//           className='w-full bg-blue-600 hover:bg-blue-700 text-white'
//         >
//           <Plus className='mr-2 h-4 w-4' /> Добавить груз
//         </Button>

//         <Button
//           variant='outline'
//           className='w-full'
//           onClick={() => {
//             router.push('/my-cargo');
//           }}
//         >
//           <TruckIcon className='mr-2 h-4 w-4' /> Мои грузы{' '}
//           <Badge variant='secondary' className='ml-2'>
//             {cargoCount}
//           </Badge>
//         </Button>
//       </div>
//       {isAddingCargo && (
//         <Card className='mb-8 shadow-lg'>
//           <CardContent className='p-6'>
//             <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
//               Добавить груз
//             </h2>
//             <ScrollArea className='h-[60vh]'>
//               <div className='space-y-4'>
//                 {sections.map(renderSectionButton)}
//               </div>
//             </ScrollArea>
//             {isAllFilled && (
//               <Button
//                 onClick={() => {
//                   router.push('/my-cargo');
//                   /* Логика публикации */
//                 }}
//                 className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white'
//               >
//                 Опубликовать
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       )}

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className='sm:max-w-[425px]'>
//           <DialogHeader>
//             <DialogTitle>
//               {sections.find((s) => s.id === activeSection)?.title}
//             </DialogTitle>
//           </DialogHeader>
//           <ScrollArea className='max-h-[60vh] pr-4'>
//             {renderContent()}
//           </ScrollArea>
//           <div className='flex justify-between mt-6'>
//             <Button
//               variant='outline'
//               onClick={() => clearSection(activeSection as keyof CargoFormData)}
//             >
//               <X className='mr-2 h-4 w-4' /> Очистить
//             </Button>
//             <Button onClick={goToNextSection}>
//               Далее <Plus className='ml-2 h-4 w-4' />
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//       <NavigationMenu
//         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//       />
//       {/* <NavigationMenu userRole={'carrier'} /> */}
//     </div>
//   );
// }

// app/cargos/page.tsx
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
  AlertCircle,
  Loader2,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

interface CargoFormData {
  title: string;
  description: string;
  weight: number;
  volume?: number;
  length?: number;
  width?: number;
  height?: number;
  loading_point: string;
  unloading_point: string;
  additional_points?: { point: string; type: 'loading' | 'unloading' }[];
  loading_date: string;
  is_constant: boolean;
  is_ready: boolean;
  vehicle_type: string;
  loading_type: string;
  payment_method: string;
  price?: number;
  payment_details?: {
    advance_payment?: number;
    payment_terms?: string;
    payment_location?: string;
  };
}

const initialFormData: CargoFormData = {
  title: '',
  description: '',
  weight: 0,
  loading_point: '',
  unloading_point: '',
  loading_date: '',
  is_constant: false,
  is_ready: false,
  vehicle_type: '',
  loading_type: '',
  payment_method: '',
};

const vehicleTypes = [
  { value: 'tent', label: 'Тентованный' },
  { value: 'refrigerator', label: 'Рефрижератор' },
  { value: 'isothermal', label: 'Изотермический' },
  { value: 'container', label: 'Контейнер' },
  { value: 'car_carrier', label: 'Автовоз' },
  { value: 'board', label: 'Бортовой' },
];

const loadingTypes = [
  { value: 'ramps', label: 'Аппарели' },
  { value: 'no_doors', label: 'Без ворот' },
  { value: 'side', label: 'Боковая' },
  { value: 'top', label: 'Верхняя' },
  { value: 'hydro_board', label: 'Гидроборт' },
];

const paymentMethods = [
  { value: 'cash', label: 'Наличные' },
  { value: 'card', label: 'Карта' },
  { value: 'transfer', label: 'Банковский перевод' },
  { value: 'advance', label: 'Аванс' },
];

const sections = [
  { id: 'cargo', title: 'Груз', icon: TruckIcon },
  { id: 'route', title: 'Маршрут', icon: MapPinIcon },
  { id: 'transport', title: 'Транспорт', icon: TruckIcon },
  { id: 'when', title: 'Когда', icon: CalendarIcon },
  { id: 'payment', title: 'Оплата', icon: CreditCardIcon },
];

export default function CargoPage() {
  const [isAddingCargo, setIsAddingCargo] = useState<boolean>(false);
  const [formData, setFormData] = useState<CargoFormData>(initialFormData);
  const [activeSection, setActiveSection] = useState<string>('cargo');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isAllFilled, setIsAllFilled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [cargoCount, setCargoCount] = useState<number>(0);

  const { userState } = useUser();
  const router = useRouter();

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'title',
      'weight',
      'loading_point',
      'unloading_point',
      'loading_date',
      'vehicle_type',
      'loading_type',
      'payment_method',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof CargoFormData]) {
        newErrors[field] = 'Это поле обязательно';
      }
    });

    if (formData.weight <= 0) {
      newErrors.weight = 'Вес должен быть больше 0';
    }

    if (
      formData.payment_method === 'advance' &&
      !formData.payment_details?.advance_payment
    ) {
      newErrors.advance_payment = 'Укажите сумму аванса';
    }

    setErrors(newErrors);
    setIsAllFilled(Object.keys(newErrors).length === 0);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Calculate volume if dimensions are provided
      if (
        ['length', 'width', 'height'].includes(name) &&
        updated.length &&
        updated.width &&
        updated.height
      ) {
        updated.volume = updated.length * updated.width * updated.height;
      }

      return updated;
    });
  };

  const handlePaymentDetailsChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      payment_details: {
        ...prev.payment_details,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      validateForm();

      if (!isAllFilled) {
        toast.error('Пожалуйста, заполните все обязательные поля');
        return;
      }

      const response = await api.createCargo(formData);
      toast.success('Груз успешно создан');
      setIsAddingCargo(false);
      setFormData(initialFormData);
      router.push('/my-cargo');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Ошибка при создании груза');
      console.error('Create cargo error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCargoContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          Название груза*
        </label>
        <Input
          placeholder='Название груза'
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          // error={errors.title}
        />
        {errors.title && (
          <p className='text-sm text-red-500 mt-1'>{errors.title}</p>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Вес (тонн)*</label>
          <Input
            type='number'
            placeholder='Вес'
            value={formData.weight || ''}
            onChange={(e) =>
              handleInputChange('weight', parseFloat(e.target.value))
            }
            // error={errors.weight}
          />
          {errors.weight && (
            <p className='text-sm text-red-500 mt-1'>{errors.weight}</p>
          )}
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Объем (м³)</label>
          <Input
            type='number'
            placeholder='Объем'
            value={formData.volume || ''}
            onChange={(e) =>
              handleInputChange('volume', parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Длина (м)</label>
          <Input
            type='number'
            placeholder='Длина'
            value={formData.length || ''}
            onChange={(e) =>
              handleInputChange('length', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Ширина (м)</label>
          <Input
            type='number'
            placeholder='Ширина'
            value={formData.width || ''}
            onChange={(e) =>
              handleInputChange('width', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Высота (м)</label>
          <Input
            type='number'
            placeholder='Высота'
            value={formData.height || ''}
            onChange={(e) =>
              handleInputChange('height', parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Описание</label>
        <Textarea
          placeholder='Описание груза'
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
    </div>
  );

  const renderRouteContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          Пункт погрузки*
        </label>
        <Input
          placeholder='Откуда'
          value={formData.loading_point}
          onChange={(e) => handleInputChange('loading_point', e.target.value)}
          // error={errors.loading_point}
        />
        {errors.loading_point && (
          <p className='text-sm text-red-500 mt-1'>{errors.loading_point}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Пункт выгрузки*
        </label>
        <Input
          placeholder='Куда'
          value={formData.unloading_point}
          onChange={(e) => handleInputChange('unloading_point', e.target.value)}
          // error={errors.unloading_point}
        />
        {errors.unloading_point && (
          <p className='text-sm text-red-500 mt-1'>{errors.unloading_point}</p>
        )}
      </div>

      {formData.additional_points?.map((point, index) => (
        <div key={index} className='flex items-center gap-2'>
          <Input
            placeholder={
              point.type === 'loading' ? 'Пункт погрузки' : 'Пункт выгрузки'
            }
            value={point.point}
            onChange={(e) => {
              const newPoints = [...(formData.additional_points || [])];
              newPoints[index].point = e.target.value;
              handleInputChange('additional_points', newPoints);
            }}
          />
          <Button
            variant='outline'
            size='icon'
            onClick={() => {
              const newPoints = formData.additional_points?.filter(
                (_, i) => i !== index
              );
              handleInputChange('additional_points', newPoints);
            }}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ))}

      <Button
        variant='outline'
        onClick={() => {
          const newPoints = [...(formData.additional_points || [])];
          newPoints.push({ point: '', type: 'loading' });
          handleInputChange('additional_points', newPoints);
        }}
      >
        <Plus className='h-4 w-4 mr-2' /> Добавить точку маршрута
      </Button>
    </div>
  );

  const renderTransportContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          Тип транспорта*
        </label>
        <Select
          value={formData.vehicle_type}
          onValueChange={(value) => handleInputChange('vehicle_type', value)}
        >
          <SelectTrigger
            className={errors.vehicle_type ? 'border-red-500' : ''}
          >
            <SelectValue placeholder='Выберите тип транспорта' />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.vehicle_type && (
          <p className='text-sm text-red-500 mt-1'>{errors.vehicle_type}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Тип погрузки*</label>
        <Select
          value={formData.loading_type}
          onValueChange={(value) => handleInputChange('loading_type', value)}
        >
          <SelectTrigger
            className={errors.loading_type ? 'border-red-500' : ''}
          >
            <SelectValue placeholder='Выберите тип погрузки' />
          </SelectTrigger>
          <SelectContent>
            {loadingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.loading_type && (
          <p className='text-sm text-red-500 mt-1'>{errors.loading_type}</p>
        )}
      </div>
    </div>
  );

  const renderWhenContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>Дата погрузки*</label>
        <Input
          type='date'
          value={formData.loading_date}
          onChange={(e) => handleInputChange('loading_date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          // error={errors.loading_date}
        />
        {errors.loading_date && (
          <p className='text-sm text-red-500 mt-1'>{errors.loading_date}</p>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Checkbox
          id='constant'
          checked={formData.is_constant}
          onCheckedChange={(checked) =>
            handleInputChange('is_constant', checked)
          }
        />
        <label htmlFor='constant'>Постоян</label>
        {/* </div> */}
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='ready'
          checked={formData.is_ready}
          onCheckedChange={(checked) => handleInputChange('is_ready', checked)}
        />
        <label htmlFor='ready'>Груз готов к отправке</label>
      </div>
    </div>
  );

  const renderPaymentContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>Способ оплаты*</label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => handleInputChange('payment_method', value)}
        >
          <SelectTrigger
            className={errors.payment_method ? 'border-red-500' : ''}
          >
            <SelectValue placeholder='Выберите способ оплаты' />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.payment_method && (
          <p className='text-sm text-red-500 mt-1'>{errors.payment_method}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Цена</label>
        <Input
          type='number'
          placeholder='Введите сумму'
          value={formData.price || ''}
          onChange={(e) =>
            handleInputChange('price', parseFloat(e.target.value))
          }
        />
      </div>

      {formData.payment_method === 'advance' && (
        <div>
          <label className='block text-sm font-medium mb-2'>
            Сумма аванса*
          </label>
          <div>
            <Input
              type='number'
              placeholder='Введите сумму аванса'
              value={formData.payment_details?.advance_payment || ''}
              onChange={(e) =>
                handlePaymentDetailsChange(
                  'advance_payment',
                  parseFloat(e.target.value)
                )
              }
              className={errors.advance_payment ? 'border-red-500' : ''}
            />
            {errors.advance_payment && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.advance_payment}
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <label className='block text-sm font-medium mb-2'>Условия оплаты</label>
        <Select
          value={formData.payment_details?.payment_terms || ''}
          onValueChange={(value) =>
            handlePaymentDetailsChange('payment_terms', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Выберите условия оплаты' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='on_loading'>При погрузке</SelectItem>
            <SelectItem value='on_unloading'>При выгрузке</SelectItem>
            <SelectItem value='after_unloading'>После выгрузки</SelectItem>
            <SelectItem value='delayed'>Отсрочка платежа</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Место оплаты</label>
        <Select
          value={formData.payment_details?.payment_location || ''}
          onValueChange={(value) =>
            handlePaymentDetailsChange('payment_location', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Выберите место оплаты' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='loading_point'>В пункте погрузки</SelectItem>
            <SelectItem value='unloading_point'>В пункте выгрузки</SelectItem>
            <SelectItem value='office'>В офисе</SelectItem>
          </SelectContent>
        </Select>
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
      default:
        return null;
    }
  };

  const getSectionSummary = (sectionId: string) => {
    switch (sectionId) {
      case 'cargo':
        return formData.title
          ? `${formData.title}, ${formData.weight} т${
              formData.volume ? `, ${formData.volume} м³` : ''
            }`
          : '';
      case 'route':
        return formData.loading_point && formData.unloading_point
          ? `${formData.loading_point} - ${formData.unloading_point}`
          : '';
      case 'transport':
        return formData.vehicle_type
          ? `${
              vehicleTypes.find((t) => t.value === formData.vehicle_type)
                ?.label || ''
            }, ${
              loadingTypes.find((t) => t.value === formData.loading_type)
                ?.label || ''
            }`
          : '';
      case 'when':
        return formData.loading_date
          ? `${new Date(formData.loading_date).toLocaleDateString()}${
              formData.is_constant ? ', постоянный' : ''
            }${formData.is_ready ? ', готов' : ''}`
          : '';
      case 'payment':
        return formData.payment_method
          ? `${
              paymentMethods.find((m) => m.value === formData.payment_method)
                ?.label || ''
            }${formData.price ? `, ${formData.price} ₽` : ''}`
          : '';
      default:
        return '';
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
                {sections.map((section) => {
                  const Icon = section.icon;
                  const summary = getSectionSummary(section.id);

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
                      {errors[section.id] && (
                        <AlertCircle className='ml-auto h-5 w-5 text-red-500' />
                      )}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>

            {isAllFilled && (
              <Button
                onClick={handleSubmit}
                className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Создание...
                  </>
                ) : (
                  'Опубликовать'
                )}
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
              onClick={() => {
                const sectionData =
                  formData[activeSection as keyof CargoFormData];
                if (typeof sectionData === 'object') {
                  handleInputChange(activeSection, {});
                } else {
                  handleInputChange(activeSection, '');
                }
              }}
            >
              <X className='mr-2 h-4 w-4' /> Очистить
            </Button>
            <Button
              onClick={() => {
                const currentIndex = sections.findIndex(
                  (s) => s.id === activeSection
                );
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1].id);
                } else {
                  setIsDialogOpen(false);
                }
              }}
            >
              Далее <Plus className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Link href={'/student/cargos/'}>go to cargos nigga</Link>
      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
