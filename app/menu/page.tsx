'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Star,
  Search,
  MapPin,
  Heart,
  FileText,
  HelpCircle,
  Settings,
  MessageSquare,
  LogOut,
  ChevronRight,
  Camera,
  Trash2,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  photo: string;
  contactInfo: string;
  rating: number;
  experience: string;
  recommendations: number;
  complaints: number;
  id: string;
  position: string;
  telegram: string;
  whatsapp: string;
  mobile: string;
  role: string;
  studyCity: string;
  group: string;
  studyLanguage: string;
  curator: string;
  graduationDate: string;
}

const mockUserProfile: UserProfile = {
  name: 'Иван Иванов',
  photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJpnDbKs1AtPdDdTykryMdPvQF96FosVzOwA&s',
  contactInfo: 'ivan@example.com',
  rating: 5,
  experience: '2 года',
  recommendations: 10,
  complaints: 0,
  id: 'ID12345',
  position: 'Логист',
  telegram: '@ivan_logist',
  whatsapp: '+79001234567',
  mobile: '+79009876543',
  role: 'Студент',
  studyCity: 'Москва',
  group: 'Логистика-2023',
  studyLanguage: 'Русский',
  curator: 'Петр Петров',
  graduationDate: '01.06.2024',
};

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  action: () => void;
}

export default function MenuPage() {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const navigateToSearch = () => {
    router.push('/search');
    // Implement navigation to search page
  };

  const navigateToSettings = () => {
    router.push('/settings');
    // Implement navigation to settings page
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Search className='h-5 w-5 mr-2' />,
      text: 'Поиск участников и список фирм',
      action: navigateToSearch,
    },
    {
      icon: <MapPin className='h-5 w-5 mr-2' />,
      text: 'Насчет расстояний',
      action: () => {},
    },
    {
      icon: <Heart className='h-5 w-5 mr-2' />,
      text: 'Избранные',
      action: () => {},
    },
    {
      icon: <FileText className='h-5 w-5 mr-2' />,
      text: 'Инструкции',
      action: () => {},
    },
    {
      icon: <HelpCircle className='h-5 w-5 mr-2' />,
      text: 'Поддержка',
      action: () => {},
    },
    {
      icon: <Settings className='h-5 w-5 mr-2' />,
      text: 'Настройки приложения',
      action: navigateToSettings,
    },
    {
      icon: <MessageSquare className='h-5 w-5 mr-2' />,
      text: 'Отзывы',
      action: () => {},
    },
  ];

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ));
  };

  const renderProfile = () => (
    <Card className='mt-4'>
      <CardContent className='p-6'>
        <h2 className='text-2xl font-bold mb-4'>{userProfile.name}</h2>
        <p className='mb-2'>Контактная информация: {userProfile.contactInfo}</p>
        <p className='mb-2 text-green-600 font-semibold'>Профиль подтвержден</p>
        <div className='flex mb-2'>{renderStars(userProfile.rating)}</div>
        <p className='mb-2'>Стаж: {userProfile.experience}</p>
        <p className='mb-2'>Рекомендации: {userProfile.recommendations}</p>
        <p className='mb-2'>Жалобы: {userProfile.complaints}</p>
        <p className='mb-4'>ID: {userProfile.id}</p>

        <h3 className='text-xl font-semibold mb-2'>Анкета участника</h3>
        <p className='mb-2'>Должность: {userProfile.position}</p>
        <p className='mb-2'>Telegram: {userProfile.telegram}</p>
        <p className='mb-2'>WhatsApp: {userProfile.whatsapp}</p>
        <p className='mb-2'>Мобильный: {userProfile.mobile}</p>
        <p className='mb-2'>Кем являетесь: {userProfile.role}</p>
        <p className='mb-2'>Город обучения: {userProfile.studyCity}</p>
        <p className='mb-2'>Группа: {userProfile.group}</p>
        <p className='mb-2'>Язык обучения: {userProfile.studyLanguage}</p>
        <p className='mb-2'>Имя куратора: {userProfile.curator}</p>
        <p className='mb-4'>
          Дата окончания учебы: {userProfile.graduationDate}
        </p>

        <Button className='w-full' variant='destructive'>
          <LogOut className='h-5 w-5 mr-2' />
          Выйти
        </Button>
      </CardContent>
    </Card>
  );

  const EditProfileModal = () => (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex items-center justify-center mb-4'>
            <Avatar className='h-24 w-24'>
              <img src={userProfile.photo} alt={userProfile.name} />
            </Avatar>
            <div className='ml-4'>
              <Button variant='outline' size='sm' className='mb-2'>
                <Camera className='h-4 w-4 mr-2' />
                Изменить
              </Button>
              <Button variant='outline' size='sm'>
                <Trash2 className='h-4 w-4 mr-2' />
                Удалить
              </Button>
            </div>
          </div>
          <Input
            placeholder='ФИО'
            value={userProfile.name}
            onChange={(e) =>
              setUserProfile({ ...userProfile, name: e.target.value })
            }
          />
          <Input
            placeholder='Мобильный телефон'
            value={userProfile.mobile}
            onChange={(e) =>
              setUserProfile({ ...userProfile, mobile: e.target.value })
            }
          />
          <Input
            placeholder='Должность'
            value={userProfile.position}
            onChange={(e) =>
              setUserProfile({ ...userProfile, position: e.target.value })
            }
          />
          <Input
            placeholder='Город'
            value={userProfile.studyCity}
            onChange={(e) =>
              setUserProfile({ ...userProfile, studyCity: e.target.value })
            }
          />
          <Input
            placeholder='Telegram'
            value={userProfile.telegram}
            onChange={(e) =>
              setUserProfile({ ...userProfile, telegram: e.target.value })
            }
          />
          <Input
            placeholder='WhatsApp'
            value={userProfile.whatsapp}
            onChange={(e) =>
              setUserProfile({ ...userProfile, whatsapp: e.target.value })
            }
          />
        </div>
        <Button onClick={() => setIsEditModalOpen(false)}>
          Сохранить изменения
        </Button>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <h1 className='text-3xl font-bold text-center mb-6'>Меню</h1>

      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <Avatar className='h-12 w-12 mr-4'>
            <img src={userProfile.photo} alt={userProfile.name} />
          </Avatar>
          <div>
            <p className='font-semibold'>{userProfile.name}</p>
            <Button
              variant='link'
              className='p-0'
              onClick={() => setShowProfile(!showProfile)}
            >
              Личный кабинет
            </Button>
          </div>
        </div>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsEditModalOpen(true)}
        >
          <ChevronRight className='h-5 w-5' />
        </Button>
      </div>

      {showProfile ? (
        renderProfile()
      ) : (
        <>
          <Input className='mb-4' placeholder='Поиск...' />
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant='ghost'
              className='w-full justify-start mb-2'
              onClick={item.action}
            >
              {item.icon}
              {item.text}
            </Button>
          ))}
        </>
      )}

      <EditProfileModal />
      <NavigationMenu userRole={'carrier'} />
    </div>
  );
}
