// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Separator } from '@/components/ui/separator';
// import { toast } from 'sonner';
// import {
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
//   User,
//   Building2,
//   Truck,
//   GraduationCap,
//   Loader2,
//   // Gamepad,
//   FileIcon,
//   Plus,
//   Trash2Icon,
// } from 'lucide-react';
// import NavigationMenu from '../components/NavigationMenu';
// import { useRouter } from 'next/navigation';
// import { useUser } from '@/contexts/UserContext';
// import { api } from '@/lib/api';
// import { Language, UserRole, UserType } from '@/types';
// import { Badge } from '@/components/ui/badge';
// import { FileUpload } from '@/components/FileUpload';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@radix-ui/react-select';
// import { useTranslation } from '@/contexts/i18n';

// interface ProfileField {
//   key: string;
//   label: string;
//   type: 'text' | 'tel' | 'email' | 'date';
//   required?: boolean;
// }

// const defaultProfiles: Record<string, ProfileField[]> = {
//   student: [
//     { key: 'full_name', label: 'ФИО', type: 'text', required: true },
//     {
//       key: 'student_id',
//       label: 'Студенческий ID',
//       type: 'text',
//       required: true,
//     },
//     { key: 'username', label: 'Telegram', type: 'text' },
//     { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
//     { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
//     { key: 'group_name', label: 'Группа', type: 'text', required: true },
//     { key: 'end_date', label: 'Дата окончания', type: 'date' },
//   ],
//   carrier: [
//     { key: 'full_name', label: 'ФИО', type: 'text', required: true },
//     { key: 'company_name', label: 'Название компании', type: 'text' },
//     // { key: 'telegramNumber', label: 'Telegram', type: 'text' },
//     { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
//     { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
//     // {
//     //   key: 'licenseNumber',
//     //   label: 'Номер лицензии',
//     //   type: 'text',
//     //   required: true,
//     // },
//   ],
//   'cargo-owner': [
//     { key: 'full_name', label: 'ФИО', type: 'text', required: true },
//     {
//       key: 'company_name',
//       label: 'Название компании',
//       type: 'text',
//       required: true,
//     },
//     // { key: 'telegramNumber', label: 'Telegram', type: 'text' },
//     { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
//     { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
//     // {
//     //   key: 'registration_certificate',
//     //   label: 'Рег. номер',
//     //   type: 'file',
//     //   required: true,
//     // },
//   ],
// };

// const getRoleIcon = (role: string) => {
//   switch (role) {
//     case 'student':
//       return GraduationCap;
//     case 'carrier':
//       return Truck;
//     case 'cargo-owner':
//       return Building2;
//     default:
//       return User;
//   }
// };

// const documentTypes = [
//   { value: 'driver_license', label: 'Водительские права', required: true },
//   { value: 'passport', label: 'Паспорт', required: true },
//   {
//     value: 'company_certificate',
//     label: 'Свидетельство о регистрации компании',
//     required: false,
//   },
//   { value: 'other', label: 'Другое', required: false },
// ] as const;

// interface DocumentFormData {
//   file: File;
//   type: 'driver_license' | 'passport' | 'company_certificate' | 'other';
//   title: string;
// }

// export interface Document {
//   id: string;
//   type: string;
//   title: string;
//   file_url: string;
//   file: any;
//   uploaded_at: string;
//   verified: boolean;
//   verified_at?: string;
//   notes?: string;
// }

// export interface VehicleDocument extends Document {
//   vehicle_id: string;
//   expiry_date?: string;
// }

// export interface UserDocument extends Document {
//   user_id: string;
// }

// const DocumentsSection = () => {
//   const [documents, setDocuments] = useState<UserDocument[]>([]);
//   const [isAddingDocument, setIsAddingDocument] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedDocument, setSelectedDocument] =
//     useState<DocumentFormData | null>(null);
//   const [isViewerOpen, setIsViewerOpen] = useState(false);
//   const [viewingDocument, setViewingDocument] = useState<UserDocument | null>(
//     null
//   );

//   // Add this function to handle opening the document viewer
//   const handleViewDocument = (document: UserDocument) => {
//     setViewingDocument(document);
//     setIsViewerOpen(true);
//   };
//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       setIsLoading(true);
//       const response = await api.getUserDocuments();
//       setDocuments(response);
//       console.log(response, 'document users');
//     } catch (error) {
//       toast.error('Ошибка при загрузке документов');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDocumentUpload = async (document: DocumentFormData) => {
//     try {
//       await api.addUserDocument(document);
//       toast.success('Документ успешно загружен');
//       fetchDocuments();
//       setIsAddingDocument(false);
//     } catch (error) {
//       toast.error('Ошибка при загрузке документа');
//     }
//   };

//   const handleDeleteDocument = async (id: string) => {
//     try {
//       await api.deleteUserDocument(id);
//       toast.success('Документ удален');
//       fetchDocuments();
//     } catch (error) {
//       toast.error('Ошибка при удалении документа');
//     }
//   };

//   const renderDocumentCard = (document: UserDocument) => (
//     <Card key={document.id} className='mb-4'>
//       <CardContent className='p-4'>
//         <div className='flex justify-between items-start'>
//           <div>
//             <h3 className='font-semibold'>{document.title}</h3>

//             <p className='text-sm text-gray-600'>
//               {documentTypes.find((t) => t.value === document.type)?.label}
//             </p>
//           </div>
//           <div className='flex space-x-2'>
//             <Badge variant={document.verified ? 'outline' : 'secondary'}>
//               {document.verified ? 'Проверен' : 'На проверке'}
//             </Badge>
//             <Button
//               variant='ghost'
//               size='sm'
//               onClick={() => handleViewDocument(document)}
//             >
//               <FileIcon className='h-4 w-4 mr-1' />
//               Просмотр
//             </Button>
//             <Button
//               variant='ghost'
//               size='sm'
//               className='text-red-600'
//               onClick={() => handleDeleteDocument(document.id)}
//             >
//               <Trash2Icon className='h-4 w-4' />
//             </Button>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   // Add this function to determine the document type
//   const getDocumentType = (url: string): 'image' | 'pdf' | 'other' => {
//     const extension = url?.split('.')?.pop()?.toLowerCase();
//     if (
//       ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']?.includes(extension || '')
//     ) {
//       return 'image';
//     } else if (extension === 'pdf') {
//       return 'pdf';
//     }
//     return 'other';
//   };

