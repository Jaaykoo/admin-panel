'use client';

import type { Category } from '@/types/CategoryTypes';
import { Search } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';

import { Card } from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { CategoryNode } from './CategoryNode';

type CategoryTreeProps = {
  categories: Category[];
  onSelect?: (category: Category) => void;
  selectedId?: number;
  showSearch?: boolean;
};

export function CategoryTree({
  categories,
  onSelect,
  selectedId,
  showSearch = true,
}: CategoryTreeProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction récursive pour filtrer les catégories
  const filterCategories = useCallback((cats: Category[], term: string): Category[] => {
    if (!term) {
      return cats;
    }

    const lowerTerm = term.toLowerCase();

    return cats.reduce<Category[]>((acc, category) => {
      const matchesName = category.name.toLowerCase().includes(lowerTerm);
      const matchesBreadcrumbs = category.breadcrumbs
        ?.toLowerCase()
        .includes(lowerTerm);
      const matchesDescription = category.description
        ?.toLowerCase()
        .includes(lowerTerm);

      let filteredChildren: Category[] = [];
      if (category.children && category.children.length > 0) {
        // eslint-disable-next-line react-hooks/immutability
        filteredChildren = filterCategories(category.children, term);
      }

      if (matchesName || matchesBreadcrumbs || matchesDescription || filteredChildren.length > 0) {
        acc.push({
          ...category,
          children: filteredChildren.length > 0 ? filteredChildren : category.children,
        });
      }

      return acc;
    }, []);
  }, []);

  const filteredCategories = useMemo(
    () => filterCategories(categories, searchTerm),
    [categories, searchTerm, filterCategories],
  );

  if (categories.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">Aucune catégorie disponible</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {showSearch && (
        <div className="border-b border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-y-auto p-2">
        {filteredCategories.length === 0
          ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">
                  Aucune catégorie ne correspond à votre recherche
                </p>
              </div>
            )
          : (
              <div className="space-y-1">
                {filteredCategories.map(category => (
                  <CategoryNode
                    key={category.id}
                    category={category}
                    onSelect={onSelect}
                    selectedId={selectedId}
                  />
                ))}
              </div>
            )}
      </div>
    </Card>
  );
}
