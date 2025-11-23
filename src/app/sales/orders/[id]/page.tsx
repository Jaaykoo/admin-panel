'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { OrderDetailsView } from '@/components/orders/OrderDetailsView';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { deleteOrder, getOrderById } from '@/services/OrderService';

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: [QUERIES.ORDER_DETAIL, id],
    queryFn: () => getOrderById(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrder(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.ORDERS_LIST] });
      toast.success('Commande supprimée avec succès');
      router.push('/sales/orders');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression de la commande');
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/sales/orders">
                  <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Commande #
                    {order.number}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Détails complets de la commande
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/sales/orders/${id}/edit`}>
                  <Button variant="outline">
                    <Edit2 className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. La commande #
                        {order.number}
                        {' '}
                        sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Order Details */}
            <OrderDetailsView order={order} />
          </div>
        </main>
      </MainContent>
    </div>
  );
}
