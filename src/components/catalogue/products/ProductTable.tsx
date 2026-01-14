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
import {
  useQueryResponse,
  useQueryResponsePagination,
} from '@/hooks/catalogues/ProductQueryResponseProvider';
import { deleteProduct } from '@/services/ProductService';

export function ProductTable() {
  const { refetch } = useQueryResponse();
  const pagination = useQueryResponsePagination();

  const [productToDelete, setProductToDelete] = useState<ProductList | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const products = pagination.results || [];

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

  return (
    <>
      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
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
                      <TableCell className="text-sm text-gray-600">{product.code ? product.code : '-'}</TableCell>
                      <TableCell className="font-semibold text-[#009ef7]">
                        {product.price}
                        {' '}
                        FCFA
                      </TableCell>
                      <TableCell>
                        {product.is_public
                          ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Public
                              </Badge>
                            )
                          : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                Privé
                              </Badge>
                            )}
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
    </>
  );
}
