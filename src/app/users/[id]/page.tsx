'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, CheckCircle, Edit, Mail, MapPin, Phone, Shield, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserById } from '@/services/UsersService';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(Number(userId)),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#7239ea] border-t-transparent" />
                <p className="mt-4 text-sm text-gray-600">Chargement des détails...</p>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
                <p className="text-red-800">Impossible de charger les détails de l'utilisateur.</p>
                <Button
                  onClick={() => router.push('/users')}
                  className="mt-4"
                  variant="outline"
                >
                  Retour à la liste
                </Button>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  // Vérification de sécurité pour user_profile
  if (!user.user_profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-6 text-center">
                <p className="text-yellow-800">Cet utilisateur n'a pas de profil associé.</p>
                <Button
                  onClick={() => router.push('/users')}
                  className="mt-4"
                  variant="outline"
                >
                  Retour à la liste
                </Button>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  const fullName = `${user.user_profile.first_name || ''} ${user.user_profile.last_name || ''}`.trim() || user.email;
  const firstName = user.user_profile.first_name || '';
  const lastName = user.user_profile.last_name || '';
  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : 'U';
  const getRoleColor = () => '#009ef7';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
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
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Détails de l'utilisateur</h1>
                    <p className="text-sm text-gray-500">
                      {user.role === 'ADMIN' ? 'Administrateur' : 'Personnel'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/users/${userId}/edit`)}
                  className="shadow-md"
                  style={{ backgroundColor: getRoleColor() }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Card */}
              <Card className="shadow-sm lg:col-span-1">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg">Profil</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {user.user_profile.avatar
                      ? (
                          <div className="h-24 w-24 overflow-hidden rounded-full">
                            <img
                              src={user.user_profile.avatar}
                              alt={fullName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )
                      : (
                          <div
                            className="flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${getRoleColor()}, ${getRoleColor()}dd)`,
                            }}
                          >
                            <span className="text-2xl font-semibold">{initials}</span>
                          </div>
                        )}
                    <h2 className="mt-4 text-xl font-bold text-gray-900">{fullName}</h2>
                    <p className="text-sm text-gray-500">{user.user_profile.title}</p>

                    <div className="mt-4 flex gap-2">
                      <Badge
                        style={{
                          backgroundColor: '#e8f4ff',
                          color: '#009ef7',
                        }}
                      >
                        {user.role === 'ADMIN' ? 'Administrateur' : user.role === 'PERSONNEL' ? 'Personnel' : user.role === 'PARTICULIER' ? 'Particulier' : 'Entreprise'}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          user.is_active
                            ? 'bg-[#e8fff3] text-[#50cd89]'
                            : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {user.is_active ? 'Actif' : 'Désactivé'}
                      </Badge>
                    </div>

                    <div className="mt-6 w-full space-y-3">
                      <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="break-all text-gray-900">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                        <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="text-gray-900">{user.phone_number}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Details Cards */}
              <div className="space-y-6 lg:col-span-2">
                {/* Personal Information */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Prénom
                        </span>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {user.user_profile.first_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Nom
                        </span>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {user.user_profile.last_name}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Civilité
                        </span>
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {user.user_profile.title}
                        </p>
                      </div>
                      {user.user_profile.birthdate && (
                        <div>
                          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                            Date de naissance
                          </span>
                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {formatDate(user.user_profile.birthdate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                {user.address && (
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-gray-600" />
                        Adresse
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-2 text-sm text-gray-900">
                        {user.address.line1 && <p className="font-medium">{user.address.line1}</p>}
                        {user.address.line4 && <p>{user.address.line4}</p>}
                        {user.address.postcode && (
                          <p className="font-medium" style={{ color: getRoleColor() }}>
                            {user.address.postcode}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Account Information */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-gray-600" />
                      Informations du compte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Rôle
                        </span>
                        <p className="mt-2">
                          <Badge style={{ backgroundColor: '#009ef7', color: 'white' }}>
                            {user.role === 'ADMIN' ? 'Administrateur' : user.role === 'PERSONNEL' ? 'Personnel' : user.role === 'PARTICULIER' ? 'Particulier' : 'Entreprise'}
                          </Badge>
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Date d'inscription
                        </span>
                        <div className="mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(user.date_joined)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Statut du compte
                        </span>
                        <div className="mt-2 flex items-center gap-2">
                          {user.is_active
                            ? (
                                <>
                                  <CheckCircle className="h-5 w-5 text-[#50cd89]" />
                                  <span className="text-sm font-medium text-[#50cd89]">Actif</span>
                                </>
                              )
                            : (
                                <>
                                  <XCircle className="h-5 w-5 text-gray-600" />
                                  <span className="text-sm font-medium text-gray-600">Désactivé</span>
                                </>
                              )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Vérification
                        </span>
                        <div className="mt-2 flex items-center gap-2">
                          {user.is_verified
                            ? (
                                <>
                                  <CheckCircle className="h-5 w-5 text-[#50cd89]" />
                                  <span className="text-sm font-medium text-[#50cd89]">Vérifié</span>
                                </>
                              )
                            : (
                                <>
                                  <XCircle className="h-5 w-5 text-yellow-600" />
                                  <span className="text-sm font-medium text-yellow-600">
                                    Non vérifié
                                  </span>
                                </>
                              )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
