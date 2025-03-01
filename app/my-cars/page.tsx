// app/my-cars/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
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

const initialCarrierRequestForm = {
  loading_point: '',
  unloading_point: '',
  ready_date: '',
  vehicle: '',
  vehicle_count: 1,
  price_expectation: undefined,
  payment_terms: '',
  notes: '',
};

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

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleResponse>({ results: [] });

  // const [vehicles, setVehicles] = useState<Vehicle[]>([]);
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

  // const [documents, setDocuments] = useState<{ type: string; file: File }[]>(
  //   []
  // );

  const { userState } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
    fetchCarrierRequests();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await api.getVehicles();
      setVehicles(response);
      console.log(response, 'res');
    } catch (error) {
      toast.error('Ошибка при загрузке транспорта');
      console.error('Fetch vehicles error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarrierRequests = async () => {
    try {
      const response = await api.get('/cargo/carrier-requests/');
      setCarrierRequests(response);
      console.log(response, 'res');
    } catch (error) {
      toast.error('Ошибка при загрузке заявок');
      console.error('Fetch carrier requests error:', error);
    }
  };

  const handleVehicleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (selectedVehicle) {
        // Check required documents
        const requiredDocs = documentTypes.filter((dt) => dt.required);
        const missingDocs = requiredDocs.filter(
          (dt) => !documents.some((d) => d.type === dt.value)
        );

        if (missingDocs.length > 0) {
          toast.error(
            `Необходимо загрузить следующие документы: ${missingDocs
              .map((d) => d.label)
              .join(', ')}`
          );
          return;
        }
        const vehicleResponse = await api.updateVehicle(
          vehicleForm.id,
          vehicleForm
        );
        console.log(vehicleResponse, 'vehres');
        const vehicleId = vehicleResponse?.id;
        console.log(vehicleResponse, 'vehres');
        console.log(vehicleId, 'id');

        // Upload documents
        const documentsUploaded = await handleDocumentUpload(
          vehicleForm.id,
          documents
        );

        if (!documentsUploaded) {
          throw new Error('Failed to upload documents');
        }

        // Upload documents
        // for (const doc of documents) {
        //   const formData = new FormData();
        //   formData.append('file', doc.file);
        //   formData.append('type', doc.type);
        //   formData.append('vehicle', vehicleId);
        //   const documents = await api.post(
        //     `/vehicles/${vehicleForm.id}/documents/`,
        //     formData
        //   );
        //   console.log(documents, 'documents');
        // }
      } else {
        const vehicleResponse = await api.createVehicle(vehicleForm);
        // Create vehicle
        console.log(vehicleResponse, 'vehres');
        // const vehicleId = vehicleResponse?.id;
        // console.log(vehicleResponse, 'vehres');
        // console.log(vehicleId, 'id');

        // Upload documents
        // const documentsUploaded = await handleDocumentUpload(
        //   vehicleId,
        //   documents
        // );

        // if (!documentsUploaded) {
        //   throw new Error('Failed to upload documents');
        // }

        // // Upload documents
        // for (const doc of documents) {
        //   const formData = new FormData();
        //   formData.append('file', doc.file);
        //   formData.append('type', doc.type);
        //   formData.append('vehicle', vehicleId);
        //   const documents = await api.post(
        //     `/vehicles/${vehicleId}/documents/`,
        //     formData
        //   );
        //   console.log(documents, 'documents');
        // }

        // .then((res) => console.log(res))
        // .catch((err) => console.log(err, 'document errror'));
      }

      toast.success('Транспорт успешно добавлен');
      setIsAddingVehicle(false);
      setVehicleForm(initialVehicleForm);
      setDocuments([]);
      fetchVehicles();
    } catch (error) {
      toast.error('Ошибка при добавлении транспорта');
      console.error('Add vehicle error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/cargo/carrier-requests/', requestForm);
      toast.success('Заявка успешно создана');
      setIsAddingRequest(false);
      setRequestForm(initialCarrierRequestForm);
      fetchCarrierRequests();
    } catch (error) {
      toast.error('Ошибка при создании заявки');
      console.error('Add request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update document upload handler
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

  // const handleDocumentUpload = (file: File, type: string) => {
  //   setDocuments((prev) => [...prev, { file, type }]);
  // };

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

  const renderVehicleForm = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>Гос. номер*</label>
        <Input
          value={vehicleForm.registration_number}
          onChange={(e) =>
            handleVehicleInputChange('registration_number', e.target.value)
          }
          placeholder='Введите гос. номер'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Страна регистрации*
        </label>
        <Select
          value={vehicleForm.registration_country}
          onValueChange={(value) =>
            handleVehicleInputChange('registration_country', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Выберите страну' />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Тип кузова*</label>
        <Select
          value={vehicleForm.body_type}
          onValueChange={(value) =>
            handleVehicleInputChange('body_type', value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Выберите тип кузова' />
          </SelectTrigger>
          <SelectContent>
            {bodyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>Тип погрузки*</label>
        <Select
          value={vehicleForm.loading_type}
          onValueChange={(value) =>
            handleVehicleInputChange('loading_type', value)
          }
        >
          <SelectTrigger>
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
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Грузоподъемность (тонн)*
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
          <label className='block text-sm font-medium mb-2'>Объем (м³)</label>
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
          <label className='block text-sm font-medium mb-2'>Длина (м)</label>
          <Input
            type='number'
            value={vehicleForm.length || ''}
            onChange={(e) =>
              handleVehicleInputChange('length', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Ширина (м)</label>
          <Input
            type='number'
            value={vehicleForm.width || ''}
            onChange={(e) =>
              handleVehicleInputChange('width', parseFloat(e.target.value))
            }
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-2'>Высота (м)</label>
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
            ADR
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
            DOZVOL
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
            TIR
          </label>
        </div>
      </div>

      {selectedVehicle ? (
        <div>
          <label className='block text-sm font-medium mb-2'>Документы</label>
          {documentTypes.map((docType) => (
            <div
              key={docType.value}
              className='border rounded-lg p-4 space-y-4'
            >
              <div className='flex items-center justify-between'>
                <span className='font-medium'>
                  {docType.label}
                  {docType.required && (
                    <span className='text-red-500 ml-1'>*</span>
                  )}
                </span>
              </div>
              <Input
                type='text'
                placeholder='Название документа'
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
                  placeholder='Срок действия'
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
                      title: `${docType.label} - ${file.name}`,
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
                  // allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                  maxSize={5 * 1024 * 1024}
                  label={`Загрузить ${docType.label}`}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // </div>

        <p>u will add the documents later</p>
      )}
    </div>
  );

  const renderCarrierRequestForm = () => (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          Пункт погрузки*
        </label>
        <Input
          placeholder='Откуда'
          value={requestForm.loading_point}
          onChange={(e) =>
            handleRequestInputChange('loading_point', e.target.value)
          }
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Пункт выгрузки*
        </label>
        <Input
          placeholder='Куда'
          value={requestForm.unloading_point}
          onChange={(e) =>
            handleRequestInputChange('unloading_point', e.target.value)
          }
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Дата готовности*
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
        <label className='block text-sm font-medium mb-2'>Транспорт*</label>
        <Select
          value={requestForm.vehicle}
          onValueChange={(value) => handleRequestInputChange('vehicle', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='Выберите транспорт' />
          </SelectTrigger>
          <SelectContent>
            {vehicles?.results?.map((vehicle: any) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.registration_number} -{' '}
                {bodyTypes.find((t) => t.value === vehicle.body_type)?.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Количество машин
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
            Ожидаемая цена
          </label>
          <Input
            type='number'
            placeholder='Цена'
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
        <label className='block text-sm font-medium mb-2'>Условия оплаты</label>
        <Select
          value={requestForm.payment_terms || ''}
          onValueChange={(value) =>
            handleRequestInputChange('payment_terms', value)
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
        <label className='block text-sm font-medium mb-2'>Примечания</label>
        <Input
          placeholder='Дополнительная информация'
          value={requestForm.notes}
          onChange={(e) => handleRequestInputChange('notes', e.target.value)}
        />
      </div>
    </div>
  );

  const renderVehicleCard = (vehicle: Vehicle) => {
    const isExpanded = expandedVehicle === vehicle.id;

    // console.log(vehicle, 'vehicelrender');
    return (
      <Card key={vehicle.id} className='mb-4'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='font-bold text-lg'>
                {vehicle.registration_number}
              </h3>
              <p className='text-sm text-gray-600'>
                {bodyTypes.find((t) => t.value === vehicle.body_type)?.label}
              </p>
            </div>
            <div className='flex space-x-2'>
              {vehicle.adr && <Badge>ADR</Badge>}
              {vehicle.dozvol && <Badge>DOZVOL</Badge>}
              {vehicle.tir && <Badge>TIR</Badge>}
              <Badge variant={vehicle.is_verified ? 'default' : 'secondary'}>
                {/* <Badge variant={vehicle.is_verified ? 'success' : 'secondary'}> */}
                {vehicle.is_verified ? 'Проверен' : 'На проверке'}
              </Badge>
            </div>
          </div>

          <div className='space-y-2 text-sm'>
            <p>
              {vehicle.capacity} т / {vehicle.volume} м³
            </p>
            <p>
              Габариты: {vehicle.length}x{vehicle.width}x{vehicle.height} м
            </p>
          </div>

          {isExpanded && (
            <div className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {vehicle?.documents?.map((doc) => (
                  <div key={doc.id} className='flex items-center space-x-2'>
                    <FileIcon className='h-4 w-4' />
                    <span>
                      {documentTypes.find((t) => t.value === doc.type)?.label}
                    </span>
                    <Badge variant={doc.verified ? 'default' : 'secondary'}>
                      {doc.verified ? 'Проверен' : 'На проверке'}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className='space-y-2'>
                <p>
                  Тип погрузки:{' '}
                  {
                    loadingTypes.find((t) => t.value === vehicle.loading_type)
                      ?.label
                  }
                </p>
                <p>
                  Страна регистрации:{' '}
                  {
                    countries.find(
                      (c) => c.value === vehicle.registration_country
                    )?.label
                  }
                </p>
                {vehicle.license_number && (
                  <p>Номер лицензии: {vehicle.license_number}</p>
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
              {isExpanded ? 'Скрыть' : 'Подробнее'}
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
                <Edit2Icon className='h-4 w-4 mr-1' />
                Изменить
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='text-red-600'
                onClick={async () => {
                  try {
                    await api.delete(`/vehicles/${vehicle.id}/`);
                    toast.success('Транспорт удален');
                    fetchVehicles();
                  } catch (error) {
                    toast.error('Ошибка при удалении транспорта');
                  }
                }}
              >
                <Trash2Icon className='h-4 w-4 mr-1' />
                Удалить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCarrierRequestCard = (request: CarrierRequest) => {
    console.log(request, 'carriererquest');
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
                {request.vehicle.body_type}
              </p>
            </div>
            <Badge
              variant={request.status === 'pending' ? 'secondary' : 'outline'}
            >
              {request.status === 'pending' ? 'В ожидании' : 'В работе'}
            </Badge>
          </div>

          <div className='space-y-2 text-sm'>
            <p>
              Дата готовности:{' '}
              {new Date(request.ready_date).toLocaleDateString()}
            </p>
            <p>Количество машин: {request.vehicle_count}</p>
            {request.price_expectation && (
              <p>Ожидаемая цена: {request.price_expectation} ₽</p>
            )}
            {request.payment_terms && (
              <p>Условия оплаты: {request.payment_terms}</p>
            )}
            {request.notes && <p>Примечания: {request.notes}</p>}
          </div>

          <div className='flex justify-end mt-4 space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={async () => {
                try {
                  await api.delete(`/cargo/carrier-requests/${request.id}/`);
                  toast.success('Заявка удалена');
                  fetchCarrierRequests();
                } catch (error) {
                  toast.error('Ошибка при удалении заявки');
                }
              }}
            >
              <Trash2Icon className='h-4 w-4 mr-1' />
              Удалить
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
        Мои машины и заявки
      </h1>

      <AssignedCargosSection />

      {!isAddingVehicle && !isAddingRequest && (
        <div className='flex flex-col items-center justify-center space-y-4 mt-10'>
          <Button
            className='w-64 h-12'
            onClick={() => setIsAddingVehicle(true)}
          >
            <Plus className='h-5 w-5 mr-2' /> Добавить машину
          </Button>
          <Button
            className='w-64 h-12'
            onClick={() => setIsAddingRequest(true)}
          >
            <Plus className='h-5 w-5 mr-2' /> Добавить заявку
          </Button>
        </div>
      )}

      {isAddingVehicle && (
        <Card className='mb-8 shadow-lg'>
          <CardContent className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              {selectedVehicle ? 'Редактировать машину' : 'Добавить машину'}
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
                Отмена
              </Button>
              <Button onClick={handleVehicleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isAddingRequest && (
        <Card className='mb-8 shadow-lg'>
          <CardContent className='p-6'>
            <h2 className='text-xl font-semibold mb-4'>Добавить заявку</h2>
            {renderCarrierRequestForm()}
            <div className='flex justify-end space-x-4 mt-6'>
              <Button
                variant='outline'
                onClick={() => {
                  setIsAddingRequest(false);
                  setRequestForm(initialCarrierRequestForm);
                }}
              >
                Отмена
              </Button>
              <Button onClick={handleRequestSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    Создание...
                  </>
                ) : (
                  'Создать'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {vehicles?.results?.length > 0 && (
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-white mb-4'>Мои машины</h2>
          {vehicles?.results?.map(renderVehicleCard)}
        </div>
      )}

      {carrierRequests?.results?.length > 0 && (
        <div className='mb-20'>
          <h2 className='text-xl font-semibold text-white mb-4'>Мои заявки</h2>
          {carrierRequests?.results?.map(renderCarrierRequestCard)}
        </div>
      )}

      <NavigationMenu userRole='carrier' />
    </div>
  );
}
