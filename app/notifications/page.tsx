'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Trash2, ArrowLeft } from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    notificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useApp();
  const { userState } = useUser();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'cargo':
        return '📦';
      case 'route':
        return '🚚';
      default:
        return '🔔';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='flex items-center mb-6'>
        <Button variant='ghost' onClick={() => router.back()} className='mr-2'>
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-2xl font-bold'>Уведомления</h1>
      </div>

      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center'>
          <Bell className='h-5 w-5 mr-2' />
          <span className='font-semibold'>
            Всего: {notifications.length}
            {notificationsCount > 0 && (
              <Badge variant='secondary' className='ml-2'>
                Новых: {notificationsCount}
              </Badge>
            )}
          </span>
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={markAllNotificationsAsRead}
            disabled={notificationsCount === 0}
          >
            <CheckCircle className='h-4 w-4 mr-2' />
            Прочитать все
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Очистить все
          </Button>
        </div>
      </div>

      <AnimatePresence mode='popLayout'>
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='text-center py-8 text-gray-500'
          >
            Нет уведомлений
          </motion.div>
        ) : (
          <div className='space-y-3'>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-start space-x-3'>
                        <div className='text-2xl'>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <p className='font-medium'>{notification.message}</p>
                          <p className='text-sm text-gray-500'>
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className='flex space-x-2'>
                        {!notification.isRead && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                          >
                            <CheckCircle className='h-4 w-4' />
                          </Button>
                        )}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
      {/* <NavigationMenu userRole='carrier' /> */}
    </div>
  );
}
