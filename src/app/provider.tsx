'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Toaster } from 'sonner';
import { MainErrorFallback } from '@/components/errors/main';
import { Notifications } from '@/components/ui/notifications';
import { MetronicSplashScreenProvider } from '@/components/ui/splash-screen';
import { ListViewProvider } from '@/hooks/_ListViewProvider';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { AuthInit, AuthProvider } from '@/hooks/auth/Auth';
import { queryConfig } from '@/libs/react-query';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth');

  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <ErrorBoundary FallbackComponent={MainErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <MetronicSplashScreenProvider>
          <QueryRequestProvider>
            <ListViewProvider>
              {isAuthRoute
                ? (
                    <>
                      {process.env.DEV && <ReactQueryDevtools />}
                      <Notifications />
                      {children}
                      <Toaster richColors />
                    </>
                  )
                : (
                    <AuthProvider>
                      <AuthInit>
                        {process.env.DEV && <ReactQueryDevtools />}
                        <Notifications />
                        {children}
                        <Toaster richColors />
                      </AuthInit>
                    </AuthProvider>
                  )}
            </ListViewProvider>
          </QueryRequestProvider>
        </MetronicSplashScreenProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
