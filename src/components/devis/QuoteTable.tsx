'use client';

import type { QuoteList } from '@/types/QuoteTypes';
import { Download, Eye, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { generateQuotePDF } from '@/lib/pdf/generateQuotePDF';
import { getQuoteById } from '@/services/QuoteService';
import { QuoteStatusBadge } from './QuoteStatusBadge';

type QuoteTableProps = {
  quotes: QuoteList[];
  isLoading?: boolean;
  onDelete?: (id: number) => void;
};

export function QuoteTable({ quotes, isLoading, onDelete }: QuoteTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!onDelete) {
      return;
    }
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = async (id: number, status: string) => {
    // Vérifier que le statut permet le téléchargement
    if (status !== 'RESPONDED' && status !== 'ACCEPTED') {
      toast.error('Seuls les devis avec le statut "Accepté" ou "Répondu" peuvent être téléchargés en PDF');
      return;
    }

    setDownloadingId(id);
    try {
      // Récupérer les détails complets du devis
      const quote = await getQuoteById(id);
      if (!quote) {
        toast.error('Devis introuvable');
        return;
      }
      await generateQuotePDF(quote);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array.from({ length: 5 })].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Aucun devis trouvé</h3>
        <p className="mt-2 text-sm text-gray-500">
          Commencez par créer votre premier devis
        </p>
        <Link href="/devis/add">
          <Button className="mt-4 bg-[#009ef7] hover:bg-[#0086d6]">
            Créer un devis
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">N° Devis</TableHead>
            <TableHead className="font-semibold text-gray-700">Client</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Total</TableHead>
            <TableHead className="font-semibold text-gray-700">Statut</TableHead>
            <TableHead className="font-semibold text-gray-700">Date expiration</TableHead>
            <TableHead className="font-semibold text-gray-700">Date création</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map(quote => (
            <TableRow key={quote.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-[#009ef7]">
                {quote.quote_number}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-xs font-semibold text-white">
                    {quote.customer_company_name?.[0] || '?'}
                  </div>
                  <div className="font-medium text-gray-900">
                    {quote.customer_company_name || 'Client inconnu'}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900">
                {formatCurrency(quote.total)}
              </TableCell>
              <TableCell>
                <QuoteStatusBadge status={quote.status} />
              </TableCell>
              <TableCell className="text-gray-600">
                {quote.expiration_date ? formatDate(quote.expiration_date) : '-'}
              </TableCell>
              <TableCell className="text-gray-600">
                {formatDate(quote.created)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/devis/${quote.id}`} className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détail
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownloadPDF(quote.id, quote.status)}
                      disabled={
                        downloadingId === quote.id
                        || (quote.status !== 'RESPONDED' && quote.status !== 'ACCEPTED')
                      }
                      title={
                        quote.status !== 'RESPONDED' && quote.status !== 'ACCEPTED'
                          ? 'Le téléchargement est disponible uniquement pour les devis acceptés ou répondus'
                          : ''
                      }
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {downloadingId === quote.id ? 'Téléchargement...' : 'Télécharger PDF'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      disabled={['ACCEPTED', 'REFUSED', 'EXPIRED'].includes(quote.status)}
                    >
                      <Link
                        href={`/devis/${quote.id}/edit`}
                        className={
                          ['ACCEPTED', 'REFUSED', 'EXPIRED'].includes(quote.status)
                            ? 'pointer-events-none opacity-50'
                            : 'flex items-center'
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(quote.id)}
                        disabled={deletingId === quote.id}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === quote.id ? 'Suppression...' : 'Supprimer'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
