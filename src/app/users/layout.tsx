import type { ReactNode } from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { UserQueryResponseProvider } from '@/hooks/user/UserQueryResponseProvider';

export default function UsersLayout({
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
