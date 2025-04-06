'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Search, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/i18n';

interface SearchResult {
  id: string;
  name: string;
  type: 'participant' | 'firm';
  details: string;
  avatar?: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    name: 'Иван Иванов',
    type: 'participant',
    details: 'Логист, Москва',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIRFWZntgIF7DtKKfdha91qSbJdq65mzTUNQNx2hG2Jc2PpLmjRszXG0DoUoWg6eyq2A&usqp=CAU',
  },
  {
    id: '2',
    name: 'ООО "Логистика+"',
    type: 'firm',
    details: 'Транспортная компания, Санкт-Петербург',
  },
  {
    id: '3',
    name: 'Анна Петрова',
    type: 'participant',
    details: 'Менеджер, Казань',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIRFWZntgIF7DtKKfdha91qSbJdq65mzTUNQNx2hG2Jc2PpLmjRszXG0DoUoWg6eyq2A&usqp=CAU',
  },
  {
    id: '4',
    name: 'ИП Сидоров',
    type: 'firm',
    details: 'Грузоперевозки, Новосибирск',
  },
];

export default function SearchParticipantsAndFirms() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = () => {
    setIsSearching(true);
    const results = mockSearchResults.filter(
      (result) =>
        result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const renderSearchResults = () => (
    <div className='mt-4 space-y-4'>
      {searchResults.map((result) => (
        <Card key={result.id}>
          <CardContent className='flex items-center p-4'>
            {result.type === 'participant' && result.avatar && (
              <Avatar className='h-10 w-10 mr-4'>
                <img src={result.avatar} alt={result.name} />
              </Avatar>
            )}
            {result.type === 'firm' && (
              <div className='h-10 w-10 mr-4 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-blue-600 font-bold'>
                  {result.name[0]}
                </span>
              </div>
            )}
            <div>
              <h3 className='font-semibold'>{result.name}</h3>
              <p className='text-sm text-gray-600'>{result.details}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='flex items-center mb-6'>
        <Button
          variant='ghost'
          onClick={() => {
            router.push('/menu');
          }}
          className='mr-2'
        >
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-2xl font-bold'>{t('search.title')}</h1>
      </div>
      <div className='flex mb-4'>
        <Input
          type='text'
          placeholder={t('search.searchByCodeOrName')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='mr-2'
        />
        <Button onClick={handleSearch}>
          <Search className='h-4 w-4 mr-2' />
          {t('common.search')}
        </Button>
      </div>
      {isSearching && searchResults.length === 0 && (
        <p className='text-center text-gray-600 mt-4'>
          {t('search.nothingFound')}
        </p>
      )}
      {isSearching && searchResults.length > 0 && renderSearchResults()}
    </div>
  );
}
