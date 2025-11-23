'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { OrderEditForm } from '@/components/orders/OrderEditForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { getOrderById } from '@/services/OrderService';

export default function OrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: [QUERIES.ORDER_DETAIL, id],
    queryFn: () => getOrderById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="space-y-6 p-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <Card className="p-8 text-center">
                <p className="text-gray-500">Commande introuvable</p>
                <Link href="/sales/orders">
                  <Button className="mt-4">
                    Retour aux commandes
                  </Button>
                </Link>
              </Card>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="space-y-6 p-6">
            {/* Header */}
            <Link href={`/sales/orders/${id}`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux détails
              </Button>
            </Link>

            <Card className="p-6">
              <h1 className="mb-6 text-2xl font-bold">
                Modifier la commande #
                {order.number}
              </h1>

              {/* Edit Form */}
              <OrderEditForm order={order} />
            </Card>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
