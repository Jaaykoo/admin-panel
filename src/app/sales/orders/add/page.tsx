'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { getProducts } from '@/services/ProductService';

// Schema pour le formulaire de création de commande
const OrderFormSchema = z.object({
  guest_email: z.string().email('Email invalide'),
  shipping_method_code: z.string().min(1, 'Méthode de livraison requise'),
  payment_method: z.string().min(1, 'Méthode de paiement requise'),

  // Adresse de facturation
  billing_first_name: z.string().min(1, 'Prénom requis'),
  billing_last_name: z.string().min(1, 'Nom requis'),
  billing_line1: z.string().min(1, 'Adresse requise'),
  billing_line2: z.string().optional(),
  billing_line4: z.string().min(1, 'Ville requise'),
  billing_postcode: z.string().min(1, 'Code postal requis'),
  billing_state: z.string().optional(),
  billing_country: z.string().min(1, 'Pays requis'),
  billing_phone: z.string().optional(),

  // Adresse de livraison
  same_address: z.boolean().default(true),
  shipping_first_name: z.string().optional(),
  shipping_last_name: z.string().optional(),
  shipping_line1: z.string().optional(),
  shipping_line2: z.string().optional(),
  shipping_line4: z.string().optional(),
  shipping_postcode: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_country: z.string().optional(),
  shipping_phone: z.string().optional(),
});

type OrderFormData = z.infer<typeof OrderFormSchema>;

