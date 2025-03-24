'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Star,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Eye,
  Loader2,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Rating {
  id: string;
  from_user: {
    telegram_id: string;
    username?: string;
    full_name: string;
    company_name?: string;
    role: string;
  };
  to_user: {
    telegram_id: string;
    username?: string;
    full_name: string;
    company_name?: string;
    role: string;
  };
  score: number;
  comment?: string;
  created_at: string;
}

interface User {
  telegram_id: string;
  full_name: string;
  username?: string;
  company_name?: string;
  role?: string;
  rating?: number;
}

interface CompletedCargo {
  id: string;
  title: string;
  status: string;
  loading_point: string;
  unloading_point: string;
  completed_at?: string;
  assigned_to?: User;
  owner?: User;
  managed_by?: User;
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedRatings, setReceivedRatings] = useState<Rating[]>([]);
  const [givenRatings, setGivenRatings] = useState<Rating[]>([]);
  const [pendingRatings, setPendingRatings] = useState<CompletedCargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCargo, setSelectedCargo] = useState<CompletedCargo | null>(
    null
  );
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState('');
  const [userAverageRating, setUserAverageRating] = useState<number | null>(
    null
  );

  const { userState } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchRatings();
  }, []);

  const tgid =
    typeof window !== 'undefined' ? localStorage.getItem('telegram_id') : '';
  const fetchRatings = async () => {
    try {
      setIsLoading(true);

      // Fetch ratings received by current user
      const received = await api.get('/core/ratings/', {
        params: { received: true },
      });
      const receivedr = received.results.filter(
        (r: any) => r.from_user.telegram_id !== tgid
      );
      setReceivedRatings(receivedr || []);
      console.log(receivedr, 'rece');
      // Fetch ratings given by current user
      const given = await api.get('/core/ratings/', {
        params: { given: true },
      });
      const givvenr = given.results.filter(
        (r: any) => r.to_user.telegram_id !== tgid
      );
      console.log(givvenr, 'given');

      setGivenRatings(givvenr || []);

      // Fetch completed cargos that need rating
      const pendingResponse = await api.get('/cargo/cargos/', {
        params: { status: 'completed', needs_rating: true },
      });
      const pendingrating = pendingResponse.results.filter(
        (r: any) =>
          r.status === 'completed' &&
          !givenRatings.some((gr: any) => gr.id === r.id)
      );

      console.log(pendingrating, 'rrrrr');
      console.log(pendingResponse, 'pending');
      setPendingRatings(pendingrating || []);

      // Fetch user's average rating
      const userProfile = await api.getCurrentUser();
      if (userProfile && userProfile.rating) {
        setUserAverageRating(userProfile.rating);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error('Не удалось загрузить отзывы');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateUser = (cargo: CompletedCargo) => {
    // Determine who to rate based on user role
    let userToRate = null;

    if (userState.role === 'carrier') {
      userToRate = cargo.owner;
    } else if (userState.role === 'cargo-owner') {
      userToRate = cargo.assigned_to;
    } else if (userState.role === 'student') {
      // Students might rate carriers or cargo owners
      // For simplicity, let's assume they rate the assigned carrier
      userToRate = cargo.assigned_to;
    } else if (userState.role === 'logistics-company') {
      userToRate = cargo.assigned_to;
    }

    if (!userToRate) {
      toast.error('Не удалось определить пользователя для оценки');
      return;
    }

    setSelectedUser(userToRate);
    setSelectedCargo(cargo);
    setShowRatingDialog(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedUser || !selectedCargo) return;

    try {
      setIsSubmitting(true);

      await api.post('/core/ratings/', {
        to_user: selectedUser.telegram_id,
        score: ratingScore,
        comment: ratingComment,
        cargo_id: selectedCargo.id,
      });

      toast.success('Отзыв успешно отправлен');
      setShowRatingDialog(false);
      setRatingScore(5);
      setRatingComment('');

      // Refresh ratings
      fetchRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Не удалось отправить отзыв');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onSelect?: (score: number) => void) => {
    return (
      <div className='flex items-center'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${onSelect ? 'cursor-pointer' : ''}`}
            onClick={() => onSelect && onSelect(star)}
          />
        ))}
      </div>
    );
  };

  const renderRatingCard = (rating: Rating, isReceived: boolean = true) => (
    <Card key={rating.id} className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center'>
            <Avatar className='h-10 w-10 mr-4'>
              <div className='flex h-full w-full items-center justify-center bg-primary text-white'>
                {isReceived
                  ? rating.from_user.full_name.charAt(0)
                  : rating.to_user.full_name.charAt(0)}
              </div>
            </Avatar>
            <div>
              <h3 className='font-semibold'>
                {isReceived
                  ? rating.from_user.full_name
                  : rating.to_user.full_name}
              </h3>
              <p className='text-sm text-gray-600'>
                {isReceived ? rating.from_user.role : rating.to_user.role}
              </p>
            </div>
          </div>
          <div className='flex flex-col items-end'>
            <div className='flex items-center'>
              <span className='font-bold mr-2'>{rating.score}</span>
              {renderStars(rating.score)}
            </div>
            <span className='text-sm text-gray-500'>
              {new Date(rating.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {rating.comment && (
          <div className='bg-gray-50 p-3 rounded-lg'>
            <p className='text-gray-800'>{rating.comment}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPendingRatingCard = (cargo: CompletedCargo) => {
    const userToRate =
      userState.role === 'carrier' ? cargo.owner : cargo.assigned_to;

    return (
      <Card key={cargo.id} className='mb-4'>
        <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-4'>
            <div className='flex items-center'>
              <Avatar className='h-10 w-10 mr-4'>
                <div className='flex h-full w-full items-center justify-center bg-primary text-white'>
                  {userToRate?.full_name.charAt(0)}
                </div>
              </Avatar>
              <div>
                <h3 className='font-semibold'>{userToRate?.full_name}</h3>
                <p className='text-sm text-gray-600'>{userToRate?.role}</p>
              </div>
            </div>
            <div className='flex flex-col items-end'>
              <div className='flex items-center'>
                <span className='font-bold mr-2'>{userToRate?.rating}</span>
                {renderStars(Number(userToRate?.rating))}
              </div>
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <Button onClick={() => handleRateUser(cargo)}>
              <Star className='h-4 w-4 mr-2' />
              Оставить отзыв
            </Button>
          </div>
        </CardContent>
        {/* <CardContent className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <div>
              <h3 className='font-semibold'>{cargo.title}</h3>
              <p className='text-sm text-gray-600'>
                {cargo.loading_point} → {cargo.unloading_point}
              </p>
              {userToRate && (
                <p className='text-sm mt-1'>
                  <span className='text-gray-600'>Пользователь: </span>
                  <span className='font-medium'>{userToRate.full_name}</span>
                </p>
              )}
            </div>
            <span className='text-sm text-gray-500'>
              {cargo.completed_at
                ? new Date(cargo.completed_at).toLocaleDateString()
                : 'Завершен'}
            </span>
          </div>
          <div className='flex justify-end mt-4'>
            <Button onClick={() => handleRateUser(cargo)}>
              <Star className='h-4 w-4 mr-2' />
              Оставить отзыв
            </Button>
          </div>
        </CardContent> */}
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-2'
          >
            <ArrowLeft className='h-6 w-6' />
          </Button>
          <h1 className='text-2xl font-bold'>Отзывы и рейтинг</h1>
        </div>

        {userAverageRating !== null && (
          <Card className='mb-6'>
            <CardContent className='p-4 flex flex-col items-center'>
              <h2 className='text-lg font-semibold mb-2'>Ваш рейтинг</h2>
              <div className='flex items-center'>
                <span className='text-3xl font-bold mr-3'>
                  {Number(userAverageRating).toFixed(1)}
                </span>
                {renderStars(userAverageRating)}
              </div>
              <p className='text-sm text-gray-600 mt-2'>
                На основе {receivedRatings?.length} отзывов
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='received'>
              Полученные{' '}
              {receivedRatings.length > 0 && `(${receivedRatings.length})`}
            </TabsTrigger>
            <TabsTrigger value='given'>
              Оставленные{' '}
              {givenRatings.length > 0 && `(${givenRatings.length})`}
            </TabsTrigger>
            <TabsTrigger value='pending'>
              Можете оставить
              {pendingRatings.length > 0 && `(${pendingRatings.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='received' className='mt-4'>
            <ScrollArea className='h-[calc(100vh-350px)]'>
              {receivedRatings.length > 0 ? (
                receivedRatings.map((rating) => renderRatingCard(rating, true))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  У вас пока нет полученных отзывов
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value='given' className='mt-4'>
            <ScrollArea className='h-[calc(100vh-350px)]'>
              {givenRatings.length > 0 ? (
                givenRatings.map((rating) => renderRatingCard(rating, false))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  Вы пока не оставили ни одного отзыва
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value='pending' className='mt-4'>
            <ScrollArea className='h-[calc(100vh-350px)]'>
              {pendingRatings.length > 0 ? (
                pendingRatings.map((cargo) => renderPendingRatingCard(cargo))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  Нет заявок, требующих отзыва
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оставить отзыв</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            {selectedUser && (
              <div className='flex items-center mb-4'>
                <Avatar className='h-12 w-12 mr-4'>
                  <div className='flex h-full w-full items-center justify-center bg-primary text-white'>
                    {selectedUser.full_name.charAt(0)}
                  </div>
                </Avatar>
                <div>
                  <h3 className='font-semibold'>{selectedUser.full_name}</h3>
                  <p className='text-sm text-gray-600'>{selectedUser.role}</p>
                </div>
              </div>
            )}

            {selectedCargo && (
              <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
                <p className='font-medium'>{selectedCargo.title}</p>
                <p className='text-sm text-gray-600'>
                  {selectedCargo.loading_point} →{' '}
                  {selectedCargo.unloading_point}
                </p>
              </div>
            )}

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Оценка</label>
              <div className='flex justify-center mb-2'>
                {renderStars(ratingScore, setRatingScore)}
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>
                Комментарий
              </label>
              <Textarea
                placeholder='Напишите ваш отзыв о сотрудничестве...'
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowRatingDialog(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleSubmitRating} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Отправка...
                </>
              ) : (
                'Отправить отзыв'
              )}
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
