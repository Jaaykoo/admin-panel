'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CustomerPagination } from '@/components/customers/tables/customer-pagination';
import { IndividualsTable } from '@/components/customers/tables/particuliers-table';
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
import { UsersKpiCards } from '@/components/users/UsersKpiCards';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import { useQueryResponseData, useQueryResponseLoading, useQueryResponsePagination } from '@/hooks/user/UserQueryResponseProvider';
import { useUsersStatistics } from '@/hooks/useUsersStatistics';

export default function ParticuliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { state, updateState } = useQueryRequest();
  const users = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const paginationData = useQueryResponsePagination();

  // KPIs en temps réel pour les PARTICULIERS uniquement
  const { statistics, isLoading: isLoadingStats } = useUsersStatistics('PARTICULIER');

  // Initialiser le filtre par rôle PARTICULIER au montage du composant
  useEffect(() => {
    updateState({
      filter: { role: 'PARTICULIER' },
      offset: 0,
    });
  }, [updateState]);

  // Recherche en temps réel avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateState({ search: searchQuery, offset: 0 });
    }, 300); // Délai de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchQuery, updateState]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche se fait automatiquement via useEffect
  };

  const handleActiveFilterChange = (value: string) => {
    setActiveFilter(value);
    const currentFilter = state.filter || {};

    if (value === 'all') {
      // Supprimer le filtre is_active mais garder le role
      const { is_active, ...restFilter } = currentFilter as any;
      updateState({ filter: restFilter, offset: 0 });
    } else {
      // Ajouter le filtre is_active
      updateState({
        filter: {
          ...currentFilter,
          is_active: value === 'active',
        },
        offset: 0,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    updateState({
      search: '',
      filter: { role: 'PARTICULIER' },
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

  const totalPages = Math.ceil((paginationData.count || 0) / (state.limit || 10));
  const currentPage = Math.floor((state.offset || 0) / (state.limit || 10)) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="space-y-6 p-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Clients Particuliers</h1>
                    <p className="text-sm text-gray-500">
                      Gérez vos clients particuliers et leurs informations
                    </p>
                  </div>
                </div>
              </div>
              {/*              <Button className="bg-[#009ef7] shadow-md hover:bg-[#0077b6]">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un particulier
              </Button> */}
            </div>

            {/* KPIs en temps réel pour les PARTICULIERS */}
            <UsersKpiCards
              total={statistics.total}
              active={statistics.active}
              verified={statistics.verified}
              inactive={statistics.inactive}
              isLoading={isLoadingStats}
            />

            {/* Filters and Search */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher par nom, email, téléphone..."
                      className="border-gray-300 pl-10"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <Select value={activeFilter} onValueChange={handleActiveFilterChange}>
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs uniquement</SelectItem>
                    <SelectItem value="inactive">Inactifs uniquement</SelectItem>
                  </SelectContent>
                </Select>

                {(searchQuery || activeFilter !== 'all') && (
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
                      <p className="mt-4 text-sm text-gray-600">Chargement des données...</p>
                    </div>
                  </div>
                )
              : (
                  <>
                    <IndividualsTable users={users} />

                    {/* Pagination */}
                    {users.length > 0 && (
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
    </div>
  );
}
