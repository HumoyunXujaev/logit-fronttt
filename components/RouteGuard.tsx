'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const publicPaths = ['/select-lang', '/select-person', '/select-role'];

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userState } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!userState.isAuthenticated && !publicPaths.includes(pathname)) {
      if (!userState.language) {
        router.push('/select-lang');
      } else if (!userState.type) {
        router.push('/select-person');
      } else if (!userState.role) {
        router.push('/select-role');
      }
    }
  }, [userState, router, pathname]);

  return <>{children}</>;
}
