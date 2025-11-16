import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layouts/header';
import { Sidebar } from '@/components/layouts/sidebar';
import { MainContent } from '@/components/layouts/main-content';
import { PageHeader } from '@/components/page-header';
import { ProductTable } from '@/components/product-table';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Produits"
              breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Catalogue' }, { label: 'Produits' }]}
              actions={(
                <Link href="/catalog/products/add">
                  <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </Link>
              )}
            />
            <ProductTable />
          </div>
        </main>
      </MainContent>`n    </div>`n  );
}
