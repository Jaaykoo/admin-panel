'use client';

import type { CreateUser } from '@/types/UserTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Save, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  FormDescription,
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
import { createUser } from '@/services/usersService';

// Schéma de validation pour créer un utilisateur
const createUserSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  phone_number: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .refine(val => isPossiblePhoneNumber(val), {
      message: 'Saisissez un numéro de téléphone valide.',
    }),
  role: z.enum(['ADMIN', 'PERSONNEL']),
  profile: z.object({
    first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    title: z.enum(['MONSIEUR', 'MADAME', 'MADEMOISELLE']),
  }),
  address: z.object({
    line1: z.string().optional(),
    line4: z.string().optional(),
    postcode: z.string().optional(),
  }).optional(),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const router = useRouter();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      phone_number: '',
      role: 'PERSONNEL',
      profile: {
        first_name: '',
        last_name: '',
        title: 'MONSIEUR',
      },
      address: {
        line1: '',
        line4: '',
        postcode: '',
      },
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserFormValues) => createUser(data as CreateUser),
    onSuccess: () => {
      toast.success('Utilisateur créé avec succès');
      router.push('/users');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.detail
        || error?.response?.data?.message
        || 'Erreur lors de la création';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CreateUserFormValues) => {
    createMutation.mutate(data);
  };

  const selectedRole = form.watch('role');
  const getRoleColor = () => '#009ef7';

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
                onClick={() => router.push('/users')}
                className="mb-4 -ml-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la liste
              </Button>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${getRoleColor(selectedRole)}, ${getRoleColor(selectedRole)}dd)`,
                    }}
                  >
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Créer un utilisateur</h1>
                    <p className="text-sm text-gray-500">Nouvel administrateur ou personnel</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Rôle et Compte */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Rôle et Compte</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rôle</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un rôle" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ADMIN">Administrateur</SelectItem>
                                <SelectItem value="PERSONNEL">Personnel</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Définit les permissions de l'utilisateur
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormDescription>
                              Minimum 8 caractères
                            </FormDescription>
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
                                placeholder="Entrez le numéro de téléphone"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Informations personnelles */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="profile.title"
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
                        name="profile.first_name"
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
                        name="profile.last_name"
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
                    </div>
                  </CardContent>
                </Card>

                {/* Adresse (optionnel) */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Adresse (optionnel)</CardTitle>
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
                    onClick={() => router.push('/users')}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    style={{ backgroundColor: getRoleColor(selectedRole) }}
                    className="hover:opacity-90"
                  >
                    {createMutation.isPending
                      ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création...
                          </>
                        )
                      : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Créer l'utilisateur
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


