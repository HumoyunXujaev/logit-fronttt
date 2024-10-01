'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
interface FormData {
  companyName?: string;
  fullName?: string;
  telegramNumber?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  position?: string;
  registrationCertificate?: string;
  role?: string;
  studentStatus?: string;
  city?: string;
  tariff?: string;
  groupName?: string;
  language?: string;
  curatorName?: string;
  endDate?: string;
}

export default function RegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/home');
    console.log(formData);
    // Здесь должна быть логика отправки данных на сервер
  };

  const clearForm = () => {
    setFormData({});
  };

  return (
    <div className='min-h-screen bg-blue-900 p-4'>
      <h1 className='text-3xl font-bold text-white text-center mb-6'>
        Пройти регистрацию
      </h1>

      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='exp-company'>
          <AccordionTrigger className='text-white'>
            Экспедиторская компания
          </AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                name='companyName'
                placeholder='Название компании'
                onChange={handleInputChange}
                value={formData.companyName || ''}
              />
              <Input
                name='fullName'
                placeholder='ФИО'
                onChange={handleInputChange}
                value={formData.fullName || ''}
              />
              <Input
                name='telegramNumber'
                placeholder='Telegram номер'
                onChange={handleInputChange}
                value={formData.telegramNumber || ''}
              />
              <Input
                name='whatsappNumber'
                placeholder='WhatsApp номер'
                onChange={handleInputChange}
                value={formData.whatsappNumber || ''}
              />
              <Input
                name='phoneNumber'
                placeholder='Мобильный номер'
                onChange={handleInputChange}
                value={formData.phoneNumber || ''}
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
                value={formData.registrationCertificate || ''}
              />
            </form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='cargo-owner'>
          <AccordionTrigger className='text-white'>
            Грузовладелец
          </AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                name='fullName'
                placeholder='ФИО'
                onChange={handleInputChange}
                value={formData.fullName || ''}
              />
              <Input
                name='telegramNumber'
                placeholder='Telegram номер'
                onChange={handleInputChange}
                value={formData.telegramNumber || ''}
              />
              <Input
                name='whatsappNumber'
                placeholder='WhatsApp номер'
                onChange={handleInputChange}
                value={formData.whatsappNumber || ''}
              />
              <Input
                name='phoneNumber'
                placeholder='Мобильный номер'
                onChange={handleInputChange}
                value={formData.phoneNumber || ''}
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
                value={formData.registrationCertificate || ''}
              />
            </form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='student'>
          <AccordionTrigger className='text-white'>Студент</AccordionTrigger>
          <AccordionContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                name='fullName'
                placeholder='ФИО'
                onChange={handleInputChange}
                value={formData.fullName || ''}
              />
              <Input
                name='telegramNumber'
                placeholder='Telegram номер'
                onChange={handleInputChange}
                value={formData.telegramNumber || ''}
              />
              <Input
                name='whatsappNumber'
                placeholder='WhatsApp номер'
                onChange={handleInputChange}
                value={formData.whatsappNumber || ''}
              />
              <Input
                name='phoneNumber'
                placeholder='Мобильный номер'
                onChange={handleInputChange}
                value={formData.phoneNumber || ''}
              />
              <Select
                name='studentStatus'
                onValueChange={(value) =>
                  handleSelectChange('studentStatus', value)
                }
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
                value={formData.groupName || ''}
              />
              <Select
                name='language'
                onValueChange={(value) => handleSelectChange('language', value)}
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
                value={formData.curatorName || ''}
              />
              <Input
                name='endDate'
                type='date'
                placeholder='Дата окончания обучения'
                onChange={handleInputChange}
                value={formData.endDate || ''}
              />
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className='mt-6 flex justify-between'>
        <Button variant='destructive' onClick={clearForm}>
          Очистить все формы
        </Button>
        <Button variant='default' onClick={handleSubmit}>
          Сохранить
        </Button>
      </div>
    </div>
  );
}
