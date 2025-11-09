/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import type { Dispatch, FC, SetStateAction } from 'react';
import type { User } from '@/types/UserTypes';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { useMutation } from '@tanstack/react-query';
import { createContext, use, useEffect, useState } from 'react';
import { LayoutSplashScreen } from '@/components/ui/splash-screen';
import { QUERIES } from '@/helpers/crud-helper/consts';
import { getUser, logout as logoutService } from '@/services/authService';

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
    mutationKey: [QUERIES, 'logout'],
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
  const { currentUser, logout, setCurrentUser } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!currentUser) {
          const data = await getUser();
          if (data) {
            setCurrentUser(data);
          }
        }
      } catch (error) {
        console.error(error);
        if (currentUser) {
          logout();
        }
      } finally {
        setShowSplashScreen(false);
      }
    };

    checkAuth();
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthInit, AuthProvider, useAuth };
