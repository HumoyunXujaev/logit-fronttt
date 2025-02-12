// 'use client';

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Star,
//   Search,
//   MapPin,
//   Heart,
//   FileText,
//   HelpCircle,
//   Settings,
//   MessageSquare,
//   LogOut,
//   ChevronRight,
//   Camera,
//   Trash2,
//   ArrowLeft,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@/contexts/UserContext';

// interface UserProfile {
//   name: string;
//   photo: string;
//   contactInfo: string;
//   rating: number;
//   experience: string;
//   recommendations: number;
//   complaints: number;
//   id: string;
//   position: string;
//   telegram: string;
//   whatsapp: string;
//   mobile: string;
//   role: string;
//   studyCity: string;
//   group: string;
//   studyLanguage: string;
//   curator: string;
//   graduationDate: string;
// }

// export default function MenuPage() {
//   const [showProfile, setShowProfile] = useState<boolean>(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
//   const [userProfile, setUserProfile] = useState<UserProfile>({
//     name: '',
//     photo:
//       'https://i.pinimg.com/736x/24/00/1e/24001e0c9918570fae6645f683a515a8.jpg',
//     contactInfo: '',
//     rating: 0,
//     experience: '',
//     recommendations: 0,
//     complaints: 0,
//     id: '',
//     position: '',
//     telegram: '',
//     whatsapp: '',
//     mobile: '',
//     role: '',
//     studyCity: '',
//     group: '',
//     studyLanguage: '',
//     curator: '',
//     graduationDate: '',
//   });

//   const router = useRouter();
//   const { userState, logout, setUserData } = useUser();

//   React.useEffect(() => {
//     if (userState.userData) {
//       setUserProfile({
//         name: userState.userData.fullName || '',
//         photo:
//           'https://i.pinimg.com/736x/24/00/1e/24001e0c9918570fae6645f683a515a8.jpg',
//         contactInfo: userState.userData.phoneNumber || '',
//         rating: 5,
//         experience: '1 год',
//         recommendations: 0,
//         complaints: 0,
//         id: Math.random().toString(36).substr(2, 9),
//         position: userState.userData.position || '',
//         telegram: userState.userData.telegramNumber || '',
//         whatsapp: userState.userData.whatsappNumber || '',
//         mobile: userState.userData.phoneNumber || '',
//         role: userState.role || '',
//         studyCity: userState.userData.city || '',
//         group: userState.userData.groupName || '',
//         studyLanguage: userState.userData.studyLanguage || '',
//         curator: userState.userData.curatorName || '',
//         graduationDate: userState.userData.endDate || '',
//       });
//     }
//   }, [userState]);

//   const handleLogout = () => {
//     logout();
//     router.push('/');
//   };

//   // const handleLogout = () => {
//   //   // Очищаем localStorage
//   //   localStorage.removeItem('logit_token');
//   //   localStorage.removeItem('logit_user_state');

//   //   // Удаляем куки
//   //   document.cookie = 'logit_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//   //   document.cookie = 'bot_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

//   //   // Перенаправляем на страницу логина
//   //   router.push('/login');
//   // };

//   const renderStars = (rating: number) => {
//     return Array(5)
//       .fill(0)
//       .map((_, i) => (
//         <Star
//           key={i}
//           className={`h-5 w-5 ${
//             i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
//           }`}
//         />
//       ));
//   };

//   const renderProfile = () => (
//     <Card className='mt-4'>
//       <CardContent className='p-6'>
//         <div className='flex items-center justify-between mb-4'>
//           <div className='flex items-center'>
//             <Avatar className='h-16 w-16 mr-4'>
//               <img src={userProfile.photo} alt={userProfile.name} />
//             </Avatar>
//             <div>
//               <h2 className='text-2xl font-bold'>{userProfile.name}</h2>
//               <p className='text-gray-600'>{userProfile.id}</p>
//             </div>
//           </div>
//           <Button
//             variant='outline'
//             size='sm'
//             onClick={() => setIsEditModalOpen(true)}
//           >
//             <Camera className='h-4 w-4 mr-2' />
//             Изменить
//           </Button>
//         </div>

//         <div className='mb-4'>
//           <p className='text-green-600 font-semibold mb-2'>
//             Профиль подтвержден
//           </p>
//           <div className='flex mb-2'>{renderStars(userProfile.rating)}</div>
//           <p className='mb-2'>Стаж: {userProfile.experience}</p>
//           <p className='mb-2'>Рекомендации: {userProfile.recommendations}</p>
//           <p className='mb-2'>Жалобы: {userProfile.complaints}</p>
//         </div>

