'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Search,
  PackageIcon,
  TruckIcon,
  MapPin,
  CreditCardIcon,
  Calendar,
  AlertCircle,
  X,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useTranslation } from '@/contexts/i18n';
import { Input } from '@/components/ui/input';

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
  const [filteredFavorites, setFilteredFavorites] = useState<
    DetailedFavorite[]
  >([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Fetch favorites from server
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Filter favorites based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter(
        (favorite) =>
          favorite.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          favorite.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
  }, [searchQuery, favorites]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get all favorites from server
      const response = await api.getFavorites();

      if (!response.results || response.results.length === 0) {
        setFavorites([]);
        setFilteredFavorites([]);
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
      const validFavorites = detailedFavorites.filter(
        Boolean
      ) as DetailedFavorite[];

      // Keep only cargo favorites as requested
      const cargoFavorites = validFavorites.filter(
        (fav) => fav.type === 'cargo'
      );

      setFavorites(cargoFavorites);
      setFilteredFavorites(cargoFavorites);
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
      // We're only interested in cargo items
      if (favorite.content_type === 'cargo') {
        const response = await api.get(`/cargo/cargos/${favorite.object_id}/`);
        return {
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
            [t('cargo.loadingDate')]: new Date(
              response.loading_date
            ).toLocaleDateString(),
          },
        };
      }
      return null;
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
      setFilteredFavorites((prev) =>
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
      setFilteredFavorites([]);
      toast.success(t('favorites.allCleared'));
    } catch (error) {
      console.error('Error clearing favorites:', error);
      toast.error(t('favorites.clearFailed'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-700 to-blue-600 p-4 pb-20'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='max-w-md mx-auto sm:max-w-lg md:max-w-2xl'
      >
        {/* Header section */}
        <motion.div
          variants={itemVariants}
          className='flex items-center mb-6 bg-white p-3 rounded-lg shadow-md'
        >
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-4 hover:bg-blue-100'
          >
            <ArrowLeft className='h-6 w-6 text-blue-600' />
          </Button>
          <h1 className='text-2xl font-bold text-blue-800'>
            {t('favorites.title')}
          </h1>
        </motion.div>

        {/* Search & Actions Bar */}
        <motion.div
          variants={itemVariants}
          className='mb-6 flex flex-col sm:flex-row gap-3'
        >
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              className='pl-10 bg-white border-gray-200'
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='flex items-center bg-white px-4 py-2 rounded-lg shadow-md'>
            <Heart className='h-5 w-5 mr-2 text-red-500' />
            <span className='font-medium text-gray-700'>
              {t('favorites.total')}: {filteredFavorites.length}
            </span>
          </div>

          {favorites.length > 0 && (
            <Button
              variant='outline'
              onClick={clearAllFavorites}
              disabled={isDeleting}
              className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
            >
              {isDeleting ? (
                <Loader2 className='h-4 w-4 mr-2 animate-spin' />
              ) : (
                <Trash2 className='h-4 w-4 mr-2' />
              )}
              {t('favorites.clearAll')}
            </Button>
          )}
        </motion.div>

        {/* Main content */}
        {isLoading ? (
          <motion.div
            variants={itemVariants}
            className='flex flex-col justify-center items-center py-20 bg-white rounded-lg shadow-md'
          >
            <Loader2 className='h-10 w-10 animate-spin text-blue-600 mb-4' />
            <span className='text-blue-600 animate-pulse'>
              {t('common.loading')}
            </span>
          </motion.div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            className='bg-red-50 border border-red-200 p-6 rounded-lg text-red-600 text-center flex flex-col items-center'
          >
            <AlertCircle className='h-10 w-10 mb-3' />
            <p>{error}</p>
          </motion.div>
        ) : (
          <AnimatePresence mode='popLayout'>
            {filteredFavorites.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className='flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg shadow-md text-center'
              >
                <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6'>
                  <Heart className='h-10 w-10 text-blue-500' />
                </div>
                <h3 className='text-xl font-semibold text-blue-800 mb-2'>
                  {t('favorites.noFavorites')}
                </h3>
                <p className='text-gray-600 max-w-xs'>
                  {searchQuery
                    ? t('cargo.nothingFound')
                    : t('favorites.addFavoritesDescription')}
                </p>
                {searchQuery && (
                  <Button
                    variant='outline'
                    className='mt-4'
                    onClick={() => setSearchQuery('')}
                  >
                    <X className='h-4 w-4 mr-2' />
                    {t('common.clear')}
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className='space-y-4'>
                {filteredFavorites.map((item) => (
                  <motion.div
                    key={item.favoriteId}
                    layout
                    variants={itemVariants}
                    initial='hidden'
                    animate='visible'
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className='overflow-hidden bg-white border-0 shadow-md hover:shadow-lg transition-all'>
                      <CardContent className='p-0'>
                        {/* Card Header */}
                        <div className='flex justify-between items-start p-4 bg-blue-50 border-b border-blue-100'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <PackageIcon className='h-12 w-12 text-blue-500' />
                              <h3 className='font-semibold text-blue-800'>
                                {item.title}
                              </h3>
                            </div>

                            <div className='flex items-center text-xs text-gray-500'>
                              <Clock className='h-3 w-3 mr-1 inline' />
                              {formatDate(item.createdAt)}
                            </div>
                          </div>

                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(item.favoriteId)}
                            disabled={isDeleting}
                            className='text-red-500 hover:text-red-600 hover:bg-red-50 h-12 w-12 rounded-full'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>

                        {/* Main content */}
                        {item.description && (
                          <div className='px-4 py-2 text-sm text-gray-700 border-b border-gray-100'>
                            {item.description}
                          </div>
                        )}

                        {/* Cargo details summary */}
                        <div className='px-4 py-3 grid grid-cols-2 gap-4 text-sm'>
                          <div className='flex items-center text-gray-700'>
                            <TruckIcon className='h-4 w-4 mr-2 text-blue-500' />
                            {item.details[t('cargo.weight')]}
                          </div>
                          <div className='flex items-center text-gray-700'>
                            <Calendar className='h-4 w-4 mr-2 text-blue-500' />
                            {item.details[t('cargo.loadingDate')]}
                          </div>
                          <div className='flex items-center text-gray-700'>
                            <MapPin className='h-4 w-4 mr-2 text-blue-500' />
                            {item.details[t('cargo.vehicleType')]}
                          </div>
                          <div className='flex items-center text-gray-700'>
                            <CreditCardIcon className='h-4 w-4 mr-2 text-blue-500' />
                            {item.details[t('cargo.price')]}
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {expandedItems.includes(item.favoriteId) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className='px-4 py-3 space-y-2 border-t border-gray-100 bg-gray-50'
                            >
                              {Object.entries(item.details).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className='flex justify-between items-center'
                                  >
                                    <p className='text-sm font-medium text-gray-600'>
                                      {key}:
                                    </p>
                                    <p className='text-sm text-gray-800'>
                                      {value as React.ReactNode}
                                    </p>
                                  </div>
                                )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Toggle details button */}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => toggleExpand(item.favoriteId)}
                          className='w-full flex items-center justify-center py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-none border-t border-gray-100'
                        >
                          {expandedItems.includes(item.favoriteId) ? (
                            <ChevronUp className='h-4 w-4 mr-2' />
                          ) : (
                            <ChevronDown className='h-4 w-4 mr-2' />
                          )}
                          {expandedItems.includes(item.favoriteId)
                            ? t('favorites.hideDetails')
                            : t('favorites.showDetails')}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className='bg-white border-0'>
          <DialogHeader>
            <DialogTitle>{t('favorites.deleteConfirmation')}</DialogTitle>
          </DialogHeader>
          <p className='py-4'>{t('favorites.deleteConfirmMessage')}</p>
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
