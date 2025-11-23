'use client';

import type { OrderDetail, OrderUpdate } from '@/types/OrderTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { OrderUpdateSchema } from '@/schemas/OrderSchemas';
import { updateOrder } from '@/services/OrderService';
import { ORDER_STATUS_OPTIONS } from '@/types/OrderTypes';

type OrderEditFormProps = {
  order: OrderDetail;
};

export function OrderEditForm({ order }: OrderEditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: OrderUpdate) => updateOrder(order.id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERIES.ORDERS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERIES.ORDER_DETAIL, order.id] });
      toast.success('Commande mise à jour avec succès');
      router.push(`/sales/orders/${order.id}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Erreur lors de la mise à jour de la commande');
    },
  });

  const form = useForm<OrderUpdate>({
    resolver: zodResolver(OrderUpdateSchema),
    defaultValues: {
      status: order.status,
      shipping_method: order.shipping_method || '',
      shipping_code: order.shipping_code || '',
      currency: order.currency || 'XOF',
    },
  });

  const onSubmit = async (data: OrderUpdate) => {
    await updateMutation.mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de la commande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Statut */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut de la commande</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ORDER_STATUS_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.icon}
                          {' '}
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Méthode de livraison */}
            <FormField
              control={form.control}
              name="shipping_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de livraison</FormLabel>
                  <FormControl>
                    <Input
                      value="Livraison gratuite"
                      disabled
                      className="bg-gray-50"
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    Actuellement, seule la livraison gratuite est disponible
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code de livraison */}
            <FormField
              control={form.control}
              name="shipping_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code de livraison</FormLabel>
                  <FormControl>
                    <Input
                      value="free-shipping"
                      disabled
                      className="bg-gray-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Devise */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Devise</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="XOF"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Adresse de facturation */}
        {order.billing_address && (
          <Card>
            <CardHeader>
              <CardTitle>Adresse de facturation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="billing_address.first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Prénom"
                          defaultValue={order.billing_address?.first_name}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billing_address.last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom"
                          defaultValue={order.billing_address?.last_name}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="billing_address.line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse ligne 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Numéro et nom de rue"
                        defaultValue={order.billing_address?.line1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="billing_address.postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code postal</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Code postal"
                          defaultValue={order.billing_address?.postcode}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billing_address.line4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ville"
                          defaultValue={order.billing_address?.line4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/sales/orders/${order.id}`)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="bg-[#009ef7] hover:bg-[#0077b6]"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
