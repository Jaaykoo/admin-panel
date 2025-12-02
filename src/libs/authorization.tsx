import type { UserRole } from '@/types/UserTypes';
import { useRouter } from 'next/router';

import * as React from 'react';
import { useUser } from './auth';

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthorization = () => {
  const user = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!user.data && !user.isLoading) {
      const redirectTo = encodeURIComponent(router.pathname);
      window.location.href = `/auth/login?redirectTo=${redirectTo}`;
    }
  }, [user.data, user.isLoading, router.pathname]);

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user.data) {
        return allowedRoles?.includes(user.data.role);
      }

      return true;
    },
    [user.data],
  );

  return { checkAccess, role: user?.data?.role };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
    allowedRoles: UserRole[];
    policyCheck?: never;
  }
  | {
    allowedRoles?: never;
    policyCheck: boolean;
  }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
