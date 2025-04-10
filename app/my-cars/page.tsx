'use client';

import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/FileUpload';
import {
  Camera,
  FileIcon,
  Edit2Icon,
  Trash2Icon,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ApiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import AssignedCargosSection from '../components/AssignedCargo';
import { useTranslation } from '@/contexts/i18n';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
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

const initialVehicleForm = {
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

interface Location {
  id: number;
  name: string;
  level: number; // 1 = Country, 2 = Region/State, 3 = City
  parent_name?: string;
  country_name?: string;
  full_name?: string;
}

// const initialCarrierRequestForm = {
//   loading_point: '',
//   unloading_point: '',
//   ready_date: '',
//   vehicle: '',
//   vehicle_count: 1,
//   price_expectation: undefined,
//   payment_terms: '',
//   notes: '',
// };

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

const documentTypes = [
  { value: 'tech_passport', label: 'Технический паспорт', required: true },
  { value: 'license', label: 'Водительские права', required: false },
  { value: 'insurance', label: 'Страховка', required: true },
  { value: 'adr_cert', label: 'ADR сертификат', required: false },
  { value: 'dozvol', label: 'DOZVOL', required: false },
  { value: 'tir', label: 'TIR', required: false },
  { value: 'other', label: 'Другое', required: false },
] as const;

// const documentTypes = [
//   { value: 'tech_passport', label: 'Технический паспорт' },
//   { value: 'driver_license', label: 'Водительские права' },
//   { value: 'insurance', label: 'Страховка' },
//   { value: 'adr_cert', label: 'ADR сертификат' },
//   { value: 'dozvol', label: 'DOZVOL' },
//   { value: 'tir', label: 'TIR' },
// ];

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
        // Проверка обязательных документов
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

        // Загрузка документов
        const documentsUploaded = await handleDocumentUpload(
          vehicleForm.id,
          documents
        );
        if (!documentsUploaded) {
          throw new Error(t('vehicle.documentsUploadFailed'));
        }
      } else {
        const vehicleResponse = await api.createVehicle(vehicleForm);
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
      // Рассчитываем объем, если заданы размеры
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

  const renderVehicleForm = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('vehicle.registrationNumber')}*
        </label>
        <Input
          value={vehicleForm.registration_number}
          onChange={(e) =>
            handleVehicleInputChange('registration_number', e.target.value)
          }
          placeholder={t('vehicle.enterPlateNumber')}
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('vehicle.registrationCountry')}*
        </label>
        <Select
          value={vehicleForm.registration_country}
          onValueChange={(value) =>
            handleVehicleInputChange('registration_country', value)
          }
        >
          <SelectTrigger>
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
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('vehicle.bodyType')}*
        </label>
        <Select
          value={vehicleForm.body_type}
          onValueChange={(value) =>
            handleVehicleInputChange('body_type', value)
          }
        >
          <SelectTrigger>
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
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('vehicle.loadingType')}*
        </label>
        <Select
          value={vehicleForm.loading_type}
          onValueChange={(value) =>
            handleVehicleInputChange('loading_type', value)
          }
        >
          <SelectTrigger>
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
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('vehicle.capacity')}*
          </label>
          <Input
            type='number'
            value={vehicleForm.capacity || ''}
            onChange={(e) =>
              handleVehicleInputChange('capacity', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.volume')}
          </label>
          <Input
            type='number'
            value={vehicleForm.volume || ''}
            onChange={(e) =>
              handleVehicleInputChange('volume', parseFloat(e.target.value))
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
            value={vehicleForm.length || ''}
            onChange={(e) =>
              handleVehicleInputChange('length', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.width')}
          </label>
          <Input
            type='number'
            value={vehicleForm.width || ''}
            onChange={(e) =>
              handleVehicleInputChange('width', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('cargo.height')}
          </label>
          <Input
            type='number'
            value={vehicleForm.height || ''}
            onChange={(e) =>
              handleVehicleInputChange('height', parseFloat(e.target.value))
            }
          />
        </div>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        <div className='flex items-center'>
          <Checkbox
            id='adr'
            checked={vehicleForm.adr}
            onCheckedChange={(checked) =>
              handleVehicleInputChange('adr', checked)
            }
          />
          <label htmlFor='adr' className='ml-2'>
            {t('vehicle.adr')}
          </label>
        </div>
        <div className='flex items-center'>
          <Checkbox
            id='dozvol'
            checked={vehicleForm.dozvol}
            onCheckedChange={(checked) =>
              handleVehicleInputChange('dozvol', checked)
            }
          />
          <label htmlFor='dozvol' className='ml-2'>
            {t('vehicle.dozvol')}
          </label>
        </div>
        <div className='flex items-center'>
          <Checkbox
            id='tir'
            checked={vehicleForm.tir}
            onCheckedChange={(checked) =>
              handleVehicleInputChange('tir', checked)
            }
          />
          <label htmlFor='tir' className='ml-2'>
            {t('vehicle.tir')}
          </label>
        </div>
      </div>
      {selectedVehicle ? (
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('vehicle.documents')}
          </label>
          {documentTypes.map((docType) => (
            <div
              key={docType.value}
              className='border rounded-lg p-4 space-y-4'
            >
              <div className='flex items-center justify-between'>
                <span className='font-medium'>
                  {t(`vehicle.documentTypes.${docType.value}`)}
                  {docType.required && (
                    <span className='text-red-500 ml-1'>*</span>
                  )}
                </span>
              </div>
              <Input
                type='text'
                placeholder={t('vehicle.documentTitle')}
                className='mb-2'
                onChange={(e) => {
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
                  onChange={(e) => {
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
                <FileUpload
                  onUpload={(file: any) => {
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
                  }}
                  maxSize={5 * 1024 * 1024}
                  label={t('vehicle.uploadDocument')}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{t('vehicle.documentsLater')}</p>
      )}
    </div>
  );

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

  //   // Handle click outside to close dropdown
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
  //       id: location.id.toString(),
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
  //         <div className='absolute z-10 w-full mt-1 bg-white rounded-md border shadow-md'>
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

  // Enhanced LocationSelector for vehicle forms
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
    const { t } = useTranslation();

    // Handle click outside to close dropdown
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
    };

    return (
      <div className='relative w-full' ref={containerRef}>
        <div className='relative overflow-hidden rounded-md shadow-sm'>
          {/* Location icon */}
          <div className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/70'>
            <MapPin className='h-4 w-4' />
          </div>

          <input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setOpen(true)}
            className={cn(
              'w-full h-10 rounded-md border pl-10 pr-10 py-2 transition-all duration-100',
              'bg-background text-foreground placeholder:text-muted-foreground/60',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              error
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                : 'border-input hover:border-primary/50',
              value.name && !searchQuery ? 'bg-primary/5' : ''
            )}
            aria-expanded={open}
          />

          {/* Show selected value */}
          {value.name && searchQuery === '' && (
            <div className='absolute left-10 right-8 top-0 h-full flex items-center'>
              <div className='truncate text-sm text-foreground font-medium'>
                {value.name}
              </div>
            </div>
          )}

          {/* Clear button */}
          {value.name && searchQuery === '' && (
            <button
              type='button'
              onClick={clearSelection}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors rounded-full hover:bg-muted p-0.5'
              aria-label='Clear'
            >
              <X className='h-4 w-4' />
            </button>
          )}

          {/* Loading indicator or search icon */}
          {searchQuery && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin text-primary' />
              ) : (
                <Search className='h-4 w-4 text-muted-foreground' />
              )}
            </div>
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className='absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-lg shadow-primary/5 overflow-hidden'
              style={{ maxHeight: '65vh' }}
            >
              <div className='py-1'>
                {isLoading ? (
                  <div className='p-4 flex items-center justify-center'>
                    <Loader2 className='h-5 w-5 animate-spin text-primary mr-2' />
                    <span className='text-sm text-muted-foreground'>
                      {t('common.loading')}
                    </span>
                  </div>
                ) : locations.length === 0 ? (
                  <div className='p-4 text-center'>
                    <p className='text-sm text-muted-foreground'>
                      {searchQuery.length < 2
                        ? t('cargo.enterMinimum2Chars')
                        : t('cargo.nothingFound')}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className='max-h-[350px] px-1'>
                    <div className='py-1'>
                      {locations.map((location) => (
                        <motion.div
                          key={location.id}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => handleSelect(location)}
                          className={cn(
                            'flex items-center gap-2 mx-1 px-3 py-2 rounded-md cursor-pointer group transition-colors',
                            'hover:bg-primary/10',
                            value.id === location.id.toString()
                              ? 'bg-primary/10'
                              : ''
                          )}
                        >
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-1'>
                              <MapPin className='h-3 w-3 text-primary shrink-0' />
                              <p className='text-sm font-medium truncate'>
                                {location.name}
                                {location.level === 3 &&
                                  location.parent_name && (
                                    <span className='text-muted-foreground font-normal'>
                                      {' '}
                                      - {location.parent_name}
                                    </span>
                                  )}
                              </p>
                            </div>
                            {location.country_name && location.level !== 1 && (
                              <p className='text-xs text-muted-foreground truncate pl-4'>
                                {location.country_name}
                              </p>
                            )}
                            {location.full_name && (
                              <p className='text-xs text-muted-foreground truncate pl-4'>
                                {location.full_name}
                              </p>
                            )}
                          </div>
                          {value.id === location.id.toString() && (
                            <Check className='h-4 w-4 text-primary shrink-0' />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        {error && errorMessage && (
          <p className='text-sm text-red-500 mt-1 px-1'>{errorMessage}</p>
        )}
      </div>
    );
  };
  const renderCarrierRequestForm = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
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
      <div>
        <label className='block text-sm font-medium mb-2'>
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
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('vehicle.readyDate')}*
        </label>
        <Input
          type='date'
          value={requestForm.ready_date}
          onChange={(e) =>
            handleRequestInputChange('ready_date', e.target.value)
          }
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('vehicle.vehicle')}*
        </label>
        <Select
          value={requestForm.vehicle}
          onValueChange={(value) => handleRequestInputChange('vehicle', value)}
        >
          <SelectTrigger>
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
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('vehicle.vehicleCount')}
          </label>
          <Input
            type='number'
            min={1}
            value={requestForm.vehicle_count}
            onChange={(e) =>
              handleRequestInputChange(
                'vehicle_count',
                parseInt(e.target.value)
              )
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>
            {t('vehicle.expectedPrice')}
          </label>
          <Input
            type='number'
            placeholder={t('cargo.enterAmount')}
            value={requestForm.price_expectation || ''}
            onChange={(e) =>
              handleRequestInputChange(
                'price_expectation',
                parseFloat(e.target.value)
              )
            }
          />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-2'>
          {t('cargo.paymentTerms')}
        </label>
        <Select
          value={requestForm.payment_terms || ''}
          onValueChange={(value) =>
            handleRequestInputChange('payment_terms', value)
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
          {t('vehicle.notes')}
        </label>
        <Input
          placeholder={t('vehicle.additionalInfo')}
          value={requestForm.notes}
          onChange={(e) => handleRequestInputChange('notes', e.target.value)}
        />
      </div>
    </div>
  );

  const renderVehicleCard = (vehicle: Vehicle) => {
    const isExpanded = expandedVehicle === vehicle.id;
    return (
      <Card key={vehicle.id} className='mb-4'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='font-bold text-lg'>
                {vehicle.registration_number}
              </h3>
              <p className='text-sm text-gray-600'>
                {t(`cargo.${vehicle.body_type}`)}
              </p>
            </div>
            <div className='flex space-x-2'>
              {vehicle.adr && <Badge>{t('vehicle.adr')}</Badge>}
              {vehicle.dozvol && <Badge>{t('vehicle.dozvol')}</Badge>}
              {vehicle.tir && <Badge>{t('vehicle.tir')}</Badge>}
              <Badge variant={vehicle.is_verified ? 'default' : 'secondary'}>
                {vehicle.is_verified
                  ? t('vehicle.verificationStatus.verified')
                  : t('vehicle.verificationStatus.pending')}
              </Badge>
            </div>
          </div>
          <div className='space-y-2 text-sm'>
            <p>
              {vehicle.capacity} {t('common.ton')} / {vehicle.volume} m³
            </p>
            <p>
              {t('vehicle.dimensions')}: {vehicle.length}x{vehicle.width}x
              {vehicle.height} m
            </p>
          </div>
          {isExpanded && (
            <div className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {vehicle?.documents?.map((doc) => (
                  <div key={doc.id} className='flex items-center space-x-2'>
                    <FileIcon className='h-4 w-4' />
                    <span>{t(`vehicle.documentTypes.${doc.type}`)}</span>
                    <Badge variant={doc.verified ? 'default' : 'secondary'}>
                      {doc.verified
                        ? t('vehicle.verificationStatus.verified')
                        : t('vehicle.verificationStatus.pending')}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className='space-y-2'>
                <p>
                  {t('cargo.loadingType')}: {t(`cargo.${vehicle.loading_type}`)}
                </p>
                <p>
                  {t('vehicle.registrationCountry')}:{' '}
                  {t(`vehicle.countriesList.${vehicle.registration_country}`)}
                </p>
                {vehicle.license_number && (
                  <p>
                    {t('vehicle.licenseNumber')}: {vehicle.license_number}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className='flex justify-between mt-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setExpandedVehicle(isExpanded ? null : vehicle.id)}
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
              >
                <Edit2Icon className='h-4 w-4 mr-1' /> {t('vehicle.edit')}
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='text-red-600'
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
    );
  };

  const renderCarrierRequestCard = (request: CarrierRequest) => {
    return (
      <Card key={request.id} className='mb-4'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='font-bold'>
                {request.loading_point} - {request.unloading_point}
              </h3>
              <p className='text-sm text-gray-600'>
                {request?.vehicle?.registration_number} -{' '}
                {t(`cargo.${request.vehicle.body_type}`)}
              </p>
            </div>
            <Badge
              variant={request.status === 'pending' ? 'secondary' : 'outline'}
            >
              {request.status === 'pending'
                ? t('cargo.status.pending')
                : t('cargo.status.active')}
            </Badge>
          </div>
          <div className='space-y-2 text-sm'>
            <p>
              {t('vehicle.readyDate')}:{' '}
              {new Date(request.ready_date).toLocaleDateString()}
            </p>
            <p>
              {t('vehicle.vehicleCount')}: {request.vehicle_count}
            </p>
            {request.price_expectation && (
              <p>
                {t('vehicle.expectedPrice')}: {request.price_expectation} ₽
              </p>
            )}
            {request.payment_terms && (
              <p>
                {t('cargo.paymentTerms')}: {t(`cargo.${request.payment_terms}`)}
              </p>
            )}
            {request.notes && (
              <p>
                {t('vehicle.notes')}: {request.notes}
              </p>
            )}
          </div>
          <div className='flex justify-end mt-4 space-x-2'>
            <Button
              variant='outline'
              size='sm'
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
    );
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-blue-600 p-4 pb-20'>
      <h1 className='text-2xl font-bold text-white text-center mb-6'>
        {t('vehicle.title')}
      </h1>
      <AssignedCargosSection />
      {!isAddingVehicle && !isAddingRequest && (
        <div className='flex flex-col items-center justify-center space-y-4 mt-10'>
          <Button
            className='w-64 h-12'
            onClick={() => setIsAddingVehicle(true)}
          >
            <Plus className='h-5 w-5 mr-2' /> {t('vehicle.addVehicle')}
          </Button>
          <Button
            className='w-64 h-12'
            onClick={() => setIsAddingRequest(true)}
          >
            <Plus className='h-5 w-5 mr-2' /> {t('vehicle.addRequest')}
          </Button>
        </div>
      )}
      {isAddingVehicle && (
        <Card className='mb-8 shadow-lg'>
          <CardContent className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              {selectedVehicle
                ? t('vehicle.editVehicle')
                : t('vehicle.addVehicle')}
            </h2>
            {renderVehicleForm()}
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsAddingVehicle(false);
                  setSelectedVehicle(null);
                  setVehicleForm(initialVehicleForm);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleVehicleSubmit} disabled={isSubmitting}>
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
        <Card className='mb-8 shadow-lg'>
          <CardContent className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              {t('vehicle.addRequest')}
            </h2>
            {renderCarrierRequestForm()}
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsAddingRequest(false);
                  setRequestForm(initialCarrierRequestForm);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={handleRequestSubmit} disabled={isSubmitting}>
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
          <h2 className='text-xl font-semibold text-white mb-4'>
            {t('vehicle.myVehicles')}
          </h2>
          {vehicles?.results?.map(renderVehicleCard)}
        </div>
      )}
      {carrierRequests?.results?.length > 0 && (
        <div className='mb-20'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            {t('vehicle.myRequests')}
          </h2>
          {carrierRequests?.results?.map(renderCarrierRequestCard)}
        </div>
      )}
      <NavigationMenu userRole='carrier' />
    </div>
  );
};

export default MyVehiclesPage;