//   // Add this document viewer dialog component to the end of the render function before the return statement
//   const renderDocumentViewer = () => (
//     <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
//       <DialogContent className='max-w-4xl w-[90vw]'>
//         <DialogHeader>
//           <DialogTitle>{viewingDocument?.title}</DialogTitle>
//         </DialogHeader>
//         <div className='my-4 max-h-[70vh] overflow-auto'>
//           {viewingDocument && (
//             <>
//               {getDocumentType(viewingDocument.file) === 'image' ? (
//                 <img
//                   src={`${
//                     'https://45.92.173.187:9876/' + viewingDocument.file
//                   }`}
//                   alt={viewingDocument.title}
//                   className='max-w-full h-auto mx-auto'
//                 />
//               ) : getDocumentType(viewingDocument.file) === 'pdf' ? (
//                 <iframe
//                   src={`${
//                     'https://45.92.173.187:9876/' + viewingDocument.file
//                   }#toolbar=0`}
//                   className='w-full h-[60vh]'
//                   title={viewingDocument.title}
//                 />
//               ) : (
//                 <div className='text-center py-8'>
//                   <p>Невозможно отобразить данный тип файла в браузере.</p>
//                   <Button
//                     className='mt-4'
//                     onClick={() =>
//                       window.open(
//                         'https://45.92.173.187:9876/' + viewingDocument.file,
//                         '_blank'
//                       )
//                     }
//                   >
//                     Открыть в новой вкладке
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//         <DialogFooter>
//           <Button variant='outline' onClick={() => setIsViewerOpen(false)}>
//             Закрыть
//           </Button>
//           <Button
//             onClick={() =>
//               window.open(
//                 'https://45.92.173.187:9876/' + viewingDocument?.file,
//                 '_blank'
//               )
//             }
//           >
//             Открыть в новой вкладке
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );

//   const renderAddDocumentDialog = () => (
//     <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Добавить документ</DialogTitle>
//         </DialogHeader>

//         <div className='space-y-4'>
//           <div className='border-2'>
//             {/* <label className='block text-sm font-medium mb-2'>type*</label> */}
//             <Select
//               value={selectedDocument?.type}
//               onValueChange={(value: any) =>
//                 setSelectedDocument(
//                   (prev) => ({ ...prev, type: value } as DocumentFormData)
//                 )
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder='Выберите тип документа' />
//               </SelectTrigger>
//               <SelectContent>
//                 {documentTypes.map((type) => (
//                   <SelectItem key={type.value} value={type.value}>
//                     {type.label}
//                     {type.required && ' *'}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           {/* <Select
//             value={selectedDocument?.type}
//             onValueChange={(value: any) =>
//               setSelectedDocument(
//                 (prev) => ({ ...prev, type: value } as DocumentFormData)
//               )
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder='Выберите тип документа' />
//             </SelectTrigger>
//             <SelectContent>
//               {documentTypes.map((type) => (
//                 <SelectItem key={type.value} value={type.value}>
//                   {type.label}
//                   {type.required && ' *'}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select> */}

//           <Input
//             placeholder='Название документа'
//             value={selectedDocument?.title || ''}
//             onChange={(e) =>
//               setSelectedDocument(
//                 (prev) =>
//                   ({ ...prev, title: e.target.value } as DocumentFormData)
//               )
//             }
//           />

//           <FileUpload
//             onUpload={(file) => {
//               if (selectedDocument?.type) {
//                 handleDocumentUpload({
//                   file,
//                   type: selectedDocument.type,
//                   title: selectedDocument.title || file.name,
//                 });
//               } else {
//                 toast.error('Выберите тип документа');
//               }
//             }}
//             maxSize={5 * 1024 * 1024}
//             label='Загрузить документ'
//           />
//         </div>
//       </DialogContent>
//     </Dialog>
//   );

//   if (isLoading) {
//     return <Loader2 className='h-8 w-8 animate-spin text-blue-600' />;
//   }

//   return (
//     <div className='space-y-4'>
//       <div className='flex justify-between items-center'>
//         <h2 className='text-xl font-semibold'>Мои документы</h2>
//         <Button onClick={() => setIsAddingDocument(true)}>
//           <Plus className='h-4 w-4 mr-2' />
//           Добавить документ
//         </Button>
//       </div>

//       {documents.length === 0 ? (
//         <div className='text-center text-gray-500 py-8'>
//           У вас пока нет загруженных документов
//         </div>
//       ) : (
//         documents.map(renderDocumentCard)
//       )}

//       {renderAddDocumentDialog()}
//       {renderDocumentViewer()}
//     </div>
//   );
// };

// // Add DocumentsSection to your menu page layout where appropriate
// export default function MenuPage() {
//   const [showProfile, setShowProfile] = useState<boolean>(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
//   const [formData, setFormData] = useState<Record<string, string>>({});
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [isMobile, setIsMobile] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isSaving, setIsSaving] = useState<boolean>(false);

//   const router = useRouter();
//   const { userState, setUserRole, setLanguage, setUserType, logout } =
//     useUser();
//   const { t } = useTranslation();

//   useEffect(() => {
//     fetchUserProfile();

//     // Check if running in Telegram WebApp
//     const isTelegramWebApp = window.Telegram?.WebApp;
//     // Check viewport width for mobile
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768 || !!isTelegramWebApp);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       setIsLoading(true);
//       const userData = await api.getCurrentUser();
//       setUserRole(userData.role);
//       setFormData(userData);
//     } catch (error) {
//       toast.error(t('common.error'));
//       console.error('Error fetching profile:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleInputChange = (key: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('image/')) {
//       toast.error(t('fileUpload.uploadError'));
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(t('fileUpload.fileTooBig', { size: '5MB' }));
//       return;
//     }
//     try {
//       setIsUploading(true);
//       // Here you would normally upload the file to your server
//       // For now, just create a local preview
//       const previewUrl = URL.createObjectURL(file);
//       setFormData((prev) => ({
//         ...prev,
//         photo: previewUrl,
//       }));
//       toast.success(t('fileUpload.uploadSuccess'));
//     } catch (error) {
//       toast.error(t('fileUpload.uploadError'));
//       console.error('Error uploading photo:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleRemovePhoto = async () => {
//     try {
//       setFormData((prev) => {
//         const newData = { ...prev };
//         delete newData.photo;
//         return newData;
//       });
//       toast.success(t('menu.removePhoto'));
//     } catch (error) {
//       toast.error(t('common.error'));
//       console.error('Error removing photo:', error);
//     }
//   };

//   const handleSaveProfile = async () => {
//     try {
//       setIsSaving(true);
//       const data = {
//         student_id: formData.telegram_id,
//         ...formData,
//       };
//       await api.updateProfile(data);
//       setUserRole(formData?.role as UserRole);
//       setUserType(formData.type as UserType);
//       setLanguage(formData.preferred_language as Language);
//       setIsEditModalOpen(false);
//       toast.success(t('common.save'));
//       fetchUserProfile(); // Refresh profile data
//     } catch (error) {
//       toast.error(t('common.error'));
//       console.error('Error updating profile:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     router.push('/');
//     toast.success(t('common.logout'));
//   };

