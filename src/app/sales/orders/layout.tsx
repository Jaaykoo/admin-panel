'use client';

import type { FC, ReactNode } from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { OrderQueryResponseProvider } from '@/hooks/orders/OrderQueryResponseProvider';

type OrdersLayoutProps = {
  children: ReactNode;
};

const OrdersLayout: FC<OrdersLayoutProps> = ({ children }) => {
  return (
    <QueryRequestProvider>
      <OrderQueryResponseProvider>
        {children}
      </OrderQueryResponseProvider>
    </QueryRequestProvider>
  );
};

export default OrdersLayout;
