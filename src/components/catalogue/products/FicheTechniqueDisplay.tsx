'use client';

import { ChevronDown, ChevronRight, FileText, Layers } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FicheTechniqueItem {
  name: string;
  value: string | number;
}

interface FicheTechnique {
  titre: string;
  content: FicheTechniqueItem[] | Record<string, string | number>;
}

interface FicheTechniqueDisplayProps {
  ficheTechniques: FicheTechnique[];
  className?: string;
}

/**
 * Composant d'affichage des fiches techniques produit
 * Design moderne avec cartes expansibles et mise en valeur des données
 */
export function FicheTechniqueDisplay({ ficheTechniques, className }: FicheTechniqueDisplayProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set([0])); // Premier élément ouvert par défaut

  if (!ficheTechniques || ficheTechniques.length === 0) {
    return null;
  }

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const normalizeContent = (content: FicheTechniqueItem[] | Record<string, string | number>): FicheTechniqueItem[] => {
    if (Array.isArray(content)) {
      return content;
    }
    return Object.entries(content).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#009ef7] to-[#0077b6] text-white shadow-md">
          <Layers className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Fiches techniques</h3>
          <p className="text-sm text-gray-500">
            {ficheTechniques.length} fiche{ficheTechniques.length > 1 ? 's' : ''} disponible{ficheTechniques.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ficheTechniques.map((fiche, index) => {
          const isExpanded = expandedCards.has(index);
          const contentArray = normalizeContent(fiche.content);

          return (
            <Card
              key={index}
              className={cn(
                'transition-all duration-200 hover:shadow-md cursor-pointer',
                isExpanded && 'ring-2 ring-[#009ef7]/20 shadow-md',
              )}
            >
              <CardHeader
                className="pb-2 cursor-pointer"
                onClick={() => toggleCard(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-medium">
                        {fiche.titre}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {contentArray.length} caractéristique{contentArray.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                  <div className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 transition-transform',
                    isExpanded && 'bg-[#009ef7]/10',
                  )}>
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4 text-[#009ef7]" />
                      : <ChevronRight className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="mt-2 rounded-lg bg-gray-50 p-3">
                    <div className="space-y-0 divide-y divide-gray-200">
                      {contentArray.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className={cn(
                            'flex items-center justify-between py-2.5',
                            itemIndex === 0 && 'pt-0',
                            itemIndex === contentArray.length - 1 && 'pb-0',
                          )}
                        >
                          <span className="text-sm font-medium text-gray-600">
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%]">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default FicheTechniqueDisplay;

