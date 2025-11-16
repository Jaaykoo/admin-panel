'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DevisDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/devis">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Détail du Devis</h1>
        </div>

        <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 grid grid-cols-3 gap-6 border-b border-gray-200 pb-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Devis</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Numéro de devis :
                  {' '}
                  <span className="font-medium text-gray-900">DEV2025-001</span>
                </p>
                <p className="text-gray-600">
                  Date de facture :
                  {' '}
                  <span className="font-medium text-gray-900">25 Jan 2025</span>
                </p>
                <p className="text-gray-600">
                  Date d'échéance :
                  {' '}
                  <span className="font-medium text-gray-900">31 Jan 2025</span>
                </p>
                <div className="inline-block rounded bg-[#f1416c] px-2 py-1 text-xs text-white">
                  Validité du devis : 30 jours
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Destiné à</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">Badette Dieng</p>
                <p className="text-gray-600">Sally Carrefour, Mbour, Sénégal</p>
                <p className="text-gray-600">Téléphone : +221 77 008 03 01</p>
                <p className="text-gray-600">Email : info@example.com</p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Adresse de l'émetteur</h3>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
                <span className="text-lg font-bold">J</span>
              </div>
              <div className="space-y-1 text-sm">
                <p className="font-medium text-gray-900">JABA</p>
                <p className="text-gray-600">Sally Carrefour, Mbour, Sénégal</p>
                <p className="text-gray-600">Phone : +221 33 688 23 21</p>
                <p className="text-gray-600">Email : info@example.com</p>
                <p className="text-gray-600">NINEA : 801122 2G3</p>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="mb-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Articles de produits/services</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Produit/Service</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">Quantité</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">Unité</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Taux</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">Remise</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-700">TVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-700">1</td>
                  <td className="px-4 py-3 text-gray-900">T-Shirt</td>
                  <td className="px-4 py-3 text-center text-gray-700">2</td>
                  <td className="px-4 py-3 text-center text-gray-700">Pcs</td>
                  <td className="px-4 py-3 text-right text-gray-700">1 000 CFA</td>
                  <td className="px-4 py-3 text-center text-gray-700">10%</td>
                  <td className="px-4 py-3 text-center text-gray-700">000</td>
                  <td className="px-4 py-3 text-right text-gray-900">000</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-700">2</td>
                  <td className="px-4 py-3 text-gray-900">Office Chair</td>
                  <td className="px-4 py-3 text-center text-gray-700">1</td>
                  <td className="px-4 py-3 text-center text-gray-700">Pcs</td>
                  <td className="px-4 py-3 text-right text-gray-700">2 000 CFA</td>
                  <td className="px-4 py-3 text-center text-gray-700">5%</td>
                  <td className="px-4 py-3 text-center text-gray-700">000</td>
                  <td className="px-4 py-3 text-right text-gray-900">000</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-700">3</td>
                  <td className="px-4 py-3 text-gray-900">LED Monitor</td>
                  <td className="px-4 py-3 text-center text-gray-700">1</td>
                  <td className="px-4 py-3 text-center text-gray-700">Pcs</td>
                  <td className="px-4 py-3 text-right text-gray-700">5 000 CFA</td>
                  <td className="px-4 py-3 text-center text-gray-700">2%</td>
                  <td className="px-4 py-3 text-center text-gray-700">000</td>
                  <td className="px-4 py-3 text-right text-gray-900">000</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-3 text-gray-700">4</td>
                  <td className="px-4 py-3 text-gray-900">Smartphone</td>
                  <td className="px-4 py-3 text-center text-gray-700">4</td>
                  <td className="px-4 py-3 text-center text-gray-700">Pcs</td>
                  <td className="px-4 py-3 text-right text-gray-700">2 000 CFA</td>
                  <td className="px-4 py-3 text-center text-gray-700">10%</td>
                  <td className="px-4 py-3 text-center text-gray-700">000</td>
                  <td className="px-4 py-3 text-right text-gray-900">000</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mb-8 flex justify-end">
            <div className="w-80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant</span>
                <span className="font-medium text-gray-900">00000</span>
              </div>
              <div className="flex justify-between text-[#f1416c]">
                <span>Remise (25%)</span>
                <span>-000</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
                <span>Total (USD)</span>
                <span>00000 CFA</span>
              </div>
              <div className="text-gray-600">
                <p className="font-medium">Total en mots</p>
                <p>Trente mille franc CFA</p>
              </div>
            </div>
          </div>

          {/* Terms and Notes */}
          <div className="mb-8 space-y-4 border-t border-gray-200 pt-6">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">Termes et conditions</h4>
              <p className="text-sm text-gray-600">
                Ce devis est valable jusqu'au [date]. Une fois accepté, une facture sera émise.
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-900">Notes</h4>
              <p className="text-sm text-gray-600">
                Ce devis n'engage pas la facturation tant qu'il n'est pas été accepté
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="mb-8 flex justify-end border-t border-gray-200 pt-6">
            <div className="text-right">
              <div className="font-script mb-2 text-2xl text-gray-700">Badette dieng</div>
              <p className="text-sm font-medium text-gray-900">Badette dieng</p>
              <p className="text-sm text-gray-600">CEO JABA</p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="rounded-lg bg-gray-50 p-4 text-center text-sm text-gray-600">
            "Merci de confirmer votre accord par signature ou par email. Une facture définitive sera générée ensuite."
          </div>

          {/* Branding */}
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">Smart invoice</p>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-[#ff6b2c]">smart</span>
              <span className="text-lg font-bold text-gray-900">invoice.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
