'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  AlertCircle,
  ChevronLeft,
  TruckIcon,
  PackageIcon,
  Calendar,
  CreditCard,
  MapPin,
  Check,
  Info,
  ExternalLink,
  Clock,
  RefreshCw,
  ArrowDown,
  CheckCircle,
} from 'lucide-react';
import NavigationMenu from '@/app/components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslation } from '@/contexts/i18n';
import { useRouter } from 'next/navigation';

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
  const { t } = useTranslation();
  const router = useRouter();

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
          setmycargos(resalllt.map((c: any) => c.id));
        }
      }
    } catch (error) {
      toast.error(t('common.error'));
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

      // Get all available carriers
      const allResponse = await api.get('/cargo/carrier-requests/', {
        params: { status: 'pending', assigned_cargo: null },
      });
      setAllRequests(allResponse);
    } catch (error) {
      toast.error(t('common.error'));
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
      toast.success(t('student.cargos.assignedSuccess'));
      setShowMatchingRequests(false);
      fetchCargos();
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Assign carrier error:', error);
    }
  };

  const handleCargoClick = async (cargo: Cargo) => {
    setSelectedCargo(cargo);
    setShowCargoDetails(true);
    await fetchCarrierRequests(cargo.id);
  };

  const renderCargoCard = (cargo: Cargo) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={cargo.id}
    >
      <Card
        className='mb-4 overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'
        onClick={() => handleCargoClick(cargo)}
      >
        <CardContent className='p-0'>
          {/* Card Header */}
          <div className='flex justify-between items-start p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 rounded-full'>
                <PackageIcon className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <h3 className='font-semibold text-lg text-gray-800'>
                  {cargo.title}
                </h3>
                {cargo?.owner && (
                  <p className='text-sm text-gray-600'>
                    {cargo?.owner?.role === 'cargo-owner'
                      ? t('reviews.userRoles.cargo-owner')
                      : t('reviews.userRoles.logistics-company')}
                    : {cargo?.owner?.company_name || cargo?.owner?.full_name}
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-col items-end gap-1.5'>
              {mycargos?.includes(cargo.id) && (
                <Badge
                  variant='outline'
                  className='bg-blue-100 border-blue-300 text-blue-700'
                >
                  {t('student.cargos.yourCargo')}
                </Badge>
              )}
              <Badge
                variant='outline'
                className='border-amber-300 bg-amber-50 text-amber-700'
              >
                {t(`cargo.status.${cargo.status}`)}
              </Badge>
              <Badge
                variant='outline'
                className='border-green-300 bg-green-50 text-green-700'
              >
                {t('student.cargos.new')}
              </Badge>
            </div>
          </div>

          {/* Card Body */}
          <div className='p-4'>
            <div className='grid grid-cols-2 gap-3 mb-3'>
              <div className='flex items-center text-gray-700'>
                <TruckIcon className='h-4 w-4 mr-2 text-blue-600' />
                <span>
                  {cargo.weight} {t('common.ton')}
                  {cargo.volume ? `, ${cargo.volume} m³` : ''}
                </span>
              </div>
              <div className='flex items-center text-gray-700'>
                <Calendar className='h-4 w-4 mr-2 text-blue-600' />
                <span>{new Date(cargo.loading_date).toLocaleDateString()}</span>
              </div>
              <div className='flex items-center text-gray-700'>
                <MapPin className='h-4 w-4 mr-2 text-blue-600' />
                <span className='truncate'>
                  {cargo.loading_point} → {cargo.unloading_point}
                </span>
              </div>
              <div className='flex items-center text-gray-700'>
                <TruckIcon className='h-4 w-4 mr-2 text-blue-600' />
                <span>{t(`cargo.${cargo.vehicle_type}`)}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
              <div className='font-medium text-blue-700'>
                <CreditCard className='h-4 w-4 inline mr-1.5' />
                {cargo.price ? `${cargo.price} $` : t('cargo.negotiablePrice')}
              </div>
              <span className='text-sm text-gray-500'>
                {new Date(cargo.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderCargoDetails = () => {
    if (!selectedCargo) return null;
    return (
      <Dialog open={showCargoDetails} onOpenChange={setShowCargoDetails}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='flex items-center text-xl'>
              <PackageIcon className='mr-2 h-5 w-5 text-blue-600' />
              {t('cargo.cargoDetails')}
            </DialogTitle>
          </DialogHeader>
          {/* Added max-h-[70vh] and overflow-y-auto to make content scrollable */}
          <div className='max-h-[70vh] overflow-y-auto pr-1'>
            <div className='space-y-6 my-2'>
              {/* Header section */}
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-bold text-gray-800'>
                  {selectedCargo.title}
                </h2>
                <Badge
                  variant='outline'
                  className={`px-2.5 ${
                    selectedCargo.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'bg-green-50 text-green-700 border-green-300'
                  }`}
                >
                  {t(`cargo.status.${selectedCargo.status}`)}
                </Badge>
              </div>

              {/* Main content */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Left column */}
                <div className='space-y-4'>
                  <div className='bg-blue-50 rounded-lg p-4'>
                    <h3 className='font-semibold text-blue-800 mb-3 flex items-center'>
                      <Info className='h-4 w-4 mr-2' />
                      {t('cargo.mainInfo')}
                    </h3>
                    <div className='space-y-2 text-gray-700'>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.name')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.title}
                        </span>
                      </p>
                      {selectedCargo.description && (
                        <p className='flex justify-between'>
                          <span className='text-gray-500'>
                            {t('cargo.description')}:
                          </span>
                          <span className='font-medium'>
                            {selectedCargo.description}
                          </span>
                        </p>
                      )}
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.weight')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.weight} {t('common.ton')}
                        </span>
                      </p>
                      {selectedCargo.volume && (
                        <p className='flex justify-between'>
                          <span className='text-gray-500'>
                            {t('cargo.volume')}:
                          </span>
                          <span className='font-medium'>
                            {selectedCargo.volume} m³
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='bg-blue-50 rounded-lg p-4'>
                    <h3 className='font-semibold text-blue-800 mb-3 flex items-center'>
                      <MapPin className='h-4 w-4 mr-2' />
                      {t('cargo.route')}
                    </h3>
                    <div className='space-y-2 text-gray-700'>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.loadingPoint')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.loading_point}
                        </span>
                      </p>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.unloadingPoint')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.unloading_point}
                        </span>
                      </p>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.loadingDate')}:
                        </span>
                        <span className='font-medium'>
                          {new Date(
                            selectedCargo.loading_date
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className='space-y-4'>
                  <div className='bg-blue-50 rounded-lg p-4'>
                    <h3 className='font-semibold text-blue-800 mb-3 flex items-center'>
                      <TruckIcon className='h-4 w-4 mr-2' />
                      {t('cargo.requirements')}
                    </h3>
                    <div className='space-y-2 text-gray-700'>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.vehicleType')}:
                        </span>
                        <span className='font-medium'>
                          {t(`cargo.${selectedCargo.vehicle_type}`)}
                        </span>
                      </p>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('cargo.paymentMethod')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.payment_method}
                        </span>
                      </p>
                      {selectedCargo.price && (
                        <p className='flex justify-between'>
                          <span className='text-gray-500'>
                            {t('cargo.price')}:
                          </span>
                          <span className='font-medium text-blue-700'>
                            {selectedCargo.price} $
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='bg-blue-50 rounded-lg p-4'>
                    <h3 className='font-semibold text-blue-800 mb-3 flex items-center'>
                      <Info className='h-4 w-4 mr-2' />
                      {t('cargo.from')}
                    </h3>
                    <div className='space-y-2 text-gray-700'>
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('common.name')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.owner?.full_name}
                        </span>
                      </p>
                      {selectedCargo.owner?.company_name && (
                        <p className='flex justify-between'>
                          <span className='text-gray-500'>
                            {t('menu.companyInfo')}:
                          </span>
                          <span className='font-medium'>
                            {selectedCargo.owner.company_name}
                          </span>
                        </p>
                      )}
                      <p className='flex justify-between'>
                        <span className='text-gray-500'>
                          {t('common.role')}:
                        </span>
                        <span className='font-medium'>
                          {selectedCargo.owner?.role === 'cargo-owner'
                            ? t('reviews.userRoles.cargo-owner')
                            : t('reviews.userRoles.logistics-company')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {(selectedCargo.status === 'pending' ||
                selectedCargo.status === 'manager_approved') && (
                <div className='mt-6 flex justify-end'>
                  <Button
                    onClick={() => setShowMatchingRequests(true)}
                    className='bg-blue-600 hover:bg-blue-700 text-white'
                  >
                    <TruckIcon className='h-4 w-4 mr-2' />
                    {t('student.cargos.findCarrier')}
                  </Button>
                </div>
              )}
            </div>
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
            <DialogTitle className='flex items-center text-xl'>
              <TruckIcon className='mr-2 h-5 w-5 text-blue-600' />
              {t('student.cargos.matchingCarriers')}
            </DialogTitle>
          </DialogHeader>

          {isLoadingRequests ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Loader2 className='h-10 w-10 animate-spin text-blue-600 mb-4' />
              <p className='text-blue-800'>{t('common.loading')}</p>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Matching carriers section */}
              {matchingRequests?.length > 0 && (
                <div>
                  <div className='flex items-center mb-4'>
                    <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-2'>
                      <CheckCircle className='h-4 w-4 text-green-600' />
                    </div>
                    <h3 className='font-semibold text-lg text-gray-800'>
                      {t('student.cargos.matchingCarriers')}
                    </h3>
                  </div>

                  <div className='space-y-3'>
                    {matchingRequests?.map((request: any) => (
                      <Card
                        key={request.id}
                        className='border border-green-200 bg-green-50/50'
                      >
                        <CardContent className='p-4'>
                          <div className='flex justify-between items-start'>
                            <div>
                              <h4 className='font-semibold text-gray-800'>
                                {request.carrier.company_name ||
                                  request.carrier.full_name}
                              </h4>
                              <div className='mt-1 space-y-1'>
                                <p className='text-sm flex items-center text-gray-600'>
                                  <TruckIcon className='h-4 w-4 mr-1.5 text-blue-600' />
                                  {request.vehicle.registration_number} -{' '}
                                  {t(`cargo.${request.vehicle.body_type}`)}
                                </p>
                                <p className='text-sm flex items-center text-gray-600'>
                                  <MapPin className='h-4 w-4 mr-1.5 text-blue-600' />
                                  {request.loading_point} →{' '}
                                  {request.unloading_point}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() =>
                                selectedCargo &&
                                handleAssignCarrier(
                                  selectedCargo.id,
                                  request.id
                                )
                              }
                              className='bg-green-600 hover:bg-green-700 text-white'
                            >
                              <Check className='h-4 w-4 mr-1.5' />
                              {t('student.cargos.selectCarrier')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All available carriers section */}
              <div>
                <div className='flex items-center mb-4'>
                  <div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-2'>
                    <TruckIcon className='h-4 w-4 text-blue-600' />
                  </div>
                  <h3 className='font-semibold text-lg text-gray-800'>
                    {t('student.cargos.allAvailableCarriers')}
                  </h3>
                </div>

                <ScrollArea className='h-[50vh] pr-4 -mr-4'>
                  <div className='space-y-3'>
                    {allRequests?.results?.length > 0 ? (
                      allRequests?.results?.map((request) => (
                        <Card
                          key={request.id}
                          className='border border-gray-200'
                        >
                          <CardContent className='p-4'>
                            <div className='flex justify-between items-start'>
                              <div>
                                <h4 className='font-semibold text-gray-800'>
                                  {request.carrier.company_name ||
                                    request.carrier.full_name}
                                </h4>
                                <div className='mt-1 space-y-1'>
                                  <p className='text-sm flex items-center text-gray-600'>
                                    <TruckIcon className='h-4 w-4 mr-1.5 text-blue-600' />
                                    {request.vehicle.registration_number} -{' '}
                                    {t(`cargo.${request.vehicle.body_type}`)}
                                  </p>
                                  <p className='text-sm flex items-center text-gray-600'>
                                    <MapPin className='h-4 w-4 mr-1.5 text-blue-600' />
                                    {request.loading_point} →{' '}
                                    {request.unloading_point}
                                  </p>
                                </div>
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
                                className='border-blue-300 text-blue-700 hover:bg-blue-50'
                              >
                                {t('student.cargos.selectCarrier')}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className='text-center py-10 bg-gray-50 rounded-lg border border-gray-200'>
                        <p className='text-gray-500'>{t('cargo.noCargos')}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-600 mb-4' />
        <p className='text-lg text-blue-600 animate-pulse'>
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (iscarrier === true) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col items-center justify-center'>
        <Card className='max-w-md w-full shadow-lg border-0'>
          <CardContent className='p-8 text-center'>
            <div className='p-4 mb-4 bg-red-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center'>
              <AlertCircle className='h-10 w-10 text-red-600' />
            </div>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>
              {t('student.cargos.requiredPermissions')}
            </h2>
            <p className='text-gray-600 mb-6'>{t('errors.noPermissions')}</p>
            <Link href={'/'}>
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                <ChevronLeft className='mr-2 h-4 w-4' />
                {t('student.cargos.goToHome')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-20'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-2 text-blue-600 hover:bg-blue-50'
          >
            <ChevronLeft className='h-5 w-5 mr-2' />
            {t('common.back')}
          </Button>
          <h1 className='text-2xl font-bold text-blue-800 text-center flex-1'>
            {t('student.cargos.availableCargos')}
          </h1>
          <div className='w-10'></div> {/* Spacer for alignment */}
        </div>

        {/* Search & Filter */}
        <div className='mb-6 flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              type='text'
              placeholder={t('cargo.searchPlaceholder')}
              className='pl-10 pr-4 py-2 border-gray-200'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant='outline'
            className='border-gray-200 text-gray-700'
            onClick={fetchCargos}
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            {t('common.refresh')}
          </Button>
        </div>

        {/* Content */}
        <div className='space-y-4'>
          {cargos?.results?.length === 0 ? (
            <Card className='p-12 text-center border border-gray-200'>
              <div className='mb-4 mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center'>
                <PackageIcon className='h-8 w-8 text-gray-400' />
              </div>
              <p className='text-lg text-gray-500'>{t('cargo.noCargos')}</p>
              <p className='text-sm text-gray-400 mt-2 max-w-md mx-auto'>
                {t('cargo.noMatchingCargos')}
              </p>
            </Card>
          ) : (
            <motion.div
              initial='hidden'
              animate='visible'
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 },
                },
              }}
            >
              {cargos?.results?.map(renderCargoCard)}
            </motion.div>
          )}
        </div>
      </div>

      {renderCargoDetails()}
      {renderMatchingRequests()}
      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
