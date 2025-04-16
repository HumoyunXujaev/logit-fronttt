'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import NavigationMenu from '@/app/components/NavigationMenu';
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Send,
  FileText,
  Search,
  ChevronRight,
  User,
  TruckIcon,
  PackageIcon,
  Loader2,
  CheckCircle,
  ExternalLink,
  Clock,
  Calendar,
  Info,
  Server,
  Shield,
  HeartHandshake,
  GraduationCap,
} from 'lucide-react';
import { useTranslation } from '@/contexts/i18n';

// Support categories
const supportCategories = [
  { id: 'account', label: 'Аккаунт и профиль', icon: User },
  { id: 'cargo', label: 'Грузы и заявки', icon: PackageIcon },
  { id: 'transport', label: 'Транспорт', icon: TruckIcon },
  { id: 'technical', label: 'Технические проблемы', icon: Server },
  { id: 'other', label: 'Другие вопросы', icon: HelpCircle },
];

// FAQ items by category
const faqItems = {
  account: [
    {
      question: 'Как изменить данные в профиле?',
      answer:
        'Для изменения данных профиля перейдите в раздел Меню -> Личный кабинет -> Изменить. Там вы сможете обновить все свои персональные данные, включая контактную информацию.',
    },
    {
      question: 'Как пройти верификацию?',
      answer:
        'Для прохождения верификации необходимо загрузить соответствующие документы в разделе Меню -> Личный кабинет -> Документы. После загрузки всех необходимых документов наши менеджеры проверят их и подтвердят вашу учетную запись в течение 24 часов.',
    },
    {
      question: 'Забыл пароль от учетной записи',
      answer:
        'Восстановление пароля для нашей платформы выполняется через Telegram. Нажмите на кнопку "Восстановить пароль" на странице входа, и мы отправим вам инструкции по восстановлению пароля в Telegram.',
    },
  ],
  cargo: [
    {
      question: 'Как создать заявку на перевозку груза?',
      answer:
        'Для создания заявки на перевозку груза перейдите в раздел "Грузы" -> "Добавить груз". Заполните все необходимые поля: информацию о грузе, маршрут, требования к транспорту, сроки и условия оплаты.',
    },
    {
      question: 'Почему моя заявка не отображается в поиске?',
      answer:
        'Заявки проходят модерацию перед публикацией. Обычно это занимает до 30 минут. Если ваша заявка не появилась в течение 2 часов, проверьте её статус в разделе "Мои грузы". Если статус "На модерации", значит, она всё ещё проверяется. В случае отклонения вы получите уведомление с указанием причины.',
    },
    {
      question: 'Как отменить или изменить заявку?',
      answer:
        'Для изменения или отмены заявки перейдите в раздел "Мои грузы", найдите нужную заявку и нажмите на кнопку "Редактировать" или "Отменить". Обратите внимание, что изменение возможно только для заявок в статусе "Активная" и "Черновик". Для отмены заявок в других статусах обратитесь в службу поддержки.',
    },
  ],
  transport: [
    {
      question: 'Как добавить новый транспорт?',
      answer:
        'Для добавления нового транспорта перейдите в раздел "Мои машины" -> "Добавить машину". Заполните все необходимые поля, включая регистрационный номер, тип транспорта, грузоподъемность и другие характеристики. Также не забудьте загрузить документы на транспорт для верификации.',
    },
    {
      question: 'Какие документы нужны для верификации транспорта?',
      answer:
        'Для верификации транспорта необходимо загрузить следующие документы: технический паспорт транспортного средства, страховой полис, фотографии транспорта (спереди, сзади, сбоку), а также дополнительные разрешения в зависимости от типа транспорта (ADR, TIR и т.д.).',
    },
    {
      question: 'Сколько времени занимает верификация транспорта?',
      answer:
        'Обычно верификация транспорта занимает от 1 до 24 часов в рабочие дни. В выходные и праздничные дни процесс может занять до 48 часов. Вы получите уведомление о результате верификации в приложении и по электронной почте.',
    },
  ],
  technical: [
    {
      question: 'Приложение работает медленно или зависает',
      answer:
        'Если приложение работает медленно, попробуйте выполнить следующие действия: очистите кэш в настройках приложения, убедитесь, что у вас установлена последняя версия, проверьте скорость интернет-соединения. Если проблема сохраняется, перезагрузите устройство и попробуйте снова.',
    },
    {
      question: 'Не приходят уведомления',
      answer:
        'Для решения проблем с уведомлениями: проверьте, включены ли уведомления в настройках приложения, убедитесь, что уведомления разрешены в настройках вашего устройства, проверьте интернет-соединение. Если проблема не решается, переустановите приложение.',
    },
    {
      question: 'Ошибка при загрузке файлов',
      answer:
        'При возникновении ошибок загрузки файлов проверьте: размер файла (не более 5 МБ), формат файла (поддерживаются JPG, PNG, PDF), стабильность интернет-соединения. Если проблема сохраняется, попробуйте загрузить файл меньшего размера или в другом формате.',
    },
  ],
  other: [
    {
      question: 'Как рассчитывается рейтинг в системе?',
      answer:
        'Рейтинг рассчитывается на основе нескольких факторов: отзывы от других пользователей, своевременность выполнения заказов, качество заполнения профиля, активность в системе. Рейтинг обновляется еженедельно и влияет на видимость ваших предложений в поиске.',
    },
    {
      question: 'Как связаться с менеджером напрямую?',
      answer:
        'Для связи с менеджером используйте раздел "Поддержка", выберите категорию вопроса и нажмите "Связаться с менеджером". В рабочие часы (9:00-18:00 по московскому времени) менеджер ответит вам в течение 30 минут. Также вы можете позвонить по телефону технической поддержки, указанному в контактной информации.',
    },
    {
      question: 'Как стать партнером платформы?',
      answer:
        'Для получения статуса партнера платформы отправьте заявку через форму "Партнерская программа" или свяжитесь с нашим отделом по работе с партнерами по электронной почте partners@logit.com. Наши специалисты свяжутся с вами в течение 2 рабочих дней и предоставят всю необходимую информацию.',
    },
  ],
};