//         <div className='space-y-2'>
//           <h3 className='text-xl font-semibold mb-3'>Контактная информация</h3>
//           <p>Telegram: {userProfile.telegram}</p>
//           <p>WhatsApp: {userProfile.whatsapp}</p>
//           <p>Телефон: {userProfile.mobile}</p>
//         </div>

//         <div className='mt-4 space-y-2'>
//           <h3 className='text-xl font-semibold mb-3'>Информация об обучении</h3>
//           <p>Должность: {userProfile.position}</p>
//           <p>Роль: {userProfile.role}</p>
//           <p>Город обучения: {userProfile.studyCity}</p>
//           <p>Группа: {userProfile.group}</p>
//           <p>Язык обучения: {userProfile.studyLanguage}</p>
//           <p>Куратор: {userProfile.curator}</p>
//           <p>Дата окончания: {userProfile.graduationDate}</p>
//         </div>

//         <Button
//           variant='destructive'
//           className='w-full mt-6'
//           onClick={() => setShowLogoutConfirm(true)}
//         >
//           <LogOut className='h-5 w-5 mr-2' />
//           Выйти
//         </Button>
//       </CardContent>
//     </Card>
//   );

//   const EditProfileModal = () => (
//     <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//       <DialogContent className='sm:max-w-[425px]'>
//         <DialogHeader>
//           <DialogTitle>Редактировать профиль</DialogTitle>
//         </DialogHeader>
//         <div className='grid gap-4 py-4'>
//           <div className='flex items-center justify-center mb-4'>
//             <Avatar className='h-24 w-24'>
//               <img src={userProfile.photo} alt={userProfile.name} />
//             </Avatar>
//             <div className='ml-4 space-y-2'>
//               <Button variant='outline' size='sm'>
//                 <Camera className='h-4 w-4 mr-2' />
//                 Изменить фото
//               </Button>
//               <Button variant='outline' size='sm'>
//                 <Trash2 className='h-4 w-4 mr-2' />
//                 Удалить фото
//               </Button>
//             </div>
//           </div>

//           <Input
//             placeholder='ФИО'
//             value={userProfile.name}
//             onChange={(e) => {
//               setUserProfile({ ...userProfile, name: e.target.value });
//               setUserData({ ...userState.userData!, fullName: e.target.value });
//             }}
//           />
//           <Input
//             placeholder='Мобильный телефон'
//             value={userProfile.mobile}
//             onChange={(e) => {
//               setUserProfile({ ...userProfile, mobile: e.target.value });
//               setUserData({
//                 ...userState.userData!,
//                 phoneNumber: e.target.value,
//               });
//             }}
//           />
//           <Input
//             placeholder='Telegram'
//             value={userProfile.telegram}
//             onChange={(e) => {
//               setUserProfile({ ...userProfile, telegram: e.target.value });
//               setUserData({
//                 ...userState.userData!,
//                 telegramNumber: e.target.value,
//               });
//             }}
//           />
//           <Input
//             placeholder='WhatsApp'
//             value={userProfile.whatsapp}
//             onChange={(e) => {
//               setUserProfile({ ...userProfile, whatsapp: e.target.value });
//               setUserData({
//                 ...userState.userData!,
//                 whatsappNumber: e.target.value,
//               });
//             }}
//           />
//           <Input
//             placeholder='Должность'
//             value={userProfile.position}
//             onChange={(e) => {
//               setUserProfile({ ...userProfile, position: e.target.value });
//               setUserData({ ...userState.userData!, position: e.target.value });
//             }}
//           />
//           <Input
//             placeholder='Город'
//             value={userProfile.studyCity}
//             onChange={(e) => {
//               setUserProfile({ ...userProfile, studyCity: e.target.value });
//               setUserData({ ...userState.userData!, city: e.target.value });
//             }}
//           />
//         </div>
//         <div className='flex justify-end space-x-2'>
//           <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>
//             Отмена
//           </Button>
//           <Button onClick={() => setIsEditModalOpen(false)}>Сохранить</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );

