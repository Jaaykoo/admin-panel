'use client';

import type { ProductClass } from '@/types/ProductClassTypes';
import { ChevronDown, ChevronUp, Edit, Package, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { extractProductClassSlugFromUrl } from '@/helpers/UrlHelper';

type ProductClassDetailsCardProps = {
  productClass: ProductClass;
};

export function ProductClassDetailsCard({ productClass }: ProductClassDetailsCardProps) {
  const [expandedAttributes, setExpandedAttributes] = useState<Record<string, boolean>>({});

  const toggleAttribute = (attributeCode: string) => {
    setExpandedAttributes(prev => ({
      ...prev,
      [attributeCode]: !prev[attributeCode],
    }));
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{productClass.name}</h1>
          <p className="text-muted-foreground">
            Code:
            {' '}
            <span className="font-mono text-sm">{productClass.code}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/catalog/product-classes/${extractProductClassSlugFromUrl(productClass.url)}/edit`}>
            <Button className="bg-[#009ef7] hover:bg-[#0077b6]">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configuration générale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Paramètres généraux du type de produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expédition requise</span>
              <Badge
                variant={productClass.requires_shipping ? 'default' : 'secondary'}
                className={productClass.requires_shipping
                  ? 'bg-[#009ef7] hover:bg-[#0077b6]'
                  : 'bg-gray-100 text-gray-700'}
              >
                {productClass.requires_shipping ? 'Oui' : 'Non'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Suivi du stock</span>
              <Badge
                variant={productClass.track_stock ? 'default' : 'secondary'}
                className={productClass.track_stock
                  ? 'bg-[#009ef7] hover:bg-[#0077b6]'
                  : 'bg-gray-100 text-gray-700'}
              >
                {productClass.track_stock ? 'Oui' : 'Non'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nombre d'attributs</span>
              <Badge variant="outline">
                {productClass.attributes?.length || 0}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Informations générales
            </CardTitle>
            <CardDescription>
              Détails du type de produit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Nom du type</span>
              <span className="font-semibold">{productClass.name}</span>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Code</span>
              <code className="rounded border border-[#e1f0ff] bg-[#f1f8ff] px-2 py-1 text-sm text-[#009ef7]">
                {extractProductClassSlugFromUrl(productClass.url)}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attributs */}
      <Card>
        <CardHeader>
          <CardTitle>Attributs définis</CardTitle>
          <CardDescription>
            Liste des attributs spécifiques à ce type de produit
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!productClass.attributes || productClass.attributes.length === 0
            ? (
                <div className="py-8 text-center text-muted-foreground">
                  Aucun attribut défini pour ce type de produit
                </div>
              )
            : (
                <div className="space-y-6">
                  {productClass.attributes.map((attribute, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50/50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{attribute.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-white">
                            {attribute.type}
                          </Badge>
                          {attribute.required && (
                            <Badge variant="destructive">
                              Obligatoire
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Code:</span>
                          {' '}
                          <code className="rounded border border-[#e1f0ff] bg-[#f1f8ff] px-2 py-1 text-[#009ef7]">
                            {attribute.code}
                          </code>
                        </div>

                        {attribute.option_group && attribute.option_group.options && attribute.option_group.options.length > 0 && (
                          <div>
                            <div className="mb-2 text-sm font-medium text-gray-700">
                              Options disponibles (
                              {attribute.option_group.options.length}
                              ):
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(expandedAttributes[attribute.code]
                                ? attribute.option_group.options
                                : attribute.option_group.options.slice(0, 8)
                              ).map((option, optionIndex) => (
                                <Badge
                                  key={optionIndex}
                                  variant="secondary"
                                  className="bg-white text-gray-700 hover:bg-gray-100"
                                >
                                  {option}
                                </Badge>
                              ))}
                            </div>

                            {/* Bouton "Autres..." pour voir toutes les options */}
                            {attribute.option_group.options.length > 8 && (
                              <div className="mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleAttribute(attribute.code)}
                                  className="border-[#009ef7] text-[#009ef7] hover:bg-[#f1f8ff]"
                                >
                                  {expandedAttributes[attribute.code] ? (
                                    <>
                                      <ChevronUp className="mr-2 h-4 w-4" />
                                      <span>Afficher moins d'options</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="mr-2 h-4 w-4" />
                                      <span>Voir toutes les options ({attribute.option_group.options.length})</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {attribute.type === 'text' && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Type:</span>
                            {' '}
                            Champ de texte libre
                          </div>
                        )}

                        {attribute.type === 'integer' && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Type:</span>
                            {' '}
                            Nombre entier
                          </div>
                        )}

                        {attribute.type === 'float' && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Type:</span>
                            {' '}
                            Nombre décimal
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
