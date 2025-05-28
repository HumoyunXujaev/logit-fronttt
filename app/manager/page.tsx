'use client';
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
import { useUser } from '@/contexts/UserContext';
import NavigationMenu from '@/app/components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n';

interface ManagerCargoResponse {
  results: ManagerCargo[];
}

interface ManagerCargo {
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
  approval_notes?: string;
  created_at: string;
}

export default function ManagerPage() {
  const [pendingCargos, setPendingCargos] = useState<ManagerCargoResponse>({
    results: [],
  });
  const [approvedCargos, setApprovedCargos] = useState<ManagerCargoResponse>({
    results: [],
  });
  const [allCargos, setAllCargos] = useState<ManagerCargoResponse>({
    results: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCargo, setSelectedCargo] = useState<ManagerCargo | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');
  const { userState } = useUser();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (userState.role && userState.role.toString() !== 'manager') {
      router.push('/');
      return;
    }
    fetchCargos();
  }, [userState.role, router]);

  const fetchCargos = async () => {
    try {
      setIsLoading(true);
      // Fetch pending approval cargos
      const pendingResponse = await api.get('/cargo/manager/pending_approval/');
      setPendingCargos(pendingResponse);
      console.log(pendingCargos, 'pending cargos');

      // Fetch approved cargos
      const approvedResponse = await api.get('/cargo/manager/approved/');
      setApprovedCargos(approvedResponse);
      console.log(approvedCargos, 'approved cargos');

      // Fetch all cargos
      const allResponse = await api.get('/cargo/cargos/');
      setAllCargos(allResponse);
      console.log(allResponse, 'all cargos');
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Fetch cargos error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (
    cargo: ManagerCargo,
    action: 'approve' | 'reject'
  ) => {
    setSelectedCargo(cargo);
    setAction(action);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedCargo || !action) return;
    try {
      setIsSubmitting(true);
      await api.post(`/cargo/manager/${selectedCargo.id}/${action}/`, {
        approval_notes: approvalNotes,
      });
      toast.success(
        action === 'approve' 
          ? t('manager.approveSuccess') 
          : t('manager.rejectSuccess')
      );
      await fetchCargos();
      setShowConfirmDialog(false);
      setApprovalNotes('');
    } catch (error) {
      toast.error(t('manager.actionError'));
      console.error('Cargo action error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCargoCard = (cargo: ManagerCargo, isPending: boolean = false) => (
    <Card key={cargo?.id} className={`mb-4 ${isPending ? 'border-blue-500' : ''}`}>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='font-bold text-lg'>{cargo?.title}</h3>
            <p className='text-sm text-gray-600'>
              {t('cargo.from')}: {cargo?.owner?.company_name || cargo?.owner?.full_name}
            </p>
            <p className='text-sm text-gray-600'>
              {t('common.created')}: {new Date(cargo?.created_at).toLocaleDateString()}
            </p>
          </div>
          <Badge
            variant={
              cargo?.status === 'pending_approval'
                ? 'secondary'
                : cargo?.status === 'manager_approved'
                ? 'outline'
                : 'default'
            }
          >
            {cargo.status === 'pending_approval' 
              ? t('manager.pendingApproval') 
              : cargo?.status === 'manager_approved' 
                ? t('manager.approved') 
                : cargo?.status}
          </Badge>
        </div>
        <div className='grid grid-cols-2 gap-2 mb-4 text-sm'>
          <div>
            <span className='font-medium'>{t('cargo.route')}:</span>
            <p>
              {cargo?.loading_point} → {cargo?.unloading_point}
            </p>
          </div>
          <div>
            <span className='font-medium'>{t('cargo.loadingDate')}:</span>
            <p>{new Date(cargo?.loading_date).toLocaleDateString()}</p>
          </div>
          <div>
            <span className='font-medium'>{t('cargo.name')}:</span>
            <p>
              {cargo?.weight} {t('common.ton')}
              {cargo?.volume && `, ${cargo?.volume} m³`}
            </p>
          </div>
          <div>
            <span className='font-medium'>{t('cargo.payment')}:</span>
            <p>
              {cargo?.payment_method} {cargo?.price && ` (${cargo?.price} $)`}
            </p>
          </div>
        </div>
        {isPending || (cargo.status === 'pending_approval' && (
          <div className='flex justify-end space-x-2'>
            <Button 
              variant='outline' 
              onClick={() => handleAction(cargo, 'reject')}
            >
              <XCircle className='h-4 w-4 mr-2' /> {t('manager.reject')}
            </Button>
            <Button onClick={() => handleAction(cargo, 'approve')}>
              <CheckCircle className='h-4 w-4 mr-2' /> {t('manager.approve')}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <h1 className='text-2xl font-bold mb-6'>{t('manager.panelTitle')}</h1>

      {/* Pending Approval Section */}
      {pendingCargos?.results?.length > 0 && (
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4'>
            {t('manager.pendingApproval')}{' '}
            <Badge variant='secondary'>{pendingCargos?.results?.length}</Badge>
          </h2>
          <div className='space-y-4'>
            {pendingCargos?.results?.map((cargo) => renderCargoCard(cargo, true))}
          </div>
        </div>
      )}

      {/* Approved Cargos Section */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>
          {t('manager.approvedCargos')}{' '}
          <Badge variant='secondary'>{approvedCargos?.results?.length}</Badge>
        </h2>
        <div className='space-y-4'>
          {approvedCargos?.results?.map((cargo) => renderCargoCard(cargo))}
        </div>
      </div>

      {/* All Cargos Section */}
      <div className='mb-20'>
        <h2 className='text-xl font-semibold mb-4'>
          {t('manager.allCargos')}{' '}
          <Badge variant='secondary'>{allCargos?.results?.length}</Badge>
        </h2>
        <div className='space-y-4'>
          {allCargos?.results?.map((cargo) => renderCargoCard(cargo))}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? t('manager.approve') : t('manager.reject')}
            </DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <div className='flex items-center space-x-2 text-amber-600'>
              <AlertTriangle className='h-5 w-5' />
              <p>
                {action === 'approve' 
                  ? t('manager.confirmApprove') 
                  : t('manager.confirmReject')}
              </p>
            </div>
            {selectedCargo && (
              <div className='mt-4'>
                <div className='p-4 bg-gray-50 rounded-lg mb-4'>
                  <p className='font-medium'>{selectedCargo?.title}</p>
                  <p className='text-sm text-gray-600'>
                    {selectedCargo?.loading_point} →{' '}
                    {selectedCargo?.unloading_point}
                  </p>
                </div>
                <textarea
                  className='w-full p-2 border rounded-lg'
                  placeholder={t('manager.addComment')}
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant='outline' 
              onClick={() => setShowConfirmDialog(false)} 
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant={action === 'approve' ? 'default' : 'destructive'}
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                  {t('manager.processing')}
                </>
              ) : action === 'approve' ? (
                t('manager.approve')
              ) : (
                t('manager.reject')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavigationMenu userRole={userState.role === 'carrier' ? 'carrier' : 'other'} />
    </div>
  );
}