//   const menuItems = [
//     {
//       icon: <Search className='h-5 w-5 mr-2' />,
//       text: 'Поиск участников и список фирм',
//       action: () => router.push('/search'),
//     },
//     {
//       icon: <MapPin className='h-5 w-5 mr-2' />,
//       text: 'Расчет расстояний',
//       action: () => {},
//     },
//     {
//       icon: <Heart className='h-5 w-5 mr-2' />,
//       text: 'Избранное',
//       action: () => router.push('/favorites'),
//     },
//     {
//       icon: <FileText className='h-5 w-5 mr-2' />,
//       text: 'Инструкции',
//       action: () => {},
//     },
//     {
//       icon: <HelpCircle className='h-5 w-5 mr-2' />,
//       text: 'Поддержка',
//       action: () => {},
//     },
//     {
//       icon: <Settings className='h-5 w-5 mr-2' />,
//       text: 'Настройки приложения',
//       action: () => router.push('/settings'),
//     },
//     {
//       icon: <MessageSquare className='h-5 w-5 mr-2' />,
//       text: 'Отзывы',
//       action: () => {},
//     },
//   ];

//   return (
//     <div className='min-h-screen bg-gray-50 p-4 pb-20'>
//       <div className='flex items-center mb-6'>
//         <Button variant='ghost' onClick={() => router.back()}>
//           <ArrowLeft className='h-6 w-6' />
//         </Button>
//         <h1 className='text-2xl font-bold ml-2'>Меню</h1>
//       </div>

//       <div className='flex items-center justify-between mb-4'>
//         <div className='flex items-center'>
//           <Avatar className='h-12 w-12 mr-4'>
//             <img src={userProfile.photo} alt={userProfile.name} />
//           </Avatar>
//           <div>
//             <p className='font-semibold'>{userProfile.name}</p>
//             <Button
//               variant='link'
//               className='p-0'
//               onClick={() => setShowProfile(!showProfile)}
//             >
//               Личный кабинет
//             </Button>
//           </div>
//         </div>
//         <Button
//           variant='ghost'
//           size='sm'
//           onClick={() => setIsEditModalOpen(true)}
//         >
//           <ChevronRight className='h-5 w-5' />
//         </Button>
//       </div>

//       {showProfile ? (
//         renderProfile()
//       ) : (
//         <>
//           <Input className='mb-4' placeholder='Поиск...' />
//           {menuItems.map((item, index) => (
//             <Button
//               key={index}
//               variant='ghost'
//               className='w-full justify-start mb-2'
//               onClick={item.action}
//             >
//               {item.icon}
//               {item.text}
//             </Button>
//           ))}
//         </>
//       )}

//       <EditProfileModal />

//       <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Подтверждение выхода</DialogTitle>
//           </DialogHeader>
//           <p>Вы уверены, что хотите выйти?</p>
//           <div className='flex justify-end space-x-2 mt-4'>
//             <Button
//               variant='outline'
//               onClick={() => setShowLogoutConfirm(false)}
//             >
//               Отмена
//             </Button>
//             <Button variant='destructive' onClick={handleLogout}>
//               Выйти
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <NavigationMenu
//         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//       />
//     </div>
//   );
// }

