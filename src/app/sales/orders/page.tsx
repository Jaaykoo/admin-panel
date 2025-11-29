'use client';

import { Search, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
// import { OrdersStatsCards } from '@/components/orders/OrdersStatsCards';
import { OrdersTable } from '@/components/orders/OrdersTable';
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
import { ORDER_STATUS_OPTIONS } from '@/types/OrderTypes';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { state, updateState } = useQueryRequest();

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
      const { status, ...restFilter } = currentFilter as any;
      updateState({ filter: restFilter, offset: 0 });
    } else {
      updateState({
        filter: {
          ...currentFilter,
          status: value,
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
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestion des commandes
                  </h1>
                  <p className="text-sm text-gray-500">
                    Suivez et gérez toutes vos commandes
                  </p>
                </div>
              </div>
              {/* <Link href="/sales/orders/add">
                    <Button
                        className="bg-gradient-to-r from-[#009ef7] to-[#0077b6] hover:from-[#0077b6] hover:to-[#005a8d]">
                        <Plus className="mr-2 h-4 w-4"/>
                        Nouvelle commande
                    </Button>
                </Link> */}
            </div>

            {/* Stats Cards */}
            {/* <OrdersStatsCards/> */}

            {/* Filters Section */}
            <div className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher par numéro, client, email..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pr-10 pl-10"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {/* Status Filter */}
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusFilterChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {ORDER_STATUS_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Clear Filters Button */}
                  {(searchQuery || statusFilter !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      size="sm"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <OrdersTable />
          </div>
        </main>
      </MainContent>
    </div>
  );
}
