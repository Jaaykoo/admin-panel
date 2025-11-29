'use client';

import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { PageHeader } from '@/components/catalogue/PageHeader';
import { Header } from '@/components/layouts/header';
import { MainContent } from '@/components/layouts/main-content';
import { Sidebar } from '@/components/layouts/sidebar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { getProductById } from '@/services/ProductService';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: [QUERIES.PRODUCT_DETAIL, resolvedParams.id],
    queryFn: () => getProductById(Number(resolvedParams.id)),
    enabled: !!resolvedParams.id,
  });

  const error = queryError ? 'Erreur lors du chargement du produit' : null;

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

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />
        <MainContent>
          <Header />
          <main className="pt-16">
            <div className="p-6">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-red-600">{error || 'Produit non trouvé'}</p>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="mt-4"
                >
                  Retour
                </Button>
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
              title={product.title}
              breadcrumbs={[
                { label: 'Accueil', href: '/' },
                { label: 'Catalogue' },
                { label: 'Produits', href: '/catalog/products' },
                { label: product.title },
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
                    onClick={() => router.push(`/catalog/products/${resolvedParams.id}/edit`)}
                    className="bg-[#009ef7] hover:bg-[#0077b6]"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              )}
            />

            <div className="space-y-6">
              {/* Informations principales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Titre</p>
                      <p className="mt-1 text-base">{product.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Slug</p>
                      <p className="mt-1 font-mono text-base text-sm">{product.slug}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Réference</p>
                      <p className="mt-1 text-base">{product.code}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">UPC</p>
                      <p className="mt-1 font-mono text-base text-sm">{product.upc}</p>
                    </div>
                  </div>

                  {product.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="mt-1 text-base">{product.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {product.is_public
                      ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Public
                          </Badge>
                        )
                      : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Privé
                          </Badge>
                        )}
                    {product.is_discountable && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Remises autorisées
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Catégories */}
              {product.categories && product.categories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Catégories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category, index) => (
                        <Badge key={index} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stock et prix */}
              {product.stockrecords && (
                <Card>
                  <CardHeader>
                    <CardTitle>Stock et prix</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Prix</p>
                        <p className="mt-1 text-2xl font-bold text-[#009ef7]">
                          {product.stockrecords.price}
                          {' '}
                          {product.stockrecords.price_currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">En stock</p>
                        <p className="mt-1 text-xl font-semibold">
                          {product.stockrecords.num_in_stock}
                        </p>
                      </div>
                      {product.stockrecords.num_allocated !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Alloué</p>
                          <p className="mt-1 text-xl font-semibold">
                            {product.stockrecords.num_allocated}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Images */}
              {product.images && product.images.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Images (
                      {product.images.length}
                      )
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {product.images.map((image, index) => (
                        <div key={index} className="space-y-2">
                          <div className="relative aspect-square overflow-hidden rounded-lg border">
                            <Image
                              src={image.original}
                              alt={image.caption || `Image ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          {image.caption && (
                            <p className="text-sm text-gray-600">{image.caption}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Attributs */}
              {product.attributes && product.attributes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Attributs
                      {product.product_class && ` (${product.product_class})`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {product.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between border-b py-2 last:border-0">
                          <span className="font-medium text-gray-700">
                            {attr.name}
                            :
                          </span>
                          <span className="text-gray-600">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Fiches techniques */}
              {product.fiche_techniques && product.fiche_techniques.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Fiches techniques</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {product.fiche_techniques.map((fiche, index) => {
                        const contentArray = Array.isArray(fiche.content)
                          ? fiche.content
                          : Object.entries(fiche.content).map(([name, val]) => ({ name, value: val }));

                        return (
                          <AccordionItem key={index} value={`fiche-${index}`}>
                            <AccordionTrigger>{fiche.titre}</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {contentArray.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between border-b py-2 last:border-0">
                                    <span className="font-medium text-gray-700">
                                      {item.name}
                                      :
                                    </span>
                                    <span className="text-gray-600">{item.value}</span>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </MainContent>
    </div>
  );
}
