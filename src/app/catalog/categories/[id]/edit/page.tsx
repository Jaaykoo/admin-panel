'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { CategoryForm } from '@/components/catalogue/categories/CategoryForm';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryResponseData } from '@/hooks/catalogues/CategoryQueryResponseProvider';
import { getCategoryById } from '@/services/CategoryServices';

export default function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(Number(id)),
    enabled: !!id,
  });
  const allCategories = useQueryResponseData();

  const handleSuccess = () => {
    router.push(`/catalog/categories/${id}`);
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
                  <Button className="mt-4">Retour aux catégories</Button>
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
            <Link href={`/catalog/categories/${id}`}>
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux détails
              </Button>
            </Link>

            <Card className="p-6">
              <h1 className="mb-6 text-2xl font-bold">
                Modifier la catégorie:
                {' '}
                {category.name}
              </h1>

              <CategoryForm
                open
                onOpenChange={(open) => {
                  if (!open) {
                    router.push(`/catalog/categories/${id}`);
                  }
                }}
                category={category}
                allCategories={allCategories}
                mode="edit"
                onSuccess={handleSuccess}
              />
            </Card>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
