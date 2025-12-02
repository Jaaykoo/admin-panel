'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { BillingDetails } from '@/components/devis/invoice/BillingDetails';
import { CompanyInfo } from '@/components/devis/invoice/CompanyInfo';
import { FooterNote } from '@/components/devis/invoice/FooterNote';
import { InvoiceDetails } from '@/components/devis/invoice/InvoiceDetails';
import { InvoiceSummary } from '@/components/devis/invoice/InvoiceSummary';
import { InvoiceTotals } from '@/components/devis/invoice/InvoiceTotals';
import { ItemsTable } from '@/components/devis/invoice/ItemsTable';
import { QuoteStatusBadge } from '@/components/devis/QuoteStatusBadge';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { COMPANY_INFO } from '@/config/company';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { generateQuotePDF } from '@/lib/pdf/generateQuotePDF';
import { deleteQuote, getQuoteById } from '@/services/QuoteService';
import { isQuoteEditable } from '@/types/QuoteTypes';

export default function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: quote, isLoading } = useQuery({
    queryKey: [QUERIES.QUOTE_DETAIL, id],
    queryFn: () => getQuoteById(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUOTES_LIST] });
      toast.success('Devis supprimé avec succès');
      router.push('/devis');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du devis');
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDownloadPDF = async () => {
    if (!quote) {
      return;
    }

    // Vérifier que le statut permet le téléchargement
    if (quote.status !== 'RESPONDED' && quote.status !== 'ACCEPTED') {
      toast.error('Seuls les devis avec le statut "Accepté" ou "Répondu" peuvent être téléchargés en PDF');
      return;
    }

    try {
      await generateQuotePDF(quote);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  // Vérifier si le PDF peut être téléchargé
  const canDownloadPDF = quote?.status === 'RESPONDED' || quote?.status === 'ACCEPTED';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-8">
              <Skeleton className="mb-6 h-10 w-48" />
              <div className="mx-auto max-w-5xl space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-8">
              <div className="mx-auto max-w-5xl text-center">
                <h2 className="text-2xl font-bold text-gray-900">Devis introuvable</h2>
                <p className="mt-2 text-gray-600">Le devis que vous recherchez n'existe pas.</p>
                <Link href="/devis">
                  <Button className="mt-4">Retour à la liste</Button>
                </Link>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  const editable = isQuoteEditable(quote.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-8">
            {/* Header Actions */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/devis">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Détail du Devis</h1>
                <QuoteStatusBadge status={quote.status} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleDownloadPDF}
                  disabled={!canDownloadPDF}
                  title={!canDownloadPDF ? 'Le téléchargement est disponible uniquement pour les devis acceptés ou répondus' : ''}
                >
                  <Download className="h-4 w-4" />
                  Télécharger PDF
                </Button>
                {editable && (
                  <Link href={`/devis/${id}/edit`}>
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                  </Link>
                )}
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>

            {/* Invoice Card */}
            <Card className="mx-auto max-w-5xl">
              <CardContent className="p-8">
                {/* 1. HEADER - Company Info & Invoice Summary */}
                <div className="mb-8 flex items-start justify-between border-b border-gray-200 pb-6">
                  <CompanyInfo
                    ownerName={COMPANY_INFO.ownerName}
                    phone={COMPANY_INFO.phone}
                    email={COMPANY_INFO.email}
                  />

                  <InvoiceSummary
                    quoteNumber={quote.quote_number}
                  />
                </div>

                {/* 2. INFOS SECTION - 2 Columns */}
                <div className="mb-8 grid grid-cols-2 gap-6">
                  {/* Left: Invoice Details */}
                  <InvoiceDetails
                    creationDate={quote.responded_at}
                    expirationDate={quote.expiration_date}
                  />

                  {/* Right: Billing Details */}
                  <BillingDetails
                    title="Coordonnées du client"
                    companyName={quote.customer.user_profile.company_name || 'Client inconnu'}
                    address={quote.customer?.address}
                    phone={quote.customer?.phone_number}
                    email={quote.customer?.email}
                    ninea={quote.customer?.user_profile.siret_number}
                  />
                </div>

                {/* 3. ITEMS TABLE */}
                <div className="mb-6">
                  <ItemsTable
                    items={quote.items.map((item) => {
                      const unitPriceHT = Number.parseFloat(item.unit_price);
                      const tva = Number.parseFloat(item.rate);
                      const amountHT = unitPriceHT * item.quantity;
                      const amountTTC = amountHT * (1 + tva / 100);

                      return {
                        id: item.id,
                        designation: item.product_detail?.title,
                        reference: item.product_detail.code,
                        quantity: item.quantity,
                        unit: '',
                        unitPriceHT,
                        tva,
                        amountHT,
                        amountTTC,
                        image: item.image,
                      };
                    })}
                  />
                </div>

                {/* 4. TOTALS - Right Aligned */}
                <div className="mb-6">
                  <InvoiceTotals
                    totalTTC={quote.total}
                  />
                </div>

                {/* 5. FOOTER */}
                <FooterNote
                  note={
                    quote.expiration_date
                      ? `Ce devis est valable jusqu'au ${formatDate(quote.expiration_date)}.`
                      : undefined
                  }
                />
              </CardContent>
            </Card>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate(Number(id))}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
