'use client';

import type { QuoteStatus } from '@/types/QuoteTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CustomerPagination } from '@/components/customers/tables/customer-pagination';
import { QuoteTable } from '@/components/devis/QuoteTable';
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
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import {
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '@/hooks/quotes/QuoteQueryResponseProvider';
import { deleteQuote } from '@/services/QuoteService';

export default function DevisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { state, updateState } = useQueryRequest();
  const quotes = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const paginationData = useQueryResponsePagination();
  const { refetch } = useQueryResponse();
  const queryClient = useQueryClient();

  // Initialiser
  useEffect(() => {
    updateState({
      offset: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recherche en temps réel avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateState({ search: searchQuery, offset: 0 });
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche se fait automatiquement via useEffect
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    const currentFilter = state.filter || {};

    if (value === 'all') {
      const { status, ...restFilter } = currentFilter as any;
      updateState({ filter: restFilter, offset: 0 });
    } else {
      updateState({
        filter: {
          ...currentFilter,
          status: value as QuoteStatus,
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

  // Mutation pour supprimer un devis
  const deleteMutation = useMutation({
    mutationFn: deleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUOTES_LIST] });
      toast.success('Devis supprimé avec succès');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du devis');
    },
  });

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
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des devis</h1>
                  <p className="text-sm text-gray-500">
                    {paginationData.count || 0}
                    {' '}
                    devis au total
                  </p>
                </div>
              </div>
              <Link href="/devis/add">
                <Button className="bg-[#009ef7] shadow-md hover:bg-[#0077b6]">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau devis
                </Button>
              </Link>
            </div>

            {/* Filters and Search */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher par N° devis, client..."
                      className="border-gray-300 pl-10"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[200px] border-gray-300">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="DRAFT">📝 Brouillon</SelectItem>
                    <SelectItem value="SUBMITTED">📤 Soumis</SelectItem>
                    <SelectItem value="RESPONDED">💬 Répondu</SelectItem>
                    <SelectItem value="ACCEPTED">✅ Accepté</SelectItem>
                    <SelectItem value="REFUSED">❌ Refusé</SelectItem>
                    <SelectItem value="EXPIRED">⏰ Expiré</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || statusFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <X className="h-4 w-4" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>

            {/* Table */}
            <QuoteTable
              quotes={quotes}
              isLoading={isLoading}
              onDelete={id => deleteMutation.mutate(id)}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <CustomerPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={state.limit || 10}
                totalItems={paginationData.count || 0}
                onPageChangeAction={handlePageChange}
                onPageSizeChangeAction={handlePageSizeChange}
              />
            )}
          </div>
        </main>
      </MainContent>
    </div>
  );
}
