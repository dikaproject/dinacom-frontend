import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  roles?: string[];
}

const AuthMiddleware = ({ children, requireAuth = false, roles = [] }: AuthMiddlewareProps) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        router.push('/login');
      }

      if (user && roles.length > 0 && !roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, isLoading, requireAuth, roles, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  if (requireAuth && !user) {
    return null;
  }

  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthMiddleware;