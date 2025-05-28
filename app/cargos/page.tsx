'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormProvider, useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Plus,
  TruckIcon,
  MapPinIcon,
  BoxIcon,
  CalendarIcon,
  CreditCardIcon,
  Check,
  ChevronsUpDown,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslation } from '@/contexts/i18n';

// Type definitions for location data
interface Location {
  id: number;
  name: string;
  level: number; // 1 = Country, 2 = Region/State, 3 = City
  parent_name?: string;
  country_name?: string;
  full_name?: string;
}

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
  loading_location?: number;
  unloading_location?: number;
  additional_points?: {
    point: string;
    type: 'loading' | 'unloading';
    location_id?: number;
  }[];
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
  loading_location: undefined,
  unloading_location: undefined,
  additional_points: [],
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
  // const [loadingLocations, setLoadingLocations] = useState<Location[]>([]);
  // const [unloadingLocations, setUnloadingLocations] = useState<Location[]>([]);
  // const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  // const [isUnloadingLocations, setIsUnloadingLocations] =
  //   useState<boolean>(false);
  // const [loadingLocationOpen, setLoadingLocationOpen] = useState(false);
  // const [unloadingLocationOpen, setUnloadingLocationOpen] = useState(false);
  // const [loadingOpen, setLoadingOpen] = useState(false);
  // const [unloadingOpen, setUnloadingOpen] = useState(false);
  // const [open, setOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [locations, setLocations] = useState<Location[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const inputRef = useRef<HTMLInputElement>(null);

  const { userState } = useUser();
  const router = useRouter();
  const { t } = useTranslation();

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
        newErrors[field] = t('cargo.requiredField');
      }
    });

    if (formData.weight <= 0) {
      newErrors.weight = t('cargo.weightTooLow');
    }

    if (
      formData.payment_method === 'advance' &&
      !formData.payment_details?.advance_payment
    ) {
      newErrors.advance_payment = t('cargo.requiredField');
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

  const searchLocations = async (
    query: string,
    setLocations: React.Dispatch<React.SetStateAction<Location[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!query || query.length < 2) {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    try {
      // Call your API to search locations
      const response = await api.searchLocations(query);
      if (Array.isArray(response)) {
        setLocations(response);
      } else {
        setLocations([]);
      }
      console.log(response, 'fdfdgdf');
    } catch (error) {
      console.error('Error searching locations:', error);
      toast.error('Ошибка при поиске местоположения');
    } finally {
      setIsLoading(false);
    }
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
        toast.error(t('cargo.requiredField'));
        return;
      }

      // Prepare the data for API submission
      const submissionData = {
        ...formData,
        loading_location: formData.loading_location
          ? Number(formData.loading_location)
          : null,
        unloading_location: formData.unloading_location
          ? Number(formData.unloading_location)
          : null,
      };

      const response = await api.createCargo(submissionData);
      toast.success(t('cargo.success'));
      setIsAddingCargo(false);
      setFormData(initialFormData);
      router.push('/my-cargo');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || t('common.error'));
      console.error('Create cargo error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCargoContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.name')}*
        </label>
        <Input
          placeholder={t('cargo.name')}
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        {errors.title && (
          <p className='text-sm text-red-500 mt-1'>{errors.title}</p>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.weight')}*
          </label>
          <Input
            type='number'
            placeholder={t('cargo.weight')}
            value={formData.weight || ''}
            onChange={(e) =>
              handleInputChange('weight', parseFloat(e.target.value))
            }
          />
          {errors.weight && (
            <p className='text-sm text-red-500 mt-1'>{errors.weight}</p>
          )}
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.volume')}
          </label>
          <Input
            type='number'
            placeholder={t('cargo.volume')}
            value={formData.volume || ''}
            onChange={(e) =>
              handleInputChange('volume', parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.length')}
          </label>
          <Input
            type='number'
            placeholder={t('cargo.length')}
            value={formData.length || ''}
            onChange={(e) =>
              handleInputChange('length', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.width')}
          </label>
          <Input
            type='number'
            placeholder={t('cargo.width')}
            value={formData.width || ''}
            onChange={(e) =>
              handleInputChange('width', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.height')}
          </label>
          <Input
            type='number'
            placeholder={t('cargo.height')}
            value={formData.height || ''}
            onChange={(e) =>
              handleInputChange('height', parseFloat(e.target.value))
            }
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.description')}
        </label>
        <Textarea
          placeholder={t('cargo.description')}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
    </div>
  );

  // const LocationSelector = ({
  //   value,
  //   onChange,
  //   placeholder,
  //   error,
  //   errorMessage,
  // }: any) => {
  //   const [open, setOpen] = useState(false);
  //   const [searchQuery, setSearchQuery] = useState('');
  //   const [locations, setLocations] = useState<Location[]>([]);
  //   const [isLoading, setIsLoading] = useState(false);
  //   const containerRef = useRef<HTMLInputElement>(null);

  //   // Handle click outside to close dropdown
  //   useEffect(() => {
  //     const handleClickOutside = (event: any) => {
  //       if (
  //         containerRef.current &&
  //         !containerRef.current.contains(event.target)
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
  //       setOpen(true); // Open list when typing
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

  //   const handleSelect = (location: any) => {
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
  //       {/* Show selected value when search is empty */}
  //       {value.name && searchQuery === '' && (
  //         <div className='absolute right-0 top-0 h-full flex items-center pr-3 text-sm text-muted-foreground'>
  //           {value.name}
  //         </div>
  //       )}
  //       {open && (
  //         <div className='absolute z-10 w-full mt-1 bg-popover rounded-md border shadow-md'>
  //           <div className='p-1'>
  //             {isLoading ? (
  //               <div className='p-4 text-center text-sm text-muted-foreground'>
  //                 {t('common.loading')}
  //               </div>
  //             ) : locations.length === 0 ? (
  //               <div className='p-4 text-center text-sm text-muted-foreground'>
  //                 {searchQuery.length < 2
  //                   ? t('cargo.enterMinimum2Chars')
  //                   : t('cargo.nothingFound')}
  //               </div>
  //             ) : (
  //               <ScrollArea className='h-[300px]'>
  //                 {locations.map((location) => (
  //                   <div
  //                     key={location.id}
  //                     onClick={() => handleSelect(location)}
  //                     className={cn(
  //                       'flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer',
  //                       'hover:bg-muted'
  //                     )}
  //                   >
  //                     <div className='flex-1'>
  //                       <p className='text-sm font-medium'>
  //                         {location.name}
  //                         {location.level === 3 && location.parent_name && (
  //                           <span className='text-muted-foreground'>
  //                             {' '}
  //                             - {location.parent_name}
  //                           </span>
  //                         )}
  //                         {location.country_name && location.level !== 1 && (
  //                           <span className='text-muted-foreground'>
  //                             {', '}
  //                             {location.country_name}
  //                           </span>
  //                         )}
  //                       </p>
  //                       {location.full_name && (
  //                         <p className='text-xs text-muted-foreground'>
  //                           {location.full_name}
  //                         </p>
  //                       )}
  //                     </div>
  //                     {value.id === location.id.toString() && (
  //                       <Check className='h-4 w-4' />
  //                     )}
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

  // Enhanced LocationSelector for cargo form
  const LocationSelector = ({
    value,
    onChange,
    placeholder,
    error,
    errorMessage,
  }: {
    value: { id: string; name: string };
    onChange: (value: { id: string; name: string }) => void;
    placeholder: string;
    error?: boolean;
    errorMessage?: string;
  }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle outside click to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
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
        <div className='relative group'>
          <input
            ref={inputRef}
            type='text'
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setOpen(true)}
            className={cn(
              'w-full h-10 px-4 py-2 rounded-md border transition-all duration-200',
              'bg-background text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'pr-10',
              error
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-input hover:border-primary/50',
              value.name && searchQuery === '' ? 'text-foreground' : ''
            )}
            aria-expanded={open}
          />

          {/* Show selected value */}
          {value.name && searchQuery === '' && (
            <div className='absolute right-10 top-0 h-full flex items-center text-sm'>
              <span className='truncate max-w-[calc(100%-80px)] text-foreground'>
                {value.name}
              </span>
            </div>
          )}

          {/* Clear button */}
          {value.name && searchQuery === '' && (
            <button
              type='button'
              onClick={clearSelection}
              className='absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 group-hover:opacity-100 opacity-70 transition-opacity'
              aria-label='Clear selection'
            >
              <X className='h-4 w-4' />
            </button>
          )}

          {/* Search icon */}
          <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className='absolute z-20 w-full mt-1 bg-background rounded-md border border-input shadow-md'
            >
              <div className='p-1'>
                {isLoading ? (
                  <div className='py-4 text-center'>
                    <Loader2 className='h-5 w-5 animate-spin text-primary mx-auto' />
                    <p className='text-sm text-muted-foreground mt-2'>
                      {t('common.loading')}
                    </p>
                  </div>
                ) : locations.length === 0 ? (
                  <div className='p-4 text-center text-sm text-muted-foreground'>
                    {searchQuery.length < 2
                      ? t('cargo.enterMinimum2Chars')
                      : t('cargo.nothingFound')}
                  </div>
                ) : (
                  <ScrollArea className='h-[min(300px,50vh)]'>
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => handleSelect(location)}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer transition-colors',
                          'hover:bg-primary/5 active:bg-primary/10',
                          value.id === location.id.toString() && 'bg-primary/5'
                        )}
                      >
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-foreground'>
                            {location.name}
                            {location.level === 3 && location.parent_name && (
                              <span className='text-muted-foreground font-normal'>
                                {' '}
                                - {location.parent_name}
                              </span>
                            )}
                            {location.country_name && location.level !== 1 && (
                              <span className='text-muted-foreground font-normal'>
                                {', '}
                                {location.country_name}
                              </span>
                            )}
                          </p>
                          {location.full_name && (
                            <p className='text-xs text-muted-foreground'>
                              {location.full_name}
                            </p>
                          )}
                        </div>
                        {value.id === location.id.toString() && (
                          <Check className='h-4 w-4 text-primary shrink-0' />
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className='text-sm text-red-500 mt-1 px-1'
          >
            {errorMessage}
          </motion.p>
        )}
      </div>
    );
  };

  const renderRouteContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.loadingPoint')}*
        </label>
        <LocationSelector
          value={{
            id: formData.loading_location?.toString() || '',
            name: formData.loading_point,
          }}
          onChange={({ id, name }: any) => {
            handleInputChange('loading_location', id);
            handleInputChange('loading_point', name);
          }}
          placeholder={t('cargo.enterCity')}
          error={!!errors.loading_point}
          errorMessage={errors.loading_point}
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.unloadingPoint')}*
        </label>
        <LocationSelector
          value={{
            id: formData.unloading_location?.toString() || '',
            name: formData.unloading_point,
          }}
          onChange={({ id, name }: any) => {
            handleInputChange('unloading_location', id);
            handleInputChange('unloading_point', name);
          }}
          placeholder={t('cargo.enterCity')}
          error={!!errors.unloading_point}
          errorMessage={errors.unloading_point}
        />
      </div>

      {/* Additional route points */}
      {formData.additional_points?.map((point, index) => (
        <div key={index} className='flex items-center gap-2'>
          <Input
            placeholder={
              point.type === 'loading'
                ? t('cargo.loadingPoint')
                : t('cargo.unloadingPoint')
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
          newPoints.push({
            point: '',
            type: 'loading',
            location_id: undefined,
          });
          handleInputChange('additional_points', newPoints);
        }}
      >
        <Plus className='h-4 w-4 mr-2' /> {t('cargo.addPoint')}
      </Button>
    </div>
  );

  const renderTransportContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.vehicleType')}*
        </label>
        <Select
          value={formData.vehicle_type}
          onValueChange={(value) => handleInputChange('vehicle_type', value)}
        >
          <SelectTrigger
            className={errors.vehicle_type ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={t('cargo.selectVehicleType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='tent'>{t('cargo.tent')}</SelectItem>
            <SelectItem value='refrigerator'>
              {t('cargo.refrigerator')}
            </SelectItem>
            <SelectItem value='isothermal'>{t('cargo.isothermal')}</SelectItem>
            <SelectItem value='container'>{t('cargo.container')}</SelectItem>
            <SelectItem value='car_carrier'>
              {t('cargo.car_carrier')}
            </SelectItem>
            <SelectItem value='board'>{t('cargo.board')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.vehicle_type && (
          <p className='text-sm text-red-500 mt-1'>{errors.vehicle_type}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.loadingType')}*
        </label>
        <Select
          value={formData.loading_type}
          onValueChange={(value) => handleInputChange('loading_type', value)}
        >
          <SelectTrigger
            className={errors.loading_type ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={t('cargo.selectLoadingType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ramps'>{t('cargo.ramps')}</SelectItem>
            <SelectItem value='no_doors'>{t('cargo.no_doors')}</SelectItem>
            <SelectItem value='side'>{t('cargo.side')}</SelectItem>
            <SelectItem value='top'>{t('cargo.top')}</SelectItem>
            <SelectItem value='hydro_board'>
              {t('cargo.hydro_board')}
            </SelectItem>
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
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.loadingDate')}*
        </label>
        <Input
          type='date'
          value={formData.loading_date}
          onChange={(e) => handleInputChange('loading_date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
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
        <label htmlFor='constant'>{t('cargo.permanent')}</label>
      </div>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id='ready'
          checked={formData.is_ready}
          onCheckedChange={(checked) => handleInputChange('is_ready', checked)}
        />
        <label htmlFor='ready'>{t('cargo.readyForShipment')}</label>
      </div>
    </div>
  );

  const renderPaymentContent = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.paymentMethod')}*
        </label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => handleInputChange('payment_method', value)}
        >
          <SelectTrigger
            className={errors.payment_method ? 'border-red-500' : ''}
          >
            <SelectValue placeholder={t('cargo.selectPaymentMethod')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='cash'>{t('cargo.cash')}</SelectItem>
            <SelectItem value='card'>{t('cargo.card')}</SelectItem>
            <SelectItem value='transfer'>{t('cargo.transfer')}</SelectItem>
            <SelectItem value='advance'>{t('cargo.advance')}</SelectItem>
          </SelectContent>
        </Select>
        {errors.payment_method && (
          <p className='text-sm text-red-500 mt-1'>{errors.payment_method}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.price')}
        </label>
        <Input
          type='number'
          placeholder={t('cargo.enterAmount')}
          value={formData.price || ''}
          onChange={(e) =>
            handleInputChange('price', parseFloat(e.target.value))
          }
        />
      </div>

      {formData.payment_method === 'advance' && (
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.advanceAmount')}*
          </label>
          <div>
            <Input
              type='number'
              placeholder={t('cargo.enterAdvanceAmount')}
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
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.paymentTerms')}
        </label>
        <Select
          value={formData.payment_details?.payment_terms || ''}
          onValueChange={(value) =>
            handlePaymentDetailsChange('payment_terms', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t('cargo.selectPaymentTerms')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='on_loading'>{t('cargo.on_loading')}</SelectItem>
            <SelectItem value='on_unloading'>
              {t('cargo.on_unloading')}
            </SelectItem>
            <SelectItem value='after_unloading'>
              {t('cargo.after_unloading')}
            </SelectItem>
            <SelectItem value='delayed'>{t('cargo.delayed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.paymentLocation')}
        </label>
        <Select
          value={formData.payment_details?.payment_location || ''}
          onValueChange={(value) =>
            handlePaymentDetailsChange('payment_location', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t('cargo.selectPaymentLocation')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='loading_point'>
              {t('cargo.loading_point')}
            </SelectItem>
            <SelectItem value='unloading_point'>
              {t('cargo.unloading_point')}
            </SelectItem>
            <SelectItem value='office'>{t('cargo.office')}</SelectItem>
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
          ? `${formData.title}, ${formData.weight} ${t('common.ton')}${
              formData.volume ? `, ${formData.volume} m³` : ''
            }`
          : '';
      case 'route':
        return formData.loading_point && formData.unloading_point
          ? `${formData.loading_point} - ${formData.unloading_point}`
          : '';
      case 'transport':
        return formData.vehicle_type
          ? `${t(`cargo.${formData.vehicle_type}`)}, ${
              formData.loading_type ? t(`cargo.${formData.loading_type}`) : ''
            }`
          : '';
      case 'when':
        return formData.loading_date
          ? `${new Date(formData.loading_date).toLocaleDateString()}${
              formData.is_constant ? `, ${t('cargo.isConstant')}` : ''
            }${formData.is_ready ? `, ${t('cargo.isReady')}` : ''}`
          : '';
      case 'payment':
        return formData.payment_method
          ? `${t(`cargo.${formData.payment_method}`)}${
              formData.price ? `, ${formData.price} $` : ''
            }`
          : '';
      default:
        return '';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <h1 className='text-3xl font-bold text-center mb-6 text-gray-800'>
        {t('cargo.title')}
      </h1>
      <div className='space-y-4 mb-8'>
        <Button
          onClick={() => setIsAddingCargo(true)}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Plus className='mr-2 h-4 w-4' /> {t('cargo.addCargo')}
        </Button>
        <Button
          variant='outline'
          className='w-full'
          onClick={() => {
            router.push('/my-cargo');
          }}
        >
          <TruckIcon className='mr-2 h-4 w-4' /> {t('cargo.myCargos')}
        </Button>
      </div>

      {isAddingCargo && (
        <Card className='mb-8 shadow-lg'>
          <CardContent className='p-6'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
              {t('cargo.addCargo')}
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
                        <span className='font-semibold'>
                          {t(section.title)}
                        </span>
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
                    {t('cargo.creating')}
                  </>
                ) : (
                  t('cargo.publish')
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
              {sections.find((s) => s.id === activeSection)?.title &&
                t(sections.find((s) => s.id === activeSection)?.title || '')}
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
              <X className='mr-2 h-4 w-4' /> {t('cargo.clear')}
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
              {t('cargo.next')} <Plus className='ml-2 h-4 w-4' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {userState.role === 'student' && (
        <div className='space-y-4 mb-8'>
          <Button
            onClick={() => {
              router.push('/student/cargos/');
            }}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white'
          >
            <BoxIcon className='mr-2 h-4 w-4' /> {t('cargo.viewAll')}
          </Button>
        </div>
      )}

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
