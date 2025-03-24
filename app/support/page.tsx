'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
} from 'lucide-react';

// Support categories
const supportCategories = [
  { id: 'account', label: 'Аккаунт и профиль', icon: User },
  { id: 'cargo', label: 'Грузы и заявки', icon: PackageIcon },
  { id: 'transport', label: 'Транспорт', icon: TruckIcon },
  { id: 'technical', label: 'Технические проблемы', icon: FileText },
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

  return (
    <div className='min-h-screen bg-gray-50 p-4 pb-20'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-4xl mx-auto'
      >
        <div className='flex items-center mb-6'>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='mr-4'
          >
            <ArrowLeft className='h-6 w-6' />
          </Button>
          <h1 className='text-2xl font-bold'>Поддержка</h1>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className='mb-6'
        >
          <TabsList className='grid grid-cols-3 mb-6'>
            <TabsTrigger value='faq'>Частые вопросы</TabsTrigger>
            <TabsTrigger value='contact'>Контакты</TabsTrigger>
            <TabsTrigger value='ticket'>Отправить заявку</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value='faq' className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-4 mb-4'>
              <div className='w-full md:w-1/3'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg'>Категории</CardTitle>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    <div className='space-y-1'>
                      {supportCategories.map((category) => (
                        <Button
                          key={category.id}
                          variant={
                            selectedCategory === category.id
                              ? 'default'
                              : 'ghost'
                          }
                          className='w-full justify-start text-left'
                          onClick={() => {
                            setSelectedCategory(category.id);
                            setSearchQuery('');
                          }}
                        >
                          <category.icon className='h-4 w-4 mr-2' />
                          {category.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='w-full md:w-2/3'>
                <Card>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg'>
                      Часто задаваемые вопросы
                    </CardTitle>
                    <div className='pt-2'>
                      <div className='relative'>
                        <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                          placeholder='Поиск по вопросам'
                          className='pl-8'
                          value={searchQuery}
                          onChange={(e: any) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='pt-0'>
                    {filteredFaqs.length > 0 ? (
                      <Accordion type='single' collapsible className='w-full'>
                        {filteredFaqs.map((faq, index) => (
                          <AccordionItem key={index} value={`faq-${index}`}>
                            <AccordionTrigger className='text-left'>
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className='text-muted-foreground'>
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className='text-center py-8 text-muted-foreground'>
                        <HelpCircle className='mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4' />
                        <p>Не найдено вопросов по вашему запросу</p>
                        <Button
                          variant='link'
                          onClick={() => {
                            setSearchQuery('');
                            setActiveTab('ticket');
                          }}
                        >
                          Отправить запрос в поддержку
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className='pt-0'>
                    <Button
                      variant='link'
                      className='w-full'
                      onClick={() => setActiveTab('ticket')}
                    >
                      Не нашли ответ на свой вопрос? Напишите нам
                      <ChevronRight className='h-4 w-4 ml-1' />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value='contact' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>
                  Выберите удобный способ связи с нами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  {contactMethods.map((method, index) => (
                    <Card key={index} className='border-0 shadow-sm'>
                      <CardContent className='pt-6'>
                        <div className='text-center mb-4'>
                          <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4'>
                            <method.icon className='h-6 w-6' />
                          </div>
                          <h3 className='font-medium'>{method.title}</h3>
                          <p className='text-sm text-muted-foreground mt-1'>
                            {method.description}
                          </p>
                        </div>
                        <div className='text-center font-medium mb-4'>
                          {method.value}
                        </div>
                        <Button className='w-full' asChild>
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

            <Card>
              <CardHeader>
                <CardTitle>График работы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Пн-Пт</span>
                    <span className='font-medium'>9:00 - 18:00</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Сб</span>
                    <span className='font-medium'>10:00 - 15:00</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Вс</span>
                    <span className='font-medium'>Выходной</span>
                  </div>
                  <Separator className='my-4' />
                  <div className='text-sm text-muted-foreground'>
                    * Время указано по Московскому часовому поясу (GMT+3)
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Ticket Tab */}
          <TabsContent value='ticket' className='space-y-4'>
            {ticketSubmitted ? (
              <Card>
                <CardContent className='pt-6 flex flex-col items-center text-center'>
                  <div className='rounded-full bg-green-100 p-4 mb-4'>
                    <CheckCircle className='h-12 w-12 text-green-600' />
                  </div>
                  <h2 className='text-xl font-bold mb-2'>Заявка отправлена</h2>
                  <p className='text-muted-foreground mb-6'>
                    Спасибо за обращение! Мы получили вашу заявку и обязательно
                    ответим вам в ближайшее время.
                  </p>
                  <div className='p-4 bg-gray-100 rounded-lg mb-6 text-left w-full'>
                    <div className='text-sm text-muted-foreground mb-1'>
                      Номер заявки
                    </div>
                    <div className='font-medium'>{`REQ-${Math.floor(
                      100000 + Math.random() * 900000
                    )}`}</div>
                  </div>
                  <Button
                    onClick={() => {
                      setTicketSubmitted(false);
                      setActiveTab('faq');
                    }}
                  >
                    Вернуться к вопросам поддержки
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Отправить заявку в поддержку</CardTitle>
                  <CardDescription>
                    Заполните форму, и мы ответим вам в течение 24 часов в
                    рабочие дни
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    ref={formRef}
                    onSubmit={handleTicketSubmit}
                    className='space-y-4'
                  >
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Категория*</label>
                      <Select
                        required
                        value={supportForm.category}
                        onValueChange={(value: any) =>
                          handleInputChange('category', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Выберите категорию' />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Тема обращения*
                      </label>
                      <Input
                        required
                        placeholder='Введите тему обращения'
                        value={supportForm.subject}
                        onChange={(e: any) =>
                          handleInputChange('subject', e.target.value)
                        }
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Описание проблемы*
                      </label>
                      <Textarea
                        required
                        placeholder='Опишите вашу проблему подробно'
                        rows={5}
                        value={supportForm.message}
                        onChange={(e: any) =>
                          handleInputChange('message', e.target.value)
                        }
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                          Email для ответа
                        </label>
                        <Input
                          type='email'
                          placeholder='example@email.com'
                          value={supportForm.email}
                          onChange={(e: any) =>
                            handleInputChange('email', e.target.value)
                          }
                        />
                      </div>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium'>
                          Телефон для связи
                        </label>
                        <Input
                          placeholder='+7 (XXX) XXX-XX-XX'
                          value={supportForm.phone}
                          onChange={(e: any) =>
                            handleInputChange('phone', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className='pt-4'>
                      <Button
                        type='submit'
                        className='w-full'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <MessageSquare className='mr-2 h-4 w-4' />
                            Отправить заявку
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
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
