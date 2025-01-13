"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { pregnancyService } from '@/services/pregnancy';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedLayout = ({ children, allowedRoles }: ProtectedLayoutProps) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/unauthorized');
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        router.replace('/unauthorized');
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.role === 'USER') {
        const profile = await pregnancyService.getProfile(true);
        if (!profile) {
          router.replace('/create-profile');
        }
      }
    };

    if (!isLoading && user) {
      checkProfile();
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedLayout;