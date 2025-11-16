'use client';

import { Download, Eye, Filter, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const devis = [
  { id: '01', number: '#856214', client: 'Lucy Chen', date: '06/12/24', amount: '25,000 XOF', status: 'Accepté' },
  { id: '02', number: '#554228', client: 'Angela Lopez', date: '05/12/24', amount: '25,000 XOF', status: 'En attente' },
  { id: '03', number: '#856412', client: 'John Nolan', date: '06/12/24', amount: '25,000 XOF', status: 'Refusé' },
  { id: '04', number: '#557954', client: 'Nyla Harper', date: '05/12/24', amount: '25,000 XOF', status: 'Expiré' },
  { id: '05', number: '#445689', client: 'Tim Bradford', date: '08/12/24', amount: '25,000 XOF', status: 'Brouillon' },
];

export default function DevisPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#009ef7]">
                Home
              </Link>
              <span>-</span>
              <span>Devis</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 bg-white">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
            <Button className="gap-2 bg-[#ffc700] text-gray-900 hover:bg-[#e6b300]">
              <Download className="h-4 w-4" />
              export CSV
            </Button>
            <Link href="/devis/add">
              <Button className="gap-2 bg-[#009ef7] text-white hover:bg-[#0086d6]">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Recherche" className="border-gray-300 pl-10" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">num</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID des devis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {devis.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.number}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#50cd89] text-white">
                          <span className="text-xs font-medium">{item.client.charAt(0)}</span>
                        </div>
                        <span className="text-sm text-gray-900">{item.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.amount}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          item.status === 'Accepté'
                            ? 'bg-[#50cd89] text-white hover:bg-[#47b881]'
                            : item.status === 'En attente'
                              ? 'bg-[#ffc700] text-gray-900 hover:bg-[#e6b300]'
                              : item.status === 'Refusé'
                                ? 'bg-[#f1416c] text-white hover:bg-[#d9355b]'
                                : item.status === 'Expiré'
                                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                                  : 'bg-[#009ef7] text-white hover:bg-[#0086d6]'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/devis/${item.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2 text-[#009ef7] hover:text-[#0086d6]">
                          <Eye className="h-4 w-4" />
                          Détail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
