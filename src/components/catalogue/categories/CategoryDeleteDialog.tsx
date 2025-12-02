'use client';

import type { Category } from '@/types/CategoryTypes';
import { AlertTriangle, Trash2 } from 'lucide-react';
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
import { deleteCategory } from '@/services/CategoryServices';

type CategoryDeleteDialogProps = {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CategoryDeleteDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: CategoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!category) {
    return null;
  }

  const hasChildren = category.children && category.children.length > 0;
  const childrenCount = category.children?.length || 0;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCategory(category.id);
      toast.success('Catégorie supprimée', {
        description: `La catégorie "${category.name}" a été supprimée avec succès.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur de suppression', {
        description: 'Impossible de supprimer la catégorie. Veuillez réessayer.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-3">
            <span className="block">
              Êtes-vous sûr de vouloir supprimer la catégorie
              {' '}
              <span className="font-semibold text-gray-900">
                &quot;
                {category.name}
                &quot;
              </span>
              {' '}
              ?
            </span>

            {hasChildren && (
              <div className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
                <div className="text-sm">
                  <div className="font-semibold text-yellow-900">
                    Attention : Cette catégorie a des sous-catégories
                  </div>
                  <div className="mt-1 text-yellow-700">
                    Cette catégorie contient
                    {' '}
                    <span className="font-semibold">
                      {childrenCount}
                      {' '}
                      sous-catégorie
                      {childrenCount > 1 ? 's' : ''}
                    </span>
                    . En supprimant cette catégorie, toutes ses sous-catégories
                    seront également supprimées.
                  </div>
                </div>
              </div>
            )}

            <span className="block text-sm text-gray-600">
              Cette action est irréversible et toutes les données associées
              seront définitivement perdues.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

