/* eslint-disable react-refresh/only-export-components */
import type { Dispatch, FC, SetStateAction } from 'react';
import type { User } from '@/types/UserTypes';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { useMutation } from '@tanstack/react-query';

import { createContext, use, useEffect, useState } from 'react';
import { LayoutSplashScreen } from '@/components/ui/splash-screen';
import { QUERIES } from '@/helpers/crud-helper/consts';
import { getUser, logout as logoutService } from '@/services/AuthService';

type AuthContextProps = {
  currentUser: User | undefined;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
  logout: () => void;
};

const initAuthContextPropsState = {
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => {
  return use(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const logout = useMutation({
    mutationKey: [QUERIES.LOGOUT],
    mutationFn: () => logoutService(),
    onSuccess: () => {
      window.location.href = '/auth/login';
    },
  });

  return (
    // eslint-disable-next-line react/no-unstable-context-value
    <AuthContext value={{ currentUser, setCurrentUser, logout: logout.mutate }}>
      {children}
    </AuthContext>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { logout, setCurrentUser } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  /*
  const { data: user, isLoading, isError } = useQuery({
    queryKey: [QUERIES.USER_ME],
    queryFn: getUser,
    retry: false,
  });
  */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getUser();
        if (data) {
          setCurrentUser(data);
        }
      } catch (error) {
        console.error('Auth error:', error);
        logout();
      } finally {
        setShowSplashScreen(false);
      }
    };

    checkAuth();
  }, [setCurrentUser, logout]);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthInit, AuthProvider, useAuth };
