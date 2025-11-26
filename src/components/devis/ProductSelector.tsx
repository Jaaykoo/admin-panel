'use client';

import type { ProductList } from '@/types/ProductTypes';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import {
  ProductQueryResponseProvider,
  useQueryResponseData,
  useQueryResponseLoading,
} from '@/hooks/catalogues/ProductQueryResponseProvider';

type ProductSelectorProps = {
  onSelectProduct: (product: ProductList) => void;
};

function ProductSelectorContent({ onSelectProduct }: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { updateState } = useQueryRequest();

  const isLoading = useQueryResponseLoading();
  const products = useQueryResponseData();

  // Update search with debounce to avoid infinite loop
  useEffect(() => {
    if (!open || !search) return;

    const timeoutId = setTimeout(() => {
      updateState({ search, limit: 20 });
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, open]);

  const handleSelect = (product: ProductList) => {
    onSelectProduct(product);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rechercher un produit</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Rechercher par nom de produit..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}
            {!isLoading && search && products.length === 0 && (
              <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
            )}
            {!isLoading && products.length > 0 && (
              <CommandGroup>
                {products.map((product) => {
                  const price = product.price || '0';
                  const mainImage = product.images?.[0]?.original;

                  return (
                    <CommandItem
                      key={product.id}
                      onSelect={() => handleSelect(product)}
                      className="cursor-pointer"
                    >
                      <div className="flex w-full items-center gap-4">
                        {/* Image */}
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border">
                          {mainImage
                            ? (
                                <img
                                  src={mainImage}
                                  alt={product.title}
                                  className="object-cover"
                                />
                              )
                            : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                                  N/A
                                </div>
                              )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>
                              Prix:
                              {' '}
                              {price}
                              {' '}
                              XOF
                            </span>
                            {product.code && (
                              <>
                                <span>•</span>
                                <span>
                                  Code:
                                  {product.code}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function ProductSelector({ onSelectProduct }: ProductSelectorProps) {
  return (
    <ProductQueryResponseProvider>
      <ProductSelectorContent onSelectProduct={onSelectProduct} />
    </ProductQueryResponseProvider>
  );
}
