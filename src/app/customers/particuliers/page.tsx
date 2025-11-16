'use client';

import { Search, Users, X } from 'lucide-react';
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
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import { useQueryResponseData, useQueryResponseLoading, useQueryResponsePagination } from '@/hooks/user/UserQueryResponseProvider';

export default function ParticuliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { state, updateState } = useQueryRequest();
  const users = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const paginationData = useQueryResponsePagination();

  // Initialiser le filtre par rôle PARTICULIER au montage du composant
  useEffect(() => {
    updateState({
      filter: { role: 'PARTICULIER' },
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

  // Calculer les statistiques à partir des données filtrées
  const stats = {
    total: paginationData.count || 0,
    active: users.filter(u => u.is_active).length,
    verified: users.filter(u => u.is_verified).length,
    inactive: users.filter(u => !u.is_active).length,
  };

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

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="rounded-full bg-[#e8fff3] p-3">
                    <Users className="h-6 w-6 text-[#50cd89]" />
                  </div>
                </div>
              </div>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <div
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                onClick={() => handleActiveFilterChange('active')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actifs</p>
                    <p className="text-2xl font-bold text-[#50cd89]">{stats.active}</p>
                  </div>
                  <div className="rounded-full bg-[#e8fff3] p-3">
                    <div className="h-2 w-2 rounded-full bg-[#50cd89]" />
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vérifiés</p>
                    <p className="text-2xl font-bold text-[#009ef7]">{stats.verified}</p>
                  </div>
                  <div className="rounded-full bg-[#e8f4ff] p-3">
                    <div className="h-2 w-2 rounded-full bg-[#009ef7]" />
                  </div>
                </div>
              </div>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <div
                className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                onClick={() => handleActiveFilterChange('inactive')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inactifs</p>
                    <p className="text-2xl font-bold text-gray-500">{stats.inactive}</p>
                  </div>
                  <div className="rounded-full bg-gray-100 p-3">
                    <div className="h-2 w-2 rounded-full bg-gray-500" />
                  </div>
                </div>
              </div>
            </div>

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
