'use client';

import type { QuoteItemForm } from '@/components/devis/QuoteItemsFormTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { toast } from 'sonner';
import { CustomerSelector } from '@/components/devis/CustomerSelector';
import { ProductSelector } from '@/components/devis/ProductSelector';
import { QuoteItemsFormTable } from '@/components/devis/QuoteItemsFormTable';
import { QuoteTotalsSummary } from '@/components/devis/QuoteTotalsSummary';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { getQuoteById, updateQuote } from '@/services/QuoteService';

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch quote
  const { data: quote, isLoading } = useQuery({
    queryKey: [QUERIES.QUOTE_DETAIL, id],
    queryFn: () => getQuoteById(Number(id)),
    enabled: !!id,
  });

  // Form state - Utiliser les valeurs du quote ou les états locaux
  const [customer, setCustomer] = useState<number | undefined>(() => quote?.customer?.id);
  const [status, setStatus] = useState<'DRAFT' | 'RESPONDED' | 'SUBMITTED' | 'ACCEPTED' | 'REFUSED' | 'EXPIRED'>(() => quote?.status || 'DRAFT');
  const [responseNote, setResponseNote] = useState(() => quote?.response_note || '');
  const [expirationDate, setExpirationDate] = useState(() => quote?.expiration_date || '');
  const [items, setItems] = useState<QuoteItemForm[]>(() =>
    quote?.items.map(item => ({
      product: item.product_detail.id,
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      rate: item.rate,
    })) || [],
  );
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Utiliser les valeurs modifiées ou celles du quote
  const currentCustomer = customer ?? quote?.customer?.id;
  const currentStatus = status;
  const currentResponseNote = responseNote;
  const currentExpirationDate = expirationDate;
  const currentItems = items;

  // Mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateQuote(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUOTE_DETAIL, id] });
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUOTES_LIST] });
      toast.success('Devis mis à jour avec succès');
      router.push(`/devis/${id}`);
    },
    onError: (error: any) => {
      console.error('Error updating quote:', error);
      const errorData = error.response?.data;
      if (errorData) {
        setErrors(errorData);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else {
        toast.error('Erreur lors de la mise à jour du devis');
      }
    },
  });

  // Handlers
  const handleAddProduct = (product: any) => {
    const newItem: QuoteItemForm = {
      product: product.id,
      title: product.title,
      image: product.images?.[0]?.original,
      quantity: 1,
      unit_price: product.price || '0',
      rate: '18.00',
    };
    setItems([...currentItems, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof QuoteItemForm, value: string | number) => {
    const newItems = [...currentItems];
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(currentItems.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, any> = {};

    if (!customer) {
      newErrors.customer = 'Le client est requis';
    }

    if (!expirationDate) {
      newErrors.expiration_date = 'La date d\'expiration est requise';
    }

    if (items.length === 0) {
      newErrors.items = 'Au moins un produit est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const data = {
      customer,
      expiration_date: expirationDate,
      status,
      response_note: responseNote || undefined,
      responded_at: status === 'RESPONDED' ? (quote?.responded_at || new Date().toISOString()) : null,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price,
        rate: item.rate,
      })),
    };

    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-8">
              <Skeleton className="mb-6 h-10 w-64" />
              <div className="mx-auto max-w-6xl space-y-4">
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
              <div className="mx-auto max-w-6xl text-center">
                <h2 className="text-2xl font-bold text-gray-900">Devis introuvable</h2>
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

  // Vérifier si le devis peut être modifié
  const canEdit = !['ACCEPTED', 'REFUSED', 'EXPIRED'].includes(quote.status);

  if (!canEdit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-8">
              <div className="mx-auto max-w-6xl text-center">
                <h2 className="text-2xl font-bold text-gray-900">Modification impossible</h2>
                <p className="mt-2 text-gray-600">
                  Les devis avec le statut &quot;
                  {quote.status}
                  &quot; ne peuvent pas être modifiés.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <Link href={`/devis/${id}`}>
                    <Button>Voir le devis</Button>
                  </Link>
                  <Link href="/devis">
                    <Button variant="outline">Retour à la liste</Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <Link href={`/devis/${id}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Modifier le devis</h1>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer */}
                  <div>
                    <Label htmlFor="customer">
                      Client
                      {' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <CustomerSelector
                      value={currentCustomer}
                      onValueChange={setCustomer}
                      error={errors.customer}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <Label htmlFor="status">
                      Statut
                      {' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select value={currentStatus} onValueChange={(value: 'DRAFT' | 'RESPONDED') => setStatus(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="RESPONDED">Accepté</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Response Note */}
                  <div>
                    <Label htmlFor="response_note">Message</Label>
                    <Textarea
                      id="response_note"
                      placeholder="Notes sur ce devis..."
                      value={currentResponseNote}
                      onChange={e => setResponseNote(e.target.value)}
                      rows={3}
                      maxLength={1000}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Cette note est uniquement visible par notre équipe
                    </p>
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <Label htmlFor="expiration_date">
                      Date d'expiration
                      {' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="expiration_date"
                      type="date"
                      value={currentExpirationDate}
                      onChange={e => setExpirationDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className={errors.expiration_date ? 'border-red-500' : ''}
                    />
                    {errors.expiration_date && (
                      <p className="mt-1 text-sm text-red-500">{errors.expiration_date}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Produits */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Produits
                      {' '}
                      <span className="text-red-500">*</span>
                    </CardTitle>
                    <ProductSelector onSelectProduct={handleAddProduct} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {errors.items && typeof errors.items === 'string' && (
                    <p className="text-sm text-red-500">{errors.items}</p>
                  )}

                  <QuoteItemsFormTable
                    items={currentItems}
                    onUpdateItem={handleUpdateItem}
                    onRemoveItem={handleRemoveItem}
                    errors={typeof errors.items === 'object' ? errors.items : {}}
                  />

                  {currentItems.length > 0 && (
                    <div className="pt-4">
                      <QuoteTotalsSummary items={currentItems} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-[#009ef7] hover:bg-[#0077b6]"
                >
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
                <Link href={`/devis/${id}`}>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
