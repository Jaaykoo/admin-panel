'use client';

import type { Category, CreateCategory } from '@/types/CategoryTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'react-slugify';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateCategorySchema } from '@/schemas/CategorySchemas';
import { createCategory, createSubCategory, updateCategory } from '@/services/CategoryServices';
import { CategorySelector } from './CategorySelector';

type CategoryFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: Category | null;
  allCategories: Category[];
  mode?: 'create' | 'edit';
  parentCategory?: Category | null;
};

// Regex pour valider une URL
const URL_REGEX = /^https?:\/\/.+\..+/i;

export function CategoryForm({
  open,
  onOpenChange,
  onSuccess,
  category,
  allCategories,
  mode = 'create',
  parentCategory,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedParent, setSelectedParent] = useState<Category | null>(parentCategory || null);

  const form = useForm<CreateCategory>({
    resolver: zodResolver(CreateCategorySchema) as any,
    defaultValues: {
      name: '',
      code: '',
      description: '',
      meta_title: '',
      meta_description: '',
      image: '',
      slug: '',
      is_public: true,
      ancestors_are_public: true,
    },
  });

  const watchName = form.watch('name');
  const watchImage = form.watch('image');

  // Auto-générer le slug avec react-slugify et le code
  useEffect(() => {
    if (watchName && !category) {
      const generatedSlug = slugify(watchName);
      const code = watchName
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '');

      form.setValue('slug', generatedSlug);
      form.setValue('code', code);
    }
  }, [watchName, form, category]);

  // Valider et prévisualiser l'image URL
  useEffect(() => {
    if (watchImage && URL_REGEX.test(watchImage)) {
      setImagePreview(watchImage);
    } else if (!watchImage) {
      setImagePreview(null);
    }
  }, [watchImage]);

  // Charger les données de la catégorie en mode édition
  useEffect(() => {
    if (category && mode === 'edit') {
      form.reset({
        name: category.name,
        code: category.code,
        description: category.description || '',
        meta_title: category.meta_title || '',
        meta_description: category.meta_description || '',
        image: category.image || '',
        slug: category.slug || '',
        is_public: category.is_public ?? true,
        ancestors_are_public: category.ancestors_are_public ?? true,
      });
      if (category.image && URL_REGEX.test(category.image)) {
        setImagePreview(category.image);
      }
    } else if (!open) {
      // Reset le formulaire quand le modal se ferme
      form.reset({
        name: '',
        code: '',
        description: '',
        meta_title: '',
        meta_description: '',
        image: '',
        slug: '',
        is_public: true,
        ancestors_are_public: true,
      });
      setImagePreview(null);
      setSelectedParent(null);
    }
  }, [category, mode, open, form]);

  // Mettre à jour selectedParent quand parentCategory change (même si modal ouvert)
  useEffect(() => {
    if (open && parentCategory) {
      setSelectedParent(parentCategory);
      console.log('🔍 DEBUG - parentCategory updated:', parentCategory);
    }
  }, [parentCategory, open]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue('image', '');
  };

  // Fonction helper pour construire le chemin complet des slugs d'une catégorie
  const buildFullSlugPath = (category: Category, categories: Category[]): string => {
    // Si breadcrumbs contient "/" c'est déjà le bon format
    if (category.breadcrumbs && category.breadcrumbs.includes('/')) {
      return category.breadcrumbs;
    }

    // Sinon, on doit construire le chemin en parcourant la hiérarchie
    // Utiliser breadcrumbs avec ">" pour identifier les parents et trouver leurs slugs
    if (category.breadcrumbs && category.breadcrumbs.includes('>')) {
      const names = category.breadcrumbs.split(' > ').map(n => n.trim());
      const slugs: string[] = [];

      // Fonction récursive pour chercher une catégorie par nom
      const findCategoryByName = (name: string, cats: Category[]): Category | null => {
        for (const cat of cats) {
          if (cat.name === name) {
            return cat;
          }
          if (cat.children && cat.children.length > 0) {
            const found = findCategoryByName(name, cat.children);
            if (found) return found;
          }
        }
        return null;
      };

      // Construire le chemin de slugs
      for (const name of names) {
        const found = findCategoryByName(name, categories);
        if (found && found.slug) {
          slugs.push(found.slug);
        }
      }

      return slugs.length > 0 ? slugs.join('/') : (category.slug || '');
    }

    // Fallback : juste le slug
    return category.slug || '';
  };

  const onSubmit = async (data: CreateCategory) => {
    try {
      setIsSubmitting(true);

      if (mode === 'edit' && category) {
        await updateCategory(category.id, data);
        toast.success('Catégorie mise à jour', {
          description: `La catégorie "${data.name}" a été mise à jour avec succès.`,
        });
      } else if (selectedParent || parentCategory) {
        // Utiliser parentCategory si selectedParent n'est pas défini
        const parent = selectedParent || parentCategory;

        // IMPORTANT : Le backend attend le CHEMIN COMPLET des SLUGS
        // Exemple: "ordinateurs-tablettes/tablettes" pour créer sous "Tablettes"

        // Construire le chemin complet des slugs en parcourant la hiérarchie
        const parentSlugsPath = buildFullSlugPath(parent!, allCategories || []);

        console.log('🔍 DEBUG - Parent:', parent);
        console.log('🔍 DEBUG - Parent breadcrumbs:', parent!.breadcrumbs);
        console.log('🔍 DEBUG - Parent slug:', parent!.slug);
        console.log('🔍 DEBUG - parentSlugsPath FINAL:', parentSlugsPath);

        if (!parentSlugsPath) {
          toast.error('Erreur', {
            description: 'Le parent sélectionné n\'a pas de chemin valide.',
          });
          setIsSubmitting(false);
          return;
        }

        await createSubCategory(parentSlugsPath, data);
        toast.success('Sous-catégorie créée', {
          description: `La sous-catégorie "${data.name}" a été créée sous "${parent!.name}".`,
        });
      } else {
        await createCategory(data);
        toast.success('Catégorie créée', {
          description: `La catégorie "${data.name}" a été créée avec succès.`,
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Une erreur est survenue lors de la sauvegarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-7xl overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {mode === 'edit' ? '✏️ Modifier la catégorie' : selectedParent ? '➕ Créer une sous-catégorie' : '🆕 Créer une catégorie'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {mode === 'edit'
              ? 'Modifiez les informations de la catégorie ci-dessous.'
              : selectedParent
                ? `Créez une nouvelle sous-catégorie sous "${selectedParent.name}".`
                : 'Créez une nouvelle catégorie ou sélectionnez un parent pour créer une sous-catégorie.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            {mode === 'create' && !parentCategory && (
              <div className="space-y-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">📁</span>
                  Catégorie parent (optionnel)
                </label>
                <CategorySelector
                  categories={allCategories}
                  selectedCategory={selectedParent}
                  onSelect={setSelectedParent}
                  placeholder="🔍 Sélectionner une catégorie parent..."
                />
                <p className="text-xs text-gray-500 leading-relaxed">
                  💡 Laissez vide pour créer une catégorie racine, ou sélectionnez un parent pour créer une sous-catégorie.
                </p>
              </div>
            )}

            {(selectedParent || parentCategory) && (
              <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500 p-2">
                    <FolderPlus className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-900">
                      Parent sélectionné :
                      {' '}
                      {(selectedParent || parentCategory)!.name}
                    </p>
                    {(selectedParent || parentCategory)!.breadcrumbs && (
                      <p className="mt-0.5 text-xs text-blue-700">
                        Chemin :
                        {' '}
                        {(selectedParent || parentCategory)!.breadcrumbs}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nom de la catégorie
                    {' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Électronique" {...field} />
                  </FormControl>
                  <FormDescription>Le nom principal de votre catégorie</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="auto-generated"
                        {...field}
                        className="bg-gray-50"
                        readOnly
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Généré automatiquement avec react-slugify
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AUTO_GENERATED"
                        {...field}
                        className="bg-gray-50"
                        readOnly
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Généré automatiquement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l&apos;image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Entrez une URL d&apos;image valide. Le système téléchargera automatiquement l&apos;image.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreview && (
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg border object-cover"
                  unoptimized={imagePreview.includes('localhost')}
                  onError={() => setImagePreview(null)}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Décrivez votre catégorie..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title (SEO)</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre pour les moteurs de recherche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description (SEO)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description pour les moteurs de recherche..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="is_public"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibilité</FormLabel>
                    <Select
                      onValueChange={value => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Publique</SelectItem>
                        <SelectItem value="false">Privée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ancestors_are_public"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parents publics</FormLabel>
                    <Select
                      onValueChange={value => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Oui</SelectItem>
                        <SelectItem value="false">Non</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#009ef7] hover:bg-[#0077b6]">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Enregistrement...' : mode === 'edit' ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
