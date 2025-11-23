'use client';

import type { Category } from '@/types/CategoryTypes';
import { ChevronRight, Edit, Eye, FolderPlus, Image as ImageIcon, MoreVertical, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
} from '@/hooks/catalogues/CategoryQueryResponseProvider';
import { CategoryDeleteDialog } from './CategoryDeleteDialog';
import { CategoryForm } from './CategoryForm';
import { CategoryTree } from './CategoryTree';

export function CategoryTable() {
  const categories = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const { refetch } = useQueryResponse();

  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [parentForSubCategory, setParentForSubCategory] = useState<Category | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (categoryId: number) => {
    setImageErrors(prev => new Set(prev).add(categoryId));
  };

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleAddSubCategory = (category: Category) => {
    setParentForSubCategory(category);
    setIsSubCategoryFormOpen(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded bg-gray-200"></div>
          <div className="h-24 rounded bg-gray-200"></div>
          <div className="h-24 rounded bg-gray-200"></div>
          <div className="h-24 rounded bg-gray-200"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 bg-white p-4">
          <Tabs value={viewMode} onValueChange={value => setViewMode(value as 'table' | 'tree')}>
            <TabsList className="bg-gray-100">
              <TabsTrigger value="table" className="data-[state=active]:bg-white">
                Table
              </TabsTrigger>
              <TabsTrigger value="tree" className="data-[state=active]:bg-white">
                Arbre
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="bg-gray-50">
          {viewMode === 'tree'
            ? (
                <div className="p-6">
                  <CategoryTree categories={categories} showSearch={false} />
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  {categories.length === 0
                    ? (
                        <div className="flex flex-col items-center justify-center py-16">
                          <div className="mb-4 rounded-full bg-gray-100 p-4">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-900">Aucune catégorie trouvée</p>
                          <p className="mt-1 text-xs text-gray-500">Essayez avec d'autres termes de recherche</p>
                        </div>
                      )
                    : (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-100">
                              <th className="py-4 pr-3 pl-6 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                                Catégorie
                              </th>
                              <th className="px-3 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                                Hiérarchie
                              </th>
                              <th className="px-3 py-4 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase">
                                Description
                              </th>
                              <th className="px-3 py-4 text-center text-xs font-semibold tracking-wider text-gray-700 uppercase">
                                Statut
                              </th>
                              <th className="py-4 pr-6 pl-3 text-right text-xs font-semibold tracking-wider text-gray-700 uppercase">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {categories.map(category => (
                              <tr key={category.id} className="group transition-colors hover:bg-blue-50/30">
                                <td className="py-4 pr-3 pl-6">
                                  <div className="flex items-center gap-4">
                                    {/* Image ou icône */}
                                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 shadow-sm transition-all group-hover:border-blue-300 group-hover:shadow-md">
                                      {category.image && !imageErrors.has(category.id)
                                        ? (
                                            <Image
                                              src={category.image}
                                              alt={category.name}
                                              fill
                                              className="object-cover transition-transform group-hover:scale-110"
                                              sizes="56px"
                                              onError={() => handleImageError(category.id)}
                                              unoptimized={category.image.includes('localhost')}
                                            />
                                          )
                                        : (
                                            <div className="flex h-full w-full items-center justify-center">
                                              <ImageIcon className="h-7 w-7 text-blue-500" strokeWidth={1.5} />
                                            </div>
                                          )}
                                    </div>
                                    {/* Nom et code */}
                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center gap-2">
                                        <Link
                                          href={`/catalog/categories/${category.id}`}
                                          className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-blue-600"
                                        >
                                          {category.name}
                                        </Link>
                                      </div>
                                      <p className="inline-block truncate rounded bg-gray-50 px-2 py-0.5 font-mono text-xs text-gray-500">
                                        {category.code}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-4">
                                  {category.breadcrumbs
                                    ? (
                                        <div className="flex flex-wrap items-center gap-1">
                                          {category.breadcrumbs.split('/').map((part, index, array) => (
                                            <div key={index} className="flex items-center">
                                              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-300 ring-inset">
                                                {part}
                                              </span>
                                              {index < array.length - 1 && (
                                                <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      )
                                    : (
                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-300 ring-inset">
                                          <span className="mr-1">🌟</span>
                                          Racine
                                        </span>
                                      )}
                                </td>
                                <td className="max-w-xs px-3 py-4">
                                  {category.description
                                    ? (
                                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                                          {category.description}
                                        </p>
                                      )
                                    : (
                                        <span className="text-xs text-gray-400 italic">Aucune description</span>
                                      )}
                                </td>
                                <td className="px-3 py-4 text-center">
                                  <Badge
                                    variant={category.is_public ? 'default' : 'secondary'}
                                    className={
                                      category.is_public
                                        ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-100'
                                        : 'bg-gray-100 text-gray-600 ring-1 ring-gray-300 hover:bg-gray-100'
                                    }
                                  >
                                    {category.is_public ? '✓ Public' : '✕ Privé'}
                                  </Badge>
                                </td>
                                <td className="py-4 pr-6 pl-3 text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuItem asChild>
                                        <Link
                                          href={`/catalog/categories/${category.id}`}
                                          className="flex cursor-pointer items-center"
                                        >
                                          <Eye className="mr-2 h-4 w-4" />
                                          Voir détails
                                        </Link>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleAddSubCategory(category)}
                                        className="cursor-pointer"
                                      >
                                        <FolderPlus className="mr-2 h-4 w-4" />
                                        Ajouter sous-catégorie
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleEdit(category)}
                                        className="cursor-pointer"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Modifier
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() => handleDelete(category)}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                </div>
              )}
        </div>
      </Card>

      {/* Edit Form */}
      <CategoryForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        category={categoryToEdit}
        allCategories={categories}
        mode="edit"
        onSuccess={handleSuccess}
      />

      {/* Sub-Category Form */}
      <CategoryForm
        open={isSubCategoryFormOpen}
        onOpenChange={setIsSubCategoryFormOpen}
        allCategories={categories}
        mode="create"
        parentCategory={parentForSubCategory}
        onSuccess={handleSuccess}
      />

      {/* Delete Dialog */}
      <CategoryDeleteDialog
        category={categoryToDelete}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
