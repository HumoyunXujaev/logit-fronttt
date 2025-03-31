'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

  return (
    <div className={className}>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className='flex items-center'>
                <span className='mr-2'>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