//   const getProfileFields = () => {
//     return (
//       defaultProfiles[formData.role || 'carrier'] || defaultProfiles.carrier
//     );
//   };

//   const RoleIcon = getRoleIcon(userState.role || 'carrier');
//   const menuItems = [
//     {
//       icon: Search,
//       text: t('menu.searchParticipants'),
//       action: () => router.push('/search'),
//     },
//     {
//       icon: MapPin,
//       text: t('menu.calculateDistance'),
//       action: () => router.push('/calculate-distance'),
//     },
//     {
//       icon: Heart,
//       text: t('menu.favorites'),
//       action: () => router.push('/favorites'),
//     },
//     {
//       icon: FileText,
//       text: t('menu.instructions'),
//       action: () => router.push('/instructions'),
//     },
//     {
//       icon: HelpCircle,
//       text: t('menu.support'),
//       action: () => router.push('/support'),
//     },
//     {
//       icon: Settings,
//       text: t('menu.settings'),
//       action: () => router.push('/settings'),
//     },
//     {
//       icon: MessageSquare,
//       text: t('menu.feedback'),
//       action: () => router.push('/reviews'),
//     },
//   ];

//   if (isLoading) {
//     return (
//       <div className='min-h-screen flex items-center justify-center'>
//         <Loader2 className='h-8 w-8 animate-spin text-primary' />
//       </div>
//     );
//   }

//   const renderProfileContent = () => (
//     <Card className='mt-4'>
//       <CardContent className='p-4'>
//         <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
//           <div className='flex flex-col sm:flex-row items-center text-center sm:text-left'>
//             <Avatar className='h-20 w-20 sm:h-16 sm:w-16 mb-4 sm:mb-0 sm:mr-4'>
//               <img
//                 src={formData.photo || 'https://i.pravatar.cc/150'}
//                 alt={formData.full_name || t('menu.personalInfo')}
//                 className='object-cover'
//               />
//             </Avatar>
//             <div>
//               <h2 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-1'>
//                 {formData.full_name || t('menu.personalInfo')}
//               </h2>
//               <div className='flex items-center justify-center sm:justify-start text-gray-600'>
//                 <RoleIcon className='h-4 w-4 mr-1' />
//                 <span className='text-sm'>
//                   {formData.role || t('menu.personalInfo')}
//                 </span>
//               </div>
//               <div className='flex items-center justify-center sm:justify-start text-gray-600'>
//                 <span className='text-sm'>
//                   {formData.is_verified
//                     ? t('menu.verified')
//                     : t('menu.notVerified')}{' '}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <Button
//             variant='outline'
//             size='sm'
//             onClick={() => setIsEditModalOpen(true)}
//             className='mt-4 sm:mt-0'
//           >
//             <Camera className='h-4 w-4 mr-2' />
//             {t('menu.editProfile')}
//           </Button>
//         </div>
//         <Separator className='my-4' />
//         <ScrollArea className='h-[calc(100vh-400px)] sm:h-auto pr-4'>
//           <div className='space-y-4'>
//             {getProfileFields().map((field) => (
//               <div key={field.key} className='space-y-1'>
//                 <label className='text-sm font-medium text-gray-500'>
//                   {field.label}
//                 </label>
//                 <p className='text-base break-words'>
//                   {formData[field.key] || '—'}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//         <Button
//           variant='destructive'
//           className='w-full mt-6'
//           onClick={() => setShowLogoutConfirm(true)}
//         >
//           <LogOut className='h-5 w-5 mr-2' />
//           {t('common.logout')}
//         </Button>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div className='min-h-screen bg-gray-50 p-4 pb-20'>
//       <div className='flex items-center mb-6'>
//         <Button variant='ghost' onClick={() => router.back()} className='p-2'>
//           <ArrowLeft className='h-6 w-6' />
//         </Button>
//         <h1 className='text-xl sm:text-2xl font-bold ml-2'>
//           {t('common.menu')}
//         </h1>
//       </div>
//       <div className='flex items-center justify-between mb-4'>
//         <div className='flex items-center'>
//           <Avatar className='h-12 w-12 mr-4'>
//             <img
//               src={formData.photo || 'https://i.pravatar.cc/150'}
//               alt={formData.full_name || t('menu.personalInfo')}
//               className='object-cover'
//             />
//           </Avatar>
//           <div>
//             <p className='font-semibold'>
//               {formData.full_name || t('menu.personalInfo')}
//             </p>
//             <Button
//               variant='link'
//               className='p-0 h-auto text-sm'
//               onClick={() => setShowProfile(!showProfile)}
//             >
//               {t('menu.myProfile')}
//             </Button>
//           </div>
//         </div>
//         <Button
//           variant='ghost'
//           size='sm'
//           onClick={() => setIsEditModalOpen(true)}
//           className='p-2'
//         >
//           <ChevronRight className='h-5 w-5' />
//         </Button>
//       </div>
//       {showProfile ? (
//         renderProfileContent()
//       ) : (
//         <div className='space-y-2'>
//           {menuItems.map((item, index) => (
//             <Button
//               key={index}
//               variant='ghost'
//               className='w-full justify-start p-4 h-auto text-left'
//               onClick={item.action}
//             >
//               <item.icon className='h-5 w-5 mr-3 flex-shrink-0' />
//               <span className='line-clamp-1'>{item.text}</span>
//             </Button>
//           ))}
//         </div>
//       )}
//       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//         <DialogContent
//           className={`${
//             isMobile
//               ? 'w-full h-[100vh] max-w-none m-0 rounded-none'
//               : 'sm:max-w-[425px]'
//           } overflow-hidden flex flex-col`}
//         >
//           <DialogHeader className='px-4 py-3'>
//             <DialogTitle>{t('menu.editProfile')}</DialogTitle>
//           </DialogHeader>
//           <ScrollArea className='flex-grow px-4'>
//             <div className='space-y-4 py-4'>
//               <div className='flex flex-col items-center justify-center mb-6'>
//                 <Avatar className='h-24 w-24 mb-4'>
//                   <img
//                     src={formData.photo || 'https://i.pravatar.cc/150'}
//                     alt={formData.full_name || t('menu.personalInfo')}
//                     className='object-cover'
//                   />
//                 </Avatar>
//                 <div className='space-y-2 w-full flex flex-col items-center'>
//                   <div className='relative w-full'>
//                     <Input
//                       type='file'
//                       accept='image/*'
//                       onChange={handleImageUpload}
//                       className='hidden'
//                       id='photo-upload'
//                     />
//                     <Button
//                       variant='outline'
//                       size='sm'
//                       disabled={isUploading}
//                       onClick={() =>
//                         document.getElementById('photo-upload')?.click()
//                       }
//                       className='w-full'
//                     >
//                       <Camera className='h-4 w-4 mr-2' />
//                       {isUploading
//                         ? t('common.loading')
//                         : t('menu.changePhoto')}
//                     </Button>
//                   </div>
//                   <Button
//                     variant='outline'
//                     size='sm'
//                     onClick={handleRemovePhoto}
//                     disabled={!formData.photo}
//                     className='w-full'
//                   >
//                     <Trash2 className='h-4 w-4 mr-2' />
//                     {t('menu.removePhoto')}
//                   </Button>
//                 </div>
//               </div>
//               {getProfileFields().map((field) => (
//                 <div key={field.key} className='space-y-2'>
//                   <label className='text-sm font-medium'>
//                     {field.label}
//                     {field.required && (
//                       <span className='text-red-500 ml-1'>*</span>
//                     )}
//                   </label>
//                   <Input
//                     type={field.type}
//                     value={formData[field.key] || ''}
//                     onChange={(e) =>
//                       handleInputChange(field.key, e.target.value)
//                     }
//                     required={field.required}
//                     className='w-full'
//                     placeholder={`${field.label.toLowerCase()}`}
//                   />
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//           <DialogFooter className='px-4 py-3 mt-2 border-t'>
//             <div
//               className={`flex ${
//                 isMobile ? 'flex-col w-full gap-2' : 'flex-row gap-4'
//               }`}
//             >
//               <Button
//                 variant='outline'
//                 onClick={() => setIsEditModalOpen(false)}
//                 className={isMobile ? 'w-full' : ''}
//                 disabled={isSaving}
//               >
//                 {t('common.cancel')}
//               </Button>
//               <Button
//                 onClick={handleSaveProfile}
//                 className={isMobile ? 'w-full' : ''}
//                 disabled={isSaving}
//               >
//                 {isSaving ? (
//                   <>
//                     <Loader2 className='h-4 w-4 mr-2 animate-spin' />
//                     {t('common.loading')}
//                   </>
//                 ) : (
//                   t('common.save')
//                 )}
//               </Button>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <DocumentsSection />
//       <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
//         <DialogContent
//           className={`${
//             isMobile ? 'w-[95%] max-w-[95%] mx-auto' : 'sm:max-w-[425px]'
//           }`}
//         >
//           <DialogHeader>
//             <DialogTitle>{t('menu.logoutConfirm')}</DialogTitle>
//           </DialogHeader>
//           <p className='py-4'>{t('menu.logoutConfirm')}</p>
//           <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
//             <Button
//               variant='outline'
//               onClick={() => setShowLogoutConfirm(false)}
//               className={isMobile ? 'w-full' : ''}
//             >
//               {t('common.cancel')}
//             </Button>
//             <Button
//               variant='destructive'
//               onClick={handleLogout}
//               className={isMobile ? 'w-full' : ''}
//             >
//               {t('common.logout')}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <NavigationMenu
//         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
//       />
//     </div>
//   );
// }

