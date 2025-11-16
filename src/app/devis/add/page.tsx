'use client';

import { ArrowLeft, Plus, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function AddDevisPage() {
  const router = useRouter();
  const [products, setProducts] = useState([
    { name: 'Savon', quantity: 1, unit: 'Pcs', rate: '500 CFA', tax: 18, amount: '1 000 CFA' },
    { name: '', quantity: 0, unit: 'Unit', rate: 0, tax: 0, amount: 0 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#009ef7]">
              Home
            </Link>
            <span>-</span>
            <Link href="/devis" className="hover:text-[#009ef7]">
              Devis
            </Link>
            <span>-</span>
            <span>Ajouter</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/devis">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Ajouter un Devis</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3 space-y-6">
            {/* Status */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Status</h3>
                <div className="h-2 w-2 rounded-full bg-[#50cd89]"></div>
              </div>
              <Select defaultValue="published">
                <SelectTrigger className="border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-gray-500">Définir le statut du devis.</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              {/* Form Fields */}
              <div className="mb-8 grid grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Nom du client*</Label>
                  <div className="relative">
                    <Input placeholder="Sélectionner ou ajouter un client" className="border-gray-300 pr-10" />
                    <Settings className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Numéro Devis</Label>
                  <Input defaultValue="DEV-2025-001" className="border-gray-300" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">N° de référence</Label>
                  <Input defaultValue="2025-07-0010" className="border-gray-300" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Date du Devis*</Label>
                  <Input type="date" defaultValue="2025-01-20" className="border-gray-300" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Date d'expiration*</Label>
                  <Input type="date" placeholder="30 jours après la date du devis" className="border-gray-300" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Vendeur</Label>
                  <Select>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Sélectionner le vendeur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor1">Vendeur 1</SelectItem>
                      <SelectItem value="vendor2">Vendeur 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Nom du projet</Label>
                  <Select>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project1">Projet 1</SelectItem>
                      <SelectItem value="project2">Projet 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">Sélectionner un client d'abord à associer le projet.</p>
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-600 text-white">
                      <th className="px-4 py-3 text-left text-xs font-medium">Produit/Service</th>
                      <th className="px-4 py-3 text-center text-xs font-medium">Quantité</th>
                      <th className="px-4 py-3 text-center text-xs font-medium">Unité</th>
                      <th className="px-4 py-3 text-center text-xs font-medium">Taux</th>
                      <th className="px-4 py-3 text-center text-xs font-medium">Tax (%)</th>
                      <th className="px-4 py-3 text-right text-xs font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {products.map((product, index) => (
                      <tr key={index} className="border-b border-gray-200 last:border-0">
                        <td className="px-4 py-3">
                          <Input
                            value={product.name}
                            placeholder="Entrez le nom du produit"
                            className="h-8 border-0 p-0 focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            value={product.quantity}
                            className="h-8 border-0 p-0 text-center focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Input value={product.unit} className="h-8 border-0 p-0 text-center focus-visible:ring-0" />
                        </td>
                        <td className="px-4 py-3">
                          <Input value={product.rate} className="h-8 border-0 p-0 text-center focus-visible:ring-0" />
                        </td>
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            value={product.tax}
                            className="h-8 border-0 p-0 text-center focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm">{product.amount}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-[#f1416c] hover:bg-red-50">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                variant="link"
                className="mb-8 h-auto p-0 text-[#50cd89] hover:text-[#47b881]"
                onClick={() =>
                  setProducts([...products, { name: '', quantity: 0, unit: 'Unit', rate: 0, tax: 0, amount: 0 }])}
              >
                <Plus className="mr-1 h-4 w-4" />
                Ajouter un nouveau
              </Button>

              {/* Totals */}
              <div className="mb-8 flex justify-end">
                <div className="w-96 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Montant Total</span>
                    <span className="font-medium">000</span>
                  </div>
                  <Button variant="link" className="h-auto p-0 text-[#50cd89] hover:text-[#47b881]">
                    <Plus className="mr-1 h-3 w-3" />
                    Ajouter des frais supplémentaires
                  </Button>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Total arrondi</span>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      <span className="font-medium">0000</span>
                    </div>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
                    <span>Total (XOF)</span>
                    <span>0000</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Total en mots</p>
                    <p className="text-gray-500">Trente mille franc CFA</p>
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Informations sur le devis</Label>
                  <Textarea
                    placeholder="Au plaisir de faire affaire avec vous dans le futur."
                    rows={3}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium text-gray-900">Conditions générales</Label>
                  <Textarea
                    placeholder="Entrez les conditions générales de votre entreprise à afficher dans votre transaction"
                    rows={3}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button className="bg-[#50cd89] text-white hover:bg-[#47b881]">Enregistrer comme brouillon</Button>
                <Button className="bg-[#009ef7] text-white hover:bg-[#0086d6]" onClick={() => router.push('/devis')}>
                  Ajouter
                </Button>
                <Link href="/devis">
                  <Button variant="outline" className="border-gray-300 bg-transparent">
                    Annuler
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
