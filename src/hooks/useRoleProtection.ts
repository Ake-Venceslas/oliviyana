import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';

export function useRoleProtection(requiredRole: 'doctor' | 'patient') {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    // Si pas connecté, rediriger vers login
    if (!userId) {
      router.push('/login');
      return;
    }

    // Si connecté, vérifier le rôle
    if (user) {
      const userRole = user?.unsafeMetadata?.role as string;

      // Si le rôle ne correspond pas, rediriger
      if (userRole && userRole !== requiredRole) {
        router.push('/login');
      }
    }
  }, [isLoaded, userId, user, requiredRole, router]);

  return { isLoaded, userId, user };
}
