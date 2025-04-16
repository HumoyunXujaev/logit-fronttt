'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  FileIcon,
  Edit2Icon,
  Trash2Icon,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  X,
  Search,
  TruckIcon,
} from 'lucide-react';
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Car } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import AssignedCargosSection from '../components/AssignedCargo';
import { useTranslation } from '@/contexts/i18n';
import { cn } from '@/lib/utils';

interface VehicleResponse {
  results: Vehicle[];
}

interface CarrierRequestResponse {
  results: CarrierRequest[];
}

interface Vehicle {
  id: string;
  registration_number: string;
  body_type: string;
  loading_type: string;
  capacity: number;
  volume: number;
  length: number;
  width: number;
  height: number;
  registration_country: string;
  adr: boolean;
  dozvol: boolean;
  tir: boolean;
  license_number?: string;
  is_active: boolean;
  is_verified: boolean;
  documents: VehicleDocument[];
}

interface VehicleDocument {
  id: string;
  type: string;
  title: string;
  file: string;
  expiry_date?: string;
  verified: boolean;
}

interface CarrierRequest {
  id: string;
  loading_point: string;
  unloading_point: string;
  ready_date: string;
  vehicle: any;
  vehicle_count: number;
  price_expectation?: number;
  payment_terms?: string;
  notes?: string;
  status:
    | 'pending'
    | 'assigned'
    | 'accepted'
    | 'rejected'
    | 'completed'
    | 'cancelled';
}

interface Location {
  id: number;
  name: string;
  level: number;
  parent_name?: string;
  country_name?: string;
  full_name?: string;
}

// Form interfaces
interface VehicleFormData {
  id: string;
  registration_number: string;
  body_type: string;
  loading_type: string;
  capacity: number;
  volume: number;
  length: number;
  width: number;
  height: number;
  registration_country: string;
  adr: boolean;
  dozvol: boolean;
  tir: boolean;
  license_number?: string;
}

interface CarrierRequestForm {
  loading_point: string;
  unloading_point: string;
  loading_location?: string;
  unloading_location?: string;
  ready_date: string;
  vehicle: string;
  vehicle_count: number;
  price_expectation?: number;
  payment_terms: string;
  notes: string;
}

interface DocumentFormData {
  file: File;
  type:
    | 'tech_passport'
    | 'license'
    | 'insurance'
    | 'adr_cert'
    | 'dozvol'
    | 'tir'
    | 'other';
  title: string;
  expiry_date?: string;
}

// Constants
const bodyTypes = [
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

const countries = [
  { value: 'UZ', label: 'Узбекистан' },
  { value: 'RU', label: 'Россия' },
  { value: 'KZ', label: 'Казахстан' },
];

const documentTypes = [
  { value: 'tech_passport', label: 'Технический паспорт', required: true },
  { value: 'license', label: 'Водительские права', required: false },
  { value: 'insurance', label: 'Страховка', required: true },
  { value: 'adr_cert', label: 'ADR сертификат', required: false },
  { value: 'dozvol', label: 'DOZVOL', required: false },
  { value: 'tir', label: 'TIR', required: false },
  { value: 'other', label: 'Другое', required: false },
] as const;

// Initial form states
const initialVehicleForm: VehicleFormData = {
  id: '',
  registration_number: '',
  body_type: '',
  loading_type: '',
  capacity: 0,
  volume: 0,
  length: 0,
  width: 0,
  height: 0,
  registration_country: '',
  adr: false,
  dozvol: false,
  tir: false,
  license_number: '',
};

const initialCarrierRequestForm: CarrierRequestForm = {
  loading_point: '',
  unloading_point: '',
  loading_location: '',
  unloading_location: '',
  ready_date: '',
  vehicle: '',
  vehicle_count: 1,
  price_expectation: undefined,
  payment_terms: '',
  notes: '',
};

// Enhanced LocationSelector component
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
      id: location.id.toString(),
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
        <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70' />
        <input
          ref={inputRef}
          type='text'
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setOpen(true)}
          className={cn(
            'w-full h-10 px-4 py-2 pl-10 pr-10 rounded-md border transition-all duration-200',
            'bg-background text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            error
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-input hover:border-primary/50',
            value.name && searchQuery === '' ? 'text-foreground' : ''
          )}
          aria-expanded={open}
        />
        {/* Show selected value */}
        {value.name && searchQuery === '' && (
          <div className='absolute left-10 right-10 top-0 h-full flex items-center text-sm'>
            <span className='truncate max-w-[calc(100%-20px)] text-foreground font-medium'>
              {value.name}
            </span>
          </div>
        )}
        {/* Clear button */}
        {value.name && searchQuery === '' && (
          <button
            type='button'
            onClick={clearSelection}
            className='absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-foreground group-hover:opacity-100 opacity-70 transition-opacity'
            aria-label='Clear selection'
          >
            <X className='h-4 w-4' />
          </button>
        )}
        {/* Search icon */}
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/70' />
      </div>
      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className='absolute z-20 w-full mt-1 bg-background rounded-md border shadow-md'
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
                        <div className='flex items-center gap-1'>
                          <MapPin className='h-3 w-3 text-primary shrink-0' />
                          <p className='text-sm font-medium'>
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
                        </div>
                        {location.full_name && (
                          <p className='text-xs text-muted-foreground pl-4'>
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

// Main component
const MyVehiclesPage = () => {
  const [vehicles, setVehicles] = useState<VehicleResponse>({ results: [] });
  const [carrierRequests, setCarrierRequests] =
    useState<CarrierRequestResponse>({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [expandedVehicle, setExpandedVehicle] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
  const [requestForm, setRequestForm] = useState(initialCarrierRequestForm);
  const [documents, setDocuments] = useState<DocumentFormData[]>([]);
  const { userState } = useUser();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    fetchVehicles();
    fetchCarrierRequests();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await api.getVehicles();
      setVehicles(response);
    } catch (error) {
      toast.error(t('vehicle.fetchVehiclesError'));
      console.error('Fetch vehicles error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarrierRequests = async () => {
    try {
      const response = await api.get('/cargo/carrier-requests/');
      setCarrierRequests(response);
    } catch (error) {
      toast.error(t('vehicle.fetchRequestsError'));
      console.error('Fetch carrier requests error:', error);
    }
  };

  const handleVehicleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (selectedVehicle) {
        // Check for required documents
        const requiredDocs = documentTypes.filter((dt) => dt.required);
        const missingDocs = requiredDocs.filter(
          (dt) => !documents.some((d) => d.type === dt.value)
        );
        if (missingDocs.length > 0) {
          toast.error(
            `${t('vehicle.requiredDocuments')}: ${missingDocs
              .map((d) => t(`vehicle.documentTypes.${d.value}`))
              .join(', ')}`
          );
          return;
        }

        const vehicleResponse = await api.updateVehicle(
          vehicleForm.id,
          vehicleForm
        );
        const vehicleId = vehicleResponse?.id;

        // Upload documents
        const documentsUploaded = await handleDocumentUpload(
          vehicleForm.id,
          documents
        );
        if (!documentsUploaded) {
          throw new Error(t('vehicle.documentsUploadFailed'));
        }
      } else {
        await api.createVehicle(vehicleForm);
      }

      toast.success(t('vehicle.vehicleAddedSuccess'));
      setIsAddingVehicle(false);
      setVehicleForm(initialVehicleForm);
      setDocuments([]);
      fetchVehicles();
    } catch (error) {
      toast.error(t('vehicle.vehicleAddError'));
      console.error('Add vehicle error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/cargo/carrier-requests/', requestForm);
      toast.success(t('vehicle.requestCreatedSuccess'));
      setIsAddingRequest(false);
      setRequestForm(initialCarrierRequestForm);
      fetchCarrierRequests();
    } catch (error) {
      toast.error(t('vehicle.requestCreateError'));
      console.error('Add request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentUpload = async (
    vehicleId: string,
    documents: DocumentFormData[]
  ) => {
    try {
      for (const doc of documents) {
        await api.addVehicleDocument(vehicleId, {
          file: doc.file,
          type: doc.type,
          title: doc.title,
          expiry_date: doc.expiry_date,
        });
      }
      return true;
    } catch (error) {
      console.error('Upload documents error:', error);
      return false;
    }
  };

  const handleVehicleInputChange = (name: string, value: any) => {
    setVehicleForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Calculate volume if dimensions are provided
      if (['length', 'width', 'height'].includes(name)) {
        if (updated.length && updated.width && updated.height) {
          updated.volume = updated.length * updated.width * updated.height;
        }
      }
      return updated;
    });
  };

  const handleRequestInputChange = (name: string, value: any) => {
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const renderVehicleForm = () => (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.registrationNumber')}*
        </label>
        <Input
          value={vehicleForm.registration_number}
          onChange={(e: any) =>
            handleVehicleInputChange('registration_number', e.target.value)
          }
          placeholder={t('vehicle.enterPlateNumber')}
          className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
        />
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.registrationCountry')}*
        </label>
        <Select
          value={vehicleForm.registration_country}
          onValueChange={(value: any) =>
            handleVehicleInputChange('registration_country', value)
          }
        >
          <SelectTrigger className='bg-blue-700/50 border-blue-500/50 text-white focus:border-blue-400'>
            <SelectValue placeholder={t('vehicle.selectCountry')} />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {t(`vehicle.countriesList.${country.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.bodyType')}*
        </label>
        <Select
          value={vehicleForm.body_type}
          onValueChange={(value: any) =>
            handleVehicleInputChange('body_type', value)
          }
        >
          <SelectTrigger className='bg-blue-700/50 border-blue-500/50 text-white focus:border-blue-400'>
            <SelectValue placeholder={t('vehicle.selectBodyType')} />
          </SelectTrigger>
          <SelectContent>
            {bodyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {t(`cargo.${type.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.loadingType')}*
        </label>
        <Select
          value={vehicleForm.loading_type}
          onValueChange={(value: any) =>
            handleVehicleInputChange('loading_type', value)
          }
        >
          <SelectTrigger className='bg-blue-700/50 border-blue-500/50 text-white focus:border-blue-400'>
            <SelectValue placeholder={t('vehicle.selectLoadingType')} />
          </SelectTrigger>
          <SelectContent>
            {loadingTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {t(`cargo.${type.value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('vehicle.capacity')}* ({t('common.ton')})
          </label>
          <Input
            type='number'
            value={vehicleForm.capacity || ''}
            onChange={(e: any) =>
              handleVehicleInputChange('capacity', parseFloat(e.target.value))
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>
        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('cargo.volume')} (m³)
          </label>
          <Input
            type='number'
            value={vehicleForm.volume || ''}
            onChange={(e: any) =>
              handleVehicleInputChange('volume', parseFloat(e.target.value))
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('cargo.length')} (m)
          </label>
          <Input
            type='number'
            value={vehicleForm.length || ''}
            onChange={(e: any) =>
              handleVehicleInputChange('length', parseFloat(e.target.value))
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>
        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('cargo.width')} (m)
          </label>
          <Input
            type='number'
            value={vehicleForm.width || ''}
            onChange={(e: any) =>
              handleVehicleInputChange('width', parseFloat(e.target.value))
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>
        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('cargo.height')} (m)
          </label>
          <Input
            type='number'
            value={vehicleForm.height || ''}
            onChange={(e: any) =>
              handleVehicleInputChange('height', parseFloat(e.target.value))
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='adr'
            checked={vehicleForm.adr}
            onCheckedChange={(checked: any) =>
              handleVehicleInputChange('adr', checked)
            }
            className='border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white'
          />
          <label htmlFor='adr' className='text-white'>
            {t('vehicle.adr')}
          </label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='dozvol'
            checked={vehicleForm.dozvol}
            onCheckedChange={(checked: any) =>
              handleVehicleInputChange('dozvol', checked)
            }
            className='border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white'
          />
          <label htmlFor='dozvol' className='text-white'>
            {t('vehicle.dozvol')}
          </label>
        </div>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id='tir'
            checked={vehicleForm.tir}
            onCheckedChange={(checked: any) =>
              handleVehicleInputChange('tir', checked)
            }
            className='border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white'
          />
          <label htmlFor='tir' className='text-white'>
            {t('vehicle.tir')}
          </label>
        </div>
      </div>

      {selectedVehicle ? (
        <div className='space-y-4 mt-4'>
          <h3 className='text-lg font-medium text-white'>
            {t('vehicle.documents')}
          </h3>

          {documentTypes.map((docType) => (
            <div
              key={docType.value}
              className='border border-blue-500/50 rounded-lg p-4 space-y-4 bg-blue-800/30'
            >
              <div className='flex items-center justify-between'>
                <span className='font-medium text-white'>
                  {t(`vehicle.documentTypes.${docType.value}`)}
                  {docType.required && (
                    <span className='text-red-300 ml-1'>*</span>
                  )}
                </span>
              </div>

              <Input
                type='text'
                placeholder={t('vehicle.documentTitle')}
                className='mb-2 bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
                onChange={(e: any) => {
                  const existingDoc = documents.find(
                    (d) => d.type === docType.value
                  );
                  if (existingDoc) {
                    setDocuments((docs) =>
                      docs.map((d) =>
                        d.type === docType.value
                          ? { ...d, title: e.target.value }
                          : d
                      )
                    );
                  }
                }}
              />

              <div className='grid grid-cols-2 gap-4'>
                <Input
                  type='date'
                  placeholder={t('vehicle.expiryDate')}
                  className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
                  onChange={(e: any) => {
                    const existingDoc = documents.find(
                      (d) => d.type === docType.value
                    );
                    if (existingDoc) {
                      setDocuments((docs) =>
                        docs.map((d) =>
                          d.type === docType.value
                            ? { ...d, expiry_date: e.target.value }
                            : d
                        )
                      );
                    }
                  }}
                />

                <div>
                  <input
                    type='file'
                    id={`doc-upload-${docType.value}`}
                    className='hidden'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && docType.value) {
                        const existingDocIndex = documents.findIndex(
                          (d) => d.type === docType.value
                        );
                        const newDoc: DocumentFormData = {
                          file,
                          type: docType.value,
                          title: `${t(
                            `vehicle.documentTypes.${docType.value}`
                          )} - ${file.name}`,
                        };
                        if (existingDocIndex !== -1) {
                          setDocuments((docs) =>
                            docs.map((d, i) =>
                              i === existingDocIndex ? newDoc : d
                            )
                          );
                        } else {
                          setDocuments((docs) => [...docs, newDoc]);
                        }
                      }
                    }}
                  />
                  <Button
                    onClick={() =>
                      document
                        .getElementById(`doc-upload-${docType.value}`)
                        ?.click()
                    }
                    className='w-full bg-blue-700 hover:bg-blue-600 text-white'
                  >
                    {t('vehicle.uploadDocument')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-blue-100 mt-4'>{t('vehicle.documentsLater')}</p>
      )}
    </div>
  );

  const renderCarrierRequestForm = () => (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('cargo.loadingPoint')}*
        </label>
        <LocationSelector
          value={{
            id: requestForm.loading_location || '',
            name: requestForm.loading_point || '',
          }}
          onChange={({ id, name }: any) => {
            handleRequestInputChange('loading_location', id);
            handleRequestInputChange('loading_point', name);
          }}
          placeholder={t('cargo.enterCity')}
          error={!requestForm.loading_point}
          errorMessage={t('cargo.requiredField')}
        />
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('cargo.unloadingPoint')}*
        </label>
        <LocationSelector
          value={{
            id: requestForm.unloading_location || '',
            name: requestForm.unloading_point || '',
          }}
          onChange={({ id, name }: any) => {
            handleRequestInputChange('unloading_location', id);
            handleRequestInputChange('unloading_point', name);
          }}
          placeholder={t('cargo.enterCity')}
          error={!requestForm.unloading_point}
          errorMessage={t('cargo.requiredField')}
        />
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.readyDate')}*
        </label>
        <Input
          type='date'
          value={requestForm.ready_date}
          onChange={(e: any) =>
            handleRequestInputChange('ready_date', e.target.value)
          }
          min={new Date().toISOString().split('T')[0]}
          className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
        />
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.vehicle')}*
        </label>
        <Select
          value={requestForm.vehicle}
          onValueChange={(value: any) =>
            handleRequestInputChange('vehicle', value)
          }
        >
          <SelectTrigger className='bg-blue-700/50 border-blue-500/50 text-white focus:border-blue-400'>
            <SelectValue placeholder={t('vehicle.selectVehicle')} />
          </SelectTrigger>
          <SelectContent>
            {vehicles?.results?.map((vehicle: any) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.registration_number} -{' '}
                {t(`cargo.${vehicle.body_type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('vehicle.vehicleCount')}
          </label>
          <Input
            type='number'
            min={1}
            value={requestForm.vehicle_count}
            onChange={(e: any) =>
              handleRequestInputChange(
                'vehicle_count',
                parseInt(e.target.value)
              )
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium mb-2 text-white'>
            {t('vehicle.expectedPrice')}
          </label>
          <Input
            type='number'
            placeholder={t('cargo.enterAmount')}
            value={requestForm.price_expectation || ''}
            onChange={(e: any) =>
              handleRequestInputChange(
                'price_expectation',
                parseFloat(e.target.value)
              )
            }
            className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('cargo.paymentTerms')}
        </label>
        <Select
          value={requestForm.payment_terms || ''}
          onValueChange={(value: any) =>
            handleRequestInputChange('payment_terms', value)
          }
        >
          <SelectTrigger className='bg-blue-700/50 border-blue-500/50 text-white focus:border-blue-400'>
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

      <div className='space-y-2'>
        <label className='block text-sm font-medium mb-2 text-white'>
          {t('vehicle.notes')}
        </label>
        <Input
          placeholder={t('vehicle.additionalInfo')}
          value={requestForm.notes}
          onChange={(e: any) =>
            handleRequestInputChange('notes', e.target.value)
          }
          className='bg-blue-700/50 border-blue-500/50 text-white placeholder:text-blue-300 focus:border-blue-400'
        />
      </div>
    </div>
  );

  const renderVehicleCard = (vehicle: Vehicle) => {
    const isExpanded = expandedVehicle === vehicle.id;

    return (
      <motion.div variants={itemVariants} key={vehicle.id} layout>
        <Card className='mb-4 overflow-hidden border-blue-500/30 bg-white/10 backdrop-blur-sm shadow-lg'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='font-bold text-lg text-white'>
                  {vehicle.registration_number}
                </h3>
                <p className='text-sm text-blue-100'>
                  {t(`cargo.${vehicle.body_type}`)}
                </p>
              </div>
              <div className='flex space-x-2'>
                {vehicle.adr && (
                  <Badge className='bg-yellow-600 hover:bg-yellow-700 text-white'>
                    {t('vehicle.adr')}
                  </Badge>
                )}
                {vehicle.dozvol && (
                  <Badge className='bg-green-600 hover:bg-green-700 text-white'>
                    {t('vehicle.dozvol')}
                  </Badge>
                )}
                {vehicle.tir && (
                  <Badge className='bg-blue-600 hover:bg-blue-700 text-white'>
                    {t('vehicle.tir')}
                  </Badge>
                )}
                <Badge
                  variant={vehicle.is_verified ? 'default' : 'secondary'}
                  className={
                    vehicle.is_verified
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }
                >
                  {vehicle.is_verified
                    ? t('vehicle.verificationStatus.verified')
                    : t('vehicle.verificationStatus.pending')}
                </Badge>
              </div>
            </div>

            <div className='space-y-2 text-sm text-blue-100'>
              <p className='flex items-center'>
                <svg
                  className='h-4 w-4 mr-2 text-blue-300'
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
                {vehicle.capacity} {t('common.ton')} / {vehicle.volume} m³
              </p>
              <p className='flex items-center'>
                <svg
                  className='h-4 w-4 mr-2 text-blue-300'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M21 14H3M21 4H3M21 9H3M21 19H3'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                </svg>
                {t('vehicle.dimensions')}: {vehicle.length}×{vehicle.width}×
                {vehicle.height} m
              </p>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='mt-4 space-y-4'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {vehicle?.documents?.map((doc) => (
                      <div
                        key={doc.id}
                        className='flex items-center space-x-2 bg-blue-900/30 p-2 rounded'
                      >
                        <FileIcon className='h-4 w-4 text-blue-300' />
                        <span className='text-blue-100'>
                          {t(`vehicle.documentTypes.${doc.type}`)}
                        </span>
                        <Badge
                          variant={doc.verified ? 'default' : 'secondary'}
                          className={
                            doc.verified
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-orange-600 hover:bg-orange-700'
                          }
                        >
                          {doc.verified
                            ? t('vehicle.verificationStatus.verified')
                            : t('vehicle.verificationStatus.pending')}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className='space-y-2 text-sm text-blue-100'>
                    <p className='flex items-center'>
                      <svg
                        className='h-4 w-4 mr-2 text-blue-300'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M3 12L5 10M5 10L12 3L19 10M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H14M5 10V20C5 20.5523 5.44772 21 6 21H10M10 21V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V21M10 21H14'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      {t('cargo.loadingType')}:{' '}
                      {t(`cargo.${vehicle.loading_type}`)}
                    </p>

                    <p className='flex items-center'>
                      <svg
                        className='h-4 w-4 mr-2 text-blue-300'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M9 22V12H15V22'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      {t('vehicle.registrationCountry')}:{' '}
                      {t(
                        `vehicle.countriesList.${vehicle.registration_country}`
                      )}
                    </p>

                    {vehicle.license_number && (
                      <p className='flex items-center'>
                        <svg
                          className='h-4 w-4 mr-2 text-blue-300'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M9 12L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                        {t('vehicle.licenseNumber')}: {vehicle.license_number}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex justify-between mt-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() =>
                  setExpandedVehicle(isExpanded ? null : vehicle.id)
                }
                className='text-blue-100 hover:text-white hover:bg-blue-800/50'
              >
                {isExpanded ? (
                  <ChevronUp className='h-4 w-4 mr-1' />
                ) : (
                  <ChevronDown className='h-4 w-4 mr-1' />
                )}
                {isExpanded ? t('vehicle.hide') : t('vehicle.details')}
              </Button>

              <div className='space-x-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSelectedVehicle(vehicle);
                    setVehicleForm({
                      ...vehicle,
                      id: vehicle.id || '',
                      license_number: vehicle.license_number || '',
                    });
                    setIsAddingVehicle(true);
                  }}
                  className='border-blue-300 text-blue-100 hover:bg-blue-800/50 hover:text-white'
                >
                  <Edit2Icon className='h-4 w-4 mr-1' /> {t('vehicle.edit')}
                </Button>

                <Button
                  variant='outline'
                  size='sm'
                  className='border-red-300 text-red-300 hover:bg-red-900/30 hover:text-red-100'
                  onClick={async () => {
                    try {
                      await api.delete(`/vehicles/${vehicle.id}/`);
                      toast.success(t('vehicle.vehicleDeletedSuccess'));
                      fetchVehicles();
                    } catch (error) {
                      toast.error(t('vehicle.vehicleDeleteError'));
                    }
                  }}
                >
                  <Trash2Icon className='h-4 w-4 mr-1' /> {t('vehicle.remove')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCarrierRequestCard = (request: CarrierRequest) => {
    return (
      <motion.div variants={itemVariants} key={request.id}>
        <Card className='mb-4 overflow-hidden border-blue-500/30 bg-white/10 backdrop-blur-sm shadow-lg'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='font-bold text-lg text-white'>
                  {request.loading_point} - {request.unloading_point}
                </h3>
                <p className='text-sm text-blue-100'>
                  {request?.vehicle?.registration_number} -{' '}
                  {t(`cargo.${request.vehicle.body_type}`)}
                </p>
              </div>
              <Badge
                variant={request.status === 'pending' ? 'secondary' : 'outline'}
                className={
                  request.status === 'pending'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'border-blue-300 text-blue-100'
                }
              >
                {request.status === 'pending'
                  ? t('cargo.status.pending')
                  : t('cargo.status.active')}
              </Badge>
            </div>

            <div className='space-y-2 text-sm text-blue-100'>
              <p className='flex items-center'>
                <svg
                  className='h-4 w-4 mr-2 text-blue-300'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                {t('vehicle.readyDate')}:{' '}
                {new Date(request.ready_date).toLocaleDateString()}
              </p>

              <p className='flex items-center'>
                <svg
                  className='h-4 w-4 mr-2 text-blue-300'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M9 20L3 17V7L9 4M9 20L15 17M9 20V4M15 17L21 20V10L15 7M15 17V7M9 10L3 7M9 10L15 7M9 10V4M15 7L21 10'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                {t('vehicle.vehicleCount')}: {request.vehicle_count}
              </p>

              {request.price_expectation && (
                <p className='flex items-center'>
                  <svg
                    className='h-4 w-4 mr-2 text-blue-300'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12 8C10.3431 8 9 9.34315 9 11C9 12.6569 10.3431 14 12 14C13.6569 14 15 15.3431 15 17C15 18.6569 13.6569 20 12 20M12 8C13.6569 8 15 6.65685 15 5C15 3.34315 13.6569 2 12 2M12 8V2M12 20C10.3431 20 9 21.3431 9 23M12 20V23M12 23C13.6569 23 15 21.6569 15 20'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {t('vehicle.expectedPrice')}: {request.price_expectation} ₽
                </p>
              )}

              {request.payment_terms && (
                <p className='flex items-center'>
                  <svg
                    className='h-4 w-4 mr-2 text-blue-300'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M3 7L12 13L21 7'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {t('cargo.paymentTerms')}:{' '}
                  {t(`cargo.${request.payment_terms}`)}
                </p>
              )}

              {request.notes && (
                <p className='flex items-center'>
                  <svg
                    className='h-4 w-4 mr-2 text-blue-300'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8 10H16M8 14H16M9 18H15M14 22H10C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8V16C20 18.8284 20 20.2426 19.1213 21.1213C18.2426 22 16.8284 22 14 22Z'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  {t('vehicle.notes')}: {request.notes}
                </p>
              )}
            </div>

            <div className='flex justify-end mt-4'>
              <Button
                variant='outline'
                size='sm'
                className='border-red-300 text-red-300 hover:bg-red-900/30 hover:text-red-100'
                onClick={async () => {
                  try {
                    await api.delete(`/cargo/carrier-requests/${request.id}/`);
                    toast.success(t('vehicle.requestDeletedSuccess'));
                    fetchCarrierRequests();
                  } catch (error) {
                    toast.error(t('vehicle.requestDeleteError'));
                  }
                }}
              >
                <Trash2Icon className='h-4 w-4 mr-1' /> {t('vehicle.remove')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-800 to-blue-600'>
        <div className='flex flex-col items-center text-white'>
          <Loader2 className='h-12 w-12 animate-spin mb-4' />
          <p className='text-xl animate-pulse'>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 p-4 pb-20'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl md:text-3xl font-bold text-white'>
            {t('vehicle.title')}
          </h1>
        </div>

        <AssignedCargosSection />

        {!isAddingVehicle && !isAddingRequest && (
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='flex flex-col md:flex-row items-center gap-4 my-10 justify-center'
          >
            <motion.div variants={itemVariants}>
              <Button
                className='w-64 h-14 bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400'
                onClick={() => setIsAddingVehicle(true)}
              >
                <Plus className='h-5 w-5 mr-2' />
                {t('vehicle.addVehicle')}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                className='w-64 h-14 bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400'
                onClick={() => setIsAddingRequest(true)}
              >
                <Plus className='h-5 w-5 mr-2' />
                {t('vehicle.addRequest')}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {isAddingVehicle && (
          <Card className='mb-8 shadow-xl border-blue-500/30 bg-blue-900/30 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center mb-4'>
                <TruckIcon className='w-6 h-6 text-blue-300 mr-2' />
                <h2 className='text-xl font-semibold text-white'>
                  {selectedVehicle
                    ? t('vehicle.editVehicle')
                    : t('vehicle.addVehicle')}
                </h2>
              </div>

              {renderVehicleForm()}

              <div className='flex justify-end space-x-4 mt-6'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsAddingVehicle(false);
                    setSelectedVehicle(null);
                    setVehicleForm(initialVehicleForm);
                  }}
                  className='border-blue-300 text-blue-100 hover:bg-blue-800/50 hover:text-white'
                >
                  {t('common.cancel')}
                </Button>

                <Button
                  onClick={handleVehicleSubmit}
                  disabled={isSubmitting}
                  className='bg-blue-500 hover:bg-blue-400 text-white'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      {t('common.saving')}
                    </>
                  ) : (
                    t('common.save')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isAddingRequest && (
          <Card className='mb-8 shadow-xl border-blue-500/30 bg-blue-900/30 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <div className='flex items-center mb-4'>
                <Car className='w-6 h-6 text-blue-300 mr-2' />
                <h2 className='text-xl font-semibold text-white'>
                  {t('vehicle.addRequest')}
                </h2>
              </div>

              {renderCarrierRequestForm()}

              <div className='flex justify-end space-x-4 mt-6'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsAddingRequest(false);
                    setRequestForm(initialCarrierRequestForm);
                  }}
                  className='border-blue-300 text-blue-100 hover:bg-blue-800/50 hover:text-white'
                >
                  {t('common.cancel')}
                </Button>

                <Button
                  onClick={handleRequestSubmit}
                  disabled={isSubmitting}
                  className='bg-blue-500 hover:bg-blue-400 text-white'
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      {t('common.creating')}
                    </>
                  ) : (
                    t('vehicle.create')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {vehicles?.results?.length > 0 && (
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-white mb-4 flex items-center'>
              <TruckIcon className='h-5 w-5 mr-2 text-blue-300' />
              {t('vehicle.myVehicles')}
            </h2>

            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {vehicles?.results?.map(renderVehicleCard)}
            </motion.div>
          </div>
        )}

        {carrierRequests?.results?.length > 0 && (
          <div className='mb-20'>
            <h2 className='text-xl font-semibold text-white mb-4 flex items-center'>
              <Car className='h-5 w-5 mr-2 text-blue-300' />
              {t('vehicle.myRequests')}
            </h2>

            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
            >
              {carrierRequests?.results?.map(renderCarrierRequestCard)}
            </motion.div>
          </div>
        )}
      </div>

      <NavigationMenu userRole='carrier' />
    </div>
  );
};

export default MyVehiclesPage;
