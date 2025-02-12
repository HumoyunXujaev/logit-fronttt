'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
// import { useUser } from '@/contexts/UserContext';
import { UserState } from '@/types';
import { toast } from 'sonner';
import AuthService from '@/lib/auth';

export default function RegistrationPage() {
  const router = useRouter();
  const { userState, setUserData, setUserRole, setUserType, setLanguage } =
    useUser();
  const [formData, setFormData] = useState<UserState['userData']>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if (!userState.role) {
    //   router.push('/select-role');
    //   return;
    // }

    // Pre-fill form with Telegram data if available
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const { user } = window.Telegram.WebApp.initDataUnsafe;
      setFormData((prev) => ({
        ...prev,
        fullName:
          user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
        telegramNumber: user.username ? `@${user.username}` : '',
      }));
    }
    if (userState) {
      console.log(userState.language, 'userstatelang');
      console.log(userState.type, 'userstatetype');
      console.log(userState.role, 'userstaterole');
    }
  }, [userState.role, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const requiredFields = getRequiredFields();
    // const missingFields = requiredFields.filter((field) => !formData[field]);
    const missingFields = requiredFields.filter(
      (field) =>
        formData && formData[field as keyof typeof formData] === undefined
    );

    if (missingFields.length > 0) {
      toast.error(
        `Пожалуйста, заполните обязательные поля: ${missingFields.join(', ')}`
      );
      return false;
    }

    return true;
  };

  const getRequiredFields = () => {
    const commonFields = ['fullName', 'phoneNumber'];

    switch (userState.role) {
      case 'logistics-company':
      case 'cargo-owner':
        return [...commonFields, 'companyName'];
      case 'student':
        return [...commonFields, 'groupName']; //'studentId'];
      case 'carrier':
        return [...commonFields, 'licenseNumber'];
      default:
        return commonFields;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // if (window.Telegram?.WebApp) {
      const webApp = window?.Telegram?.WebApp;

      // Отправляем регистрацию с полными данными
      const result = await AuthService.registerUser({
        telegramData: webApp,
        userData: {
          type: userState.type,
          role: userState.role,
          preferred_language: userState.language,
          ...formData,
        },
      });

      console.log(result, 'result');
      // }
      // await setUserData({
      //   result,

      //   // role: userState.role,
      // });
      await setUserRole(userState.role);
      await setUserType(userState.type);
      await setLanguage(userState.language);
      // await setUserType({ type: userState.type })

      toast.success('Регистрация успешно завершена');

      if (userState.role === 'carrier') {
        router.push('/driver-verification');
      } else {
        router.push('/menu');
      }
    } catch (error) {
      toast.error('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({});
  };

  const renderExpeditorForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='companyName'
        placeholder='Название компании'
        onChange={handleInputChange}
        value={formData?.companyName || ''}
        required
      />
      <Input
        name='fullName'
        placeholder='ФИО'
        onChange={handleInputChange}
        value={formData?.fullName || ''}
        required
      />
      <Input
        name='telegramNumber'
        placeholder='Telegram номер'
        onChange={handleInputChange}
        value={formData?.telegramNumber || ''}
      />
      <Input
        name='whatsappNumber'
        placeholder='WhatsApp номер'
        onChange={handleInputChange}
        value={formData?.whatsappNumber || ''}
      />
      <Input
        name='phoneNumber'
        placeholder='Мобильный номер'
        onChange={handleInputChange}
        value={formData?.phoneNumber || ''}
        required
      />
      <Select
        name='position'
        onValueChange={(value) => handleSelectChange('position', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Кем являетесь' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='director'>Директор</SelectItem>
          <SelectItem value='manager'>Руководитель</SelectItem>
          <SelectItem value='dispatcher'>Диспетчер</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='registrationCertificate'
        placeholder='Свидетельство о гос. регистрации юр. лица'
        onChange={handleInputChange}
        value={formData?.registrationCertificate || ''}
      />
      <div className='flex justify-between mt-6'>
        <Button variant='destructive' onClick={clearForm} type='button'>
          Очистить
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );

  const renderCargoOwnerForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='fullName'
        placeholder='ФИО'
        onChange={handleInputChange}
        value={formData?.fullName || ''}
        required
      />
      <Input
        name='telegramNumber'
        placeholder='Telegram номер'
        onChange={handleInputChange}
        value={formData?.telegramNumber || ''}
      />
      <Input
        name='whatsappNumber'
        placeholder='WhatsApp номер'
        onChange={handleInputChange}
        value={formData?.whatsappNumber || ''}
      />
      <Input
        name='phoneNumber'
        placeholder='Мобильный номер'
        onChange={handleInputChange}
        value={formData?.phoneNumber || ''}
        required
      />
      <Select
        name='role'
        onValueChange={(value) => handleSelectChange('role', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Кем являетесь' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='shipper'>Грузоотправитель</SelectItem>
          <SelectItem value='consignee'>Грузополучатель</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='registrationCertificate'
        placeholder='Свидетельство о гос. регистрации юр. лица'
        onChange={handleInputChange}
        value={formData?.registrationCertificate || ''}
      />

      <div className='flex justify-between mt-6'>
        <Button variant='destructive' onClick={clearForm} type='button'>
          Очистить
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );

  const renderStudentForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='fullName'
        placeholder='ФИО'
        onChange={handleInputChange}
        value={formData?.fullName || ''}
        required
      />
      <Input
        name='telegramNumber'
        placeholder='Telegram номер'
        onChange={handleInputChange}
        value={formData?.telegramNumber || ''}
      />
      <Input
        name='whatsappNumber'
        placeholder='WhatsApp номер'
        onChange={handleInputChange}
        value={formData?.whatsappNumber || ''}
      />
      <Input
        name='phoneNumber'
        placeholder='Мобильный номер'
        onChange={handleInputChange}
        value={formData?.phoneNumber || ''}
        required
      />
      <Select
        name='studentStatus'
        onValueChange={(value) => handleSelectChange('studentStatus', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Кем являетесь' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='current'>Студент Логит Скул</SelectItem>
          <SelectItem value='graduate'>Выпускник Логит Скул</SelectItem>
        </SelectContent>
      </Select>
      <Select
        name='city'
        onValueChange={(value) => handleSelectChange('city', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Город обучения' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='tashkent'>Ташкент</SelectItem>
          <SelectItem value='samarkand'>Самарканд</SelectItem>
        </SelectContent>
      </Select>
      <Select
        name='tariff'
        onValueChange={(value) => handleSelectChange('tariff', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Тариф обучения' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='standard'>Стандарт Про</SelectItem>
          <SelectItem value='vip'>ВИП Про</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='groupName'
        placeholder='Название группы'
        onChange={handleInputChange}
        value={formData?.groupName || ''}
        required
      />
      <Select
        name='studyLanguage'
        onValueChange={(value) => handleSelectChange('studyLanguage', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder='Язык обучения' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='russian'>Русский</SelectItem>
          <SelectItem value='uzbek'>Узбекский</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='curatorName'
        placeholder='Имя куратора'
        onChange={handleInputChange}
        value={formData?.curatorName || ''}
      />
      <Input
        name='endDate'
        type='date'
        placeholder='Дата окончания обучения'
        onChange={handleInputChange}
        value={formData?.endDate || ''}
      />

      <div className='flex justify-between mt-6'>
        <Button variant='destructive' onClick={clearForm} type='button'>
          Очистить
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );

  // Show only the relevant form based on user role
  console.log(userState.role, 'userstate');

  const renderForm = () => {
    switch (userState.role) {
      case 'logistics-company':
        return renderExpeditorForm();
      case 'cargo-owner':
        return renderCargoOwnerForm();
      case 'student':
        return renderStudentForm();
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-blue-900 p-4'>
      <h1 className='text-3xl font-bold text-white text-center mb-6'>
        Пройти регистрацию
      </h1>
      <div className='bg-white rounded-lg p-6 max-w-md mx-auto'>
        {renderForm()}
      </div>
    </div>
  );
}
