'use client';

import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        await api.get('/auth/session');

        setAuthorized(true);
      } catch {
        localStorage.removeItem('accessToken');

        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
