'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Package, Menu, Heart, Car, WorkflowIcon } from 'lucide-react';
import { useTranslation } from '@/contexts/i18n';

interface NavigationMenuProps {
  userRole: 'carrier' | 'other';
}

const NavigationMenu = memo(function NavigationMenu({
  userRole,
}: NavigationMenuProps) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Base menu items that all users can see
  const baseMenuItems = [
    { href: '/home', icon: Home, label: t('common.home') },
    { href: '/favorites', icon: Heart, label: t('menu.favorites') },
  ];

  // Role-specific menu items
  const roleSpecificItems =
    userRole === 'carrier'
      ? [{ href: '/my-cars', icon: Car, label: t('vehicle.title') }]
      : [{ href: '/cargos', icon: Package, label: t('cargo.title') }];

  // Common menu items for all users
  const commonItems = [{ href: '/menu', icon: Menu, label: t('common.menu') }];

  // Get the user's role from localStorage to handle manager view specifically
  const userRoleFromStorage =
    typeof window !== 'undefined' && mounted
      ? JSON.parse(localStorage.getItem('logit_user_state') || '{}')
      : null;

  // Show manager menu item only for managers
  const managerItems =
    userRoleFromStorage?.role === 'manager'
      ? [{ href: '/manager', icon: WorkflowIcon, label: 'Менеджер' }]
      : [];

  // Combine all menu items
  const menuItems = [
    ...baseMenuItems,
    ...roleSpecificItems,
    ...commonItems,
    ...managerItems,
  ];

  if (!mounted) {
    return null; // Prevent hydration issues
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center shadow-lg z-40'
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} passHref>
            <div className='relative flex flex-col items-center group'>
              {isActive && (
                <motion.div
                  layoutId='navigation-indicator'
                  className='absolute -top-2 w-1/2 h-1 bg-blue-600 rounded-full'
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? 'scale-110' : ''
                  } transition-transform`}
                />
                <span className='text-xs mt-1 font-medium'>{item.label}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </motion.div>
  );
});

export default NavigationMenu;
