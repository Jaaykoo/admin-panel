'use client';

import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { ProductTable } from '@/components/catalogue/products/ProductTable';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des produits</h1>
                  <p className="text-sm text-gray-500">Gérez votre catalogue de produits</p>
                </div>
              </div>
              <Link href="/catalog/products/add">
                <Button className="bg-[#009ef7] shadow-md hover:bg-[#0077b6]">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau produit
                </Button>
              </Link>
            </div>

            {/* Table */}
            <ProductTable />
          </div>
        </main>
      </MainContent>
    </div>
  );
}
