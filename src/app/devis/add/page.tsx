'use client';

import type { QuoteItemForm } from '@/components/devis/QuoteItemsFormTable';
import type { ProductList } from '@/types/ProductTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { createQuote } from '@/services/QuoteService';

export default function AddDevisPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Form state
  const [customer, setCustomer] = useState<number | undefined>();
  const [status, setStatus] = useState<'DRAFT' | 'RESPONDED'>('DRAFT');
  const [responseNote, setResponseNote] = useState('');
  const [expirationDate, setExpirationDate] = useState(
    format(addDays(new Date(), 15), 'yyyy-MM-dd'),
  );
  const [items, setItems] = useState<QuoteItemForm[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Mutation
  const createMutation = useMutation({
    mutationFn: createQuote,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.QUOTES_LIST] });
      toast.success('Devis créé avec succès');
      if (data?.id) {
        router.push(`/devis/${data.id}`);
      } else {
        router.push('/devis');
      }
    },
    onError: (error: any) => {
      console.error('Error creating quote:', error);
      const errorData = error.response?.data;
      if (errorData) {
        setErrors(errorData);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else {
        toast.error('Erreur lors de la création du devis');
      }
    },
  });

  // Handlers
  const handleAddProduct = (product: ProductList) => {
    const newItem: QuoteItemForm = {
      product: product.id,
      title: product.title,
      image: product.images?.[0]?.original,
      quantity: 1,
      unit_price: product.price || '0',
      rate: '18.00', // TVA par défaut
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof QuoteItemForm, value: string | number) => {
    const newItems = [...items];
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
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

    items.forEach((item, index) => {
      if (item.quantity < 1) {
        if (!newErrors.items) {
          newErrors.items = {};
        }
        if (!newErrors.items[index]) {
          newErrors.items[index] = {};
        }
        newErrors.items[index].quantity = 'La quantité doit être supérieure à 0';
      }
    });

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
      customer: customer!,
      expiration_date: expirationDate,
      status,
      response_note: responseNote || undefined,
      responded_at: status === 'RESPONDED' ? new Date().toISOString() : null,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price,
        rate: item.rate,
      })),
    };

    createMutation.mutate(data as any);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <Link href="/devis">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau devis</h1>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto space-y-6">
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
                      value={customer}
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
                    <Select value={status} onValueChange={(value: 'DRAFT' | 'RESPONDED') => setStatus(value)}>
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
                      value={responseNote}
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
                      value={expirationDate}
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
                    items={items}
                    onUpdateItem={handleUpdateItem}
                    onRemoveItem={handleRemoveItem}
                    errors={typeof errors.items === 'object' ? errors.items : {}}
                  />

                  {items.length > 0 && (
                    <div className="pt-4">
                      <QuoteTotalsSummary items={items} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-[#009ef7] hover:bg-[#0077b6]"
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {createMutation.isPending ? 'Création...' : 'Créer le devis'}
                </Button>
                <Link href="/devis">
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
