'use client';

import type { ProductClassDetail } from '@/types/ProductClassTypes';
import { Check, FolderOpen, Loader2 } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { extractProductClassSlugFromUrl } from '@/helpers/UrlHelper';
import { cn } from '@/lib/utils';
import { getProductClasses } from '@/services/ProductClassService';

type ProductClassSelectorProps = {
  value?: string;
  onSelect: (productClass: ProductClassDetail | null) => void;
  disabled?: boolean;
};

export function ProductClassSelector({ value, onSelect, disabled }: ProductClassSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productClasses, setProductClasses] = useState<ProductClassDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductClass, setSelectedProductClass] = useState<ProductClassDetail | null>(null);

  // Utiliser useDeferredValue pour éviter le re-render pendant la frappe
  const deferredSearchTerm = useDeferredValue(searchTerm);

  // Fetch des product classes avec debounce
  useEffect(() => {
    const fetchProductClasses = async () => {
      setIsLoading(true);
      try {
        const query = deferredSearchTerm ? `?search=${encodeURIComponent(deferredSearchTerm)}` : '';
        const response = await getProductClasses(query);
        setProductClasses(response.results || []);
      } catch (error) {
        console.error('Error fetching product classes:', error);
        setProductClasses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductClasses();
  }, [deferredSearchTerm]);

  // Synchroniser selectedProductClass avec value (quand le produit est chargé)
  useEffect(() => {
    if (value && productClasses.length > 0) {
      const found = productClasses.find(pc => extractProductClassSlugFromUrl(pc.url) === value);
      if (found) {
        setSelectedProductClass(found);
      }
    } else if (!value) {
      setSelectedProductClass(null);
    }
  }, [value, productClasses]);

  const handleSelect = (productClass: ProductClassDetail) => {
    setSelectedProductClass(productClass);
    onSelect(productClass);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedProductClass(null);
    onSelect(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 w-[95%]">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          {selectedProductClass ? selectedProductClass.name : 'Sélectionner un type de produit'}
        </Button>
        {selectedProductClass && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
          >
            ×
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sélectionner un type de produit</DialogTitle>
            <DialogDescription>
              Recherchez et sélectionnez le type de produit pour votre produit
            </DialogDescription>
          </DialogHeader>

          <Command className="rounded-lg border">
            <CommandInput
              placeholder="Rechercher un type de produit..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading
                ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )
                : (
                    <>
                      <CommandEmpty>Aucun type de produit trouvé</CommandEmpty>
                      <CommandGroup>
                        {productClasses.map(productClass => (
                          <CommandItem
                            key={extractProductClassSlugFromUrl(productClass.url)}
                            value={productClass.name}
                            onSelect={() => handleSelect(productClass)}
                          >
                            <div className="flex w-full items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                                <FolderOpen className="h-4 w-4 text-[#009ef7]" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{productClass.name}</p>
                                <p className="text-xs text-gray-500">{extractProductClassSlugFromUrl(productClass.url)}</p>
                              </div>
                              <Check
                                className={cn(
                                  'h-4 w-4',
                                  extractProductClassSlugFromUrl(selectedProductClass?.url || '') === extractProductClassSlugFromUrl(productClass.url)
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </>
                  )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
