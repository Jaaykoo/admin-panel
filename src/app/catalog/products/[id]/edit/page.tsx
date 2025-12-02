'use client';

import type { ProductClassDetail } from '@/types/ProductClassTypes';
import type { ProductUpdate } from '@/types/ProductTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import slugify from 'react-slugify';
import { toast } from 'sonner';
import { PageHeader } from '@/components/catalogue/PageHeader';
import {
  CategoryMultiSelect,
  DynamicAttributesForm,
  FicheTechniqueManager,
  ImageListManager,
  ProductClassSelector,
} from '@/components/catalogue/products';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { extractProductClassSlugFromUrl } from '@/helpers/UrlHelper';
import { ProductUpdateSchema } from '@/schemas/ProductSchemas';
import { getProductClassBySlug } from '@/services/ProductClassService';
import { getProductById, updateProduct } from '@/services/ProductService';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductClass, setSelectedProductClass] = useState<ProductClassDetail | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductUpdate>({
    resolver: zodResolver(ProductUpdateSchema) as any,
  });

  const watchTitle = watch('title');
  const watchSlug = watch('slug');
  const watchCategories = watch('categories') || [];
  const watchAttributes = watch('attributes') || [];
  const watchImages = watch('images') || [];
  const watchFicheTechniques = watch('fiche_techniques') || [];

  // Charger les données du produit avec React Query
  const { data: product, isLoading, error } = useQuery({
    queryKey: [QUERIES.PRODUCT_DETAIL, resolvedParams.id],
    queryFn: () => getProductById(Number(resolvedParams.id)),
    enabled: !!resolvedParams.id,
  });

  // Pré-remplir le formulaire quand le produit est chargé
  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        slug: product.slug,
        code: product.code,
        upc: product.upc,
        description: product.description,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        structure: product.structure,
        is_public: product.is_public,
        is_discountable: product.is_discountable,
        categories: product.categories,
        product_class: product.product_class,
        attributes: product.attributes,
        images: product.images,
        fiche_techniques: product.fiche_techniques,
        stockrecords: product.stockrecords,
      });

      // Charger le product class si présent
      if (product.product_class) {
        getProductClassBySlug(product.product_class)
          .then(setSelectedProductClass)
          .catch(err => console.error('Error fetching product class:', err));
      }
    }
  }, [product, reset]);

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      console.error('Error fetching product:', error);
      toast.error('Erreur lors du chargement du produit');
      router.back();
    }
  }, [error, router]);

  const handleTitleChange = (title: string) => {
    setValue('title', title);
    if (!watchSlug || watchSlug === slugify(watchTitle)) {
      setValue('slug', slugify(title));
    }
  };

  const onSubmit = async (data: ProductUpdate) => {
    setIsSubmitting(true);
    try {
      await updateProduct(Number(resolvedParams.id), data);
      toast.success('Produit mis à jour avec succès');
      router.push(`/catalog/products/${resolvedParams.id}`);
    } catch (error: any) {
      console.error('❌ Error updating product:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.detail || 'Erreur lors de la mise à jour du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#009ef7]" />
                <p className="mt-2 text-sm text-gray-500">Chargement du produit...</p>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            <PageHeader
              title="Modifier le produit"
              breadcrumbs={[
                { label: 'Accueil', href: '/' },
                { label: 'Catalogue' },
                { label: 'Produits', href: '/catalog/products' },
                { label: 'Modifier' },
              ]}
              actions={(
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="bg-[#009ef7] hover:bg-[#0077b6]"
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mettre à jour
                  </Button>
                </div>
              )}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        Titre du produit
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        {...register('title')}
                        onChange={e => handleTitleChange(e.target.value)}
                        placeholder="Ex: HP EliteBook 840 G7"
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">
                        Slug
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="slug"
                        {...register('slug')}
                        placeholder="hp-elitebook-840-g7"
                      />
                      {errors.slug && (
                        <p className="text-sm text-red-500">{errors.slug.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Réference</Label>
                      <Input
                        id="code"
                        {...register('code')}
                        placeholder="Réference détaillée du produit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upc">UPC</Label>
                      <Input
                        id="upc"
                        {...register('upc')}
                        placeholder="UPC du produit"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      rows={4}
                      placeholder="Description détaillée du produit"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="meta_title">Meta Title (SEO)</Label>
                      <Input
                        id="meta_title"
                        {...register('meta_title')}
                        placeholder="Titre pour les moteurs de recherche"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                      <Input
                        id="meta_description"
                        {...register('meta_description')}
                        placeholder="Description pour les moteurs de recherche"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_public"
                        checked={watch('is_public')}
                        onCheckedChange={checked => setValue('is_public', checked as boolean)}
                      />
                      <Label htmlFor="is_public" className="cursor-pointer">
                        Produit public
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_discountable"
                        checked={watch('is_discountable')}
                        onCheckedChange={checked => setValue('is_discountable', checked as boolean)}
                      />
                      <Label htmlFor="is_discountable" className="cursor-pointer">
                        Remises autorisées
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Catégories */}
              <Card>
                <CardHeader>
                  <CardTitle>Catégories</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryMultiSelect
                    value={watchCategories}
                    onChange={categories => setValue('categories', categories)}
                    disabled={isSubmitting}
                  />
                </CardContent>
              </Card>

              {/* Type de produit et attributs */}
              <Card>
                <CardHeader>
                  <CardTitle>Type de produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProductClassSelector
                    value={watch('product_class')}
                    onSelect={async (productClass) => {
                      setSelectedProductClass(productClass);
                      setValue('product_class', extractProductClassSlugFromUrl(productClass?.url || '') || undefined);
                      setValue('attributes', []);
                    }}
                    disabled={isSubmitting}
                  />

                  {selectedProductClass && (
                    <DynamicAttributesForm
                      productClass={selectedProductClass}
                      value={watchAttributes}
                      onChange={attributes => setValue('attributes', attributes)}
                      disabled={isSubmitting}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Gestion du stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Prix
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="text"
                        {...register('stockrecords.price')}
                        placeholder="1299.99"
                      />
                      {errors.stockrecords?.price && (
                        <p className="text-sm text-red-500">
                          {errors.stockrecords.price.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price_currency">Devise</Label>
                      <Input
                        id="price_currency"
                        {...register('stockrecords.price_currency')}
                        placeholder="XOF"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="num_in_stock">
                        Quantité en stock
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="num_in_stock"
                        type="number"
                        {...register('stockrecords.num_in_stock', { valueAsNumber: true })}
                        placeholder="50"
                      />
                      {errors.stockrecords?.num_in_stock && (
                        <p className="text-sm text-red-500">
                          {errors.stockrecords.num_in_stock.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sections supplémentaires */}
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="images">
                  <AccordionTrigger className="rounded-lg border bg-white px-6 hover:no-underline">
                    <span className="text-base font-semibold">
                      Images du produit (
                      {watchImages.length}
                      )
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 rounded-lg border bg-white p-6">
                    <ImageListManager
                      value={watchImages}
                      onChange={images => setValue('images', images)}
                      disabled={isSubmitting}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fiches">
                  <AccordionTrigger className="rounded-lg border bg-white px-6 hover:no-underline">
                    <span className="text-base font-semibold">
                      Fiches techniques (
                      {watchFicheTechniques.length}
                      )
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="mt-2 rounded-lg border bg-white p-6">
                    <FicheTechniqueManager
                      value={watchFicheTechniques}
                      onChange={fiches => setValue('fiche_techniques', fiches)}
                      disabled={isSubmitting}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </form>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