// //   const renderProfileContent = () => (
// //     <Card className='mt-4'>
// //       <CardContent className='p-4'>
// //         <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
// //           <div className='flex flex-col sm:flex-row items-center text-center sm:text-left'>
// //             <Avatar className='h-20 w-20 sm:h-16 sm:w-16 mb-4 sm:mb-0 sm:mr-4'>
// //               <img
// //                 src={formData.photo || 'https://i.pravatar.cc/150'}
// //                 alt={formData.full_name || 'Профиль'}
// //                 className='object-cover'
// //               />
// //             </Avatar>
// //             <div>
// //               <h2 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-1'>
// //                 {formData.full_name || 'Пользователь'}
// //               </h2>
// //               <div className='flex items-center justify-center sm:justify-start text-gray-600'>
// //                 <RoleIcon className='h-4 w-4 mr-1' />
// //                 <span className='text-sm'>
// //                   {formData.role || 'Пользователь'}
// //                 </span>
// //               </div>
// //               <div className='flex items-center justify-center sm:justify-start text-gray-600'>
// //                 <span className='text-sm'>
// //                   {formData.is_verified
// //                     ? 'Пользователь Верифицирован'
// //                     : 'Пользователь Не Верифицирован'}{' '}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
// //           <Button
// //             variant='outline'
// //             size='sm'
// //             onClick={() => setIsEditModalOpen(true)}
// //             className='mt-4 sm:mt-0'
// //           >
// //             <Camera className='h-4 w-4 mr-2' />
// //             Изменить
// //           </Button>
// //         </div>

// //         <Separator className='my-4' />

// //         <ScrollArea className='h-[calc(100vh-400px)] sm:h-auto pr-4'>
// //           <div className='space-y-4'>
// //             {getProfileFields().map((field) => (
// //               <div key={field.key} className='space-y-1'>
// //                 <label className='text-sm font-medium text-gray-500'>
// //                   {field.label}
// //                 </label>
// //                 <p className='text-base break-words'>
// //                   {formData[field.key] || '—'}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         </ScrollArea>

// //         <Button
// //           variant='destructive'
// //           className='w-full mt-6'
// //           onClick={() => setShowLogoutConfirm(true)}
// //         >
// //           <LogOut className='h-5 w-5 mr-2' />
// //           Выйти
// //         </Button>
// //       </CardContent>
// //     </Card>
// //   );

// //   return (
// //     <div className='min-h-screen bg-gray-50 p-4 pb-20'>
// //       <div className='flex items-center mb-6'>
// //         <Button variant='ghost' onClick={() => router.back()} className='p-2'>
// //           <ArrowLeft className='h-6 w-6' />
// //         </Button>
// //         <h1 className='text-xl sm:text-2xl font-bold ml-2'>Меню</h1>
// //       </div>

// //       <div className='flex items-center justify-between mb-4'>
// //         <div className='flex items-center'>
// //           <Avatar className='h-12 w-12 mr-4'>
// //             <img
// //               src={formData.photo || 'https://i.pravatar.cc/150'}
// //               alt={formData.full_name || 'Профиль'}
// //               className='object-cover'
// //             />
// //           </Avatar>
// //           <div>
// //             <p className='font-semibold'>
// //               {formData.full_name || 'Пользователь'}
// //             </p>

