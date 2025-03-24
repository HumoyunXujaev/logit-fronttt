// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Home, Package, Menu, Heart, Car, WorkflowIcon } from 'lucide-react';
// import { memo, useEffect } from 'react';

// interface NavigationMenuProps {
//   userRole: 'carrier' | 'other';
// }

// const NavigationMenu = memo(function NavigationMenu({
//   userRole,
// }: NavigationMenuProps) {
//   const pathname = usePathname();

//   const isActive = (path: string) => {
//     return pathname === path ? 'text-blue-600' : '';
//   };

//   const menuItems =
//     userRole === 'carrier'
//       ? [
//           { href: '/home', icon: Home, label: 'Главная' },
//           {
//             href: '/favorites',
//             icon: Heart,
//             label: 'Избр.',
//           },
//           { href: '/my-cars', icon: Car, label: 'Машины' },
//           { href: '/menu', icon: Menu, label: 'Меню' },
//         ]
//       : [
//           { href: '/home', icon: Home, label: 'Главная' },
//           {
//             href: '/favorites',
//             icon: Heart,
//             label: 'Избр.',
//           },
//           { href: '/cargos', icon: Package, label: 'Грузы' },
//           { href: '/menu', icon: Menu, label: 'Меню' },
//           { href: 'manager', icon: WorkflowIcon, label: 'менеджер' },
//         ];

//   useEffect(() => {}, [menuItems, pathname]);

//   return (
//     <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center'>
//       {menuItems.map((item) => (
//         <Link key={item.href} href={item.href} passHref>
//           <Button
//             variant='ghost'
//             size='sm'
//             className={`flex flex-col items-center relative ${isActive(
//               item.href
//             )}`}
//           >
//             <item.icon className='h-5 w-5' />
//             <span className='text-xs'>{item.label}</span>
//           </Button>
//         </Link>
//       ))}
//     </div>
//   );
// });

// export default NavigationMenu;

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Package, Menu, Heart, Car, WorkflowIcon } from 'lucide-react';
import { memo, useEffect } from 'react';

interface NavigationMenuProps {
  userRole: 'carrier' | 'other';
}

const NavigationMenu = memo(function NavigationMenu({
  userRole,
}: NavigationMenuProps) {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600' : '';
  };

  // Base menu items that all users can see
  const baseMenuItems = [
    { href: '/home', icon: Home, label: 'Главная' },
    { href: '/favorites', icon: Heart, label: 'Избр.' },
  ];

  // Role-specific menu items
  const roleSpecificItems =
    userRole === 'carrier'
      ? [{ href: '/my-cars', icon: Car, label: 'Машины' }]
      : [{ href: '/cargos', icon: Package, label: 'Грузы' }];

  // Common menu items for all users
  const commonItems = [{ href: '/menu', icon: Menu, label: 'Меню' }];

  // Get the user's role from localStorage to handle manager view specifically
  const userRoleFromStorage =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('logit_user_state') || '{}')
      : null;

  console.log(userRoleFromStorage?.role, 'userrolefromstorage');
  // Show manager menu item only for managers
  const managerItems =
    userRoleFromStorage.role === 'manager'
      ? [{ href: '/manager', icon: WorkflowIcon, label: 'Менеджер' }]
      : [];

  // Combine all menu items
  const menuItems = [
    ...baseMenuItems,
    ...roleSpecificItems,
    ...commonItems,
    ...managerItems,
  ];

  useEffect(() => {}, [menuItems, pathname]);

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
          </Button>
        </Link>
      ))}
    </div>
  );
});

export default NavigationMenu;
