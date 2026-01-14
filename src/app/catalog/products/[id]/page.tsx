'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Barcode,
  Box,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Grid3X3,
  ImageIcon,
  Info,
  Loader2,
  Package,
  Percent,
  Tag,
  Warehouse,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { FicheTechniqueDisplay } from '@/components/catalogue/products/FicheTechniqueDisplay';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { cn } from '@/lib/utils';
import { getProductById } from '@/services/ProductService';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: [QUERIES.PRODUCT_DETAIL, resolvedParams.id],
    queryFn: () => getProductById(Number(resolvedParams.id)),
    enabled: !!resolvedParams.id,
  });

  const error = queryError ? 'Erreur lors du chargement du produit' : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="flex h-[60vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#009ef7]/10">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009ef7]" />
                </div>
                <p className="text-sm font-medium text-gray-600">Chargement du produit...</p>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="flex h-[60vh] items-center justify-center p-6">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Package className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">Produit non trouvé</h2>
                <p className="mb-6 text-gray-500">{error || 'Le produit demandé n\'existe pas ou a été supprimé.'}</p>
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
              </div>
            </div>
          </main>
        </MainContent>
      </div>
    );
  }

  const mainImage = product.images && product.images.length > 0
    ? product.images[selectedImageIndex]?.original
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MainContent>
        <Header />
        <main className="pt-16">
          <div className="p-6">
            {/* Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <button onClick={() => router.push('/')} className="hover:text-[#009ef7]">Accueil</button>
                <span>/</span>
                <button onClick={() => router.push('/catalog/products')} className="hover:text-[#009ef7]">Produits</button>
                <span>/</span>
                <span className="font-medium text-gray-900">{product.title}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  onClick={() => router.push(`/catalog/products/${resolvedParams.id}/edit`)}
                  className="bg-[#009ef7] hover:bg-[#0077b6]"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              </div>
            </div>

            {/* Hero Section - Image + Infos principales */}
            <div className="mb-8 grid gap-8 lg:grid-cols-2">
              {/* Galerie d'images */}
              <div className="space-y-4">
                {/* Image principale */}
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-contain p-4"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100">
                      <ImageIcon className="h-20 w-20 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                          selectedImageIndex === index
                            ? 'border-[#009ef7] ring-2 ring-[#009ef7]/20'
                            : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <Image
                          src={image.original}
                          alt={image.caption || `Image ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informations principales */}
              <div className="space-y-6">
                {/* Titre et badges */}
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {product.is_public ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        <Eye className="mr-1 h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        <EyeOff className="mr-1 h-3 w-3" />
                        Privé
                      </Badge>
                    )}
                    {product.is_discountable && (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        <Percent className="mr-1 h-3 w-3" />
                        Remises autorisées
                      </Badge>
                    )}
                    {product.product_class && (
                      <Badge variant="outline" className="border-[#009ef7] text-[#009ef7]">
                        <Box className="mr-1 h-3 w-3" />
                        {product.product_class}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.title}</h1>
                </div>

                {/* Prix */}
                {product.stockrecords && (
                  <div className="rounded-xl bg-gradient-to-r from-[#009ef7]/5 to-[#0077b6]/5 p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-[#009ef7]">
                        {Number(product.stockrecords.price).toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xl font-medium text-gray-600">
                        {product.stockrecords.price_currency ? product.stockrecords.price_currency : 'FCFA'}
                      </span>
                    </div>
                    <div className="mt-4 flex gap-6">
                      <div className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">En stock</p>
                          <p className="font-semibold text-gray-900">{product.stockrecords.num_in_stock} unités</p>
                        </div>
                      </div>
                      {product.stockrecords.num_allocated !== undefined && product.stockrecords.num_allocated > 0 && (
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Alloué</p>
                            <p className="font-semibold text-gray-900">{product.stockrecords.num_allocated} unités</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Références */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Tag className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">Référence</span>
                    </div>
                    <p className="mt-1 font-mono text-sm font-medium text-gray-900">{product.code || '—'}</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Barcode className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">UPC</span>
                    </div>
                    <p className="mt-1 font-mono text-sm font-medium text-gray-900">{product.upc || '—'}</p>
                  </div>
                </div>

                {/* Catégories */}
                {product.categories && product.categories.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-gray-500">
                      <Grid3X3 className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">Catégories</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs pour les détails */}
            <Tabs defaultValue="description" className="space-y-6">
              <TabsList className="h-auto w-full justify-start gap-2 rounded-xl bg-white p-2 shadow-sm border border-gray-200">
                <TabsTrigger
                  value="description"
                  className="rounded-lg px-4 py-2.5 data-[state=active]:bg-[#009ef7] data-[state=active]:text-white"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Description
                </TabsTrigger>
                {product.images && product.images.length > 0 && (
                  <TabsTrigger
                    value="images"
                    className="rounded-lg px-4 py-2.5 data-[state=active]:bg-[#009ef7] data-[state=active]:text-white"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Images ({product.images.length})
                  </TabsTrigger>
                )}
                {product.attributes && product.attributes.length > 0 && (
                  <TabsTrigger
                    value="specifications"
                    className="rounded-lg px-4 py-2.5 data-[state=active]:bg-[#009ef7] data-[state=active]:text-white"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Spécifications
                  </TabsTrigger>
                )}
                {product.fiche_techniques && product.fiche_techniques.length > 0 && (
                  <TabsTrigger
                    value="technical"
                    className="rounded-lg px-4 py-2.5 data-[state=active]:bg-[#009ef7] data-[state=active]:text-white"
                  >
                    <Box className="mr-2 h-4 w-4" />
                    Fiches techniques
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Description */}
              <TabsContent value="description" className="mt-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    {product.description ? (
                      <div className="prose prose-gray max-w-none">
                        <MarkdownPreview source={product.description} />
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-4 text-gray-500">Aucune description disponible</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Images */}
              {product.images && product.images.length > 0 && (
                <TabsContent value="images" className="mt-6">
                  <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {product.images.map((image, index) => (
                          <div key={index} className="group space-y-3">
                            <div className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition-shadow group-hover:shadow-lg">
                              <Image
                                src={image.original}
                                alt={image.caption || `Image ${index + 1}`}
                                fill
                                className="object-contain p-2"
                                unoptimized
                              />
                            </div>
                            {image.caption && (
                              <p className="text-center text-sm text-gray-600">{image.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Spécifications */}
              {product.attributes && product.attributes.length > 0 && (
                <TabsContent value="specifications" className="mt-6">
                  <Card className="border-gray-200 shadow-sm">
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-100">
                        {product.attributes.map((attr, index) => (
                          <div
                            key={index}
                            className={cn(
                              'flex items-center justify-between px-6 py-4',
                              index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white',
                            )}
                          >
                            <span className="font-medium text-gray-700">{attr.name}</span>
                            <span className="text-gray-600">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Fiches techniques */}
              {product.fiche_techniques && product.fiche_techniques.length > 0 && (
                <TabsContent value="technical" className="mt-6">
                  <FicheTechniqueDisplay ficheTechniques={product.fiche_techniques} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
