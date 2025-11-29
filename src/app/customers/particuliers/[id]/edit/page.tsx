'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { toast } from 'sonner';
import * as z from 'zod';
import { Header } from '@/components/layouts/header';
import { Sidebar } from '@/components/layouts/sidebar';
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
import { PhoneInputComponent } from '@/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserById, updateUser } from '@/services/UsersService';

// Schéma de validation pour particulier
const particulierSchema = z.object({
  email: z.string().email('Email invalide'),
  phone_number: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .refine(val => isPossiblePhoneNumber(val), {
      message: 'Saisissez un numéro de téléphone valide.',
    }),
  user_profile: z.object({
    first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    title: z.enum(['MONSIEUR', 'MADAME', 'MADEMOISELLE']),
    birthdate: z.string().optional(),
    mobile: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val === '') {
            return true;
          }
          return isPossiblePhoneNumber(val);
        },
        {
          message: 'Saisissez un numéro de téléphone valide.',
        },
      ),
  }),
  address: z.object({
    line1: z.string().min(1, 'Ce champ ne peut être vide.'),
    line4: z.string().min(1, 'Ce champ ne peut être vide.'),
    postcode: z.string().min(1, 'Ce champ ne peut être vide.'),
  }),
});

type ParticulierFormValues = z.infer<typeof particulierSchema>;

export default function EditParticulierPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const form = useForm<ParticulierFormValues>({
    resolver: zodResolver(particulierSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      user_profile: {
        first_name: '',
        last_name: '',
        title: 'MONSIEUR',
        birthdate: '',
        mobile: '',
      },
      address: {
        line1: '',
        line4: '',
        postcode: '',
      },
    },
  });

  // Charger les données de l'utilisateur dans le formulaire
  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        phone_number: user.phone_number,
        user_profile: {
          first_name: user.user_profile.first_name,
          last_name: user.user_profile.last_name,
          title: user.user_profile.title,
          birthdate: user.user_profile.birthdate || '',
          mobile: user.user_profile.mobile || '',
        },
        address: {
          line1: user.address?.line1 || '',
          line4: user.address?.line4 || '',
          postcode: user.address?.postcode || '',
        },
      });
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: (data: ParticulierFormValues) => updateUser(userId, data),
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès');
      router.push(`/customers/particuliers/${userId}`);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail
        || error?.response?.data?.message
        || 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ParticulierFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64">
          <Header />
          <main className="pt-16">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#009ef7] border-t-transparent" />
                <p className="mt-4 text-sm text-gray-600">Chargement des données...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64">
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
                <p className="text-red-800">Impossible de charger les détails de l'utilisateur.</p>
                <Button
                  onClick={() => router.push('/customers/particuliers')}
                  className="mt-4"
                  variant="outline"
                >
                  Retour à la liste
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="pt-16">
          <div className="space-y-6 p-6">
            {/* Header */}
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push(`/customers/particuliers/${userId}`)}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au profil
              </Button>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modifier le profil</h1>
                    <p className="text-sm text-gray-500">
                      {user.user_profile.first_name}
                      {' '}
                      {user.user_profile.last_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Informations personnelles */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="user_profile.title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Civilité</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MONSIEUR">M.</SelectItem>
                                <SelectItem value="MADAME">Mme</SelectItem>
                                <SelectItem value="MADEMOISELLE">Mlle</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="user_profile.first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="user_profile.last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="user_profile.birthdate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Informations de contact */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Informations de contact</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@exemple.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <PhoneInputComponent
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Entrez votre numéro de téléphone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="user_profile.mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile (optionnel)</FormLabel>
                            <FormControl>
                              <PhoneInputComponent
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Entrez un numéro mobile"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Adresse */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Adresse</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="address.line1"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Adresse</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Rue de la Paix" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.line4"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address.postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input placeholder="75001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/customers/particuliers/${userId}`)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="bg-[#009ef7] hover:bg-[#0077b6]"
                  >
                    {updateMutation.isPending
                      ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enregistrement...
                          </>
                        )
                      : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer les modifications
                          </>
                        )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
}
