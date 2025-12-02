'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, FolderPlus, Image as ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { CategoryBreadcrumb } from '@/components/catalogue/categories/CategoryBreadcrumb';
import { CategoryDeleteDialog } from '@/components/catalogue/categories/CategoryDeleteDialog';
import { CategoryForm } from '@/components/catalogue/categories/CategoryForm';
import { CategoryTree } from '@/components/catalogue/categories/CategoryTree';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryResponseData } from '@/hooks/catalogues/CategoryQueryResponseProvider';
import { getCategoryById } from '@/services/CategoryServices';

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: category, isLoading, refetch } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: !!id,
  });
  const allCategories = useQueryResponseData();

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isSubCategoryFormOpen, setIsSubCategoryFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <Skeleton className="mb-4 h-8 w-64" />
              <Skeleton className="h-96 w-full" />
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <Card className="p-8 text-center">
                <p className="text-gray-500">Catégorie introuvable</p>
                <Link href="/catalog/categories">
                  <Button className="mt-4">
                    Retour aux catégories
                  </Button>
                </Link>
              </Card>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Breadcrumb et actions */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Link href="/catalog/categories">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour aux catégories
                  </Button>
                </Link>
                <CategoryBreadcrumb category={category} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsSubCategoryFormOpen(true)}
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Ajouter sous-catégorie
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditFormOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Informations principales */}
              <Card className="p-6 lg:col-span-2">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Code:
                      {category.code}
                    </p>
                  </div>
                  <Badge
                    variant={category.is_public ? 'default' : 'secondary'}
                    className={
                      category.is_public
                        ? 'bg-[#e8fff3] text-[#50cd89]'
                        : 'bg-gray-100 text-gray-600'
                    }
                  >
                    {category.is_public ? 'Public' : 'Privé'}
                  </Badge>
                </div>

                {category.image && !imageError
                  ? (
                      <div className="mb-6">
                        <div className="relative h-80 w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                            unoptimized={category.image.includes('localhost')}
                            onError={() => setImageError(true)}
                            priority
                          />
                        </div>
                      </div>
                    )
                  : category.image
                    ? (
                        <div className="mb-6">
                          <div className="flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
                            <ImageIcon className="h-24 w-24 text-blue-400" strokeWidth={1.5} />
                          </div>
                        </div>
                      )
                    : null}

                {category.description && (
                  <div className="mb-6">
                    <h2 className="mb-2 text-lg font-semibold">Description</h2>
                    <p className="text-gray-700">{category.description}</p>
                  </div>
                )}

                {/* Informations SEO */}
                {(category.meta_title || category.meta_description) && (
                  <div>
                    <h2 className="mb-3 text-lg font-semibold">SEO</h2>
                    <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                      {category.meta_title && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">Meta Title</p>
                          <p className="text-sm text-gray-900">{category.meta_title}</p>
                        </div>
                      )}
                      {category.meta_description && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">Meta Description</p>
                          <p className="text-sm text-gray-900">{category.meta_description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>

              {/* Informations supplémentaires */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="mb-4 text-lg font-semibold">Informations</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Slug</p>
                      <p className="text-sm text-gray-900">{category.slug || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Breadcrumbs</p>
                      <p className="text-sm text-gray-900">{category.breadcrumbs || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Parents publics</p>
                      <p className="text-sm text-gray-900">
                        {category.ancestors_are_public ? 'Oui' : 'Non'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">URL</p>
                      <p className="truncate text-sm text-gray-900">{category.url}</p>
                    </div>
                  </div>
                </Card>

                {category.children && category.children.length > 0 && (
                  <Card className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                      Sous-catégories (
                      {category.children.length}
                      )
                    </h2>
                    <CategoryTree
                      categories={category.children}
                      showSearch={false}
                    />
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </MainContent>

      {/* Modals */}
      <CategoryForm
        open={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        category={category}
        allCategories={allCategories}
        mode="edit"
        onSuccess={handleSuccess}
      />

      <CategoryForm
        open={isSubCategoryFormOpen}
        onOpenChange={setIsSubCategoryFormOpen}
        allCategories={allCategories}
        mode="create"
        parentCategory={category}
        onSuccess={handleSuccess}
      />

      <CategoryDeleteDialog
        category={category}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={() => {
          window.location.href = '/catalog/categories';
        }}
      />
    </div>
  );
}
