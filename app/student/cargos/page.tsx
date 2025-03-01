'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
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
import {
  Loader2,
  Search,
  Filter,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import NavigationMenu from '@/app/components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { string } from 'three/src/nodes/TSL.js';
import Link from 'next/link';

interface CargoResponse {
  results: Cargo[];
}

interface CarrierRequestResponse {
  results: CarrierRequest[];
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
    telegram_id: any;
  };
  weight: number;
  volume?: number;
  loading_point: string;
  unloading_point: string;
  loading_date: string;
  vehicle_type: string;
  payment_method: string;
  price?: number;
  status: string;
  created_at: string;
}

interface CarrierRequest {
  id: string;
  carrier: {
    id: string;
    full_name: string;
    company_name?: string;
    rating: number;
  };
  vehicle: {
    id: string;
    registration_number: string;
    body_type: string;
  };
  loading_point: string;
  unloading_point: string;
  ready_date: string;
  status: string;
}

export default function StudentCargosPage() {
  const [iscarrier, setiscarrier] = useState(false);

  const [cargos, setCargos] = useState<CargoResponse>({ results: [] });
  const [matchingRequests, setMatchingRequests] = useState<CarrierRequest[]>(
    []
  );
  const [allRequests, setAllRequests] = useState<CarrierRequestResponse>({
    results: [],
  });
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [showCargoDetails, setShowCargoDetails] = useState(false);
  const [showMatchingRequests, setShowMatchingRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    vehicle_type: '',
    loading_point: '',
    unloading_point: '',
  });
  const [mycargos, setmycargos] = useState<string[] | null>(null);

  const { userState } = useUser();

  useEffect(() => {
    fetchCargos();
    if (userState.role !== 'student') {
      setiscarrier(true);
    }
  }, []);

  const fetchCargos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cargo/cargos', {
        params: {
          status: 'pending',
          assigned_to: null,
          ...filters,
          search: searchTerm,
        },
      });
      setCargos(response);
      if (typeof window !== 'undefined') {
        const id = localStorage.getItem('telegram_id');
        if (id && cargos) {
          const resalllt = await response.results.filter(
            (res: any) => res.owner?.telegram_id === id
          );
          console.log(resalllt, 'resaalt');
          setmycargos(resalllt.map((c: any) => c.id));
          console.log(mycargos, 'mycargos');
          console.log(id, 'id');
          console.log(cargos, 'cargos');
          console.log(response, 'res');
        }
      }
    } catch (error) {
      toast.error('Ошибка при загрузке грузов');
      console.error('Fetch cargos error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarrierRequests = async (cargoId: string) => {
    try {
      setIsLoadingRequests(true);
      // Get matching carriers
      const matchingResponse = await api.get(
        `/cargo/cargos/${cargoId}/matching_carriers/`
      );
      setMatchingRequests(matchingResponse.data);
      console.log(matchingRequests, 'mareq');

      // Get all available carriers
      const allResponse = await api.get('/cargo/carrier-requests/', {
        params: { status: 'pending', assigned_cargo: null },
      });
      console.log(allResponse, 'allres');
      setAllRequests(allResponse);
    } catch (error) {
      toast.error('Ошибка при загрузке заявок перевозчиков');
      console.error('Fetch carrier requests error:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleAssignCarrier = async (cargoId: string, requestId: string) => {
    try {
      await api.post(`/cargo/cargos/${cargoId}/assign_carrier/`, {
        carrier_request: requestId,
      });
      toast.success('Груз успешно перенаправлен перевозчику');
      setShowMatchingRequests(false);
      fetchCargos();
    } catch (error) {
      toast.error('Ошибка при назначении перевозчика');
      console.error('Assign carrier error:', error);
    }
  };

  const handleCargoClick = async (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setShowCargoDetails(true);
    await fetchCarrierRequests(cargo.id);
  };

  const renderCargoCard = (cargo: Cargo) => (
    <Card
      key={cargo.id}
      className='mb-4 hover:shadow-lg transition-shadow cursor-pointer'
      onClick={() => handleCargoClick(cargo)}
    >
      <CardContent className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <div>
            <h3 className='font-bold text-lg'>{cargo.title}</h3>
            {cargo?.owner && (
              <p className='text-sm text-gray-600'>
                {cargo?.owner?.role === 'cargo-owner'
                  ? 'Грузовладелец'
                  : 'Экспедитор'}
                : {cargo?.owner?.company_name || cargo?.owner?.full_name}
              </p>
            )}
          </div>

          {mycargos?.includes(cargo.id) && <Badge>ЭТО ВАШ ГРУЗ</Badge>}

          <Badge>{cargo.status}</Badge>
          <Badge>Новый</Badge>
        </div>

        <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
          <p>
            Груз: {cargo.weight} т{cargo.volume ? `, ${cargo.volume} м³` : ''}
          </p>
          <p>Тип: {cargo.vehicle_type}</p>
          <p>
            Маршрут: {cargo.loading_point} → {cargo.unloading_point}
          </p>
          <p>
            Дата загрузки: {new Date(cargo.loading_date).toLocaleDateString()}
          </p>
        </div>

        <div className='flex justify-between items-center mt-2'>
          <span className='font-semibold'>
            {cargo.price ? `${cargo.price} ₽` : 'Цена договорная'}
          </span>
          <span className='text-sm text-gray-500'>
            {new Date(cargo.created_at).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  console.log(selectedCargo, 'selectedcargo');
  const renderCargoDetails = () => {
    if (!selectedCargo) return null;

    return (
      <Dialog open={showCargoDetails} onOpenChange={setShowCargoDetails}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Детали груза</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='font-semibold'>Основная информация</h3>
                <p>Название: {selectedCargo.title}</p>
                <p>Описание: {selectedCargo.description}</p>
                <p>Вес: {selectedCargo.weight} т</p>
                {selectedCargo.volume && (
                  <p>Объем: {selectedCargo.volume} м³</p>
                )}
              </div>

              <div>
                <h3 className='font-semibold'>Маршрут</h3>
                <p>Погрузка: {selectedCargo.loading_point}</p>
                <p>Выгрузка: {selectedCargo.unloading_point}</p>
                <p>
                  Дата погрузки:{' '}
                  {new Date(selectedCargo.loading_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className='font-semibold'>Требования</h3>
              <p>Тип транспорта: {selectedCargo.vehicle_type}</p>
              <p>Способ оплаты: {selectedCargo.payment_method}</p>
              {selectedCargo.price && <p>Цена: {selectedCargo.price} ₽</p>}
            </div>

            {(selectedCargo.status === 'pending' ||
              selectedCargo.status === 'manager_approved') && (
              <div className='flex justify-end space-x-2 mt-4'>
                <Button onClick={() => setShowMatchingRequests(true)}>
                  Найти перевозчика
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderMatchingRequests = () => {
    return (
      <Dialog
        open={showMatchingRequests}
        onOpenChange={setShowMatchingRequests}
      >
        <DialogContent className='max-w-4xl'>
          <DialogHeader>
            <DialogTitle>Подходящие перевозчики</DialogTitle>
          </DialogHeader>

          {isLoadingRequests ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin' />
            </div>
          ) : (
            <div className='space-y-4'>
              {matchingRequests?.length > 0 && (
                <div>
                  <h3 className='font-semibold mb-2'>Подходящие заявки</h3>
                  <div className='space-y-2'>
                    {matchingRequests?.map((request: any) => (
                      <Card key={request.id}>
                        <CardContent className='p-4'>
                          <div className='flex justify-between items-start'>
                            <div>
                              <h4 className='font-semibold'>
                                {request.carrier.company_name ||
                                  request.carrier.full_name}
                              </h4>
                              <p className='text-sm'>
                                {request.vehicle.registration_number} -{' '}
                                {request.vehicle.body_type}
                              </p>
                              <p className='text-sm'>
                                {request.loading_point} →{' '}
                                {request.unloading_point}
                              </p>
                            </div>
                            <Button
                              onClick={() =>
                                selectedCargo &&
                                handleAssignCarrier(
                                  selectedCargo.id,
                                  request.id
                                )
                              }
                            >
                              Выбрать
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className='font-semibold mb-2'>Все доступные заявки</h3>
                <div className='space-y-2'>
                  {allRequests?.results?.map((request) => (
                    <Card key={request.id}>
                      <CardContent className='p-4'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <h4 className='font-semibold'>
                              {request.carrier.company_name ||
                                request.carrier.full_name}
                            </h4>
                            <p className='text-sm'>
                              {request.vehicle.registration_number} -{' '}
                              {request.vehicle.body_type}
                            </p>
                            <p className='text-sm'>
                              {request.loading_point} →{' '}
                              {request.unloading_point}
                            </p>
                          </div>
                          <Button
                            variant='outline'
                            onClick={() =>
                              selectedCargo &&
                              handleAssignCarrier(
                                selectedCargo?.id,
                                request?.id
                              )
                            }
                          >
                            Выбрать
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (iscarrier === true) {
    return (
      <div className='min-h-screen bg-gray-100 p-4 flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' /> You don't
        have enough permissions to access this page
        <Link href={'/'}>go to home page</Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-2xl font-bold mb-6'>Доступные грузы</h1>

        <div className='mb-6 space-y-4'>
          <div className='flex gap-4'>
            <Input
              placeholder='Поиск грузов...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-sm'
            />
            <Button onClick={fetchCargos}>
              <Search className='h-4 w-4 mr-2' />
              Поиск
            </Button>
          </div>

          <div className='flex gap-4'>
            <Select
              value={filters.vehicle_type}
              onValueChange={(value) =>
                setFilters((f) => ({ ...f, vehicle_type: value }))
              }
            >
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Тип транспорта' />
              </SelectTrigger>
              <SelectContent>{/* Add vehicle types */}</SelectContent>
            </Select>

            <Button
              variant='outline'
              onClick={() =>
                setFilters({
                  vehicle_type: '',
                  loading_point: '',
                  unloading_point: '',
                })
              }
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>

        <div className='space-y-4'>
          {cargos?.results?.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              Нет доступных грузов
            </div>
          ) : (
            cargos?.results?.map(renderCargoCard)
          )}
        </div>

        {renderCargoDetails()}
        {renderMatchingRequests()}
      </div>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />

      {/* <NavigationMenu userRole={userState.role} /> */}
    </div>
  );
}
