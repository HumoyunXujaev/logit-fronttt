import { useState, useEffect } from 'react';

export interface FavoriteItem {
  id: string;
  type: 'cargo' | 'route' | 'carrier';
  title: string;
  description: string;
  createdAt: Date;
  details: Record<string, any>;
  orderId?: number;
}

const FAVORITES_STORAGE_KEY = 'logit_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteItem[]) => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addToFavorites = (item: Omit<FavoriteItem, 'id' | 'createdAt'>) => {
    const newItem: FavoriteItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    // Проверяем, нет ли уже такого элемента
    const exists = favorites.some(
      (favorite) => favorite.type === item.type && favorite.title === item.title
    );

    if (!exists) {
      const updatedFavorites = [...favorites, newItem];
      saveFavorites(updatedFavorites);
      return true;
    }
    return false;
  };

  const removeFromFavorites = (itemId: number) => {
    const updatedFavorites = favorites.filter(
      (item) => item.orderId !== itemId
    );
    saveFavorites(updatedFavorites);
  };

  const isFavorite = (itemId: number) => {
    return favorites.some((item) => item.orderId === itemId);
  };

  const getFavoritesByType = (type: FavoriteItem['type']) => {
    return favorites.filter((item) => item.type === type);
  };

  const clearAllFavorites = () => {
    saveFavorites([]);
  };

  const updateFavoriteDetails = (
    itemId: string,
    details: Record<string, any>
  ) => {
    const updatedFavorites = favorites.map((item) =>
      item.id === itemId
        ? { ...item, details: { ...item.details, ...details } }
        : item
    );
    saveFavorites(updatedFavorites);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesByType,
    clearAllFavorites,
    updateFavoriteDetails,
  };
};
