'use client';

import type { OrderList, OrderStatus } from '@/types/OrderTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import {
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '@/hooks/orders/OrderQueryResponseProvider';
import { deleteOrder } from '@/services/OrderService';
import { getOrderStatusColor, getOrderStatusIcon, getOrderStatusLabel } from '@/types/OrderTypes';

export function OrdersTable() {
  const [orderToDelete, setOrderToDelete] = useState<OrderList | null>(null);
  const { state, updateState } = useQueryRequest();
  const orders = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const paginationData = useQueryResponsePagination();
  const { refetch } = useQueryResponse();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => deleteOrder(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.ORDERS_LIST] });
      toast.success('Commande supprimée avec succès');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la suppression de la commande');
    },
  });

  const totalCount = paginationData.count || 0;
  const totalPages = Math.ceil(totalCount / (state.limit || 10));
  const currentPage = Math.floor((state.offset || 0) / (state.limit || 10)) + 1;

  const handleDelete = async () => {
    if (!orderToDelete) {
      return;
    }

    await deleteMutation.mutateAsync(orderToDelete.id);
    setOrderToDelete(null);
  };

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (state.limit || 10);
    updateState({ offset: newOffset });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeVariant = (status: OrderStatus): 'default' | 'success' | 'warning' | 'destructive' | 'secondary' => {
    const color = getOrderStatusColor(status);
    const variantMap = {
      default: 'default' as const,
      success: 'success' as const,
      warning: 'warning' as const,
      danger: 'destructive' as const,
      secondary: 'secondary' as const,
    };
    return variantMap[color] || 'default';
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#009ef7] border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">
            Chargement des commandes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Total TTC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="py-8">
                        <p className="text-sm text-gray-500">
                          Aucune commande trouvée
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              : (
                  orders.map((order: OrderList) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/sales/orders/${order.id}`}
                          className="text-[#009ef7] hover:underline"
                        >
                          {order.number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {order.email || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {new Date(order.date_placed).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(order.date_placed).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getOrderStatusIcon(order.status)}
                          {' '}
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-[#009ef7]">
                        {Number(order.total_incl_tax).toLocaleString('fr-FR')}
                        {' '}
                        FCFA
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/sales/orders/${order.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/sales/orders/${order.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setOrderToDelete(order)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page
            {' '}
            {currentPage}
            {' '}
            sur
            {' '}
            {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Alert Dialog for Delete */}
      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La commande
              {' '}
              <strong>
                {orderToDelete?.number}
              </strong>
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
  );
}
