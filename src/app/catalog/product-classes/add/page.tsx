'use client';

import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { ProductClassForm } from '@/components/catalogue/product-classes';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';

export default function CreateProductClassPage() {
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
                <Link href="/catalog/product-classes">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Créer un type de produit</h1>
                  <p className="text-sm text-gray-500">Définissez un nouveau type de produit avec ses attributs</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <ProductClassForm />
            </div>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
