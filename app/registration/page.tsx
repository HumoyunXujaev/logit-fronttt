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
import { UserState } from '@/types';
import { toast } from 'sonner';
import AuthService from '@/lib/auth';
import { useTranslation } from '@/contexts/i18n';

export default function RegistrationPage() {
  const router = useRouter();
  const { userState, setUserData, setUserRole, setUserType, setLanguage } =
    useUser();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UserState['userData']>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    const missingFields = requiredFields.filter(
      (field) =>
        formData && formData[field as keyof typeof formData] === undefined
    );

    if (missingFields.length > 0) {
      toast.error(`${t('cargo.requiredField')}: ${missingFields.join(', ')}`);
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
        return [...commonFields, 'groupName'];
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
      const webApp = window?.Telegram?.WebApp;

      // Submit registration with full data
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

      await setUserRole(userState.role);
      await setUserType(userState.type);
      await setLanguage(userState.language);

      toast.success(t('registration.successMessage'));

      if (userState.role === 'carrier') {
        router.push('/driver-verification');
      } else {
        router.push('/menu');
      }
    } catch (error) {
      toast.error(t('common.error'));
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
        placeholder={t('registration.companyName')}
        onChange={handleInputChange}
        value={formData?.companyName || ''}
        required
      />
      <Input
        name='fullName'
        placeholder={t('registration.fullName')}
        onChange={handleInputChange}
        value={formData?.fullName || ''}
        required
      />
      <Input
        name='telegramNumber'
        placeholder={t('registration.telegram')}
        onChange={handleInputChange}
        value={formData?.telegramNumber || ''}
      />
      <Input
        name='whatsappNumber'
        placeholder={t('registration.whatsapp')}
        onChange={handleInputChange}
        value={formData?.whatsappNumber || ''}
      />
      <Input
        name='phoneNumber'
        placeholder={t('registration.phone')}
        onChange={handleInputChange}
        value={formData?.phoneNumber || ''}
        required
      />
      <Select
        name='position'
        onValueChange={(value) => handleSelectChange('position', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('registration.position')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='director'>{t('registration.director')}</SelectItem>
          <SelectItem value='manager'>{t('registration.manager')}</SelectItem>
          <SelectItem value='dispatcher'>
            {t('registration.dispatcher')}
          </SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='registrationCertificate'
        placeholder={t('registration.registrationCertificate')}
        onChange={handleInputChange}
        value={formData?.registrationCertificate || ''}
      />
      <div className='flex justify-between mt-6'>
        <Button variant='destructive' onClick={clearForm} type='button'>
          {t('registration.clearButton')}
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? t('common.loading') : t('registration.saveButton')}
        </Button>
      </div>
    </form>
  );

  const renderCargoOwnerForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='fullName'
        placeholder={t('registration.fullName')}
        onChange={handleInputChange}
        value={formData?.fullName || ''}
        required
      />
      <Input
        name='telegramNumber'
        placeholder={t('registration.telegram')}
        onChange={handleInputChange}
        value={formData?.telegramNumber || ''}
      />
      <Input
        name='whatsappNumber'
        placeholder={t('registration.whatsapp')}
        onChange={handleInputChange}
        value={formData?.whatsappNumber || ''}
      />
      <Input
        name='phoneNumber'
        placeholder={t('registration.phone')}
        onChange={handleInputChange}
        value={formData?.phoneNumber || ''}
        required
      />
      <Select
        name='role'
        onValueChange={(value) => handleSelectChange('role', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('registration.position')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='shipper'>{t('registration.shipper')}</SelectItem>
          <SelectItem value='consignee'>
            {t('registration.consignee')}
          </SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='registrationCertificate'
        placeholder={t('registration.registrationCertificate')}
        onChange={handleInputChange}
        value={formData?.registrationCertificate || ''}
      />
      <div className='flex justify-between mt-6'>
        <Button variant='destructive' onClick={clearForm} type='button'>
          {t('registration.clearButton')}
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? t('common.loading') : t('registration.saveButton')}
        </Button>
      </div>
    </form>
  );

  const renderStudentForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='fullName'
        placeholder={t('registration.fullName')}
        onChange={handleInputChange}
        value={formData?.fullName || ''}
        required
      />
      <Input
        name='telegramNumber'
        placeholder={t('registration.telegram')}
        onChange={handleInputChange}
        value={formData?.telegramNumber || ''}
      />
      <Input
        name='whatsappNumber'
        placeholder={t('registration.whatsapp')}
        onChange={handleInputChange}
        value={formData?.whatsappNumber || ''}
      />
      <Input
        name='phoneNumber'
        placeholder={t('registration.phone')}
        onChange={handleInputChange}
        value={formData?.phoneNumber || ''}
        required
      />
      <Select
        name='studentStatus'
        onValueChange={(value) => handleSelectChange('studentStatus', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('registration.studentStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='current'>
            {t('registration.currentStudent')}
          </SelectItem>
          <SelectItem value='graduate'>{t('registration.graduate')}</SelectItem>
        </SelectContent>
      </Select>
      <Select
        name='city'
        onValueChange={(value) => handleSelectChange('city', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('registration.cityOfEducation')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='tashkent'>{t('registration.tashkent')}</SelectItem>
          <SelectItem value='samarkand'>
            {t('registration.samarkand')}
          </SelectItem>
        </SelectContent>
      </Select>
      <Select
        name='tariff'
        onValueChange={(value) => handleSelectChange('tariff', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('registration.educationTariff')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='standard'>
            {t('registration.standardPro')}
          </SelectItem>
          <SelectItem value='vip'>{t('registration.vipPro')}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='groupName'
        placeholder={t('registration.groupName')}
        onChange={handleInputChange}
        value={formData?.groupName || ''}
        required
      />
      <Select
        name='studyLanguage'
        onValueChange={(value) => handleSelectChange('studyLanguage', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('registration.studyLanguage')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='russian'>{t('registration.russian')}</SelectItem>
          <SelectItem value='uzbek'>{t('registration.uzbek')}</SelectItem>
        </SelectContent>
      </Select>
      <Input
        name='curatorName'
        placeholder={t('registration.curatorName')}
        onChange={handleInputChange}
        value={formData?.curatorName || ''}
      />
      <Input
        name='endDate'
        type='date'
        placeholder={t('registration.endDate')}
        onChange={handleInputChange}
        value={formData?.endDate || ''}
      />
      <div className='flex justify-between mt-6'>
        <Button variant='destructive' onClick={clearForm} type='button'>
          {t('registration.clearButton')}
        </Button>
        <Button type='submit' disabled={isLoading}>
          {isLoading ? t('common.loading') : t('registration.saveButton')}
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
        {t('registration.title')}
      </h1>
      <div className='bg-white rounded-lg p-6 max-w-md mx-auto'>
        {renderForm()}
      </div>
    </div>
  );
}
