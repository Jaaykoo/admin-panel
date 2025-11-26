'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type KpiBarCardProps = {
  title: string;
  mainValue: number;
  variation: number;
  bars: number[];
  barColor?: string;
};

export function KpiBarCard({
  title,
  mainValue,
  variation,
  bars,
  barColor = '#009ef7',
}: KpiBarCardProps) {
  const isPositive = variation >= 0;
  const maxValue = Math.max(...bars);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {/* Valeur principale */}
          <div className="mb-2 text-3xl font-bold text-gray-900">
            {mainValue.toLocaleString()}
          </div>

          {/* Variation */}
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(variation).toFixed(1)}%</span>
          </div>
        </div>

        {/* Mini Bar Chart */}
        <div className="mt-6">
          <div className="flex h-24 items-end justify-between gap-1">
            {bars.map((value, index) => {
              const heightPercentage = (value / maxValue) * 100;
              return (
                <div
                  key={index}
                  className="group relative flex-1 cursor-pointer transition-opacity hover:opacity-80"
                >
                  <div
                    className="rounded-t transition-all duration-300"
                    style={{
                      height: `${heightPercentage}%`,
                      backgroundColor: barColor,
                    }}
                  />
                  {/* Tooltip au survol */}
                  <div className="invisible absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    {value.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Ligne de base */}
          <div className="mt-0.5 h-px bg-gray-200" />
        </div>
      </CardContent>
    </Card>
  );
}

