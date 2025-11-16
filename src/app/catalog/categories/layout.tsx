'use client';

import type { ReactNode } from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { CategoryQueryResponseProvider } from '@/hooks/catalogues/CategoryQueryResponseProvider';

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return (
    <QueryRequestProvider>
      <CategoryQueryResponseProvider>
        {children}
      </CategoryQueryResponseProvider>
    </QueryRequestProvider>
  );
}
