import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface AssignedCargoResponse {
  results: AssignedCargo[];
}

interface AssignedCargo {
  id: string;
  title: string;
  loading_point: string;
  unloading_point: string;
  loading_date: string;
  weight: number;
  volume?: number;
  price?: number;
  payment_method: string;
  status: string;
  owner: {
    full_name: string;
    company_name?: string;
  };
  assigned_by: {
    full_name: string;
  };
  managed_by: {
    full_name: string;
  };
}

export default function AssignedCargosSection() {
  const [assignedCargos, setAssignedCargos] = useState<AssignedCargoResponse>({
    results: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCargo, setSelectedCargo] = useState<AssignedCargo | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignedCargos();
  }, []);

  const fetchAssignedCargos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/cargo/cargos/', {
        params: { status: 'assigned', assigned_to: 'me' },
      });
      setAssignedCargos(response);
      console.log(response, 'assign');
    } catch (error) {
      toast.error('Ошибка при загрузке назначенных грузов');
      console.error('Fetch assigned cargos error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    cargo: AssignedCargo,
    action: 'accept' | 'reject'
  ) => {
    setSelectedCargo(cargo);
    setAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedCargo || !action) return;

    try {
      setIsSubmitting(true);
      await api.post(`/cargo/cargos/${selectedCargo.id}/accept_assignment/`, {
        decision: action,
      });

      toast.success(
        action === 'accept' ? 'Груз успешно принят' : 'Груз отклонен'
      );

      await fetchAssignedCargos();
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error('Ошибка при обработке груза');
      console.error('Cargo action error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (assignedCargos?.results?.length === 0) {
    return null;
  }

  const assignedddCargos = assignedCargos.results.filter(
    (c) => c.status !== 'pending'
  );
  console.log(assignedddCargos, 'tttt');

  return (
    <div className='mb-8'>
      <h2 className='text-xl font-semibold text-white mb-4'>
        Назначенные грузы
      </h2>
      <div className='space-y-4'>
        {assignedCargos?.results?.map((cargo) => (
          <>
            {cargo.status !== 'pending' && (
              <Card key={cargo?.id} className='bg-white'>
                <CardContent className='p-4'>
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <h3 className='font-bold text-lg'>{cargo?.title}</h3>
                      <p className='text-sm text-gray-600'>
                        От:{' '}
                        {cargo?.owner?.company_name || cargo?.owner?.full_name}
                      </p>
                      <p className='text-sm text-gray-600'>
                        Назначен (Логист): {cargo?.managed_by?.full_name}
                      </p>
                    </div>
                    <Badge variant='secondary'>
                      {cargo?.status === 'assigned'
                        ? 'Требует подтверждения'
                        : cargo?.status}
                    </Badge>
                  </div>

                  <div className='grid grid-cols-2 gap-2 mb-4 text-sm'>
                    <div>
                      <span className='font-medium'>Маршрут:</span>
                      <p>
                        {cargo?.loading_point} → {cargo?.unloading_point}
                      </p>
                    </div>
                    <div>
                      <span className='font-medium'>Дата загрузки:</span>
                      <p>
                        {new Date(cargo?.loading_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className='font-medium'>Груз:</span>
                      <p>
                        {cargo?.weight} т
                        {cargo?.volume && `, ${cargo.volume} м³`}
                      </p>
                    </div>
                    <div>
                      <span className='font-medium'>Оплата:</span>
                      <p>
                        {cargo?.payment_method}
                        {cargo?.price && ` (${cargo?.price} ₽)`}
                      </p>
                    </div>
                  </div>

                  {cargo?.status === 'assigned' && (
                    <div className='flex justify-end space-x-2'>
                      <Button
                        variant='outline'
                        onClick={() => handleAction(cargo, 'reject')}
                      >
                        <XCircle className='h-4 w-4 mr-2' />
                        Отклонить
                      </Button>
                      <Button onClick={() => handleAction(cargo, 'accept')}>
                        <CheckCircle className='h-4 w-4 mr-2' />
                        Принять
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        ))}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'accept' ? 'Принять груз' : 'Отклонить груз'}
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <div className='flex items-center space-x-2 text-amber-600'>
              <AlertTriangle className='h-5 w-5' />
              <p>
                {action === 'accept'
                  ? 'Вы уверены, что хотите принять этот груз?'
                  : 'Вы уверены, что хотите отклонить этот груз?'}
              </p>
            </div>
            {selectedCargo && (
              <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                <p className='font-medium'>{selectedCargo?.title}</p>
                <p className='text-sm text-gray-600'>
                  {selectedCargo?.loading_point} →{' '}
                  {selectedCargo?.unloading_point}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              variant={action === 'accept' ? 'default' : 'destructive'}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Обработка...
                </>
              ) : action === 'accept' ? (
                'Принять'
              ) : (
                'Отклонить'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