export default function AddOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Récupérer les produits
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: [QUERIES.PRODUCTS_LIST, 'all'],
    queryFn: () => getProducts('limit=100'),
  });

  const products = productsResponse?.results || [];
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
    || p.upc?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderFormSchema) as any,
    defaultValues: {
      guest_email: '',
      shipping_method_code: '',
      payment_method: '',
      billing_first_name: '',
      billing_last_name: '',
      billing_line1: '',
      billing_line2: '',
      billing_line4: '',
      billing_postcode: '',
      billing_state: '',
      billing_country: '',
      billing_phone: '',
      same_address: true,
    },
  });

  const sameAddress = form.watch('same_address');

  // Calculer le total
  const totalCost = selectedProducts.reduce((sum, productId) => {
    const product = products.find(p => p.id === productId);
    const quantity = productQuantities[productId] || 1;
    if (product && product.price) {
      return sum + (Number(product.price) * quantity);
    }
    return sum;
  }, 0);

  // Mutation pour créer la commande
  const createOrderMutation = useMutation({
    mutationFn: async (_data: OrderFormData) => {
      // TODO: Implémenter la création réelle via l'API
      // Données disponibles :
      // - _data : informations du formulaire
      // - selectedProducts : IDs des produits sélectionnés
      // - productQuantities : quantités par produit

      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { id: Date.now(), number: `ORD-${Date.now()}` };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.ORDERS_LIST] });
      toast.success('Commande créée avec succès');
      router.push(`/sales/orders/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la création de la commande');
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    if (selectedProducts.length === 0) {
      toast.error('Veuillez sélectionner au moins un produit');
      return;
    }
    await createOrderMutation.mutateAsync(data);
  };

  const handleProductSelect = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
      setProductQuantities({ ...productQuantities, [productId]: 1 });
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      const newQuantities = { ...productQuantities };
      delete newQuantities[productId];
      setProductQuantities(newQuantities);
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      setProductQuantities({ ...productQuantities, [productId]: quantity });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6">
              <Link href="/sales/orders">
                <Button variant="ghost" size="sm" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour aux commandes
                </Button>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Créer une commande</h1>
                  <p className="text-sm text-gray-500">Créez une nouvelle commande manuellement</p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Colonne 1 : Détails de la commande */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Détails de la commande</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Email client */}
                        <FormField
                          control={form.control}
                          name="guest_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email du client *</FormLabel>
                              <FormControl>
                                <Input placeholder="client@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Méthode de paiement */}
                        <FormField
                          control={form.control}
                          name="payment_method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Méthode de paiement *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une méthode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="card">Carte bancaire</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                  <SelectItem value="cash">Paiement à la livraison</SelectItem>
                                  <SelectItem value="transfer">Virement bancaire</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Méthode de livraison */}
                        <FormField
                          control={form.control}
                          name="shipping_method_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Méthode de livraison *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une méthode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="standard">Livraison standard</SelectItem>
                                  <SelectItem value="express">Livraison express</SelectItem>
                                  <SelectItem value="pickup">Retrait en magasin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Colonnes 2-3 : Produits et Adresses */}
                  <div className="space-y-6 lg:col-span-2">
                    {/* Sélection des produits */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sélectionner les produits</CardTitle>
                        <p className="text-sm text-gray-500">
                          Ajoutez des produits à cette commande
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="mb-4 text-base font-semibold text-gray-900">
                            Total :
                            {' '}
                            <span className="text-[#009ef7]">
                              {totalCost.toLocaleString('fr-FR')}
                              {' '}
                              FCFA
                            </span>
                          </div>
                          <p className="mb-4 text-sm text-gray-500">
                            {selectedProducts.length}
                            {' '}
                            produit(s) sélectionné(s)
                          </p>
                          <Input
                            placeholder="Rechercher des produits..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                          />
                        </div>

                        {productsLoading
                          ? (
                              <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <Skeleton key={i} className="h-20 w-full" />
                                ))}
                              </div>
                            )
                          : (
                              <div className="overflow-hidden rounded-lg border">
                                <table className="w-full">
                                  <thead className="border-b bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                                        Produit
                                      </th>
                                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase">
                                        Quantité
                                      </th>
                                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                                        Prix
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y bg-white">
                                    {filteredProducts.length === 0
                                      ? (
                                          <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                                              Aucun produit trouvé
                                            </td>
                                          </tr>
                                        )
                                      : (
                                          filteredProducts.map(product => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                              <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                  <Checkbox
                                                    checked={selectedProducts.includes(product.id)}
                                                    onCheckedChange={checked =>
                                                      handleProductSelect(product.id, checked as boolean)}
                                                  />
                                                  <div className="relative h-12 w-12 overflow-hidden rounded">
                                                    {product.images && product.images.length > 0 && product.images[0]?.original
                                                      ? (
                                                          <Image
                                                            src={product.images[0].original}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized
                                                          />
                                                        )
                                                      : (
                                                          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs">
                                                            N/A
                                                          </div>
                                                        )}
                                                  </div>
                                                  <div>
                                                    <div className="font-medium">{product.title}</div>
                                                    <div className="text-sm text-gray-500">
                                                      SKU:
                                                      {' '}
                                                      {product.upc || 'N/A'}
                                                    </div>
                                                  </div>
                                                </div>
                                              </td>
                                              <td className="px-4 py-4 text-center">
                                                {selectedProducts.includes(product.id) && (
                                                  <Input
                                                    type="number"
                                                    min="1"
                                                    value={productQuantities[product.id] || 1}
                                                    onChange={e =>
                                                      handleQuantityChange(product.id, Number.parseInt(e.target.value))}
                                                    className="w-20 text-center"
                                                  />
                                                )}
                                              </td>
                                              <td className="px-4 py-4 text-right">
                                                <span className="font-medium">
                                                  {product.price
                                                    ? `${Number(product.price).toLocaleString('fr-FR')} FCFA`
                                                    : 'N/A'}
                                                </span>
                                              </td>
                                            </tr>
                                          ))
                                        )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                      </CardContent>
                    </Card>

                    {/* Adresses */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Adresses</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Adresse de facturation */}
                        <div>
                          <h4 className="mb-4 font-semibold">Adresse de facturation</h4>
                          <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="billing_first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Prénom *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Prénom" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="billing_last_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nom *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nom" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="mt-4 space-y-4">
                            <FormField
                              control={form.control}
                              name="billing_line1"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Adresse *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Numéro et nom de rue" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="billing_line2"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Complément d'adresse</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Bâtiment, appartement..." {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-4 md:grid-cols-3">
                              <FormField
                                control={form.control}
                                name="billing_postcode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Code postal *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Code postal" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billing_line4"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ville *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ville" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="billing_state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Région</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Région" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="billing_country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pays *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un pays" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="SN">Sénégal</SelectItem>
                                      <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                                      <SelectItem value="BF">Burkina Faso</SelectItem>
                                      <SelectItem value="ML">Mali</SelectItem>
                                      <SelectItem value="BJ">Bénin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="billing_phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Téléphone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+221 XX XXX XX XX" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Même adresse pour livraison */}
                        <FormField
                          control={form.control}
                          name="same_address"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">
                                  L'adresse de livraison est la même que l'adresse de facturation
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        {/* Adresse de livraison (si différente) */}
                        {!sameAddress && (
                          <div>
                            <h4 className="mb-4 font-semibold">Adresse de livraison</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="shipping_first_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Prénom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="shipping_last_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Nom" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            {/* Autres champs de livraison similaires à la facturation */}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-3">
                      <Link href="/sales/orders">
                        <Button type="button" variant="outline">
                          Annuler
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        className="bg-[#009ef7] hover:bg-[#0077b6]"
                        disabled={createOrderMutation.isPending || selectedProducts.length === 0}
                      >
                        {createOrderMutation.isPending ? 'Création...' : 'Créer la commande'}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
