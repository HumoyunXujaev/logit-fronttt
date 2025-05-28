'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EyeIcon,
  PencilIcon,
  PowerIcon,
  PlusIcon,
  Loader2,
  Calendar,
  TruckIcon,
  MapPin,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  Clock,
  PackageIcon,
  ShieldAlert,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/contexts/i18n';

interface CargoResponse {
  results: Cargo[];
}

interface Cargo {
  id: string;
  title: string;
  status: string;
  loading_point: string;
  unloading_point: string;
  weight: number;
  vehicle_type: string;
  payment_method: string;
  price?: number;
  loading_date: string;
  created_at: string;
}

export default function MyCargoPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [cargos, setCargos] = useState<CargoResponse>({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [isCarrier, setIsCarrier] = useState(false);
  const { userState } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchCargos();
    if (userState.role === 'carrier') {
      setIsCarrier(true);
    }
  }, []);

  const fetchCargos = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCargos();
      setCargos(response);
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Fetch cargos error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setActionInProgress(id);
      await api.updateCargo(id, { status });
      toast.success(t('myCargoPage.statusUpdated'));
      await fetchCargos();
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Update status error:', error);
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'inactive':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='h-4 w-4 mr-1.5' />;
      case 'pending':
        return <Clock className='h-4 w-4 mr-1.5' />;
      case 'completed':
        return <CheckCircle className='h-4 w-4 mr-1.5' />;
      case 'cancelled':
        return <ShieldAlert className='h-4 w-4 mr-1.5' />;
      case 'draft':
        return <PencilIcon className='h-4 w-4 mr-1.5' />;
      case 'inactive':
        return <PowerIcon className='h-4 w-4 mr-1.5' />;
      default:
        return <Clock className='h-4 w-4 mr-1.5' />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: t('cargo.status.active'),
      pending: t('cargo.status.pending'),
      completed: t('cargo.status.completed'),
      cancelled: t('cargo.status.cancelled'),
      draft: t('cargo.status.draft'),
      inactive: t('cargo.status.inactive'),
    };
    return labels[status] || status;
  };

  const activeCargos = cargos?.results?.filter((cargo) =>
    ['active', 'pending', 'draft'].includes(cargo.status)
  );

  const inactiveCargos = cargos?.results?.filter((cargo) =>
    ['completed', 'cancelled', 'inactive'].includes(cargo.status)
  );

  const handleView = (id: string) => {
    router.push(`/cargo/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/cargo/${id}/edit`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const renderCargoCard = (cargo: Cargo) => (
    <motion.div variants={itemVariants} key={cargo.id}>
      <Card className='mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-3'>
            <h3 className='font-semibold text-lg text-gray-800'>
              {cargo.title}
            </h3>
            <Badge
              className={`${getStatusBadgeVariant(
                cargo.status
              )} flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
            >
              {getStatusIcon(cargo.status)}
              {getStatusLabel(cargo.status)}
            </Badge>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-4 text-sm'>
            <div className='flex items-center text-gray-600'>
              <MapPin className='h-4 w-4 mr-1.5 text-blue-600' />
              <span>
                {cargo.loading_point} → {cargo.unloading_point}
              </span>
            </div>
            <div className='flex items-center text-gray-600'>
              <Calendar className='h-4 w-4 mr-1.5 text-blue-600' />
              <span>{new Date(cargo.loading_date).toLocaleDateString()}</span>
            </div>
            <div className='flex items-center text-gray-600'>
              <PackageIcon className='h-4 w-4 mr-1.5 text-blue-600' />
              <span>
                {cargo.weight} {t('common.ton')},{' '}
                {t(`cargo.${cargo.vehicle_type}`)}
              </span>
            </div>
            <div className='flex items-center text-gray-600'>
              <CreditCard className='h-4 w-4 mr-1.5 text-blue-600' />
              <span>
                {cargo.price ? `${cargo.price} $` : t('cargo.negotiablePrice')}
              </span>
            </div>
          </div>

          <div className='flex justify-between space-x-2 mt-3 pt-3 border-t border-gray-200'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleView(cargo.id)}
              className='text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50'
            >
              <EyeIcon className='h-4 w-4 mr-1.5' />
              {t('myCargoPage.show')}
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEdit(cargo.id)}
              className='text-amber-600 hover:text-amber-700 border-amber-200 hover:bg-amber-50'
            >
              <PencilIcon className='h-4 w-4 mr-1.5' />
              {t('myCargoPage.edit')}
            </Button>

            {cargo.status === 'active' && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleStatusChange(cargo.id, 'inactive')}
                disabled={actionInProgress === cargo.id}
                className='text-orange-600 hover:text-orange-700 border-orange-200 hover:bg-orange-50'
              >
                {actionInProgress === cargo.id ? (
                  <Loader2 className='h-4 w-4 mr-1.5 animate-spin' />
                ) : (
                  <PowerIcon className='h-4 w-4 mr-1.5' />
                )}
                {t('myCargoPage.deactivate')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-lg text-blue-800 animate-pulse'>
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  if (isCarrier === true) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex flex-col items-center justify-center'>
        <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center'>
          <ShieldAlert className='h-16 w-16 text-red-500 mx-auto mb-4' />
          <h2 className='text-xl font-bold text-gray-800 mb-4'>
            {t('myCargoPage.insufficientPermissions')}
          </h2>
          <p className='text-gray-600 mb-6'>
            {t('myCargoPage.insufficientPermissions')}
          </p>
          <Link href={'/'}>
            <Button className='w-full bg-blue-600 hover:bg-blue-700'>
              {t('myCargoPage.goToHomePage')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-24'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-2 text-blue-600 hover:bg-blue-50'
          >
            <ArrowLeft className='h-5 w-5 mr-2' />
            {t('common.back')}
          </Button>
          <h1 className='text-2xl font-bold text-blue-800'>
            {t('myCargoPage.myCargos')}
          </h1>
          <div className='w-10'></div> {/* Spacer for alignment */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 bg-white p-1 rounded-lg shadow-sm'
        >
          <Tabs
            defaultValue={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as 'active' | 'inactive')
            }
          >
            <TabsList className='grid grid-cols-2 w-full'>
              <TabsTrigger
                value='active'
                className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'
              >
                {t('myCargoPage.active')}
                <Badge
                  variant='secondary'
                  className='ml-2 bg-white text-blue-600'
                >
                  {activeCargos?.length || 0}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value='inactive'
                className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'
              >
                {t('myCargoPage.inactive')}
                <Badge
                  variant='secondary'
                  className='ml-2 bg-white text-blue-600'
                >
                  {inactiveCargos?.length || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <ScrollArea className='h-[calc(100vh-250px)]'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {activeTab === 'active' ? (
              activeCargos?.length > 0 ? (
                activeCargos.map(renderCargoCard)
              ) : (
                <motion.div
                  variants={itemVariants}
                  className='text-center py-10 bg-white rounded-lg shadow-sm'
                >
                  <PackageIcon className='h-16 w-16 text-blue-200 mx-auto mb-4' />
                  <p className='text-gray-500 text-lg'>
                    {t('myCargoPage.noActiveCargos')}
                  </p>
                </motion.div>
              )
            ) : inactiveCargos?.length > 0 ? (
              inactiveCargos.map(renderCargoCard)
            ) : (
              <motion.div
                variants={itemVariants}
                className='text-center py-10 bg-white rounded-lg shadow-sm'
              >
                <PackageIcon className='h-16 w-16 text-blue-200 mx-auto mb-4' />
                <p className='text-gray-500 text-lg'>
                  {t('myCargoPage.noInactiveCargos')}
                </p>
              </motion.div>
            )}
          </motion.div>
        </ScrollArea>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='fixed bottom-20 left-4 right-4 max-w-4xl mx-auto'
        >
          <Button
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl shadow-lg flex items-center justify-center'
            onClick={() => router.push('/cargos')}
          >
            <PlusIcon className='h-5 w-5 mr-2' />
            <span className='text-base font-medium'>
              {t('myCargoPage.addMoreCargo')}
            </span>
          </Button>
        </motion.div>
      </div>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
