'use client';

import { Download, Plus, Search, Shield, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
import { UsersTable } from '@/components/users/users-table';
import { UsersKpiCards } from '@/components/users/UsersKpiCards';
import { useQueryRequest } from '@/hooks/_QueryRequestProvider';
import { useQueryResponseData, useQueryResponseLoading, useQueryResponsePagination } from '@/hooks/user/UserQueryResponseProvider';
import { useUsersStatistics } from '@/hooks/useUsersStatistics';

export default function UsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { state, updateState } = useQueryRequest();
  const users = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const paginationData = useQueryResponsePagination();

  // KPIs en temps réel basés sur le filtre de rôle
  const currentRole = roleFilter === 'all' ? undefined : (roleFilter as 'PARTICULIER' | 'ENTREPRISE');
  const { statistics, isLoading: isLoadingStats } = useUsersStatistics(currentRole);

  // Initialiser sans filtre restrictif
  useEffect(() => {
    updateState({
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

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    const currentFilter = state.filter || {};

    if (value === 'all') {
      const { role, ...restFilter } = currentFilter as any;
      updateState({ filter: restFilter, offset: 0 });
    } else {
      updateState({
        filter: {
          ...currentFilter,
          role: value,
        },
        offset: 0,
      });
    }
  };

  const handleActiveFilterChange = (value: string) => {
    setActiveFilter(value);
    const currentFilter = state.filter || {};

    if (value === 'all') {
      const { is_active, ...restFilter } = currentFilter as any;
      updateState({ filter: restFilter, offset: 0 });
    } else {
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
    setRoleFilter('all');
    setActiveFilter('all');
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
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
                  <p className="text-sm text-gray-500">Tous les utilisateurs de la plateforme</p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/users/create')}
                className="bg-[#009ef7] shadow-md hover:bg-[#0077b6]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Créer un utilisateur
              </Button>
            </div>

            {/* KPIs en temps réel */}
            <UsersKpiCards
              total={statistics.total}
              active={statistics.active}
              verified={statistics.verified}
              inactive={statistics.inactive}
              isLoading={isLoadingStats}
            />

            {/* Filtres et recherche */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Rechercher par nom, email..."
                      className="border-gray-300 pl-10"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                </form>

                <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                  <SelectTrigger className="w-[180px] border-gray-300">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les rôles</SelectItem>
                    <SelectItem value="ADMIN">Administrateurs</SelectItem>
                    <SelectItem value="PERSONNEL">Personnel</SelectItem>
                    <SelectItem value="PARTICULIER">Particuliers</SelectItem>
                    <SelectItem value="ENTREPRISE">Entreprises</SelectItem>
                  </SelectContent>
                </Select>

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

                {(searchQuery || roleFilter !== 'all' || activeFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-gray-300 bg-white shadow-sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Réinitialiser
                  </Button>
                )}

                <Button variant="outline" className="border-gray-300 bg-white shadow-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </Button>
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
                    <UsersTable users={users} />

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
