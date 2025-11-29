'use client';

import type { User } from '@/types/UserTypes';
import { useMutation } from '@tanstack/react-query';
import { Edit, Eye, MoreHorizontal, Shield, Trash2, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryResponse } from '@/hooks/user/UserQueryResponseProvider';
import { blockUser, deleteUser, unblockUser } from '@/services/UsersService';

type UsersTableProps = {
  users: User[];
};

const getStatusConfig = (isActive: boolean) => {
  if (!isActive) {
    return { label: 'Désactivé', className: 'bg-gray-100 text-gray-600' };
  }
  return { label: 'Actif', className: 'bg-[#e8fff3] text-[#50cd89]' };
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return { label: 'Administrateur', className: 'bg-[#e8f4ff] text-[#009ef7]' };
    case 'PERSONNEL':
      return { label: 'Personnel', className: 'bg-[#e8f4ff] text-[#009ef7]' };
    case 'PARTICULIER':
      return { label: 'Particulier', className: 'bg-[#e8f4ff] text-[#009ef7]' };
    case 'ENTREPRISE':
      return { label: 'Entreprise', className: 'bg-[#e8f4ff] text-[#009ef7]' };
    default:
      return { label: role, className: 'bg-[#e8f4ff] text-[#009ef7]' };
  }
};

export function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const { refetch } = useQueryResponse();

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      toast.success('Utilisateur supprimé avec succès');
      refetch();
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Erreur lors de la suppression');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      !isActive ? blockUser(userId) : unblockUser(userId),
    onSuccess: (_, variables) => {
      toast.success(
        variables.isActive
          ? 'Utilisateur désactivé avec succès'
          : 'Utilisateur activé avec succès',
      );
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Erreur lors de la modification');
    },
  });

  const handleDelete = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  const handleToggleActive = (userId: number, isActive: boolean) => {
    toggleActiveMutation.mutate({ userId, isActive });
  };

  const handleViewProfile = (userId: number) => {
    router.push(`/users/${userId}`);
  };

  const handleEdit = (userId: number) => {
    router.push(`/users/${userId}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Aucun utilisateur trouvé</h3>
        <p className="mt-2 text-sm text-gray-600">
          Aucun utilisateur ne correspond aux critères de recherche
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => {
                const status = getStatusConfig(user.is_active);
                const roleBadge = getRoleBadge(user.role);
                const firstName = user.user_profile?.first_name || 'N/A';
                const lastName = user.user_profile?.last_name || '';
                const initials = user.user_profile?.first_name && user.user_profile?.last_name
                  ? `${user.user_profile.first_name[0]}${user.user_profile.last_name[0]}`.toUpperCase()
                  : '??';

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white">
                          <span className="text-sm font-semibold">{initials}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {firstName}
                            {' '}
                            {lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.user_profile?.title || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge className={roleBadge.className}>{roleBadge.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.phone_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(user.date_joined)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={status.className}>{status.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(user.id, user.is_active)}
                          >
                            {user.is_active
                              ? (
                                  <>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Désactiver
                                  </>
                                )
                              : (
                                  <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activer
                                  </>
                                )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cet utilisateur sera définitivement supprimé de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
