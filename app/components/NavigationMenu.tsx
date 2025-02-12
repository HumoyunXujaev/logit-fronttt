'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Truck, Package, Bell, Menu, Heart, Car } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useFavorites } from '@/hooks/useFavorites';
import { memo, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface NavigationMenuProps {
  userRole: 'carrier' | 'other';
}

// export default function NavigationMenu({ userRole }: NavigationMenuProps) {
//   const pathname = usePathname();
//   const { unreadCount } = useNotifications();
//   const { favorites } = useFavorites();
const NavigationMenu = memo(function NavigationMenu({
  userRole,
}: NavigationMenuProps) {
  const pathname = usePathname();
  const { notificationsCount, favoritesCount } = useApp();

  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : '';
  };

  const menuItems =
    userRole === 'carrier'
      ? [
          { href: '/home', icon: Home, label: 'Главная' },
          {
            href: '/favorites',
            icon: Heart,
            label: 'Избр.',
            count: favoritesCount,
          },
          { href: '/my-cars', icon: Car, label: 'Машины' },
          {
            href: '/notifications',
            icon: Bell,
            label: 'Уведомл.',
            count: notificationsCount,
          },
          { href: '/menu', icon: Menu, label: 'Меню' },
        ]
      : [
          { href: '/home', icon: Home, label: 'Главная' },
          { href: '/requests', icon: Truck, label: 'Заявки' },
          { href: '/cargos', icon: Package, label: 'Грузы' },
          {
            href: '/notifications',
            icon: Bell,
            label: 'Уведомл.',
            count: notificationsCount,
          },
          { href: '/menu', icon: Menu, label: 'Меню' },
        ];

  useEffect(() => {}, [
    notificationsCount,
    favoritesCount,
    menuItems,
    pathname,
  ]);

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center'>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} passHref>
          <Button
            variant='ghost'
            size='sm'
            className={`flex flex-col items-center relative ${isActive(
              item.href
            )}`}
          >
            <item.icon className='h-5 w-5' />
            <span className='text-xs'>{item.label}</span>
            {item.count && item.count > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs'
              >
                {item.count > 99 ? '99+' : item.count}
              </Badge>
            )}
          </Button>
        </Link>
      ))}
    </div>
  );
});

export default NavigationMenu;
