'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { FavoriteItem, useFavorites } from '@/hooks/useFavorites';

interface AppContextType {
  notifications: Notification[];
  notificationsCount: number;
  favoritesCount: number;
  favorites: FavoriteItem[];
  addNotification: (notification: any) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addToFavorites: (item: any) => void;
  removeFromFavorites: (id: number) => void;
  clearAllFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    notifications: originalNotifications,
    unreadCount,
    addNotification: originalAddNotification,
    markAsRead: originalMarkAsRead,
    markAllAsRead: originalMarkAllAsRead,
    deleteNotification: originalDeleteNotification,
    clearAllNotifications: originalClearAllNotifications,
  } = useNotifications();

  const {
    favorites: originalFavorites,
    addToFavorites: originalAddToFavorites,
    removeFromFavorites: originalRemoveFromFavorites,
    isFavorite: originalIsFavorite,
    clearAllFavorites: originalClearAllFavorites,
  } = useFavorites();

  const [notifications, setNotifications] = useState(originalNotifications);
  const [favorites, setFavorites] = useState(originalFavorites);
  const [notificationsCount, setNotificationsCount] = useState(unreadCount);
  const [favoritesCount, setFavoritesCount] = useState(
    originalFavorites.length
  );

  useEffect(() => {
    setNotifications(originalNotifications);
    setNotificationsCount(unreadCount);
  }, [originalNotifications, unreadCount]);

  useEffect(() => {
    setFavorites(originalFavorites);
    setFavoritesCount(originalFavorites.length);
  }, [originalFavorites]);

  // const hasNotification = (type: string, itemId: string): boolean => {
  //   return notifications.some(
  //     notification => notification.type === type && notification.orderId === itemId
  //   );
  // };

  // const isFavorite = (type: string, itemId: string): boolean => {
  //   return favorites.some(
  //     favorite => favorite.type === type && favorite.orderId === itemId
  //   );
  // };

  const addNotification = (notification: any) => {
    originalAddNotification(notification);
    // После добавления уведомления обновляем состояние
    setNotifications((prev) => [...prev, notification]);
    setNotificationsCount((prev) => prev + 1);
  };

  const markNotificationAsRead = (id: string) => {
    originalMarkAsRead(id);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    setNotificationsCount((prev) => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = () => {
    originalMarkAllAsRead();
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
    setNotificationsCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    originalDeleteNotification(id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    if (notification && !notification.isRead) {
      setNotificationsCount((prev) => Math.max(0, prev - 1));
    }
  };

  const clearAllNotifications = () => {
    originalClearAllNotifications();
    setNotifications([]);
    setNotificationsCount(0);
  };

  const addToFavorites = (item: any) => {
    originalAddToFavorites(item);
    setFavorites((prev) => [...prev, item]);
    setFavoritesCount((prev) => prev + 1);
  };

  const removeFromFavorites = (id: number) => {
    originalRemoveFromFavorites(id);
    setFavorites((prev) => prev.filter((item) => item.orderId !== id));
    setFavoritesCount((prev) => Math.max(0, prev - 1));
  };

  const clearAllFavorites = () => {
    originalClearAllFavorites();
    setFavorites([]);
    setFavoritesCount(0);
  };

  const value = {
    notifications,
    notificationsCount,
    favoritesCount,
    favorites,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite: originalIsFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
