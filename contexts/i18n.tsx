'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { ru } from '@/i18n/ru';
import { uz } from '@/i18n/uz';

// Define the shape of our translations
export interface Translations {
  [key: string]: string | Translations;
}

// Define the context type
interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguage: string;
  changeLanguage: (language: string) => void;
}

// Create the context
const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

// Dictionary of all translations
const translations: Record<string, Translations> = {
  ru,
  uz,
};

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userState, setLanguage } = useUser();
  const [currentLanguage, setCurrentLanguage] = useState(
    userState.language || 'ru'
  );

  // Update the current language when the user's language changes
  useEffect(() => {
    if (userState.language) {
      setCurrentLanguage(userState.language);
    }
  }, [userState.language]);

  // Function to change the language
  const changeLanguage = (language: string) => {
    setLanguage(language as 'ru' | 'uz');
    setCurrentLanguage(language as 'ru' | 'uz');
  };

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Split the key by dots to access nested translations
    const keys = key.split('.');
    let value: any = translations[currentLanguage];

    // Traverse the translation object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return the key if translation is not found
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    // If the value is not a string, return the key
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }

    // Replace parameters in the translation string
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(
          new RegExp(`{{${paramKey}}}`, 'g'),
          String(paramValue)
        );
      }, value);
    }

    return value;
  };

  return (
    <TranslationContext.Provider value={{ t, currentLanguage, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

// Hook to use the translation context
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
