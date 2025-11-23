'use client';

import type { ProductList } from '@/types/ProductTypes';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import Image from 'next/image';
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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useQueryRequest,
  useQueryRequestLoading,
} from '@/hooks/_QueryRequestProvider';
import {
  useQueryResponse,
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '@/hooks/catalogues/ProductQueryResponseProvider';
import { deleteProduct } from '@/services/ProductService';

export function ProductTable() {
  const isLoading = useQueryResponseLoading();
  const { refetch } = useQueryResponse();
  const { state, updateState } = useQueryRequest();
  const pagination = useQueryResponsePagination();
  const isRequestLoading = useQueryRequestLoading();

  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<ProductList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const products = pagination.results || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateState({ search: value, offset: 0 });
  };

  const handlePageChange = (newOffset: number) => {
    updateState({ offset: newOffset });
  };

  const handleDelete = async () => {
    if (!productToDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success('Produit supprimé avec succès');
      setProductToDelete(null);
      refetch();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#009ef7] border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <p className="text-sm text-gray-500">
          {pagination.count || 0}
          {' '}
          produit(s) au total
        </p>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>upc</TableHead>
              <TableHead>reférence</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="py-8">
                        <p className="text-sm text-gray-500">Aucun produit trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              : (
                  products.map((product: ProductList) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded">
                          {product.images && Array.isArray(product.images) && product.images.length > 0
                            ? (
                                <Image
                                  src={product.images[0]?.original || '/placeholder.png'}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              )
                            : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                  N/A
                                </div>
                              )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell className="text-sm text-gray-600">{product.upc ? product.upc : '-'}</TableCell>
                      <TableCell className="text-sm text-gray-600">{product.code ? product.code : '-'}</TableCell>
                      <TableCell className="font-semibold text-[#009ef7]">
                        {product.price}
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
                              <Link href={`/catalog/products/${product.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/catalog/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setProductToDelete(product)}
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
      {pagination.count && pagination.count > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const currentOffset = state.offset || 0;
              const limit = state.limit || 10;
              const newOffset = Math.max(0, currentOffset - limit);
              handlePageChange(newOffset);
            }}
            disabled={!pagination.previous || isRequestLoading}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page
            {' '}
            {Math.floor((state.offset || 0) / (state.limit || 10)) + 1}
            {' '}
            sur
            {' '}
            {Math.ceil((pagination.count || 0) / (state.limit || 10))}
          </span>
          <Button
            variant="outline"
            onClick={() => {
              const currentOffset = state.offset || 0;
              const limit = state.limit || 10;
              const newOffset = currentOffset + limit;
              handlePageChange(newOffset);
            }}
            disabled={!pagination.next || isRequestLoading}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "
              {productToDelete?.title}
              " ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
