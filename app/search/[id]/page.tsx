'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/contexts/i18n';
import NavigationMenu from '@/app/components/NavigationMenu';
import {
  ArrowLeft,
  Mail,
  Phone,
  Star,
  Truck,
  Package,
  Building2,
  Award,
  User,
  FileText,
  Shield,
  Check,
  Heart,
  MapPin,
  Calendar,
  Info,
  Loader2,
  CreditCard,
  TruckIcon,
  GraduationCap,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface UserDocument {
  id: string;
  type: string;
  title: string;
  file_url: string;
  uploaded_at: string;
  verified: boolean;
}

interface User {
  telegram_id: string;
  username: string;
  full_name: string;
  first_name: string;
  last_name: string;
  type: string;
  role: string;
  preferred_language: string;
  phone_number?: string;
  whatsapp_number?: string;
  company_name?: string;
  position?: string;
  student_id?: string;
  group_name?: string;
  study_language?: string;
  curator_name?: string;
  end_date?: string;
  rating: number;
  rating_count: number;
  is_verified: boolean;
  verification_date?: string;
  date_joined: string;
  last_login?: string;
  documents: UserDocument[];
  tariff?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userState } = useUser();
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/${userId}/public-profile/`);
        setUser(response);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(
          'Failed to load user profile. The user may not exist or you may not have permission to view this profile.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'carrier':
        return <TruckIcon className='h-5 w-5' />;
      case 'cargo-owner':
        return <Package className='h-5 w-5' />;
      case 'logistics-company':
      case 'transport-company':
        return <Building2 className='h-5 w-5' />;
      case 'student':
        return <GraduationCap className='h-5 w-5' />;
      default:
        return <Star className='h-5 w-5' />;
    }
  };

  const getRoleLabel = (roleValue: string) => {
    return t(`reviews.userRoles.${roleValue}`) || roleValue;
  };

  const getTypeLabel = (typeValue: string) => {
    const types: Record<string, string> = {
      individual: t('selectPerson.individual'),
      legal: t('selectPerson.legal'),
    };
    return types[typeValue] || typeValue;
  };

  const getDocumentTypeLabel = (docType: string) => {
    const types: Record<string, string> = {
      driver_license: t('vehicle.documentTypes.driver_license'),
      passport: t('vehicle.documentTypes.passport'),
      company_certificate: t('vehicle.documentTypes.company_certificate'),
      other: t('vehicle.documentTypes.other'),
    };
    return types[docType] || docType;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center'>
        <div className='flex flex-col items-center'>
          <Loader2 className='h-12 w-12 animate-spin text-blue-600 mb-4' />
          <p className='text-lg text-blue-600 animate-pulse'>
            {t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4'>
        <div className='max-w-4xl mx-auto'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mb-6 flex items-center text-blue-600'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('common.back')}
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{t('common.error')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error || t('search.userNotFound')}</p>
              <Button asChild className='mt-4'>
                <Link href='/search'>{t('search.returnToDirectory')}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <NavigationMenu
          userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
        />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 pb-20'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='max-w-4xl mx-auto'
      >
        <motion.div variants={itemVariants}>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mb-6 flex items-center text-blue-600'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            {t('common.back')}
          </Button>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left column - User info */}
          <motion.div variants={itemVariants} className='lg:col-span-1'>
            <Card className='border border-blue-100 shadow-sm overflow-hidden'>
              <CardHeader className='pb-2 bg-blue-50/80'>
                <div className='flex items-center gap-4'>
                  <Avatar className='h-16 w-16 border-2 border-white shadow-md'>
                    <AvatarFallback className='bg-blue-600 text-white font-bold'>
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className='text-xl text-blue-800'>
                      {user.full_name}
                    </CardTitle>
                    {user.username && (
                      <CardDescription>@{user.username}</CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className='pt-4'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center'>
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <Badge className='mr-2' variant='secondary'>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant='outline'>{getTypeLabel(user.type)}</Badge>
                    </div>
                  </div>

                  {user.is_verified && (
                    <Badge
                      variant='outline'
                      className='w-fit bg-green-50 text-green-700 border-green-200'
                    >
                      <Shield className='h-3 w-3 mr-1' />
                      {t('menu.verified')}
                    </Badge>
                  )}

                  {user.rating > 0 && (
                    <div className='flex items-center'>
                      <span className='text-sm mr-1'>
                        {t('reviews.rating')}:
                      </span>
                      <span className='text-yellow-500'>
                        {'★'.repeat(Math.round(user.rating))}
                      </span>
                      <span className='text-gray-300'>
                        {'★'.repeat(5 - Math.round(user.rating))}
                      </span>
                      <span className='ml-2 text-sm'>
                        {user.rating.toFixed(1)} ({user.rating_count}{' '}
                        {user.rating_count === 1
                          ? t('reviews.review')
                          : t('reviews.reviews')}
                        )
                      </span>
                    </div>
                  )}

                  <Separator className='bg-blue-100' />

                  {(user.phone_number || user.whatsapp_number) && (
                    <div className='space-y-2'>
                      <h3 className='font-medium'>{t('menu.contactInfo')}</h3>
                      {user.phone_number && (
                        <div className='flex items-center gap-2'>
                          <Phone className='h-4 w-4 text-blue-500' />
                          <span>{user.phone_number}</span>
                        </div>
                      )}
                      {user.whatsapp_number && (
                        <div className='flex items-center gap-2'>
                          <Phone className='h-4 w-4 text-green-500' />
                          <span>{user.whatsapp_number} (WhatsApp)</span>
                        </div>
                      )}
                    </div>
                  )}

                  {user.company_name && (
                    <div className='space-y-2'>
                      <h3 className='font-medium'>{t('menu.companyInfo')}</h3>
                      <p className='text-sm flex items-center'>
                        <Building2 className='h-4 w-4 mr-2 text-blue-500' />
                        {user.company_name}
                      </p>
                      {user.position && (
                        <p className='text-sm text-gray-600 flex items-center'>
                          <User className='h-4 w-4 mr-2 text-blue-500' />
                          {t('registration.position')}: {user.position}
                        </p>
                      )}
                    </div>
                  )}

                  <Separator className='bg-blue-100' />

                  <div className='space-y-2'>
                    <h3 className='font-medium'>{t('search.memberSince')}</h3>
                    <p className='text-sm flex items-center'>
                      <Calendar className='h-4 w-4 mr-2 text-blue-500' />
                      {formatDate(user.date_joined)}
                    </p>
                    {user.last_login && (
                      <p className='text-sm text-gray-600 flex items-center'>
                        <Clock className='h-4 w-4 mr-2 text-blue-500' />
                        {t('search.lastActive')}: {formatDate(user.last_login)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column - Details */}
          <motion.div variants={itemVariants} className='lg:col-span-2'>
            <Tabs defaultValue='details'>
              <TabsList className='mb-4 bg-blue-100/50 p-1 rounded-xl'>
                <TabsTrigger
                  value='details'
                  className='data-[state=active]:bg-white data-[state=active]:text-blue-800 rounded-lg'
                >
                  <User className='h-4 w-4 mr-2' />
                  {t('search.details')}
                </TabsTrigger>

                {user.role === 'student' && (
                  <TabsTrigger
                    value='student'
                    className='data-[state=active]:bg-white data-[state=active]:text-blue-800 rounded-lg'
                  >
                    <GraduationCap className='h-4 w-4 mr-2' />
                    {t('search.studentInfo')}
                  </TabsTrigger>
                )}

                {user.documents.length > 0 && user.is_verified && (
                  <TabsTrigger
                    value='documents'
                    className='data-[state=active]:bg-white data-[state=active]:text-blue-800 rounded-lg'
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    {t('menu.documents')}
                  </TabsTrigger>
                )}
              </TabsList>

              <AnimatePresence mode='wait'>
                <TabsContent value='details'>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className='border border-blue-100 shadow-sm overflow-hidden'>
                      <CardHeader className='bg-blue-50/80'>
                        <CardTitle className='flex items-center'>
                          <User className='h-5 w-5 mr-2 text-blue-600' />
                          {t('search.userDetails')}
                        </CardTitle>
                        <CardDescription>
                          {t('search.detailedInformation')} {user.full_name}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className='pt-6'>
                        <div className='space-y-4'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <h3 className='text-sm font-medium text-gray-500'>
                                {t('search.fullName')}
                              </h3>
                              <p>{user.full_name}</p>
                            </div>
                            <div>
                              <h3 className='text-sm font-medium text-gray-500'>
                                {t('search.userType')}
                              </h3>
                              <p>{getTypeLabel(user.type)}</p>
                            </div>
                            <div>
                              <h3 className='text-sm font-medium text-gray-500'>
                                {t('common.role')}
                              </h3>
                              <p>{getRoleLabel(user.role)}</p>
                            </div>
                            <div>
                              <h3 className='text-sm font-medium text-gray-500'>
                                {t('settings.language')}
                              </h3>
                              <p>
                                {user.preferred_language === 'ru'
                                  ? t('selectLang.ru')
                                  : user.preferred_language === 'uz'
                                  ? t('selectLang.uz')
                                  : user.preferred_language}
                              </p>
                            </div>
                          </div>

                          {user.company_name && (
                            <>
                              <Separator className='bg-blue-100' />
                              <h3 className='font-medium'>
                                {t('menu.companyDetails')}
                              </h3>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                  <h3 className='text-sm font-medium text-gray-500'>
                                    {t('registration.companyName')}
                                  </h3>
                                  <p>{user.company_name}</p>
                                </div>
                                {user.position && (
                                  <div>
                                    <h3 className='text-sm font-medium text-gray-500'>
                                      {t('registration.position')}
                                    </h3>
                                    <p>{user.position}</p>
                                  </div>
                                )}
                              </div>
                            </>
                          )}

                          {user.is_verified && (
                            <>
                              <Separator className='bg-blue-100' />
                              <div>
                                <h3 className='font-medium'>
                                  {t('menu.verification')}
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                                  <div>
                                    <h3 className='text-sm font-medium text-gray-500'>
                                      {t('search.status')}
                                    </h3>
                                    <p className='text-green-600 flex items-center'>
                                      <CheckCircle className='h-4 w-4 mr-1' />
                                      {t('menu.verified')}
                                    </p>
                                  </div>
                                  {user.verification_date && (
                                    <div>
                                      <h3 className='text-sm font-medium text-gray-500'>
                                        {t('search.verifiedOn')}
                                      </h3>
                                      <p>
                                        {formatDate(user.verification_date)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value='student'>
                  {user.role === 'student' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className='border border-blue-100 shadow-sm overflow-hidden'>
                        <CardHeader className='bg-blue-50/80'>
                          <CardTitle className='flex items-center'>
                            <GraduationCap className='h-5 w-5 mr-2 text-blue-600' />
                            {t('search.studentInformation')}
                          </CardTitle>
                          <CardDescription>
                            {t('search.educationalDetails')} {user.full_name}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className='pt-6'>
                          <div className='space-y-4'>
                            {user.student_id && (
                              <div>
                                <h3 className='text-sm font-medium text-gray-500'>
                                  {t('registration.studentId')}
                                </h3>
                                <p>{user.student_id}</p>
                              </div>
                            )}

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              {user.group_name && (
                                <div>
                                  <h3 className='text-sm font-medium text-gray-500'>
                                    {t('registration.groupName')}
                                  </h3>
                                  <p>{user.group_name}</p>
                                </div>
                              )}

                              {user.study_language && (
                                <div>
                                  <h3 className='text-sm font-medium text-gray-500'>
                                    {t('registration.studyLanguage')}
                                  </h3>
                                  <p>{user.study_language}</p>
                                </div>
                              )}

                              {user.curator_name && (
                                <div>
                                  <h3 className='text-sm font-medium text-gray-500'>
                                    {t('registration.curatorName')}
                                  </h3>
                                  <p>{user.curator_name}</p>
                                </div>
                              )}

                              {user.end_date && (
                                <div>
                                  <h3 className='text-sm font-medium text-gray-500'>
                                    {t('registration.endDate')}
                                  </h3>
                                  <p>{formatDate(user.end_date)}</p>
                                </div>
                              )}
                            </div>

                            {user.tariff && (
                              <>
                                <Separator className='bg-blue-100' />
                                <div>
                                  <h3 className='text-sm font-medium text-gray-500'>
                                    {t('registration.educationTariff')}
                                  </h3>
                                  <Badge variant='secondary' className='mt-1'>
                                    {user.tariff === 'standard'
                                      ? t('registration.standardPro')
                                      : user.tariff === 'vip'
                                      ? t('registration.vipPro')
                                      : user.tariff}
                                  </Badge>
                                </div>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value='documents'>
                  {user.documents.length > 0 && user.is_verified && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className='border border-blue-100 shadow-sm overflow-hidden'>
                        <CardHeader className='bg-blue-50/80'>
                          <CardTitle className='flex items-center'>
                            <FileText className='h-5 w-5 mr-2 text-blue-600' />
                            {t('menu.verifiedDocuments')}
                          </CardTitle>
                          <CardDescription>
                            {t('search.documentsUploadedBy')} {user.full_name}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className='pt-6'>
                          <div className='space-y-4'>
                            {user.documents.map(
                              (doc) =>
                                doc.verified && (
                                  <div
                                    key={doc.id}
                                    className='border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors'
                                  >
                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
                                      <div className='flex items-start gap-3'>
                                        <div className='bg-blue-100 p-2 rounded-full'>
                                          <FileText className='h-5 w-5 text-blue-600' />
                                        </div>
                                        <div>
                                          <h3 className='font-medium'>
                                            {doc.title}
                                          </h3>
                                          <p className='text-sm text-gray-500'>
                                            {getDocumentTypeLabel(doc.type)}
                                          </p>
                                          <p className='text-xs text-gray-400 mt-1'>
                                            {t('common.uploaded')}{' '}
                                            {formatDate(doc.uploaded_at)}
                                          </p>
                                        </div>
                                      </div>

                                      {doc.file_url && (
                                        <Button
                                          variant='outline'
                                          size='sm'
                                          asChild
                                          className='mt-2 md:mt-0'
                                        >
                                          <a
                                            href={doc.file_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='flex items-center'
                                          >
                                            <ExternalLink className='h-4 w-4 mr-2' />
                                            {t('search.viewDocument')}
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )
                            )}

                            {user.documents.filter((doc) => doc.verified)
                              .length === 0 && (
                              <p className='text-gray-500 text-center py-4'>
                                {t('search.noVerifiedDocuments')}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
