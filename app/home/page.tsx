'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { DateRange, Range } from 'react-date-range';
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
  Search,
  TruckIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  CopyIcon,
  AlertCircle,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useTranslation } from '@/contexts/i18n';
import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  name_ru?: string;
  display_name?: string;
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
    username: any;
    telegram_id: any;
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
  source_id?: string;
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

// Enhanced LocationSelector for home page
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
  const { t } = useTranslation();

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
      name:
        location.display_name ||
        location.name_ru ||
        location.full_name ||
        location.name,
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
            'bg-blue-500 text-white placeholder:text-blue-200',
            'focus:outline-none focus:ring-2 focus:ring-yellow-300/30 focus:border-yellow-400',
            'pr-10',
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-blue-400 hover:border-blue-300',
            value.name && searchQuery === '' ? 'text-white' : ''
          )}
          aria-expanded={open}
        />
        {/* Show selected value */}
        {value.name && searchQuery === '' && (
          <div className='absolute right-10 top-0 h-full flex items-center text-sm'>
            <span className='truncate max-w-[calc(100%-80px)] text-white font-medium'>
              {value.name}
            </span>
          </div>
        )}
        {/* Clear button */}
        {value.name && searchQuery === '' && (
          <button
            type='button'
            onClick={clearSelection}
            className='absolute right-10 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white group-hover:opacity-100 opacity-70 transition-opacity'
            aria-label='Clear selection'
          >
            <X className='h-4 w-4' />
          </button>
        )}
        {/* Search icon */}
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200' />
      </div>
      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className='absolute z-20 w-full mt-1 bg-blue-700 rounded-md border border-blue-600 shadow-md'
          >
            <div className='p-1'>
              {isLoading ? (
                <div className='py-4 text-center'>
                  <Loader2 className='h-5 w-5 animate-spin text-yellow-400 mx-auto' />
                  <p className='text-sm text-blue-200 mt-2'>
                    {t('common.loading')}
                  </p>
                </div>
              ) : locations.length === 0 ? (
                <div className='p-4 text-center text-sm text-blue-200'>
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
                        'hover:bg-blue-600 active:bg-blue-500',
                        value.id === location.id.toString() && 'bg-blue-600'
                      )}
                    >
                      <div className='flex-1'>
                        <p className='text-sm font-medium text-white'>
                          {location.display_name || location.name}
                          {location.name_ru && (
                            <span className='text-blue-200 text-xs ml-2'>
                              ({location.name})
                            </span>
                          )}
                          {location.level === 3 && location.parent_name && (
                            <span className='text-blue-200 font-normal'>
                              {' '}
                              - {location.parent_name}
                            </span>
                          )}
                          {location.country_name && location.level !== 1 && (
                            <span className='text-blue-200 font-normal'>
                              {', '}
                              {location.country_name}
                            </span>
                          )}
                        </p>
                        {location.full_name && (
                          <p className='text-xs text-blue-200'>
                            {location.full_name}
                          </p>
                        )}
                      </div>
                      {value.id === location.id.toString() && (
                        <Check className='h-4 w-4 text-yellow-400 shrink-0' />
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
          className='text-sm text-red-300 mt-1 px-1'
        >
          {errorMessage}
        </motion.p>
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
  const { t } = useTranslation();

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

  const handleDateRangeChange = (ranges: any) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: ranges.selection,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      notifications: checked,
    }));
    // If enabling notifications, also enable saving filter
    if (checked) {
      setSaveFilter(true);
    }
  };

  const handleRadiusChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      radius: value[0],
    }));
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
      newErrors.filterName =
        t('favorites.requiredField') || 'This field is required';
    }

    // Validate at least one main filter is set
    if (
      !filters.loading_location.id &&
      !filters.unloading_location.id &&
      !filters.vehicle_type
    ) {
      newErrors.general =
        t('home.atLeastOneFilter') ||
        'Please specify at least one filter criteria';
    }

    // Validate weight range if both values are provided
    if (
      filters.weight_min !== undefined &&
      filters.weight_max !== undefined &&
      filters.weight_min > filters.weight_max
    ) {
      newErrors.weight =
        t('home.invalidWeightRange') ||
        'Minimum weight cannot be greater than maximum weight';
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
      from_location: filters.loading_location.name || undefined,
      to_location: filters.unloading_location.name || undefined,
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
        toast.success(
          t('home.filterSavedSuccess') || 'Filter saved with notifications'
        );
      } catch (error) {
        console.error('Error saving filter:', error);
        toast.error(t('home.filterSaveError') || 'Error saving filter');
      }
    }

    onApply({
      ...filterData,
      notifications: filters.notifications,
    });
    onClose();
  };

  <style jsx global>{`
    .rdrCalendarWrapper {
      font-size: 14px !important;
    }
    .rdrMonth {
      width: 100% !important;
    }
    .rdrDayNumber span {
      font-size: 13px !important;
    }
    .rdrMonthName {
      font-size: 14px !important;
    }
  `}</style>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-blue-600 text-white max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-white text-center'>
            {t('cargo.cargoSearch')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className='pr-4 h-[70vh] max-h-[600px]'>
          <div className='space-y-4 px-1'>
            {errors.general && (
              <div className='bg-red-500/70 text-white p-3 rounded text-sm'>
                <AlertCircle className='h-4 w-4 inline-block mr-2' />
                {errors.general}
              </div>
            )}

            <Select
              value={filters.vehicle_type}
              onValueChange={(value) =>
                handleSelectChange('vehicle_type', value)
              }
            >
              <SelectTrigger className='bg-blue-500 text-white border-blue-400 h-11'>
                <SelectValue placeholder={t('cargo.selectVehicleType')} />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {t(`cargo.${type.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='space-y-2'>
              <label className='text-white text-sm font-medium'>
                {t('cargo.loadingPoint')}
              </label>
              <LocationSelector
                value={filters.loading_location}
                onChange={(value: any) =>
                  setFilters((prev) => ({
                    ...prev,
                    loading_location: value,
                  }))
                }
                placeholder={t('cargo.enterCity')}
              />
            </div>

            <div className='space-y-2'>
              <label className='text-white text-sm font-medium'>
                {t('cargo.unloadingPoint')}
              </label>
              <LocationSelector
                value={filters.unloading_location}
                onChange={(value: any) =>
                  setFilters((prev) => ({
                    ...prev,
                    unloading_location: value,
                  }))
                }
                placeholder={t('cargo.enterCity')}
              />
            </div>

            {/* Weight range */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-white text-sm font-medium'>
                  {t('cargo.weight')} {t('common.from')} ({t('common.ton')})
                </label>
                <Input
                  type='number'
                  min='0'
                  placeholder={t('common.minimum')}
                  value={filters.weight_min || ''}
                  onChange={(e) => handleWeightChange('min', e.target.value)}
                  className='bg-blue-500 text-white border-blue-400 placeholder:text-blue-300 h-11'
                />
              </div>
              <div className='space-y-2'>
                <label className='text-white text-sm font-medium'>
                  {t('cargo.weight')} {t('common.to')} ({t('common.ton')})
                </label>
                <Input
                  type='number'
                  min='0'
                  placeholder={t('common.maximum')}
                  value={filters.weight_max || ''}
                  onChange={(e) => handleWeightChange('max', e.target.value)}
                  className='bg-blue-500 text-white border-blue-400 placeholder:text-blue-300 h-11'
                />
              </div>
            </div>
            {errors.weight && (
              <div className='text-yellow-300 text-sm'>{errors.weight}</div>
            )}

            {/* Radius search */}
            <div className='space-y-3 pt-2'>
              <div className='flex justify-between items-center'>
                <label className='text-white text-sm font-medium'>
                  {t('locations.radius')}: {filters.radius}{' '}
                  {t('locations.kilometers')}
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
                {t('home.searchRadiusDescription', { radius: filters.radius })}
              </p>
            </div>

            {/* <div className='border border-blue-500 rounded-md p-4 mt-2'>
              <h3 className='text-sm font-medium text-blue-100 mb-2'>
                {t('cargo.loadingDate')}
              </h3>
              <div className='bg-white rounded-md p-2'>
                <DateRange
                  ranges={[filters.dateRange]}
                  onChange={handleDateRangeChange}
                  months={1}
                  direction='vertical'
                  className='w-full'
                />
              </div>
            </div> */}
            <div className='border border-blue-500 rounded-md p-4 mt-2'>
              <h3 className='text-sm font-medium text-blue-100 mb-3'>
                {t('cargo.loadingDate')}
              </h3>
              <div className='bg-white rounded-md p-2 overflow-hidden'>
                <div className='calendar-container'>
                  <DateRange
                    ranges={[filters.dateRange]}
                    onChange={handleDateRangeChange}
                    months={1}
                    direction='horizontal'
                    showMonthAndYearPickers={true}
                    showDateDisplay={false}
                    rangeColors={['#3b82f6']}
                    weekStartsOn={1}
                    // staticRanges={[]}
                    // inputRanges={[]}
                  />
                </div>
              </div>
            </div>

            <div className='flex items-center space-x-2 my-4'>
              <Checkbox
                id='notifications'
                checked={filters.notifications}
                onCheckedChange={handleCheckboxChange}
                className='bg-blue-500 border-blue-300 text-yellow-400 focus:ring-yellow-500'
              />
              <label htmlFor='notifications' className='text-white'>
                {t('home.enableNotificationsForNewCargos')}
              </label>
            </div>

            {filters.notifications && (
              <div className='space-y-3 border border-blue-500 rounded-md p-4'>
                <div className='flex items-center space-x-2 mb-2'>
                  <Checkbox
                    id='saveFilter'
                    checked={saveFilter}
                    onCheckedChange={(checked) => setSaveFilter(!!checked)}
                    className='bg-blue-500 border-blue-300 text-yellow-400 focus:ring-yellow-500'
                  />
                  <label htmlFor='saveFilter' className='text-white'>
                    {t('home.saveFilter')}
                  </label>
                </div>
                {saveFilter && (
                  <div>
                    <Input
                      placeholder={t('home.filterName')}
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
              className='w-full bg-yellow-400 text-blue-800 hover:bg-yellow-500 mt-4'
            >
              <Filter className='h-4 w-4 mr-2' />
              {t('home.applyFilter')}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default function HomePage() {
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

  const fetchCargos = async (resetResults = true) => {
    try {
      setIsLoading(resetResults);

      // Prepare query params - remove any empty values to reduce request size
      const params = {
        ...(searchTerm ? { search: searchTerm } : {}),
        ...filterParams,
      };

      // Start timing
      const timerLabel = `API_CALL_${Date.now()}`;
      console.time(timerLabel);
      console.log('Sending request with params:', params);

      // Use search endpoint if we have active filters
      let response;
      if (Object.keys(filterParams).length > 0) {
        response = await api.searchCargo(params);
      } else {
        response = await api.getCargos(params);
      }

      // End timing and log results
      console.log(response, 'res');
      console.timeEnd(timerLabel);
      console.log('Backend response time (ms):', performance.now());
      console.log('Response data size:', JSON.stringify(response).length);

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
      toast.error(t('cargo.errorLoadingCargos') || 'Error loading cargos');
      console.error('Fetch cargos error:', error);
    } finally {
      setIsLoading(false);
      setIsMoreLoading(false);
    }
  };

  // Load more results when user scrolls to bottom
  // const loadMoreResults = async () => {
  //   if (!nextPage || isMoreLoading) return;
  //   setIsMoreLoading(true);
  //   try {
  //     const response = await fetch(nextPage);
  //     const data = await response.json();
  //     setCargos((prev) => ({
  //       ...data,
  //       results: [...prev?.results, ...data?.results],
  //     }));
  //     setNextPage(data?.next);
  //   } catch (error) {
  //     toast.error(
  //       t('cargo.errorLoadingMore') || 'Error loading additional results'
  //     );
  //     console.error('Load more error:', error);
  //   } finally {
  //     setIsMoreLoading(false);
  //   }
  // };

  const loadMoreResults = async () => {
    if (!nextPage || isMoreLoading) return;
    setIsMoreLoading(true);
    try {
      // Extract query params from the nextPage URL
      const url = new URL(nextPage);
      const limit = url.searchParams.get('limit');
      const offset = url.searchParams.get('offset');

      // Use your API utility with the extracted params instead of raw fetch
      const response = await api.getCargos({
        limit,
        offset,
        ...filterParams, // Include any current filters
        search: searchTerm,
      });

      setCargos((prev) => ({
        ...response,
        results: [...prev.results, ...response.results],
      }));
      setNextPage(response.next);
    } catch (error) {
      toast.error(
        t('cargo.errorLoadingMore') || 'Error loading additional results'
      );
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

    // Remove any undefined or empty string values to reduce payload size
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
    );

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
    setFilterParams(cleanedFilters);
  };

  // Reset all filters
  const clearFilters = () => {
    setFilterParams({});
    setActiveFilters([]);
    toast.info(t('common.filtersReset') || 'Filters reset');
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
      toast.success(
        t('notifications.notificationsEnabled') || 'Notifications enabled'
      );
      setShowNotificationDialog(false);
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      toast.error(
        t('notifications.enableNotificationsError') ||
          'Failed to enable notifications'
      );
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

  const openTelegramProfile = (username: any) => {
    if (!username) {
      console.error('Invalid Telegram username');
      return;
    }

    // Create proper telegram URL
    const telegramUrl = `https://t.me/${username}`;

    // Use Telegram's WebApp API to open Telegram links
    if (window.Telegram && window.Telegram.WebApp) {
      // This is the correct method for Telegram Mini Apps
      window.Telegram.WebApp.openTelegramLink(telegramUrl);
    } else {
      // Fallback for when WebApp API isn't available
      console.error('Telegram WebApp API not available');
      window.open(telegramUrl, '_blank');
    }
  };

  // Replace your existing openTelegramMessage function with this:
  const openTelegramMessage = (messageUrl: any) => {
    if (!messageUrl || !messageUrl.includes('t.me/')) {
      console.error('Invalid Telegram message URL:', messageUrl);
      return;
    }

    // Use Telegram's WebApp API to open Telegram links
    if (window.Telegram && window.Telegram.WebApp) {
      // This is the correct method for Telegram Mini Apps
      window.Telegram.WebApp.openTelegramLink(messageUrl);
    } else {
      // Fallback for when WebApp API isn't available
      console.error('Telegram WebApp API not available');
      window.open(messageUrl, '_blank');
    }
  };

  return (
    <div
      className='min-h-screen bg-gradient-to-b from-blue-700 to-blue-600 p-4 pb-20'
      ref={pageRef}
    >
      {/* Добавьте сразу после открывающего div */}
      <style jsx global>{`
        .calendar-container {
          display: flex;
          justify-content: center;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .calendar-container .rdrCalendarWrapper {
          font-size: 12px !important;
          width: 100% !important;
          max-width: 320px !important;
          margin: 0 auto !important;
        }

        .calendar-container .rdrMonth {
          width: 100% !important;
          padding: 0 !important;
        }

        .calendar-container .rdrMonthAndYearWrapper {
          height: 40px !important;
          padding: 0 8px !important;
        }

        .calendar-container .rdrMonthName {
          font-size: 14px !important;
        }

        .calendar-container .rdrWeekDays {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 0 !important;
        }

        .calendar-container .rdrWeekDay {
          font-size: 11px !important;
          padding: 4px 0 !important;
          text-align: center !important;
        }

        .calendar-container .rdrDays {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 2px !important;
        }

        .calendar-container .rdrDay {
          height: 36px !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .calendar-container .rdrDayNumber {
          top: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .calendar-container .rdrDayNumber span {
          font-size: 13px !important;
          line-height: 1 !important;
        }

        .calendar-container .rdrMonthPicker,
        .calendar-container .rdrYearPicker {
          width: 60px !important;
          font-size: 12px !important;
        }

        .calendar-container .rdrNextPrevButton {
          width: 24px !important;
          height: 24px !important;
          margin: 0 4px !important;
        }

        .calendar-container .rdrNextPrevButton i {
          margin: 0 !important;
        }

        /* Мобильная адаптация */
        @media (max-width: 380px) {
          .calendar-container .rdrCalendarWrapper {
            max-width: 280px !important;
          }

          .calendar-container .rdrDay {
            height: 32px !important;
          }

          .calendar-container .rdrDayNumber span {
            font-size: 12px !important;
          }
        }

        /* Планшеты и больше */
        @media (min-width: 768px) {
          .calendar-container .rdrCalendarWrapper {
            max-width: 350px !important;
          }

          .calendar-container .rdrDay {
            height: 40px !important;
          }
        }
      `}</style>
      {/* Search and Filter section */}
      <div className='relative max-w-4xl mx-auto mb-6'>
        <div className='absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl'></div>
        <div className='relative p-4'>
          <h1 className='text-xl font-bold mb-4 text-center text-white'>
            {t('cargo.cargoSearch')}
          </h1>

          <div className='flex items-center gap-2 mb-4'>
            <div className='relative flex-grow'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                type='text'
                placeholder={t('cargo.searchPlaceholder')}
                value={searchTerm}
                onChange={handleSearch}
                className='pl-10 pr-4 py-6 border-0 shadow-lg focus-visible:ring-2 focus-visible:ring-yellow-500'
              />
            </div>
            <Button
              variant='default'
              size='lg'
              className='bg-yellow-400 text-blue-900 hover:bg-yellow-500 whitespace-nowrap shadow-lg'
              onClick={() => setIsFilterModalOpen(true)}
            >
              <Filter className='h-4 w-4 mr-2' />
              {t('common.filter')}
            </Button>
          </div>

          {/* Active filters display */}
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white/10 rounded-lg p-3 backdrop-blur-sm flex flex-wrap items-center gap-2'
            >
              <span className='text-sm font-medium text-white'>
                {t('cargo.activeFilters')}:
              </span>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant='secondary'
                  className='bg-blue-800/70 text-white border border-blue-400'
                >
                  {filter}
                </Badge>
              ))}
              <Button
                variant='ghost'
                size='sm'
                className='ml-auto h-7 text-red-300 hover:text-red-100 hover:bg-red-500/20'
                onClick={clearFilters}
              >
                <X className='h-4 w-4 mr-1' /> {t('common.clear')}
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filterParams}
      />

      {/* Loading state */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center h-64 text-white'>
          <Loader2 className='h-12 w-12 animate-spin mb-4' />
          <p className='text-lg animate-pulse'>{t('common.loading')}</p>
        </div>
      ) : (
        <div className='space-y-4 mb-20 max-w-4xl mx-auto'>
          {/* Radius search notice */}
          {filterParams.radius &&
            (filterParams.loading_location_id ||
              filterParams.unloading_location_id) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white/10 p-3 rounded-lg mb-2 text-sm backdrop-blur-sm border border-blue-400/30'
              >
                <Badge
                  variant='secondary'
                  className='bg-blue-800/70 text-white border border-blue-400 mr-2'
                >
                  {t('cargo.radiusSearch')} {filterParams.radius}
                </Badge>
                {filterParams.loading_location_id && (
                  <span className='text-white'>
                    {t('cargo.kmFromLoadingPoint')}
                  </span>
                )}
                {filterParams.loading_location_id &&
                  filterParams.unloading_location_id && (
                    <span className='text-white mx-1'>{t('cargo.and')}</span>
                  )}
                {filterParams.unloading_location_id && (
                  <span className='text-white'>
                    {t('cargo.kmFromUnloadingPoint')}
                  </span>
                )}
              </motion.div>
            )}

          {/* Cargo cards */}
          {cargos.results && cargos.results.length > 0 ? (
            <>
              {cargos.results.map((cargo, index) => (
                <motion.div
                  key={cargo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className='bg-white overflow-hidden hover:shadow-lg transition-all'>
                    <CardContent className='p-0'>
                      {/* Card header with badges */}
                      <div className='bg-gray-50 border-b px-4 py-3 flex justify-between items-start'>
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
                          <Badge
                            variant='outline'
                            className='border-blue-200 text-blue-700'
                          >
                            {t(`cargo.${cargo.vehicle_type}`)}
                          </Badge>
                        </div>
                        <div className='flex items-center'>
                          {cargo.owner && cargo.owner.rating && (
                            <>
                              <span className='font-bold mr-1 text-yellow-600'>
                                {cargo.owner.rating}
                              </span>
                              <div className='flex'>
                                {renderStars(cargo.owner.rating)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Card main content */}
                      <div className='p-4'>
                        <div className='flex justify-between items-center mb-3'>
                          <span className='font-bold text-lg'>
                            {cargo.loading_point} - {cargo.unloading_point}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {formatDate(cargo.created_at)}
                          </span>
                        </div>

                        <div className='grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-sm'>
                          <div className='flex items-center'>
                            <TruckIcon className='h-4 w-4 mr-1 text-blue-600' />
                            <span className='text-gray-700'>{cargo.title}</span>
                          </div>
                          <div className='flex items-center'>
                            <svg
                              className='h-4 w-4 mr-1 text-blue-600'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M12 2V6M12 18V22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93M2 12H6M18 12H22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                            <span className='text-gray-700'>
                              {cargo.weight} {t('common.ton')}
                              {cargo.volume ? ` / ${cargo.volume} m³` : ''}
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <MapPinIcon className='h-4 w-4 mr-1 text-blue-600' />
                            <span className='text-gray-700'>
                              {getVehicleTypeLabel(cargo.vehicle_type)}
                            </span>
                          </div>
                          <div className='flex items-center'>
                            <CalendarIcon className='h-4 w-4 mr-1 text-blue-600' />
                            <span className='text-gray-700'>
                              {new Date(
                                cargo.loading_date
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className='mb-3 py-2 px-3 bg-gray-50 rounded-md'>
                          <div className='flex items-center'>
                            <CreditCardIcon className='h-4 w-4 mr-1 text-blue-600' />
                            <span className='font-semibold text-gray-900'>
                              {cargo.price
                                ? `${cargo.price} $`
                                : t('cargo.negotiablePrice')}
                            </span>
                            <Badge
                              variant='outline'
                              className='ml-2 border-blue-200 text-blue-700 px-2'
                            >
                              {t(`cargo.${cargo.payment_method}`)}
                            </Badge>
                          </div>
                        </div>

                        {/* Expanded details section */}
                        <AnimatePresence>
                          {expandedOrder === cargo.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className='mt-4 text-sm space-y-2 bg-gray-50 p-3 rounded-md'
                            >
                              {cargo.description && (
                                <p className='flex'>
                                  <span className='font-medium w-24'>
                                    {t('cargo.description')}:
                                  </span>
                                  <span className='text-gray-700'>
                                    {cargo.description}
                                  </span>
                                </p>
                              )}
                              {cargo.volume && (
                                <p className='flex'>
                                  <span className='font-medium w-24'>
                                    {t('cargo.volume')}:
                                  </span>
                                  <span className='text-gray-700'>
                                    {cargo.volume} m³
                                  </span>
                                </p>
                              )}
                              <p className='flex'>
                                <span className='font-medium w-24'>
                                  {t('cargo.loadingDate')}:
                                </span>
                                <span className='text-gray-700'>
                                  {new Date(
                                    cargo.loading_date
                                  ).toLocaleDateString()}
                                </span>
                              </p>
                              <p className='flex'>
                                <span className='font-medium w-24'>
                                  {t('cargo.from')}:
                                </span>
                                <span className='text-gray-700'>
                                  {cargo.owner?.company_name ||
                                    cargo.owner?.full_name}
                                </span>
                              </p>
                              {cargo.owner && cargo.owner.username && (
                                <div className='flex justify-end mt-2'>
                                  <a
                                    href='#'
                                    onClick={(e) => {
                                      e.preventDefault(); // This is crucial
                                      openTelegramProfile(cargo.owner.username);
                                      return false; // Extra security to prevent default
                                    }}
                                    className='inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors'
                                  >
                                    <svg
                                      className='h-4 w-4 mr-1.5'
                                      viewBox='0 0 24 24'
                                      fill='currentColor'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.36 15.33c-.31 0-.3-.13-.62-.42l-1.8-1.73 4.14-2.57-4.89-2.96 1.52-1.55c.17-.18.38-.29.91-.12l6.89 2.96c.43.23.45.3.46.48.01.18-.02.25-.44.49l-5.46 4.6c-.21.18-.35.31-.71.31z' />
                                    </svg>
                                    {t('cargo.contactViatelegram')}
                                  </a>
                                </div>
                              )}
                              {/* Telegram Source Message */}
                              {/* Telegram Source Message */}
                              {cargo?.source_id && (
                                <div className='mt-4'>
                                  <h3 className='font-semibold text-blue-800 mb-3 flex items-center'>
                                    <svg
                                      className='h-4 w-4 mr-2'
                                      viewBox='0 0 24 24'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.36 15.33c-.31 0-.3-.13-.62-.42l-1.8-1.73 4.14-2.57-4.89-2.96 1.52-1.55c.17-.18.38-.29.91-.12l6.89 2.96c.43.23.45.3.46.48.01.18-.02.25-.44.49l-5.46 4.6c-.21.18-.35.31-.71.31z'
                                        fill='#2AABEE'
                                      />
                                    </svg>
                                    {t('cargo.originalMessage')}
                                  </h3>
                                  <div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
                                    {/* Telegram message header */}
                                    <div className='bg-[#f5f5f5] p-3 flex items-center border-b border-gray-200'>
                                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#2AABEE] to-[#1e88e5] flex items-center justify-center text-white mr-3'>
                                        <svg
                                          className='h-6 w-6'
                                          viewBox='0 0 24 24'
                                          fill='currentColor'
                                        >
                                          <path d='M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z' />
                                        </svg>
                                      </div>
                                      <div className='flex-1'>
                                        <div className='font-medium text-[#212121]'>
                                          {t('cargo.telegramChannel')}
                                        </div>
                                        <div className='text-xs text-gray-500'>
                                          {new Date(
                                            cargo?.created_at
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                      <Badge
                                        variant='secondary'
                                        className='bg-[#2AABEE]/10 text-[#2AABEE] border-0'
                                      >
                                        Telegram
                                      </Badge>
                                    </div>
                                    {/* Telegram message content */}
                                    <div className='p-4'>
                                      <div className='whitespace-pre-line text-[#212121] mb-2'>
                                        {/* Format the cargo details as a Telegram message */}
                                        {`🚛 Груз: ${cargo?.title}
📦 ${cargo?.description ? `Описание: ${cargo?.description}` : ''}
📍 Откуда: ${cargo?.loading_point}
📍 Куда: ${cargo?.unloading_point}
📅 Дата погрузки: ${new Date(cargo?.loading_date).toLocaleDateString()}
🚚 Тип ТС: ${t(`cargo.${cargo?.vehicle_type}`)}
⚖️ Вес: ${cargo?.weight} ${t('common.ton')}${
                                          cargo?.volume
                                            ? `, Объём: ${cargo?.volume} м³`
                                            : ''
                                        }
💰 Цена: ${cargo?.price ? `${cargo?.price} $` : t('cargo.negotiablePrice')}
💳 Оплата: ${t(`cargo.${cargo?.payment_method}`)}`}
                                      </div>
                                      {/* Forward link to original message */}
                                      <a
                                        href='#'
                                        onClick={(e) => {
                                          e.preventDefault();
                                          openTelegramMessage(cargo?.source_id);
                                          return false;
                                        }}
                                        className='flex items-center justify-center mt-3 text-[#2AABEE] text-sm font-medium hover:underline'
                                      >
                                        <ExternalLink className='h-4 w-4 mr-1.5' />
                                        {t('cargo.viewOriginalMessage')}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action buttons */}
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
                                ? 'text-red-500 hover:text-red-600 border-red-200'
                                : ''
                            }`}
                            onClick={() => handleFavoriteToggle(cargo)}
                          >
                            <Heart
                              className={`h-4 w-4 mr-1 ${
                                favorites.includes(Number(cargo.id))
                                  ? 'fill-red-500'
                                  : ''
                              }`}
                            />
                          </Button>
                          {cargo.owner && cargo.owner.username && (
                            <a
                              href='#'
                              onClick={(e) => {
                                e.preventDefault();
                                openTelegramProfile(cargo.owner.username);
                                return false;
                              }}
                              className='flex-1 ml-1 mr-1'
                            >
                              <Button
                                variant='outline'
                                size='sm'
                                className='flex-1 ml-1 mr-1 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50'
                              >
                                <svg
                                  className='h-4 w-4 mr-1'
                                  viewBox='0 0 24 24'
                                  fill='currentColor'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.36 15.33c-.31 0-.3-.13-.62-.42l-1.8-1.73 4.14-2.57-4.89-2.96 1.52-1.55c.17-.18.38-.29.91-.12l6.89 2.96c.43.23.45.3.46.48.01.18-.02.25-.44.49l-5.46 4.6c-.21.18-.35.31-.71.31z' />
                                </svg>
                              </Button>
                            </a>
                          )}
                          <Button
                            variant='outline'
                            size='sm'
                            className='ml-1 flex-none'
                            onClick={() => {
                              const fullText = `
🚛 Груз: ${cargo.title}
📦 Описание: ${cargo.description}

📍 Откуда: ${cargo.loading_point}${
                                cargo.loading_location
                                  ? ' (' + cargo.loading_location + ')'
                                  : ''
                              }
📍 Куда: ${cargo.unloading_point}${
                                cargo.unloading_location
                                  ? ' (' + cargo.unloading_location + ')'
                                  : ''
                              }
📅 Дата погрузки: ${cargo.loading_date}
🚚 Тип ТС: ${cargo.vehicle_type}

⚖️ Вес: ${cargo.weight} т${
                                cargo.volume
                                  ? ', Объём: ' + cargo.volume + ' м³'
                                  : ''
                              }
💰 Цена: ${cargo.price ? cargo.price + ' сум' : 'Не указана'}
💳 Оплата: ${cargo.payment_method}

👤 Владелец: ${
                                cargo.owner.company_name
                                  ? cargo.owner.company_name + ' / '
                                  : ''
                              }${cargo.owner.full_name}
${cargo.owner.is_verified ? '✅ Верифицирован' : ''}
${cargo.owner.rating !== undefined ? '⭐️ Рейтинг: ' + cargo.owner.rating : ''}
${
  cargo.owner.telegram_id
    ? '📱 Telegram: tg://user?id=' + cargo.owner.telegram_id
    : ''
}

📅 Создано: ${new Date(cargo.created_at).toLocaleDateString()}
🔖 Статус: ${cargo.status}
    `.trim();

                              navigator.clipboard.writeText(fullText);
                              toast.success(t('home.copiedToClipboard'));
                            }}
                          >
                            <CopyIcon className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Load more button */}
              {nextPage && (
                <div className='flex justify-center mt-4'>
                  <Button
                    onClick={loadMoreResults}
                    disabled={isMoreLoading}
                    variant='outline'
                    className='bg-white hover:bg-gray-50'
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
            <div className='bg-white/10 p-8 rounded-lg text-center text-white backdrop-blur-sm border border-white/20'>
              <div className='mb-4 p-4 bg-white/10 rounded-full inline-flex'>
                <Search className='h-10 w-10 text-white/70' />
              </div>
              <h3 className='text-xl font-bold mb-2'>{t('cargo.noCargos')}</h3>
              <p className='text-blue-100 max-w-md mx-auto'>
                {t('cargo.noMatchingCargos')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Notification dialog */}
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
              <span className='font-semibold block mt-2'>
                {currentCargo.loading_point} - {currentCargo.unloading_point}
              </span>
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
              <Bell className='h-4 w-4 mr-2' />
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
}
