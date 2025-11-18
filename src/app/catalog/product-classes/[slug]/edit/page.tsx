'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';
import { ProductClassForm } from '@/components/catalogue/product-classes';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';
import { getProductClassBySlug } from '@/services/ProductTypeService';

type EditProductClassPageProps = {
  params: Promise<{ slug: string }>;
};

export default function EditProductClassPage({ params }: EditProductClassPageProps) {
  const { slug } = use(params);
  const { data: productClass, isLoading } = useQuery({
    queryKey: ['product-class', slug],
    queryFn: () => getProductClassBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Chargement du type de produit...</div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }
  if (!productClass) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/catalog/product-classes/${slug}`}>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Modifier "
                    {productClass.name}
                    "
                  </h1>
                  <p className="text-sm text-gray-500">Modifiez les propriétés et attributs du type de produit</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <ProductClassForm initialData={productClass} isEditing />
            </div>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