// //             <Button
// //               variant='link'
// //               className='p-0 h-auto text-sm'
// //               onClick={() => setShowProfile(!showProfile)}
// //             >
// //               Личный кабинет
// //             </Button>
// //           </div>
// //         </div>
// //         <Button
// //           variant='ghost'
// //           size='sm'
// //           onClick={() => setIsEditModalOpen(true)}
// //           className='p-2'
// //         >
// //           <ChevronRight className='h-5 w-5' />
// //         </Button>
// //       </div>

// //       {showProfile ? (
// //         renderProfileContent()
// //       ) : (
// //         <div className='space-y-2'>
// //           {menuItems.map((item, index) => (
// //             <Button
// //               key={index}
// //               variant='ghost'
// //               className='w-full justify-start p-4 h-auto text-left'
// //               onClick={item.action}
// //             >
// //               <item.icon className='h-5 w-5 mr-3 flex-shrink-0' />
// //               <span className='line-clamp-1'>{item.text}</span>
// //             </Button>
// //           ))}
// //         </div>
// //       )}

// //       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
// //         <DialogContent
// //           className={`${
// //             isMobile
// //               ? 'w-full h-[100vh] max-w-none m-0 rounded-none'
// //               : 'sm:max-w-[425px]'
// //           } overflow-hidden flex flex-col`}
// //         >
// //           <DialogHeader className='px-4 py-3'>
// //             <DialogTitle>Редактировать профиль</DialogTitle>
// //           </DialogHeader>

// //           <ScrollArea className='flex-grow px-4'>
// //             <div className='space-y-4 py-4'>
// //               <div className='flex flex-col items-center justify-center mb-6'>
// //                 <Avatar className='h-24 w-24 mb-4'>
// //                   <img
// //                     src={formData.photo || 'https://i.pravatar.cc/150'}
// //                     alt={formData.full_name || 'Профиль'}
// //                     className='object-cover'
// //                   />
// //                 </Avatar>
// //                 <div className='space-y-2 w-full flex flex-col items-center'>
// //                   <div className='relative w-full'>
// //                     <Input
// //                       type='file'
// //                       accept='image/*'
// //                       onChange={handleImageUpload}
// //                       className='hidden'
// //                       id='photo-upload'
// //                     />
// //                     <Button
// //                       variant='outline'
// //                       size='sm'
// //                       disabled={isUploading}
// //                       onClick={() =>
// //                         document.getElementById('photo-upload')?.click()
// //                       }
// //                       className='w-full'
// //                     >
// //                       <Camera className='h-4 w-4 mr-2' />
// //                       {isUploading ? 'Загрузка...' : 'Изменить фото'}
// //                     </Button>
// //                   </div>
// //                   <Button
// //                     variant='outline'
// //                     size='sm'
// //                     onClick={handleRemovePhoto}
// //                     disabled={!formData.photo}
// //                     className='w-full'
// //                   >
// //                     <Trash2 className='h-4 w-4 mr-2' />
// //                     Удалить фото
// //                   </Button>
// //                 </div>
// //               </div>

// //               {getProfileFields().map((field) => (
// //                 <div key={field.key} className='space-y-2'>
// //                   <label className='text-sm font-medium'>
// //                     {field.label}
// //                     {field.required && (
// //                       <span className='text-red-500 ml-1'>*</span>
// //                     )}
// //                   </label>
// //                   <Input
// //                     type={field.type}
// //                     value={formData[field.key] || ''}
// //                     onChange={(e) =>
// //                       handleInputChange(field.key, e.target.value)
// //                     }
// //                     required={field.required}
// //                     className='w-full'
// //                     placeholder={`Введите ${field.label.toLowerCase()}`}
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           </ScrollArea>

// //           <DialogFooter className='px-4 py-3 mt-2 border-t'>
// //             <div
// //               className={`flex ${
// //                 isMobile ? 'flex-col w-full gap-2' : 'flex-row gap-4'
// //               }`}
// //             >
// //               <Button
// //                 variant='outline'
// //                 onClick={() => setIsEditModalOpen(false)}
// //                 className={isMobile ? 'w-full' : ''}
// //                 disabled={isSaving}
// //               >
// //                 Отмена
// //               </Button>
// //               <Button
// //                 onClick={handleSaveProfile}
// //                 className={isMobile ? 'w-full' : ''}
// //                 disabled={isSaving}
// //               >
// //                 {isSaving ? (
// //                   <>
// //                     <Loader2 className='h-4 w-4 mr-2 animate-spin' />
// //                     Сохранение...
// //                   </>
// //                 ) : (
// //                   'Сохранить'
// //                 )}
// //               </Button>
// //             </div>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <DocumentsSection />
// //       <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
// //         <DialogContent
// //           className={`${
// //             isMobile ? 'w-[95%] max-w-[95%] mx-auto' : 'sm:max-w-[425px]'
// //           }`}
// //         >
// //           <DialogHeader>
// //             <DialogTitle>Подтверждение выхода</DialogTitle>
// //           </DialogHeader>
// //           <p className='py-4'>Вы уверены, что хотите выйти?</p>
// //           <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
// //             <Button
// //               variant='outline'
// //               onClick={() => setShowLogoutConfirm(false)}
// //               className={isMobile ? 'w-full' : ''}
// //             >
// //               Отмена
// //             </Button>
// //             <Button
// //               variant='destructive'
// //               onClick={handleLogout}
// //               className={isMobile ? 'w-full' : ''}
// //             >
// //               Выйти
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>

// //       <NavigationMenu
// //         userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
// //       />
// //     </div>
// //   );
// // }

