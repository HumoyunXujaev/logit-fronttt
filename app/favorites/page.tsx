'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Heart,
  ArrowLeft,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { useTranslation } from '@/contexts/i18n';

interface ServerFavorite {
  id: string;
  content_type: string;
  object_id: string;
  created_at: string;
}

interface DetailedFavorite {
  id: string;
  favoriteId: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  details: Record<string, any>;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { userState } = useUser();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [favorites, setFavorites] = useState<DetailedFavorite[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorites from server
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get all favorites from server
      const response = await api.getFavorites();

      if (!response.results || response.results.length === 0) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      // Fetch details for each favorite
      const detailedFavorites = await Promise.all(
        response.results.map(async (favorite: ServerFavorite) => {
          return await fetchFavoriteDetails(favorite);
        })
      );

      // Filter out any null results (failed fetches)
      setFavorites(detailedFavorites.filter(Boolean) as DetailedFavorite[]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError(t('favorites.errorFetching'));
      toast.error(t('favorites.errorFetching'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavoriteDetails = async (
    favorite: ServerFavorite
  ): Promise<DetailedFavorite | null> => {
    try {
      // Determine the API endpoint based on content_type
      let detailsData;

      if (favorite.content_type === 'cargo') {
        const response = await api.get(`/cargo/cargos/${favorite.object_id}/`);
        detailsData = {
          id: response.id,
          favoriteId: favorite.id,
          type: 'cargo',
          title: `${response.title}: ${response.loading_point} - ${response.unloading_point}`,
          description: response.description || '',
          createdAt: favorite.created_at,
          details: {
            [t('cargo.weight')]: `${response.weight} ${t('common.ton')}`,
            [t('cargo.volume')]: response.volume
              ? `${response.volume} m³`
              : t('cargo.notSpecified'),
            [t('cargo.vehicleType')]: t(`cargo.${response.vehicle_type}`),
            [t('cargo.payment')]: response.payment_method,
            [t('cargo.price')]: response.price
              ? `${response.price} ₽`
              : t('cargo.negotiablePrice'),
          },
        };
      } else if (favorite.content_type === 'carrier') {
        const response = await api.get(`/vehicles/${favorite.object_id}/`);
        detailsData = {
          id: response.id,
          favoriteId: favorite.id,
          type: 'carrier',
          title: `${response.registration_number}`,
          description: `${t(`cargo.${response.body_type}`)}`,
          createdAt: favorite.created_at,
          details: {
            [t('vehicle.capacity')]: `${response.capacity} ${t('common.ton')}`,
            [t('cargo.volume')]: response.volume
              ? `${response.volume} m³`
              : t('cargo.notSpecified'),
            [t(
              'vehicle.dimensions'
            )]: `${response.length}x${response.width}x${response.height} m`,
            [t('cargo.loadingType')]: t(`cargo.${response.loading_type}`),
          },
        };
      } else if (favorite.content_type === 'route') {
        // Example for route - adjust according to your API structure
        const response = await api.get(`/core/routes/${favorite.object_id}/`);
        detailsData = {
          id: response.id,
          favoriteId: favorite.id,
          type: 'route',
          title: `${response.origin} - ${response.destination}`,
          description: response.description || '',
          createdAt: favorite.created_at,
          details: {
            [t('cargo.distance')]: `${response.distance} km`,
            [t('cargo.estimatedTime')]: response.estimated_time,
          },
        };
      } else {
        // Generic fallback
        detailsData = {
          id: favorite.object_id,
          favoriteId: favorite.id,
          type: favorite.content_type,
          title: t('favorites.savedItem'),
          description: '',
          createdAt: favorite.created_at,
          details: {},
        };
      }

      return detailsData;
    } catch (error) {
      console.error(
        `Failed to fetch details for favorite ${favorite.id}:`,
        error
      );
      return null;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getFavoriteIcon = (type: string) => {
    switch (type) {
      case 'cargo':
        return '📦';
      case 'route':
        return '🚚';
      case 'carrier':
        return '🚛';
      default:
        return '❤️';
    }
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      await api.delete(`/core/favorites/${itemToDelete}/`);

      // Update UI by removing the deleted favorite
      setFavorites((prev) =>
        prev.filter((item) => item.favoriteId !== itemToDelete)
      );
      toast.success(t('favorites.removedSuccess'));
    } catch (error) {
      console.error('Error deleting favorite:', error);
      toast.error(t('favorites.deleteFailed'));
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  const clearAllFavorites = async () => {
    try {
      setIsDeleting(true);

      // Delete all favorites sequentially
      for (const favorite of favorites) {
        await api.delete(`/core/favorites/${favorite.favoriteId}/`);
      }

      setFavorites([]);
      toast.success(t('favorites.allCleared'));
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast.error(t('favorites.clearFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Group favorites by type
  const groupedFavorites = favorites.reduce(
    (acc: Record<string, DetailedFavorite[]>, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, DetailedFavorite[]>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='flex items-center mb-6'>
        <Button variant='ghost' onClick={() => router.back()} className='mr-2'>
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-2xl font-bold'>{t('favorites.title')}</h1>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <Heart className='h-5 w-5 mr-2 text-red-500' />
          <span className='font-semibold'>
            {t('favorites.total')}: {favorites.length}
          </span>
        </div>
        {favorites.length > 0 && (
          <Button
            variant='outline'
            size='sm'
            onClick={clearAllFavorites}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            ) : (
              <Trash2 className='h-4 w-4 mr-2' />
            )}
            {t('favorites.clearAll')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
          <span className='ml-2 text-blue-600'>{t('common.loading')}</span>
        </div>
      ) : error ? (
        <div className='bg-red-50 p-4 rounded-lg text-red-500 text-center'>
          {error}
        </div>
      ) : (
        <AnimatePresence mode='popLayout'>
          {Object.entries(groupedFavorites).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='text-center py-8 text-gray-500'
            >
              {t('favorites.noFavorites')}
            </motion.div>
          ) : (
            Object.entries(groupedFavorites).map(([type, items]) => (
              <motion.div
                key={type}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='mb-6'
              >
                <h2 className='text-lg font-semibold mb-3 flex items-center'>
                  {getFavoriteIcon(type)}{' '}
                  <span className='ml-2'>{t(`favorites.types.${type}`)}</span>
                  <Badge variant='secondary' className='ml-2'>
                    {items.length}
                  </Badge>
                </h2>
                <AnimatePresence mode='popLayout'>
                  {items.map((item) => (
                    <motion.div
                      key={item.favoriteId}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className='mb-3'>
                        <CardContent className='p-4'>
                          <div className='flex justify-between items-start'>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <h3 className='font-medium'>{item.title}</h3>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  onClick={() => handleDelete(item.favoriteId)}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className='h-4 w-4 text-red-500' />
                                </Button>
                              </div>
                              <p className='text-sm text-gray-500 mb-2'>
                                {formatDate(item.createdAt)}
                              </p>
                              <p className='text-sm'>{item.description}</p>
                              <AnimatePresence>
                                {expandedItems.includes(item.favoriteId) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className='mt-4 space-y-2 text-sm'
                                  >
                                    {Object.entries(item.details).map(
                                      ([key, value]) => (
                                        <p key={key}>
                                          <span className='font-medium'>
                                            {key}:{' '}
                                          </span>{' '}
                                          {value as React.ReactNode}
                                        </p>
                                      )
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => toggleExpand(item.favoriteId)}
                            className='mt-2 w-full'
                          >
                            {expandedItems.includes(item.favoriteId) ? (
                              <>
                                <ChevronUp className='h-4 w-4 mr-2' />
                                {t('favorites.hideDetails')}
                              </>
                            ) : (
                              <>
                                <ChevronDown className='h-4 w-4 mr-2' />
                                {t('favorites.showDetails')}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('favorites.deleteConfirmation')}</DialogTitle>
          </DialogHeader>
          <p>{t('favorites.deleteConfirmMessage')}</p>
          <DialogFooter className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              ) : null}
              {t('common.delete')}
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
