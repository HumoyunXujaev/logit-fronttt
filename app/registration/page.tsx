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
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { UserState } from '@/types';
import { toast } from 'sonner';
import AuthService from '@/lib/auth';
import { useTranslation } from '@/contexts/i18n';
import {
  User,
  Building2,
  Calendar,
  GraduationCap,
  MapPin,
  Languages,
  Users,
  Briefcase,
  CheckCircle,
  Loader2,
  ChevronLeft,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
        username: user.username ? `@${user.username}` : '',
      }));
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
    // Modified validation to check for empty strings and null values
    const missingFields = requiredFields.filter((field) => {
      const value = formData
        ? formData[field as keyof typeof formData]
        : undefined;
      return value === undefined || value === null || value === '';
    });

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

  const renderFormTitle = () => {
    switch (userState.role) {
      case 'logistics-company':
        return (
          t('registration.title') +
          ' - ' +
          t('reviews.userRoles.logistics-company')
        );
      case 'cargo-owner':
        return (
          t('registration.title') + ' - ' + t('reviews.userRoles.cargo-owner')
        );
      case 'student':
        return t('registration.title') + ' - ' + t('reviews.userRoles.student');
      case 'carrier':
        return t('registration.title') + ' - ' + t('reviews.userRoles.carrier');
      default:
        return t('registration.title');
    }
  };

  const renderRoleIcon = () => {
    switch (userState.role) {
      case 'logistics-company':
        return <Briefcase className='h-6 w-6 text-blue-500' />;
      case 'cargo-owner':
        return <Building2 className='h-6 w-6 text-blue-500' />;
      case 'student':
        return <GraduationCap className='h-6 w-6 text-blue-500' />;
      case 'carrier':
        return <User className='h-6 w-6 text-blue-500' />;
      default:
        return <User className='h-6 w-6 text-blue-500' />;
    }
  };

  const renderExpeditorForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.companyName')}*
        </label>
        <Input
          name='companyName'
          placeholder={t('registration.companyName')}
          onChange={handleInputChange}
          value={formData?.companyName || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.fullName')}*
        </label>
        <Input
          name='fullName'
          placeholder={t('registration.fullName')}
          onChange={handleInputChange}
          value={formData?.fullName || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.telegram')}
          </label>
          <Input
            name='username'
            placeholder={t('registration.telegram')}
            onChange={handleInputChange}
            value={formData?.username || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.whatsapp')}
          </label>
          <Input
            name='whatsappNumber'
            placeholder={t('registration.whatsapp')}
            onChange={handleInputChange}
            value={formData?.whatsappNumber || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.phone')}*
        </label>
        <Input
          name='phoneNumber'
          placeholder={t('registration.phone')}
          onChange={handleInputChange}
          value={formData?.phoneNumber || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.position')}
        </label>
        <Select
          name='position'
          value={formData?.position || ''}
          onValueChange={(value) => handleSelectChange('position', value)}
        >
          <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
            <SelectValue placeholder={t('registration.position')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='director'>
              {t('registration.director')}
            </SelectItem>
            <SelectItem value='manager'>{t('registration.manager')}</SelectItem>
            <SelectItem value='dispatcher'>
              {t('registration.dispatcher')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.registrationCertificate')}
        </label>
        <Input
          name='registrationCertificate'
          placeholder={t('registration.registrationCertificate')}
          onChange={handleInputChange}
          value={formData?.registrationCertificate || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        />
      </div>

      <div className='flex justify-between mt-8'>
        <Button
          variant='outline'
          onClick={clearForm}
          type='button'
          className='flex gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
        >
          {t('registration.clearButton')}
        </Button>

        <Button
          type='submit'
          disabled={isLoading}
          className='bg-blue-600 hover:bg-blue-700 text-white flex gap-2'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              {t('common.loading')}
            </>
          ) : (
            <>
              <CheckCircle className='h-4 w-4' />
              {t('registration.saveButton')}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  const renderCargoOwnerForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.companyName')}*
        </label>
        <Input
          name='companyName'
          placeholder={t('registration.companyName')}
          onChange={handleInputChange}
          value={formData?.companyName || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.fullName')}*
        </label>
        <Input
          name='fullName'
          placeholder={t('registration.fullName')}
          onChange={handleInputChange}
          value={formData?.fullName || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.telegram')}
          </label>
          <Input
            name='username'
            placeholder={t('registration.telegram')}
            onChange={handleInputChange}
            value={formData?.username || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.whatsapp')}
          </label>
          <Input
            name='whatsappNumber'
            placeholder={t('registration.whatsapp')}
            onChange={handleInputChange}
            value={formData?.whatsappNumber || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.phone')}*
        </label>
        <Input
          name='phoneNumber'
          placeholder={t('registration.phone')}
          onChange={handleInputChange}
          value={formData?.phoneNumber || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.position')}
        </label>
        <Select
          name='role'
          value={formData?.position || ''}
          onValueChange={(value) => handleSelectChange('position', value)}
        >
          <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
            <SelectValue placeholder={t('registration.position')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='shipper'>{t('registration.shipper')}</SelectItem>
            <SelectItem value='consignee'>
              {t('registration.consignee')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.registrationCertificate')}
        </label>
        <Input
          name='registrationCertificate'
          placeholder={t('registration.registrationCertificate')}
          onChange={handleInputChange}
          value={formData?.registrationCertificate || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        />
      </div>

      <div className='flex justify-between mt-8'>
        <Button
          variant='outline'
          onClick={clearForm}
          type='button'
          className='flex gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
        >
          {t('registration.clearButton')}
        </Button>

        <Button
          type='submit'
          disabled={isLoading}
          className='bg-blue-600 hover:bg-blue-700 text-white flex gap-2'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              {t('common.loading')}
            </>
          ) : (
            <>
              <CheckCircle className='h-4 w-4' />
              {t('registration.saveButton')}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  const renderStudentForm = () => (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.fullName')}*
        </label>
        <Input
          name='fullName'
          placeholder={t('registration.fullName')}
          onChange={handleInputChange}
          value={formData?.fullName || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.telegram')}
          </label>
          <Input
            name='username'
            placeholder={t('registration.telegram')}
            onChange={handleInputChange}
            value={formData?.username || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.whatsapp')}
          </label>
          <Input
            name='whatsappNumber'
            placeholder={t('registration.whatsapp')}
            onChange={handleInputChange}
            value={formData?.whatsappNumber || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.phone')}*
        </label>
        <Input
          name='phoneNumber'
          placeholder={t('registration.phone')}
          onChange={handleInputChange}
          value={formData?.phoneNumber || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          required
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.studentStatus')}
          </label>
          <Select
            name='studentStatus'
            value={formData?.studentStatus || ''}
            onValueChange={(value) =>
              handleSelectChange('studentStatus', value)
            }
          >
            <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
              <SelectValue placeholder={t('registration.studentStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='current'>
                {t('registration.currentStudent')}
              </SelectItem>
              <SelectItem value='graduate'>
                {t('registration.graduate')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.cityOfEducation')}
          </label>
          <Select
            name='city'
            value={formData?.city || ''}
            onValueChange={(value) => handleSelectChange('city', value)}
          >
            <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
              <SelectValue placeholder={t('registration.cityOfEducation')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='tashkent'>
                {t('registration.tashkent')}
              </SelectItem>
              <SelectItem value='samarkand'>
                {t('registration.samarkand')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.educationTariff')}
          </label>
          <Select
            name='tariff'
            value={formData?.tariff || ''}
            onValueChange={(value) => handleSelectChange('tariff', value)}
          >
            <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
              <SelectValue placeholder={t('registration.educationTariff')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='standard'>
                {t('registration.standardPro')}
              </SelectItem>
              <SelectItem value='vip'>{t('registration.vipPro')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.groupName')}*
          </label>
          <Input
            name='groupName'
            placeholder={t('registration.groupName')}
            onChange={handleInputChange}
            value={formData?.groupName || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.studyLanguage')}
          </label>
          <Select
            name='studyLanguage'
            value={formData?.studyLanguage || ''}
            onValueChange={(value) =>
              handleSelectChange('studyLanguage', value)
            }
          >
            <SelectTrigger className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
              <SelectValue placeholder={t('registration.studyLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='russian'>
                {t('registration.russian')}
              </SelectItem>
              <SelectItem value='uzbek'>{t('registration.uzbek')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('registration.curatorName')}
          </label>
          <Input
            name='curatorName'
            placeholder={t('registration.curatorName')}
            onChange={handleInputChange}
            value={formData?.curatorName || ''}
            className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-medium text-gray-700'>
          {t('registration.endDate')}
        </label>
        <Input
          name='endDate'
          type='date'
          placeholder={t('registration.endDate')}
          onChange={handleInputChange}
          value={formData?.endDate || ''}
          className='border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        />
      </div>

      <div className='flex justify-between mt-8'>
        <Button
          variant='outline'
          onClick={clearForm}
          type='button'
          className='flex gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
        >
          {t('registration.clearButton')}
        </Button>

        <Button
          type='submit'
          disabled={isLoading}
          className='bg-blue-600 hover:bg-blue-700 text-white flex gap-2'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              {t('common.loading')}
            </>
          ) : (
            <>
              <CheckCircle className='h-4 w-4' />
              {t('registration.saveButton')}
            </>
          )}
        </Button>
      </div>
    </form>
  );

  // Show only the relevant form based on user role
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
    <div className='min-h-screen bg-gradient-to-br from-blue-700 to-blue-600 p-4 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-2xl mx-auto'
      >
        <Button
          variant='ghost'
          onClick={() => router.push('/select-role?type=' + userState.type)}
          className='mb-6 text-white hover:bg-blue-600/20'
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>

        <Card className='overflow-hidden border-0 shadow-xl'>
          <CardHeader className='bg-gray-50 border-b border-gray-100'>
            <div className='flex items-center'>
              {renderRoleIcon()}
              <div className='ml-2'>
                <CardTitle>{renderFormTitle()}</CardTitle>
                <CardDescription>
                  {t('registration.fillProfileData')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-6 pt-8'>{renderForm()}</CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
