import type { ReactNode } from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { UserQueryResponseProvider } from '@/hooks/user/UserQueryResponseProvider';

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryRequestProvider>
      <UserQueryResponseProvider>
        {children}
      </UserQueryResponseProvider>
    </QueryRequestProvider>
  );
}
