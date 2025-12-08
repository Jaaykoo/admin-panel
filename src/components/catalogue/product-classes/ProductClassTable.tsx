'use client';

import type { ProductClass } from '@/types/ProductClassTypes';
import { MoreHorizontal, Package } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
import { extractProductClassSlugFromUrl } from '@/helpers/UrlHelper';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import {
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
} from '@/hooks/catalogues/ProductClassQueryResponseProvider';
import { deleteProductClass } from '@/services/ProductTypeService';

type ProductClassTableProps = {
  onEdit?: (productClass: ProductClass) => void;
  onDelete?: (slug: string) => void;
};

export function ProductClassTable({ onDelete }: ProductClassTableProps) {
  const data = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const { refetch } = useQueryResponse();
  const { state, updateState } = useQueryRequest();

  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(state.search || '');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce pour la recherche avec useRef pour éviter les re-renders
  useEffect(() => {
    // Annuler le timer précédent
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Créer un nouveau timer
    debounceTimerRef.current = setTimeout(() => {
      updateState({ search: searchValue, offset: 0 });
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  const handleDelete = async (slug: string, name: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le type de produit "${name}" ?`)) {
      return;
    }

    try {
      setDeletingSlug(slug);
      await deleteProductClass(slug);
      toast.success('Type de produit supprimé avec succès');
      refetch();
      onDelete?.(slug);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du type de produit');
    } finally {
      setDeletingSlug(null);
    }
  };

  // Fonction helper pour extraire le slug depuis l'URL
  const getSlugFromUrl = (url: string): string => {
    return extractProductClassSlugFromUrl(url) || '';
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Chargement des types de produit...</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Header avec recherche */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <Input
              ref={inputRef}
              placeholder="Rechercher un type de produit..."
              value={searchValue}
              onChange={handleSearchChange}
              className="border-gray-300 pl-4"
            />
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-gray-50">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50/50">
                <TableHead className="font-semibold text-gray-900">Nom</TableHead>
                <TableHead className="font-semibold text-gray-900">Code</TableHead>
                <TableHead className="font-semibold text-gray-900">Expédition</TableHead>
                <TableHead className="font-semibold text-gray-900">Suivi stock</TableHead>
                <TableHead className="font-semibold text-gray-900">Attributs</TableHead>
                <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Package className="mb-3 h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">Aucun type de produit</p>
                          <p className="text-sm">Commencez par créer votre premier type de produit</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                : (
                    data.map(productClass => (
                      <TableRow key={productClass.code} className="border-gray-200 hover:bg-gray-50/50">
                        <TableCell className="font-medium text-gray-900">{productClass.name}</TableCell>
                        <TableCell>
                          <code className="rounded border border-[#e1f0ff] bg-[#f1f8ff] px-2 py-1 text-sm text-[#009ef7]">
                            {productClass.code ? productClass.code : '—'}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={productClass.requires_shipping ? 'default' : 'secondary'}
                            className={productClass.requires_shipping
                              ? 'bg-[#009ef7] hover:bg-[#0077b6]'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          >
                            {productClass.requires_shipping ? 'Oui' : 'Non'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={productClass.track_stock ? 'default' : 'secondary'}
                            className={productClass.track_stock
                              ? 'bg-[#009ef7] hover:bg-[#0077b6]'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          >
                            {productClass.track_stock ? 'Oui' : 'Non'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {productClass.attributes?.length || 0}
                            {' '}
                            attribut(s)
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                disabled={deletingSlug === productClass.code}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/catalog/product-classes/${getSlugFromUrl(productClass.url)}`}>
                                  Voir les détails
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/catalog/product-classes/${getSlugFromUrl(productClass.url)}/edit`}>
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(getSlugFromUrl(productClass.url), productClass.name)}
                                className="text-destructive"
                                /* disabled={deletingSlug === getSlugFromUrl(productClass.url)} */
                                disabled={true}
                              >
                                {deletingSlug === getSlugFromUrl(productClass.url) ? 'Suppression...' : 'Supprimer'}
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
      </div>
    </div>
  );
}
