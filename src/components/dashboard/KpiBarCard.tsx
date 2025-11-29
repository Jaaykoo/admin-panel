'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/utils/formatNumber';

export type KpiBarCardProps = {
  title: string;
  mainValue: number;
  variation: number;
  bars: number[];
  labels?: string[];
  barColor?: string;
};

export function KpiBarCard({
  title,
  bars,
  labels,
  barColor = '#009ef7',
}: KpiBarCardProps) {
  const maxValue = Math.max(...bars, 1); // Minimum de 1 pour éviter division par 0
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>

        {/* Mini Bar Chart */}
        <div className="mt-3">
          <div className="flex h-24 items-end justify-between gap-1">
            {bars.map((value, index) => {
              // Calculer le pourcentage avec minimum de 2% pour visibilité si valeur > 0
              let heightPercentage = (value / maxValue) * 100;
              if (value > 0 && heightPercentage < 3) {
                heightPercentage = 3; // Hauteur minimum visible
              }

              return (
                <div
                  key={index}
                  className="group relative flex-1 cursor-pointer transition-opacity hover:opacity-80"
                >
                  {/* Tooltip au survol */}
                  {value > 0 && (
                    <div className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100" style={{ zIndex: 10 }}>
                      {formatCompactNumber(value)}
                    </div>
                  )}
                  <div
                    className="rounded-t transition-all duration-300"
                    style={{
                      height: `${heightPercentage}%`,
                      backgroundColor: value > 0 ? barColor : '#e5e7eb',
                      minHeight: value > 0 ? '3px' : '0',
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* Ligne de base */}
          <div className="mt-0.5 h-px bg-gray-200" />

          {/* Labels des jours */}
          {labels && labels.length > 0 && (
            <div className="mt-2 flex justify-between gap-1">
              {labels.map((label, index) => (
                <div
                  key={index}
                  className="flex-1 text-center text-xs text-gray-500"
                  style={{ fontSize: '0.65rem' }}
                >
                  {label.slice(0, 3)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
