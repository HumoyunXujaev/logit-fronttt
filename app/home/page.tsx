'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Filter, Home, Truck, Package, Bell, Menu, ChevronDown } from 'lucide-react';

interface Order {
  id: number;
  cargo: string;
  weight: number;
  date: string;
  payment: string;
  price: string;
  from: string;
  to: string;
  vehicleType: string;
  description: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    cargo: 'Металл',
    weight: 22,
    date: '12.12.2023 14:34',
    payment: 'Комбо',
    price: 'Договорная',
    from: 'Ташкент',
    to: 'Москва',
    vehicleType: 'Тент',
    description: 'Ташкент-Москва, нужен-тент, груз-металл, вес:22т, оплата:комбо, дата сообщения: 12.12.2023'
  },
  {
    id: 2,
    cargo: 'Текстиль',
    weight: 5,
    date: '15.12.2023 09:00',
    payment: 'Наличные',
    price: '3600 долларов',
    from: 'Бухара',
    to: 'Андижан',
    vehicleType: 'Газель',
    description: 'Бухара-Андижан, нужен-газель, груз-текстиль, вес:5т, оплата:наличные, дата сообщения: 15.12.2023'
  },
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Здесь должна быть логика фильтрации заказов
  };

  return (
    <div className="min-h-screen bg-blue-600 p-4 pb-20">
      <div className="flex items-center mb-4 bg-white rounded-lg p-2">
        <Input
          type="text"
          placeholder="Поиск заказов..."
          value={searchTerm}
          onChange={handleSearch}
          className="mr-2 flex-grow"
        />
        <Button variant="default" size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500 whitespace-nowrap">
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
        </Button>
      </div>

      <div className="space-y-4 mb-20">
        {orders.map((order) => (
          <Card key={order.id} className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{order.from} - {order.to}</span>
                <span className="text-sm text-gray-500">{order.date}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>{order.cargo} - {order.weight} т</span>
                <span className="text-sm">{order.vehicleType}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Оплата: {order.payment}</span>
                <span>Цена: {order.price}</span>
              </div>
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm text-blue-500 hover:no-underline">
                    <span className="flex items-center">
                      Подробнее
                      
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-gray-50 p-3 rounded-md mt-2">
                      <h4 className="font-semibold mb-2">Полное описание:</h4>
                      <p className="text-sm">{order.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm">Показать</Button>
                <Button variant="outline" size="sm">Дубликаты</Button>
                <Button variant="outline" size="sm">Избранное</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center">
        <Button variant="ghost" size="sm" className="flex flex-col items-center">
          <Home className="h-5 w-5" />
          <span className="text-xs">Главная</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center">
          <Truck className="h-5 w-5" />
          <span className="text-xs">Заявки</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center">
          <Package className="h-5 w-5" />
          <span className="text-xs">Грузы</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center">
          <Bell className="h-5 w-5" />
          <span className="text-xs">Уведомл.</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center">
          <Menu className="h-5 w-5" />
          <span className="text-xs">Меню</span>
        </Button>
      </div>
    </div>
  );
}