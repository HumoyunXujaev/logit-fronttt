'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useTranslation } from '@/contexts/i18n';

interface LanguageSelectorProps {
  onChange?: (language: string) => void;
  className?: string;
}

export default function LanguageSelector({
  onChange,
  className = '',
}: LanguageSelectorProps) {
  const { t, currentLanguage, changeLanguage } = useTranslation();

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
    if (onChange) {
      onChange(value);
    }
  };

  const languages = [
    { code: 'ru', name: t('selectLang.ru'), flag: '🇷🇺' },
    { code: 'uz', name: t('selectLang.uz'), flag: '🇺🇿' },
  ];

  // Находим текущий выбранный язык
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={className}>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <div className='flex items-center justify-start w-full'>
            <span className='mr-2 text-base'>
              {selectedLanguage?.flag || '🌐'}
            </span>
            <span className='text-sm font-medium'>
              {selectedLanguage?.name || t('selectLang.select') || 'Выберите язык'}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className='flex items-center w-full'>
                <span className='mr-2 text-base'>{lang.flag}</span>
                <span className='text-sm font-medium'>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}