'use client';
import React, { useState, useEffect, useRef } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
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
  FileIcon,
  Plus,
  Upload,
  Check,
  Calendar,
  Shield,
  CheckCircle,
  ExternalLink,
  Clock,
  X,
} from 'lucide-react';
import NavigationMenu from '../components/NavigationMenu';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { Language, UserRole, UserType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/FileUpload';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/contexts/i18n';
import LanguageSelector from '@/components/LanguageSelector';

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
    { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
    { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
  ],
  'cargo-owner': [
    { key: 'full_name', label: 'ФИО', type: 'text', required: true },
    {
      key: 'company_name',
      label: 'Название компании',
      type: 'text',
      required: true,
    },
    { key: 'whatsapp_number', label: 'WhatsApp', type: 'tel' },
    { key: 'phone_number', label: 'Телефон', type: 'tel', required: true },
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
  file: any;
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

// Redesigned Documents Section with improved UI
const DocumentsSection = () => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentFormData | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<UserDocument | null>(
    null
  );
  const { t } = useTranslation();

  // Add this function to handle opening the document viewer
  const handleViewDocument = (document: UserDocument) => {
    setViewingDocument(document);
    setIsViewerOpen(true);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await api.getUserDocuments();
      setDocuments(response);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentUpload = async (document: DocumentFormData) => {
    try {
      await api.addUserDocument(document);
      toast.success(t('fileUpload.uploadSuccess'));
      fetchDocuments();
      setIsAddingDocument(false);
    } catch (error) {
      toast.error(t('fileUpload.uploadError'));
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await api.deleteUserDocument(id);
      toast.success(t('common.delete'));
      fetchDocuments();
    } catch (error) {
      toast.error(t('common.error'));
    }
  };

  const renderDocumentCard = (document: UserDocument) => (
    <motion.div
      key={document.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className='mb-4 overflow-hidden hover:shadow-md transition-all duration-200'>
        <CardContent className='p-0'>
          <div className='flex items-center border-b'>
            <div className='p-4 bg-gray-50 flex items-center justify-center'>
              <FileIcon className='h-8 w-8 text-blue-500' />
            </div>
            <div className='flex-1 p-4'>
              <h3 className='font-semibold text-base'>{document.title}</h3>
              <p className='text-sm text-gray-600'>
                {documentTypes.find((t) => t.value === document.type)?.label ||
                  document.type}
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                {new Date(document.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className='pr-4'>
              <Badge
                variant={document.verified ? 'outline' : 'secondary'}
                className={cn(
                  'flex items-center gap-1',
                  document.verified
                    ? 'border-green-500 text-green-600'
                    : 'text-amber-600'
                )}
              >
                {document.verified ? (
                  <>
                    <CheckCircle className='h-3 w-3' />{' '}
                    {t('menu.verified_status')}
                  </>
                ) : (
                  <>
                    <Clock className='h-3 w-3' /> {t('menu.pending_status')}
                  </>
                )}
              </Badge>
            </div>
          </div>
          <div className='flex p-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleViewDocument(document)}
              className='flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50'
            >
              <FileText className='h-4 w-4 mr-1' /> {t('menu.document_preview')}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='flex-1 text-red-600 hover:text-red-700 hover:bg-red-50'
              onClick={() => handleDeleteDocument(document.id)}
            >
              <Trash2 className='h-4 w-4 mr-1' /> {t('common.delete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Add this function to determine the document type
  const getDocumentType = (url: string): 'image' | 'pdf' | 'other' => {
    const extension = url?.split('.')?.pop()?.toLowerCase();
    if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']?.includes(extension || '')
    ) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'other';
  };

  // Add this document viewer dialog component
  const renderDocumentViewer = () => (
    <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
      <DialogContent className='max-w-4xl w-[90vw]'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <FileIcon className='mr-2 h-5 w-5 text-blue-500' />
            {viewingDocument?.title}
          </DialogTitle>
        </DialogHeader>
        <div className='my-4 max-h-[70vh] overflow-auto bg-gray-50 rounded-lg p-2'>
          {viewingDocument && (
            <>
              {getDocumentType(viewingDocument.file) === 'image' ? (
                <img
                  src={`${
                    'https://45.92.173.187:9876/' + viewingDocument.file
                  }`}
                  alt={viewingDocument.title}
                  className='max-w-full h-auto mx-auto rounded-md'
                />
              ) : getDocumentType(viewingDocument.file) === 'pdf' ? (
                <iframe
                  src={`${
                    'https://45.92.173.187:9876/' + viewingDocument.file
                  }#toolbar=0`}
                  className='w-full h-[60vh] rounded-md border'
                  title={viewingDocument.title}
                />
              ) : (
                <div className='text-center py-8 bg-white rounded-lg'>
                  <FileIcon className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                  <p className='mb-6'>{t('fileUpload.uploadError')}</p>
                  <Button
                    className='mt-4'
                    onClick={() =>
                      window.open(
                        'https://45.92.173.187:9876/' + viewingDocument.file,
                        '_blank'
                      )
                    }
                  >
                    {t('menu.document_view')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter className='flex justify-between'>
          <Badge
            variant={viewingDocument?.verified ? 'outline' : 'secondary'}
            className={cn(
              viewingDocument?.verified
                ? 'border-green-500 text-green-600'
                : 'text-amber-600'
            )}
          >
            {viewingDocument?.verified
              ? t('menu.verified_status')
              : t('menu.pending_status')}
          </Badge>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsViewerOpen(false)}
              className='gap-2'
            >
              <X className='h-4 w-4' /> {t('common.close')}
            </Button>
            <Button
              onClick={() =>
                window.open(
                  'https://45.92.173.187:9876/' + viewingDocument?.file,
                  '_blank'
                )
              }
              className='gap-2'
            >
              <ExternalLink className='h-4 w-4' /> {t('menu.document_view')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderAddDocumentDialog = () => (
    <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <Plus className='h-5 w-5 mr-2 text-blue-500' />
            {t('menu.addDocument')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <label className='block text-sm font-medium mb-1'>
              {t('common.type')}
            </label>
            <div className='grid grid-cols-1 gap-3'>
              {documentTypes.map((type) => (
                <button
                  key={type.value}
                  type='button'
                  onClick={() =>
                    setSelectedDocument(
                      (prev) =>
                        ({ ...prev, type: type.value } as DocumentFormData)
                    )
                  }
                  className={cn(
                    'flex items-center p-3 rounded-lg border transition-all duration-200',
                    selectedDocument?.type === type.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className='mr-3'>
                    {selectedDocument?.type === type.value ? (
                      <div className='h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center'>
                        <Check className='h-3 w-3 text-white' />
                      </div>
                    ) : (
                      <div className='h-5 w-5 border-2 border-gray-300 rounded-full' />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>
                      {t(`vehicle.documentTypes.${type.value}`)}
                    </p>
                    {type.required && (
                      <span className='text-xs text-red-500 mt-0.5'>*</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium mb-1'>
              {t('menu.documentName')}
            </label>
            <Input
              placeholder={t('menu.documentName')}
              value={selectedDocument?.title || ''}
              onChange={(e) =>
                setSelectedDocument(
                  (prev) =>
                    ({ ...prev, title: e.target.value } as DocumentFormData)
                )
              }
              className='w-full'
            />
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <FileUpload
              onUpload={(file) => {
                if (selectedDocument?.type) {
                  handleDocumentUpload({
                    file,
                    type: selectedDocument.type,
                    title: selectedDocument.title || file.name,
                  });
                } else {
                  toast.error(t('vehicle.documentTypes'));
                }
              }}
              maxSize={5 * 1024 * 1024}
              label={t('menu.uploadDocument')}
            />
            <div className='text-xs text-gray-500 mt-3'>
              <p>{t('menu.maxSize')}: 5MB</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold flex items-center'>
          <FileText className='h-5 w-5 mr-2 text-blue-500' />
          {t('menu.documents')}
        </h2>
        <Button
          onClick={() => setIsAddingDocument(true)}
          size='sm'
          className='bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Plus className='h-4 w-4 mr-2' /> {t('menu.addDocument')}
        </Button>
      </div>

      {documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='bg-gray-50 rounded-lg p-8 text-center'
        >
          <FileText className='h-12 w-12 mx-auto text-gray-400 mb-4' />
          <p className='text-gray-500 mb-4'>{t('menu.noDocuments')}</p>
          <Button
            onClick={() => setIsAddingDocument(true)}
            className='bg-blue-600 hover:bg-blue-700'
          >
            <Upload className='h-4 w-4 mr-2' />
            {t('menu.uploadDocument')}
          </Button>
        </motion.div>
      ) : (
        <div>
          <AnimatePresence>{documents.map(renderDocumentCard)}</AnimatePresence>
          {documents.length > 0 && (
            <Button variant='outline' className='w-full mt-2'>
              <FileText className='h-4 w-4 mr-2' />{' '}
              {t('menu.downloadAllDocuments')}
            </Button>
          )}
        </div>
      )}
      {renderAddDocumentDialog()}
      {renderDocumentViewer()}
    </div>
  );
};

export default function MenuPage() {
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');

  const router = useRouter();
  const { userState, setUserRole, setLanguage, setUserType, logout } =
    useUser();
  const { t } = useTranslation();

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
      setUserRole(userData.role);
      setFormData(userData);
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('fileUpload.uploadError'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('fileUpload.fileTooBig', { size: '5MB' }));
      return;
    }
    try {
      setIsUploading(true);
      // Here you would normally upload the file to your server
      // For now, just create a local preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        photo: previewUrl,
      }));
      toast.success(t('fileUpload.uploadSuccess'));
    } catch (error) {
      toast.error(t('fileUpload.uploadError'));
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setFormData((prev) => {
        const newData = { ...prev };
        delete newData.photo;
        return newData;
      });
      toast.success(t('menu.removePhoto'));
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Error removing photo:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const data = {
        student_id: formData.telegram_id,
        ...formData,
      };
      await api.updateProfile(data);
      setUserRole(formData?.role as UserRole);
      setUserType(formData.type as UserType);
      setLanguage(formData.preferred_language as Language);
      setIsEditModalOpen(false);
      toast.success(t('common.save'));
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      toast.error(t('common.error'));
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success(t('common.logout'));
  };

  const getProfileFields = () => {
    return (
      defaultProfiles[formData.role || 'carrier'] || defaultProfiles.carrier
    );
  };

  const RoleIcon = getRoleIcon(userState.role || 'carrier');

  const menuItems = [
    {
      id: 'search',
      icon: Search,
      text: t('menu.searchParticipants'),
      action: () => router.push('/search'),
    },
    {
      id: 'distance',
      icon: MapPin,
      text: t('menu.calculateDistance'),
      action: () => router.push('/calculate-distance'),
    },
    {
      id: 'favorites',
      icon: Heart,
      text: t('menu.favorites'),
      action: () => router.push('/favorites'),
    },
    {
      id: 'instructions',
      icon: FileText,
      text: t('menu.instructions'),
      action: () => router.push('/instructions'),
    },
    {
      id: 'support',
      icon: HelpCircle,
      text: t('menu.support'),
      action: () => router.push('/support'),
    },
    {
      id: 'settings',
      icon: Settings,
      text: t('menu.settings'),
      action: () => router.push('/settings'),
    },
    {
      id: 'feedback',
      icon: MessageSquare,
      text: t('menu.feedback'),
      action: () => router.push('/reviews'),
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
    <AnimatePresence mode='wait'>
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'profile' ? (
          <Card className='mt-4 shadow-sm'>
            <CardContent className='p-6'>
              <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
                <div className='flex flex-col sm:flex-row items-center text-center sm:text-left'>
                  <div className='relative mb-4 sm:mb-0 sm:mr-6'>
                    <Avatar className='h-24 w-24 sm:h-20 sm:w-20 ring-4 ring-white shadow-md'>
                      <img
                        src={formData.photo || 'https://i.pravatar.cc/150'}
                        alt={formData.full_name || t('menu.personalInfo')}
                        className='object-cover'
                      />
                    </Avatar>
                    <div className='absolute -bottom-2 -right-2'>
                      {formData.is_verified ? (
                        <Badge
                          variant='default'
                          className='bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1'
                        >
                          <Shield className='h-3 w-3' /> {t('menu.verified')}
                        </Badge>
                      ) : (
                        <Badge
                          variant='outline'
                          className='bg-amber-50 text-amber-700 border-amber-200 px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1'
                        >
                          <Clock className='h-3 w-3' /> {t('menu.notVerified')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className='text-xl sm:text-2xl font-bold mb-2 sm:mb-1'>
                      {formData.full_name || t('menu.personalInfo')}
                    </h2>
                    <div className='flex items-center justify-center sm:justify-start text-gray-600 mb-1'>
                      <RoleIcon className='h-4 w-4 mr-1 text-blue-600' />
                      <span className='text-sm capitalize'>
                        {userState.role === 'cargo-owner'
                          ? t('reviews.userRoles.cargo-owner')
                          : userState.role === 'logistics-company'
                          ? t('reviews.userRoles.logistics-company')
                          : t(`reviews.userRoles.${userState.role}`)}
                      </span>
                    </div>
                    {formData.company_name && (
                      <div className='flex items-center justify-center sm:justify-start text-gray-600'>
                        <Building2 className='h-4 w-4 mr-1 text-blue-600' />
                        <span className='text-sm'>{formData.company_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setIsEditModalOpen(true)}
                  className='mt-4 sm:mt-0 shadow-sm hover:shadow gap-2'
                >
                  <User className='h-4 w-4' /> {t('menu.editProfile')}
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                <div className='space-y-4'>
                  <h3 className='text-sm uppercase text-gray-500 font-semibold tracking-wider flex items-center'>
                    <User className='h-4 w-4 mr-2 text-blue-500' />{' '}
                    {t('menu.personalInfo')}
                  </h3>
                  <div className='space-y-3'>
                    {getProfileFields()
                      .filter(
                        (field) =>
                          ![
                            'company_name',
                            'phone_number',
                            'whatsapp_number',
                            'username',
                          ].includes(field.key)
                      )
                      .map((field) => (
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
                </div>

                <div className='space-y-4'>
                  <h3 className='text-sm uppercase text-gray-500 font-semibold tracking-wider flex items-center'>
                    <MessageSquare className='h-4 w-4 mr-2 text-blue-500' />{' '}
                    {t('menu.contactInfo')}
                  </h3>
                  <div className='space-y-3'>
                    {getProfileFields()
                      .filter((field) =>
                        [
                          'phone_number',
                          'whatsapp_number',
                          'username',
                        ].includes(field.key)
                      )
                      .map((field) => (
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

                  {formData.company_name && (
                    <>
                      <h3 className='text-sm uppercase text-gray-500 font-semibold tracking-wider mt-6 flex items-center'>
                        <Building2 className='h-4 w-4 mr-2 text-blue-500' />{' '}
                        {t('menu.companyInfo')}
                      </h3>
                      <div className='space-y-1'>
                        <label className='text-sm font-medium text-gray-500'>
                          {getProfileFields().find(
                            (field) => field.key === 'company_name'
                          )?.label || 'Компания'}
                        </label>
                        <p className='text-base break-words'>
                          {formData.company_name || '—'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Button
                variant='destructive'
                className='w-full mt-6 flex items-center justify-center gap-2'
                onClick={() => setShowLogoutConfirm(true)}
              >
                <LogOut className='h-5 w-5' /> {t('common.logout')}
              </Button>
            </CardContent>
          </Card>
        ) : activeTab === 'documents' ? (
          <div className='mt-4'>
            <DocumentsSection />
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-2 p-2'
          >
            <ArrowLeft className='h-6 w-6' />
          </Button>
          <h1 className='text-xl sm:text-2xl font-bold'>{t('common.menu')}</h1>
          <div className='ml-auto'>
            <LanguageSelector />
          </div>
        </div>

        {showProfile ? (
          <div className='space-y-4'>
            <div className='flex space-x-2 bg-white p-1 rounded-lg shadow-sm'>
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                className='flex-1'
                onClick={() => setActiveTab('profile')}
              >
                <User className='h-4 w-4 mr-2' />
                {t('common.profile')}
              </Button>
              <Button
                variant={activeTab === 'documents' ? 'default' : 'ghost'}
                className='flex-1'
                onClick={() => setActiveTab('documents')}
              >
                <FileText className='h-4 w-4 mr-2' />
                {t('menu.documents')}
              </Button>
            </div>

            {renderProfileContent()}

            <Button
              variant='outline'
              className='w-full mt-4'
              onClick={() => setShowProfile(false)}
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              {t('common.back')}
            </Button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className='flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm overflow-hidden'
            >
              <div className='flex items-center'>
                <Avatar className='h-14 w-14 mr-4 ring-4 ring-white shadow'>
                  <img
                    src={formData.photo || 'https://i.pravatar.cc/150'}
                    alt={formData.full_name || t('menu.personalInfo')}
                    className='object-cover'
                  />
                </Avatar>
                <div>
                  <p className='font-semibold text-lg line-clamp-1'>
                    {formData.full_name || t('menu.personalInfo')}
                  </p>
                  <Button
                    variant='link'
                    className='p-0 h-auto text-sm text-blue-600'
                    onClick={() => setShowProfile(true)}
                  >
                    {t('menu.myProfile')}
                  </Button>
                </div>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowProfile(true)}
                className='p-2 hover:bg-gray-100'
              >
                <ChevronRight className='h-5 w-5' />
              </Button>
            </motion.div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 },
                  }}
                >
                  <Button
                    variant='ghost'
                    className='w-full justify-start p-4 h-auto text-left bg-white hover:bg-gray-50 shadow-sm rounded-lg border border-transparent hover:border-gray-200 transition-all'
                    onClick={item.action}
                  >
                    <div className='h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 flex-shrink-0'>
                      <item.icon className='h-5 w-5' />
                    </div>
                    <span className='font-medium'>{item.text}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent
          className={`${
            isMobile
              ? 'w-full h-[100vh] max-w-none m-0 rounded-none'
              : 'sm:max-w-[425px]'
          } overflow-hidden flex flex-col`}
        >
          <DialogHeader className='px-4 py-3'>
            <DialogTitle className='flex items-center'>
              <User className='h-5 w-5 mr-2 text-blue-500' />
              {t('menu.editProfile')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className='flex-grow px-4'>
            <div className='space-y-6 py-4'>
              <div className='flex flex-col items-center justify-center mb-6'>
                <div className='relative mb-4'>
                  <Avatar className='h-24 w-24 ring-4 ring-white shadow-md'>
                    <img
                      src={formData.photo || 'https://i.pravatar.cc/150'}
                      alt={formData.full_name || t('menu.personalInfo')}
                      className='object-cover'
                    />
                  </Avatar>
                  {formData.is_verified && (
                    <div className='absolute -bottom-2 -right-2'>
                      <Badge
                        variant='default'
                        className='bg-green-500 text-white px-2 py-1 text-xs rounded-full'
                      >
                        <Shield className='h-3 w-3 mr-1' /> {t('menu.verified')}
                      </Badge>
                    </div>
                  )}
                </div>
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
                      className='w-full gap-2'
                    >
                      <Camera className='h-4 w-4' />
                      {isUploading
                        ? t('common.loading')
                        : t('menu.changePhoto')}
                    </Button>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleRemovePhoto}
                    disabled={!formData.photo}
                    className='w-full gap-2'
                  >
                    <Trash2 className='h-4 w-4' />
                    {t('menu.removePhoto')}
                  </Button>
                </div>
              </div>

              <Separator />

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
                    placeholder={`${field.label.toLowerCase()}`}
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
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSaveProfile}
                className={`${isMobile ? 'w-full' : ''} gap-2`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <CheckCircle className='h-4 w-4' />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent
          className={`${
            isMobile ? 'w-[95%] max-w-[95%] mx-auto' : 'sm:max-w-[425px]'
          }`}
        >
          <DialogHeader>
            <DialogTitle className='flex items-center'>
              <LogOut className='h-5 w-5 mr-2 text-red-500' />
              {t('menu.logoutConfirm')}
            </DialogTitle>
          </DialogHeader>
          <p className='py-4'>{t('menu.logoutConfirm')}</p>
          <DialogFooter className={`${isMobile ? 'flex-col gap-2' : ''}`}>
            <Button
              variant='outline'
              onClick={() => setShowLogoutConfirm(false)}
              className={isMobile ? 'w-full' : ''}
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={handleLogout}
              className={`${isMobile ? 'w-full' : ''} gap-2`}
            >
              <LogOut className='h-4 w-4' />
              {t('common.logout')}
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
