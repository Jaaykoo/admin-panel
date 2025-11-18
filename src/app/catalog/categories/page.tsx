'use client';

import { Package, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CategoryForm } from '@/components/catalogue/categories/CategoryForm';
import { CategoryTable } from '@/components/catalogue/categories/CategoryTable';
import { CustomerPagination } from '@/components/customers/tables/customer-pagination';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import { useQueryResponse, useQueryResponseData, useQueryResponseLoading, useQueryResponsePagination } from '@/hooks/catalogues/CategoryQueryResponseProvider';

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { state, updateState } = useQueryRequest();
  const categories = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const paginationData = useQueryResponsePagination();
  const { refetch } = useQueryResponse();

  // Initialiser
  useEffect(() => {
    updateState({
      offset: 0,
    });
  }, []);

  // Recherche en temps réel avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateState({ search: searchQuery, offset: 0 });
    }, 300); // Délai de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche se fait automatiquement via useEffect
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    const currentFilter = state.filter || {};

    if (value === 'all') {
      const { is_public, ...restFilter } = currentFilter as any;
      updateState({ filter: restFilter, offset: 0 });
    } else {
      updateState({
        filter: {
          ...currentFilter,
          is_public: value === 'public',
        },
        offset: 0,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    updateState({
      search: '',
      filter: {},
      offset: 0,
    });
  };

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (state.limit || 10);
    updateState({ offset: newOffset });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (size: number) => {
    updateState({ limit: size as 10 | 20 | 50 | 100, offset: 0 });
  };

  const handleSuccess = () => {
    refetch();
  };

  const totalPages = Math.ceil((paginationData.count || 0) / (state.limit || 10));
  const currentPage = Math.floor((state.offset || 0) / (state.limit || 10)) + 1;

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
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des catégories</h1>
                  <p className="text-sm text-gray-500">Organisez vos produits par catégories</p>
                </div>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-[#009ef7] shadow-md hover:bg-[#0077b6]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle catégorie
              </Button>
            </div>

            {/* Filters and Search */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher par nom, code, description..."
                      className="border-gray-300 pl-10"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="public">Public uniquement</SelectItem>
                    <SelectItem value="private">Privé uniquement</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-gray-300 bg-white shadow-sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>

            {/* Table */}
            {isLoading
              ? (
                  <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-16 shadow-sm">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#009ef7] border-t-transparent" />
                      <p className="mt-4 text-sm text-gray-600">Chargement des catégories...</p>
                    </div>
                  </div>
                )
              : (
                  <>
                    <CategoryTable />

                    {/* Pagination */}
                    {categories.length > 0 && (
                      <CustomerPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={state.limit || 10}
                        totalItems={paginationData.count || 0}
                        onPageChangeAction={handlePageChange}
                        onPageSizeChangeAction={handlePageSizeChange}
                      />
                    )}
                  </>
                )}
          </div>
        </main>
      </MainContent>

      {/* Form Modal */}
      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        allCategories={categories}
        mode="create"
        onSuccess={handleSuccess}
      />
    </div>
  );
}
