'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FavoriteItem, useFavorites } from '@/hooks/useFavorites';

interface AppContextType {
  favoritesCount: number;
  favorites: FavoriteItem[];
  addToFavorites: (item: any) => void;
  removeFromFavorites: (id: number) => void;
  clearAllFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const {
    favorites: originalFavorites,
    addToFavorites: originalAddToFavorites,
    removeFromFavorites: originalRemoveFromFavorites,
    isFavorite: originalIsFavorite,
    clearAllFavorites: originalClearAllFavorites,
  } = useFavorites();

  const [favorites, setFavorites] = useState(originalFavorites);
  const [favoritesCount, setFavoritesCount] = useState(
    originalFavorites.length
  );

  useEffect(() => {
    setFavorites(originalFavorites);
    setFavoritesCount(originalFavorites.length);
  }, [originalFavorites]);

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
    favoritesCount,
    favorites,
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
