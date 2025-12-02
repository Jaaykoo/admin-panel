'use client';

import type { Category } from '@/types/CategoryTypes';
import { Check, ChevronRight, FolderOpen, Image as ImageIcon, Search } from 'lucide-react';
import Image from 'next/image';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

type CategorySelectorProps = {
  categories: Category[];
  selectedCategory?: Category | null;
  onSelect: (category: Category | null) => void;
  placeholder?: string;
  emptyText?: string;
};

export function CategorySelector({
  categories,
  selectedCategory,
  onSelect,
  placeholder = 'Sélectionner une catégorie parent...',
  emptyText = 'Aucune catégorie trouvée.',
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (categoryId: number) => {
    setImageErrors(prev => new Set(prev).add(categoryId));
  };

  // Fonction pour aplatir l'arborescence
  const flattenCategories = (cats: Category[], prefix = ''): Category[] => {
    return cats.reduce<Category[]>((acc, category) => {
      const breadcrumb = prefix
        ? `${prefix} > ${category.name}`
        : category.name;

      acc.push({
        ...category,
        breadcrumbs: breadcrumb,
      });

      if (category.children && category.children.length > 0) {
        acc.push(...flattenCategories(category.children, breadcrumb));
      }

      return acc;
    }, []);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlatCategories(flattenCategories(categories));
  }, [categories, flattenCategories]);

  const handleSelect = (category: Category) => {
    onSelect(category);
    setOpen(false);
  };

  const handleClear = () => {
    onSelect(null);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="justify-between"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          {selectedCategory
            ? (
                <>
                  {selectedCategory.image && !imageErrors.has(selectedCategory.id)
                    ? (
                        <Image
                          src={selectedCategory.image}
                          alt={selectedCategory.name}
                          width={20}
                          height={20}
                          className="h-5 w-5 rounded object-cover"
                          unoptimized={selectedCategory.image.includes('localhost')}
                          onError={() => handleImageError(selectedCategory.id)}
                        />
                      )
                    : (
                        <FolderOpen className="h-4 w-4 text-[#009ef7]" />
                      )}
                  <span className="font-medium">{selectedCategory.name}</span>
                </>
              )
            : (
                <>
                  <Search className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">{placeholder}</span>
                </>
              )}
        </div>
        <ChevronRight className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {selectedCategory && (
        <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            {selectedCategory.image && !imageErrors.has(selectedCategory.id)
              ? (
                  <Image
                    src={selectedCategory.image}
                    alt={selectedCategory.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                    unoptimized={selectedCategory.image.includes('localhost')}
                    onError={() => handleImageError(selectedCategory.id)}
                  />
                )
              : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-gray-100 to-gray-200">
                    <FolderOpen className="h-6 w-6 text-[#009ef7]" />
                  </div>
                )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {selectedCategory.name}
              </p>
              {selectedCategory.breadcrumbs && (
                <p className="text-xs text-gray-500">
                  {selectedCategory.breadcrumbs}
                </p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700"
          >
            Retirer
          </Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sélectionner une catégorie parent</DialogTitle>
            <DialogDescription>
              Recherchez et sélectionnez la catégorie parent pour votre nouvelle
              catégorie
            </DialogDescription>
          </DialogHeader>

          <Command className="rounded-lg border">
            <CommandInput placeholder="Rechercher une catégorie..." />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {flatCategories.map(category => (
                  <CommandItem
                    key={category.id}
                    value={`${category.name} ${category.breadcrumbs || ''}`}
                    onSelect={() => handleSelect(category)}
                  >
                    <div className="flex w-full items-center gap-3">
                      {category.image && !imageErrors.has(category.id)
                        ? (
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded object-cover"
                              unoptimized={category.image.includes('localhost')}
                              onError={() => handleImageError(category.id)}
                            />
                          )
                        : (
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-gray-100 to-gray-200">
                              {category.image
                                ? <ImageIcon className="h-4 w-4 text-blue-500" />
                                : <FolderOpen className="h-4 w-4 text-[#009ef7]" />}
                            </div>
                          )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{category.name}</p>
                        {category.breadcrumbs && (
                          <p className="text-xs text-gray-500">
                            {category.breadcrumbs}
                          </p>
                        )}
                      </div>
                      <Check
                        className={cn(
                          'h-4 w-4',
                          selectedCategory?.id === category.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
