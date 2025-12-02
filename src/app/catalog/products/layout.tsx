'use client';

import type { ReactNode } from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { CategoryQueryResponseProvider } from '@/hooks/catalogues/CategoryQueryResponseProvider';
import { ProductQueryResponseProvider } from '@/hooks/catalogues/ProductQueryResponseProvider';

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <QueryRequestProvider>
      <CategoryQueryResponseProvider>
        <ProductQueryResponseProvider>
          {children}
        </ProductQueryResponseProvider>
      </CategoryQueryResponseProvider>
    </QueryRequestProvider>
  );
}
