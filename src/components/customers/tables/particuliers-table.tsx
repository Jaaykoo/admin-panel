'use client';

import type { User } from '@/types/UserTypes';
import { useMutation } from '@tanstack/react-query';
import { Edit, Eye, MoreHorizontal, Trash2, UserCheck, UserX } from 'lucide-react';
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

type IndividualsTableProps = {
  users: User[];
};

const getStatusConfig = (isActive: boolean) => {
  if (!isActive) {
    return { label: 'Désactivé', className: 'bg-gray-100 text-gray-600' };
  }
  return { label: 'Actif', className: 'bg-[#e8fff3] text-[#50cd89]' };
};

export function IndividualsTable({ users }: IndividualsTableProps) {
  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
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
    router.push(`/customers/particuliers/${userId}`);
  };

  const handleEdit = (userId: number) => {
    router.push(`/customers/particuliers/${userId}/edit`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === users.length && users.length > 0}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Téléphone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Date d'inscription
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-sm font-medium">Aucun client particulier trouvé</p>
                          <p className="text-xs">Essayez de modifier vos filtres de recherche</p>
                        </div>
                      </td>
                    </tr>
                  )
                : (
                    users.map((user) => {
                      const statusConfig = getStatusConfig(user.is_active);
                      const fullName = `${user.user_profile.first_name} ${user.user_profile.last_name}`;
                      const initials = `${user.user_profile.first_name[0]}${user.user_profile.last_name[0]}`.toUpperCase();

                      return (
                        <tr key={user.id} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(
                                    selectedUsers.filter(id => id !== user.id),
                                  );
                                }
                              }}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.user_profile.avatar
                                ? (
                                    <img
                                      src={user.user_profile.avatar}
                                      alt={fullName}
                                      className="h-10 w-10 rounded-full object-cover"
                                    />
                                  )
                                : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white shadow-md">
                                      <span className="text-sm font-semibold">{initials}</span>
                                    </div>
                                  )}
                              <div>
                                <div className="font-medium text-gray-900">{fullName}</div>
                                <div className="text-xs text-gray-500">
                                  {user.user_profile.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.phone_number}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className={statusConfig.className}>
                              {statusConfig.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(user.date_joined)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
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
                                  className="text-[#f1416c]"
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
                    })
                  )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'utilisateur sera définitivement supprimé
              de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#f1416c] hover:bg-[#d9214e]"
            >
              {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