// Contact methods
const contactMethods = [
  {
    title: 'Телефон поддержки',
    description: 'Звоните нам в рабочие дни с 9:00 до 18:00 (МСК)',
    icon: Phone,
    value: '+7 (800) 555-35-35',
    action: 'Позвонить',
    href: 'tel:+78005553535',
  },
  {
    title: 'Электронная почта',
    description: 'Напишите нам на электронную почту',
    icon: Mail,
    value: 'support@logit.com',
    action: 'Написать',
    href: 'mailto:support@logit.com',
  },
  {
    title: 'Telegram-поддержка',
    description: 'Получите быстрый ответ через Telegram',
    icon: Send,
    value: '@logit_support',
    action: 'Написать',
    href: 'https://t.me/logit_support',
  },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('account');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [supportForm, setSupportForm] = useState({
    category: '',
    subject: '',
    message: '',
    email: '',
    phone: '',
  });
  const router = useRouter();
  const { userState } = useUser();
  const { t } = useTranslation();

  // Filter FAQ items based on search query
  const filteredFaqs = searchQuery
    ? Object.values(faqItems)
        .flat()
        .filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : faqItems[selectedCategory as keyof typeof faqItems] || [];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (!supportForm.category || !supportForm.subject || !supportForm.message) {
      toast.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Success response
      toast.success('Заявка успешно отправлена');
      setTicketSubmitted(true);

      // Reset form
      setSupportForm({
        category: '',
        subject: '',
        message: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      toast.error('Произошла ошибка при отправке заявки');
      console.error('Support ticket submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSupportForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900 p-4 pb-20'>
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='max-w-4xl mx-auto'
      >
        <motion.div
          variants={itemVariants}
          className='flex items-center mb-6 bg-white dark:bg-blue-800/30 p-3 rounded-lg shadow-sm'
        >
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-4 hover:bg-blue-100 dark:hover:bg-blue-700/50'
          >
            <ArrowLeft className='h-6 w-6 text-blue-600 dark:text-blue-300' />
          </Button>
          <h1 className='text-2xl font-bold text-blue-800 dark:text-white'>
            {t('support.title')}
          </h1>
        </motion.div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='grid grid-cols-3 mb-6 bg-blue-100/50 dark:bg-blue-800/30 p-1 rounded-xl'>
            <TabsTrigger
              value='faq'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <HelpCircle className='h-4 w-4 mr-2' />
              {t('support.faq')}
            </TabsTrigger>
            <TabsTrigger
              value='contact'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <Phone className='h-4 w-4 mr-2' />
              {t('support.contact')}
            </TabsTrigger>
            <TabsTrigger
              value='ticket'
              className='data-[state=active]:bg-white dark:data-[state=active]:bg-blue-700 data-[state=active]:text-blue-800 dark:data-[state=active]:text-white rounded-lg'
            >
              <MessageSquare className='h-4 w-4 mr-2' />
              {t('support.submitTicket')}
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value='faq' className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
              <motion.div variants={itemVariants} className='w-full md:w-1/3'>
                <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden h-full'>
                  <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20 pb-2'>
                    <CardTitle className='text-lg text-blue-800 dark:text-blue-200 flex items-center'>
                      <HeartHandshake className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                      {t('support.categories')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='pt-4'>
                    <div className='space-y-1'>
                      {supportCategories.map((category) => (
                        <Button
                          key={category.id}
                          variant={
                            selectedCategory === category.id
                              ? 'default'
                              : 'ghost'
                          }
                          className={`w-full justify-start text-left ${
                            selectedCategory === category.id
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'hover:bg-blue-50 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-200'
                          }`}
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSearchQuery('');
                          }}
                        >
                          <category.icon className='h-4 w-4 mr-3' />
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className='w-full md:w-2/3'>
                <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                  <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20 pb-2'>
                    <CardTitle className='text-lg text-blue-800 dark:text-blue-200 flex items-center'>
                      <HelpCircle className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                      {t('support.faq')}
                    </CardTitle>
                    <div className='pt-2'>
                      <div className='relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500/70 dark:text-blue-400/70' />
                        <Input
                          placeholder={t('support.searchQuestion')}
                          className='pl-10 border-blue-200 dark:border-blue-700 dark:bg-blue-800/10 dark:placeholder:text-blue-400/70 focus-visible:ring-blue-500'
                          value={searchQuery}
                          onChange={(e: any) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-4'>
                    {filteredFaqs.length > 0 ? (
                      <Accordion type='single' collapsible className='w-full'>
                        {filteredFaqs.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`faq-${index}`}
                            className='border-blue-100 dark:border-blue-700/50'
                          >
                            <AccordionTrigger className='text-left text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-blue-300 hover:no-underline'>
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className='text-blue-700 dark:text-blue-300'>
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className='text-center py-8 text-blue-600/80 dark:text-blue-300/80'>
                        <HelpCircle className='mx-auto h-12 w-12 text-blue-400/50 dark:text-blue-400/30 mb-4' />
                        <p className='text-blue-700 dark:text-blue-300'>
                          {t('support.notFound')}
                        </p>
                        <Button
                          variant='link'
                          onClick={() => {
                            setSearchQuery('');
                            setActiveTab('ticket');
                          }}
                          className='text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:dark:text-blue-300'
                        >
                          {t('support.askQuestion')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className='pt-0 border-t border-blue-100 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-800/10'>
                    <Button
                      variant='link'
                      className='w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:dark:text-blue-300'
                      onClick={() => setActiveTab('ticket')}
                    >
                      {t('support.askQuestion')}
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value='contact' className='space-y-4'>
            <motion.div variants={itemVariants}>
              <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                  <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                    <Phone className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                    {t('support.contactInfo')}
                  </CardTitle>
                  <CardDescription className='text-blue-700/70 dark:text-blue-300/70'>
                    {t('support.chooseContactMethod')}
                  </CardDescription>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {contactMethods.map((method, index) => (
                      <Card
                        key={index}
                        className='border-blue-100 dark:border-blue-700 shadow-sm hover:shadow-md transition-shadow duration-300'
                      >
                        <CardContent className='pt-6'>
                          <div className='text-center mb-4'>
                            <div className='inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-600 dark:text-blue-400 mb-4'>
                              <method.icon className='h-8 w-8' />
                            </div>
                            <h3 className='font-semibold text-blue-800 dark:text-blue-200'>
                              {method.title}
                            </h3>
                            <p className='text-sm text-blue-600/70 dark:text-blue-400/80 mt-1 px-4'>
                              {method.description}
                            </p>
                          </div>
                          <div className='text-center font-medium text-blue-700 dark:text-blue-300 mb-4'>
                            {method.value}
                          </div>
                          <Button
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                            asChild
                          >
                            <a
                              href={method.href}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {method.action}
                              <ExternalLink className='ml-2 h-4 w-4' />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                  <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                    <Calendar className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                    {t('support.workingHours')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                  <div className='space-y-3'>
                    <div className='flex justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <span className='text-blue-700 dark:text-blue-300'>
                        {t('support.weekdays.monFri')}
                      </span>
                      <span className='font-medium text-blue-800 dark:text-blue-200'>
                        9:00 - 18:00
                      </span>
                    </div>
                    <div className='flex justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <span className='text-blue-700 dark:text-blue-300'>
                        {t('support.weekdays.sat')}
                      </span>
                      <span className='font-medium text-blue-800 dark:text-blue-200'>
                        10:00 - 15:00
                      </span>
                    </div>
                    <div className='flex justify-between p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg'>
                      <span className='text-blue-700 dark:text-blue-300'>
                        {t('support.weekdays.sun')}
                      </span>
                      <span className='font-medium text-blue-800 dark:text-blue-200'>
                        {t('support.weekdays.weekend')}
                      </span>
                    </div>

                    <Separator className='my-4 bg-blue-100 dark:bg-blue-700/50' />

                    <div className='p-3 bg-blue-50/80 dark:bg-blue-800/20 rounded-lg flex items-start'>
                      <Info className='h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0' />
                      <div className='text-sm text-blue-600/80 dark:text-blue-300/80'>
                        {t('support.timeZoneNote')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Support Ticket Tab */}
          <TabsContent value='ticket' className='space-y-4'>
            {ticketSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                  <CardContent className='pt-6 flex flex-col items-center text-center'>
                    <div className='rounded-full bg-green-100 dark:bg-green-900/50 p-6 mb-4'>
                      <CheckCircle className='h-16 w-16 text-green-600 dark:text-green-400' />
                    </div>
                    <h2 className='text-xl font-bold mb-2 text-blue-800 dark:text-blue-200'>
                      {t('support.ticketSubmitted')}
                    </h2>
                    <p className='text-blue-600/80 dark:text-blue-300/80 mb-6 max-w-md'>
                      {t('support.thankYouMessage')}
                    </p>
                    <div className='p-4 bg-blue-50/80 dark:bg-blue-800/20 rounded-lg mb-6 text-left w-full max-w-md'>
                      <div className='text-sm text-blue-600/80 dark:text-blue-300/80 mb-1'>
                        {t('support.ticketNumber')}
                      </div>
                      <div className='font-medium text-blue-800 dark:text-blue-200'>{`REQ-${Math.floor(
                        100000 + Math.random() * 900000
                      )}`}</div>
                    </div>
                    <Button
                      onClick={() => {
                        setTicketSubmitted(false);
                        setActiveTab('faq');
                      }}
                      className='bg-blue-600 hover:bg-blue-700 text-white'
                    >
                      <HelpCircle className='h-4 w-4 mr-2' />
                      {t('support.backToSupport')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants}>
                <Card className='border border-blue-100 dark:border-blue-700 shadow-sm overflow-hidden'>
                  <CardHeader className='bg-blue-50/80 dark:bg-blue-800/20'>
                    <CardTitle className='text-blue-800 dark:text-blue-200 flex items-center'>
                      <MessageSquare className='h-5 w-5 mr-2 text-blue-600 dark:text-blue-400' />
                      {t('support.ticketTitle')}
                    </CardTitle>
                    <CardDescription className='text-blue-700/70 dark:text-blue-300/70'>
                      {t('support.ticketDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pt-6'>
                    <form
                      ref={formRef}
                      onSubmit={handleTicketSubmit}
                      className='space-y-4'
                    >
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                          {t('support.category')}*
                        </label>
                        <Select
                          required
                          value={supportForm.category}
                          onValueChange={(value: any) =>
                            handleInputChange('category', value)
                          }
                        >
                          <SelectTrigger className='border-blue-200 dark:border-blue-700 dark:bg-blue-900/10'>
                            <SelectValue
                              placeholder={`${t('support.category')}...`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {supportCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className='flex items-center'>
                                  <category.icon className='h-4 w-4 mr-2 text-blue-600 dark:text-blue-400' />
                                  {category.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                          {t('support.subject')}*
                        </label>
                        <Input
                          required
                          placeholder={`${t('support.subject')}...`}
                          value={supportForm.subject}
                          onChange={(e: any) =>
                            handleInputChange('subject', e.target.value)
                          }
                          className='border-blue-200 dark:border-blue-700 dark:bg-blue-900/10 dark:placeholder:text-blue-400/70'
                        />
                      </div>

                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                          {t('support.problemDescription')}*
                        </label>
                        <Textarea
                          required
                          placeholder={`${t('support.problemDescription')}...`}
                          rows={5}
                          value={supportForm.message}
                          onChange={(e: any) =>
                            handleInputChange('message', e.target.value)
                          }
                          className='border-blue-200 dark:border-blue-700 dark:bg-blue-900/10 dark:placeholder:text-blue-400/70'
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <label className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                            {t('support.emailForResponse')}
                          </label>
                          <Input
                            type='email'
                            placeholder='example@email.com'
                            value={supportForm.email}
                            onChange={(e: any) =>
                              handleInputChange('email', e.target.value)
                            }
                            className='border-blue-200 dark:border-blue-700 dark:bg-blue-900/10 dark:placeholder:text-blue-400/70'
                          />
                        </div>
                        <div className='space-y-2'>
                          <label className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                            {t('support.phoneForContact')}
                          </label>
                          <Input
                            placeholder='+7 (XXX) XXX-XX-XX'
                            value={supportForm.phone}
                            onChange={(e: any) =>
                              handleInputChange('phone', e.target.value)
                            }
                            className='border-blue-200 dark:border-blue-700 dark:bg-blue-900/10 dark:placeholder:text-blue-400/70'
                          />
                        </div>
                      </div>

                      <div className='pt-4'>
                        <Button
                          type='submit'
                          className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              {t('common.loading')}
                            </>
                          ) : (
                            <>
                              <MessageSquare className='mr-2 h-4 w-4' />
                              {t('support.submitTicket')}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <NavigationMenu
        userRole={userState.role === 'carrier' ? 'carrier' : 'other'}
      />
    </div>
  );
}
