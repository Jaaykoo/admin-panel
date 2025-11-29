'use client';

import type React from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { QuoteQueryResponseProvider } from '@/hooks/quotes/QuoteQueryResponseProvider';

export default function DevisLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryRequestProvider>
      <QuoteQueryResponseProvider>
        {children}
      </QuoteQueryResponseProvider>
    </QueryRequestProvider>
  );
}