'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
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
  ArrowLeft,
  User,
  Building2,
  Truck,
  GraduationCap,
  Loader2,
  Gamepad,
  FileIcon,
  Plus,
  Trash2Icon,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { Language, UserRole, UserType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/FileUpload';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@radix-ui/react-select';

interface ProfileField {
  key: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'date';
  required?: boolean;
}

const defaultProfiles: Record<string, ProfileField[]> = {
  student: [
    { key: 'full_name', label: 'ФИО', type: 'text', required: true },
    {
      key: 'student_id',
      label: 'Студенческий ID',
      type: 'text',
      required: true,
    },
    { key: 'username', label: 'Telegram', type: 'text' },
    { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
    { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
    { key: 'group_name', label: 'Группа', type: 'text', required: true },
    { key: 'end_date', label: 'Дата окончания', type: 'date' },
  ],
  carrier: [
    { key: 'full_name', label: 'ФИО', type: 'text', required: true },
    { key: 'company_name', label: 'Название компании', type: 'text' },
    // { key: 'telegramNumber', label: 'Telegram', type: 'text' },
    { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
    { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
    // {
    //   key: 'licenseNumber',
    //   label: 'Номер лицензии',
    //   type: 'text',
    //   required: true,
    // },
  ],
  'cargo-owner': [
    { key: 'full_name', label: 'ФИО', type: 'text', required: true },
    {
      key: 'company_name',
      label: 'Название компании',
      type: 'text',
      required: true,
    },
    // { key: 'telegramNumber', label: 'Telegram', type: 'text' },
    { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
    { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
    // {
    //   key: 'registration_certificate',
    //   label: 'Рег. номер',
    //   type: 'file',
    //   required: true,
    // },
  ],
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'student':
      return GraduationCap;
    case 'carrier':
      return Truck;
    case 'cargo-owner':
      return Building2;
    default:
      return User;
  }
};

const documentTypes = [
  { value: 'driver_license', label: 'Водительские права', required: true },
  { value: 'passport', label: 'Паспорт', required: true },
  {
    value: 'company_certificate',
    label: 'Свидетельство о регистрации компании',
    required: false,
  },
  { value: 'other', label: 'Другое', required: false },
] as const;

interface DocumentFormData {
  file: File;
  type: 'driver_license' | 'passport' | 'company_certificate' | 'other';
  title: string;
}

export interface Document {
  id: string;
  type: string;
  title: string;
  file_url: string;
  uploaded_at: string;
  verified: boolean;
  verified_at?: string;
  notes?: string;
}

export interface VehicleDocument extends Document {
  vehicle_id: string;
  expiry_date?: string;
}

export interface UserDocument extends Document {
  user_id: string;
}

const DocumentsSection = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentFormData | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserDocuments();
      setDocuments(response);
      console.log(response, 'document users');
    } catch (error) {
      toast.error('Ошибка при загрузке документов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (document: DocumentFormData) => {
    try {
      await api.addUserDocument(document);
      toast.success('Документ успешно загружен');
      fetchDocuments();
      setIsAddingDocument(false);
    } catch (error) {
      toast.error('Ошибка при загрузке документа');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await api.deleteUserDocument(id);
      toast.success('Документ удален');
      fetchDocuments();
    } catch (error) {
      toast.error('Ошибка при удалении документа');
    }
  };

  const renderDocumentCard = (document: UserDocument) => (
    <Card key={document.id} className='mb-4'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-semibold'>{document.title}</h3>

            <p className='text-sm text-gray-600'>
              {documentTypes.find((t) => t.value === document.type)?.label}
            </p>
          </div>
          <div className='flex space-x-2'>
            <Badge variant={document.verified ? 'outline' : 'secondary'}>
              {document.verified ? 'Проверен' : 'На проверке'}
            </Badge>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => window.open(document.file_url, '_blank')}
            >
              <FileIcon className='h-4 w-4 mr-1' />
              Просмотр
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-red-600'
              onClick={() => handleDeleteDocument(document.id)}
            >
              <Trash2Icon className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAddDocumentDialog = () => (
    <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить документ</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-2'>type*</label>
            <Select
              value={selectedDocument?.type}
              onValueChange={(value: any) =>
                setSelectedDocument(
                  (prev) => ({ ...prev, type: value } as DocumentFormData)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Выберите тип документа' />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                    {type.required && ' *'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* <Select
            value={selectedDocument?.type}
            onValueChange={(value: any) =>
              setSelectedDocument(
                (prev) => ({ ...prev, type: value } as DocumentFormData)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Выберите тип документа' />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                  {type.required && ' *'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <Input
            placeholder='Название документа'
            value={selectedDocument?.title || ''}
            onChange={(e) =>
              setSelectedDocument(
                (prev) =>
                  ({ ...prev, title: e.target.value } as DocumentFormData)
              )
            }
          />

          <FileUpload
            onUpload={(file) => {
              if (selectedDocument?.type) {
                handleDocumentUpload({
                  file,
                  type: selectedDocument.type,
                  title: selectedDocument.title || file.name,
                });
              } else {
                toast.error('Выберите тип документа');
              }
            }}
            allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            maxSize={5 * 1024 * 1024}
            label='Загрузить документ'
          />
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return <Loader2 className='h-8 w-8 animate-spin text-blue-600' />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Мои документы</h2>
        <Button onClick={() => setIsAddingDocument(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Добавить документ
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className='text-center text-gray-500 py-8'>
          У вас пока нет загруженных документов
        </div>
      ) : (
        documents.map(renderDocumentCard)
      )}

      {renderAddDocumentDialog()}
    </div>
  );
};

// Add DocumentsSection to your menu page layout where appropriate
export default function MenuPage() {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const router = useRouter();
  const { userState, setUserRole, setLanguage, setUserType, logout } =
    useUser();

  useEffect(() => {
    fetchUserProfile();

    // Check if running in Telegram WebApp
    const isTelegramWebApp = window.Telegram?.WebApp;
    // Check viewport width for mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || !!isTelegramWebApp);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await api.getCurrentUser();
      console.log(userData);
      setUserRole(userData.role);
      // if (userData.role === 'carrier' && userData.is_verified === false) {
      //   router.push('driver-verification/');
      // }
      setFormData(userData);
      console.log(formData);
    } catch (error) {
      toast.error('Ошибка при загрузке профиля');
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, загрузите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setIsUploading(true);
      // Here you would normally upload the file to your server
      // const formData = new FormData();
      // formData.append('photo', file);
      // const response = await api.uploadProfilePhoto(formData);

      // For now, just create a local preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: previewUrl }));
      toast.success('Фото профиля успешно обновлено');
    } catch (error) {
      toast.error('Ошибка при загрузке фото');
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      // Here you would normally call an API endpoint to remove the photo
      // await api.removeProfilePhoto();

      setFormData((prev) => {
        const newData = { ...prev };
        delete newData.photo;
        return newData;
      });
      toast.success('Фото профиля удалено');
    } catch (error) {
      toast.error('Ошибка при удалении фото');
      console.error('Error removing photo:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const data = { student_id: formData.telegram_id, ...formData };
      console.log(data, 'data');
      await api.updateProfile(data);
      setUserRole(formData?.role as UserRole);
      setUserType(formData.type as UserType);
      setLanguage(formData.preferred_language as Language);
      setIsEditModalOpen(false);
      toast.success('Профиль успешно обновлен');
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      toast.error('Ошибка при обновлении профиля');
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Вы успешно вышли из системы');
  };

  const getProfileFields = () => {
    return (
      defaultProfiles[formData.role || 'carrier'] || defaultProfiles.carrier
    );
  };
  console.log(formData, 'formdataa');

  const RoleIcon = getRoleIcon(userState.role || 'carrier');

  const menuItems = [
    {
      icon: Search,
      text: 'Поиск участников и список фирм',
      action: () => router.push('/search'),
    },
    {
      icon: MapPin,
      text: 'Расчет расстояний',
      action: () => router.push('/calculate-distance'),
    },
    { icon: Heart, text: 'Избранное', action: () => router.push('/favorites') },
    {
      icon: FileText,
      text: 'Инструкции',
      action: () => router.push('/instructions'),
    },
    {
      icon: HelpCircle,
      text: 'Поддержка',
      action: () => router.push('/support'),
    },
    {
      icon: Settings,
      text: 'Настройки приложения',
      action: () => router.push('/settings'),
    },
    {
      icon: MessageSquare,
      text: 'Отзывы',
      action: () => router.push('/reviews'),
    },
    {
      icon: Gamepad,
      text: 'Игра',
      action: () => router.push('/game'),
    },
  ];

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  const renderProfileContent = () => (
    <Card className='mt-4'>
      <CardContent className='p-4'>
        <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
          <div className='flex flex-col sm:flex-row items-center text-center sm:text-left'>
            <Avatar className='h-20 w-20 sm:h-16 sm:w-16 mb-4 sm:mb-0 sm:mr-4'>
              <img
                src={formData.photo || 'https://i.pravatar.cc/150'}
                alt={formData.full_name || 'Профиль'}
                className='object-cover'
              />
            </Avatar>
            <div>
              <h2 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-1'>
                {formData.full_name || 'Пользователь'}
              </h2>
              <div className='flex items-center justify-center sm:justify-start text-gray-600'>
                <RoleIcon className='h-4 w-4 mr-1' />
                <span className='text-sm'>
                  {formData.role || 'Пользователь'}
                </span>
              </div>
              <div className='flex items-center justify-center sm:justify-start text-gray-600'>
                <span className='text-sm'>
                  {formData.is_verified
                    ? 'Пользователь Верифицирован'
                    : 'Пользователь Не Верифицирован'}{' '}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsEditModalOpen(true)}
            className='mt-4 sm:mt-0'
          >
            <Camera className='h-4 w-4 mr-2' />
            Изменить
          </Button>
        </div>

        <Separator className='my-4' />

        <ScrollArea className='h-[calc(100vh-400px)] sm:h-auto pr-4'>
          <div className='space-y-4'>
            {getProfileFields().map((field) => (
              <div key={field.key} className='space-y-1'>
                <label className='text-sm font-medium text-gray-500'>
                  {field.label}
                </label>
                <p className='text-base break-words'>
                  {formData[field.key] || '—'}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button
          variant='destructive'
          className='w-full mt-6'
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut className='h-5 w-5 mr-2' />
          Выйти
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='flex items-center mb-6'>
        <Button variant='ghost' onClick={() => router.back()} className='p-2'>
          <ArrowLeft className='h-6 w-6' />
        </Button>
        <h1 className='text-xl sm:text-2xl font-bold ml-2'>Меню</h1>
      </div>

      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <Avatar className='h-12 w-12 mr-4'>
            <img
              src={formData.photo || 'https://i.pravatar.cc/150'}
              alt={formData.full_name || 'Профиль'}
              className='object-cover'
            />
          </Avatar>
          <div>
            <p className='font-semibold'>
              {formData.full_name || 'Пользователь'}
            </p>

            <Button
              variant='link'
              className='p-0 h-auto text-sm'
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
          className='p-2'
        >
          <ChevronRight className='h-5 w-5' />
        </Button>
      </div>

      {showProfile ? (
        renderProfileContent()
      ) : (
        <div className='space-y-2'>
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant='ghost'
              className='w-full justify-start p-4 h-auto text-left'
              onClick={item.action}
            >
              <item.icon className='h-5 w-5 mr-3 flex-shrink-0' />
              <span className='line-clamp-1'>{item.text}</span>
            </Button>
          ))}
        </div>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className={`${
            isMobile
              ? 'w-full h-[100vh] max-w-none m-0 rounded-none'
              : 'sm:max-w-[425px]'
          } overflow-hidden flex flex-col`}
        >
          <DialogHeader className='px-4 py-3'>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>

          <ScrollArea className='flex-grow px-4'>
            <div className='space-y-4 py-4'>
              <div className='flex flex-col items-center justify-center mb-6'>
                <Avatar className='h-24 w-24 mb-4'>
                  <img
                    src={formData.photo || 'https://i.pravatar.cc/150'}
                    alt={formData.full_name || 'Профиль'}
                    className='object-cover'
                  />
                </Avatar>
                <div className='space-y-2 w-full flex flex-col items-center'>
                  <div className='relative w-full'>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={handleImageUpload}
                      className='hidden'
                      id='photo-upload'
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={isUploading}
                      onClick={() =>
                        document.getElementById('photo-upload')?.click()
                      }
                      className='w-full'
                    >
                      <Camera className='h-4 w-4 mr-2' />
                      {isUploading ? 'Загрузка...' : 'Изменить фото'}
                    </Button>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleRemovePhoto}
                    disabled={!formData.photo}
                    className='w-full'
                  >
                    <Trash2 className='h-4 w-4 mr-2' />
                    Удалить фото
                  </Button>
                </div>
              </div>

              {getProfileFields().map((field) => (
                <div key={field.key} className='space-y-2'>
                  <label className='text-sm font-medium'>
                    {field.label}
                    {field.required && (
                      <span className='text-red-500 ml-1'>*</span>
                    )}
                  </label>
                  <Input
                    type={field.type}
                    value={formData[field.key] || ''}
                    onChange={(e) =>
                      handleInputChange(field.key, e.target.value)
                    }
                    required={field.required}
                    className='w-full'
                    placeholder={`Введите ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className='px-4 py-3 mt-2 border-t'>
            <div
              className={`flex ${
                isMobile ? 'flex-col w-full gap-2' : 'flex-row gap-4'
              }`}
            >
              <Button
                variant='outline'
                onClick={() => setIsEditModalOpen(false)}
                className={isMobile ? 'w-full' : ''}
                disabled={isSaving}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSaveProfile}
                className={isMobile ? 'w-full' : ''}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    Сохранение...
                  </>
                ) : (
                  'Сохранить'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DocumentsSection />
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent
          className={`${
            isMobile ? 'w-[95%] max-w-[95%] mx-auto' : 'sm:max-w-[425px]'
          }`}
        >
          <DialogHeader>
            <DialogTitle>Подтверждение выхода</DialogTitle>
          </DialogHeader>
          <p className='py-4'>Вы уверены, что хотите выйти?</p>
          <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
            <Button
              variant='outline'
              onClick={() => setShowLogoutConfirm(false)}
              className={isMobile ? 'w-full' : ''}
            >
              Отмена
            </Button>
            <Button
              variant='destructive'
              onClick={handleLogout}
              className={isMobile ? 'w-full' : ''}
            >
              Выйти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
