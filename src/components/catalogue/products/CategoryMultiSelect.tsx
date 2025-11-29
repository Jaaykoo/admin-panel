'use client';

import type { Category } from '@/types/CategoryTypes';
import { Check, Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import { useQueryResponseData, useQueryResponseLoading } from '@/hooks/catalogues/CategoryQueryResponseProvider';
import { cn } from '@/lib/utils';

type CategoryMultiSelectProps = {
  value: string[];
  onChange: (categories: string[]) => void;
  disabled?: boolean;
};

export function CategoryMultiSelect({ value, onChange, disabled }: CategoryMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { updateState } = useQueryRequest();
  const categories = useQueryResponseData();
  const isLoading = useQueryResponseLoading();

  // Mettre à jour la recherche dans le provider
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateState({ search: searchTerm, offset: 0 });
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, updateState]);

  // Dériver les catégories sélectionnées depuis value et categories
  // useMemo évite les re-renders inutiles et élimine le besoin de setState dans useEffect
  const selectedCategories = useMemo(() => {
    if (value.length === 0 || categories.length === 0) {
      return [];
    }

    return categories.filter((cat): cat is Category & { slug: string } =>
      !!cat.slug && value.includes(cat.slug),
    );
  }, [value, categories]);
  const handleSelect = (category: Category) => {
    if (!category.slug) {
      return;
    }

    const slug: string = category.slug;
    const isSelected = value.includes(slug);
    const newValue: string[] = isSelected
      ? value.filter(s => s !== slug)
      : [...value, slug];

    // selectedCategories sera automatiquement mis à jour via useMemo
    onChange(newValue);
  };

  const handleRemove = (categorySlug: string | undefined) => {
    if (!categorySlug) {
      return;
    }

    const newValue = value.filter(slug => slug !== categorySlug);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {/* Selected categories */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((category) => {
            if (!category.slug) {
              return null;
            }
            return (
              <Badge
                key={category.slug}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="text-xs">{category.breadcrumbs || category.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(category.slug)}
                  disabled={disabled}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Select button */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        {selectedCategories.length > 0
          ? `${selectedCategories.length} catégorie(s) sélectionnée(s)`
          : 'Sélectionner des catégories'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sélectionner des catégories</DialogTitle>
            <DialogDescription>
              Recherchez et sélectionnez une ou plusieurs catégories pour votre produit
            </DialogDescription>
          </DialogHeader>

          <Command className="rounded-lg border">
            <CommandInput
              placeholder="Rechercher une catégorie..."
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
                      <CommandEmpty>Aucune catégorie trouvée</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => {
                          if (!category.slug) {
                            return null;
                          }
                          const isSelected = value.includes(category.slug);
                          return (
                            <CommandItem
                              key={category.slug}
                              value={`${category.name} ${category.breadcrumbs || ''}`}
                              onSelect={() => handleSelect(category)}
                            >
                              <div className="flex w-full items-center gap-3">
                                <div className={cn(
                                  'flex h-4 w-4 items-center justify-center rounded border',
                                  isSelected ? 'border-[#009ef7] bg-[#009ef7]' : 'border-gray-300',
                                )}
                                >
                                  {isSelected && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{category.name}</p>
                                  {category.breadcrumbs && (
                                    <p className="text-xs text-gray-500">
                                      {category.breadcrumbs}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </CommandItem>
                          );
                        })}
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
