'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, removeFromFavorites, clearAllFavorites } = useApp();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { userState } = useUser();
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

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeFromFavorites(itemToDelete);
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const groupedFavorites = favorites.reduce(
    (acc: Record<string, any[]>, item) => {
      //   const groupedFavorites = favorites.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='flex items-center mb-6'>
        <Button variant='ghost' onClick={() => router.back()} className='mr-2'>
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-2xl font-bold'>Избранное</h1>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <Heart className='h-5 w-5 mr-2 text-red-500' />
          <span className='font-semibold'>Всего: {favorites.length}</span>
        </div>
        {favorites.length > 0 && (
          <Button variant='outline' size='sm' onClick={clearAllFavorites}>
            <Trash2 className='h-4 w-4 mr-2' />
            Очистить все
          </Button>
        )}
      </div>

      <AnimatePresence mode='popLayout'>
        {Object.entries(groupedFavorites).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='text-center py-8 text-gray-500'
          >
            У вас пока нет избранных элементов
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
                {getFavoriteIcon(type)}
                <span className='ml-2'>
                  {type === 'cargo' && 'Грузы'}
                  {type === 'route' && 'Маршруты'}
                  {type === 'carrier' && 'Перевозчики'}
                </span>
                <Badge variant='secondary' className='ml-2'>
                  {items.length}
                </Badge>
              </h2>

              <AnimatePresence mode='popLayout'>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
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
                                onClick={() => handleDelete(item.orderId)}
                              >
                                <Trash2 className='h-4 w-4 text-red-500' />
                              </Button>
                            </div>
                            <p className='text-sm text-gray-500 mb-2'>
                              {formatDate(item.createdAt)}
                            </p>
                            <p className='text-sm'>{item.description}</p>

                            <AnimatePresence>
                              {expandedItems.includes(item.id) && (
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
                                          {key}:
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
                          onClick={() => toggleExpand(item.id)}
                          className='mt-2 w-full'
                        >
                          {expandedItems.includes(item.id) ? (
                            <>
                              <ChevronUp className='h-4 w-4 mr-2' />
                              Скрыть детали
                            </>
                          ) : (
                            <>
                              <ChevronDown className='h-4 w-4 mr-2' />
                              Показать детали
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

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <p>Вы уверены, что хотите удалить этот элемент из избранного?</p>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              variant='outline'
              onClick={() => setShowDeleteConfirm(false)}
            >
              Отмена
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
      {/* <NavigationMenu userRole='carrier' /> */}
    </div>
  );
}
