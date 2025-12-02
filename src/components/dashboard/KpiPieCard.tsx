'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/utils/formatNumber';

export type KpiPieCategory = {
  label: string;
  value: number;
  color: string;
};

export type KpiPieCardProps = {
  title: string;
  mainValue: number;
  variation: number;
  categories: KpiPieCategory[];
};

export function KpiPieCard({ title, categories }: KpiPieCardProps) {
  const total = categories.reduce((sum, cat) => sum + cat.value, 0);

  // Calculer les pourcentages et les angles pour le donut chart
  const segments = categories.reduce<Array<{
    label: string;
    value: number;
    color: string;
    percentage: number;
    startAngle: number;
    angle: number;
  }>>((acc, category) => {
    const percentage = (category.value / total) * 100;
    const angle = (category.value / total) * 360;
    const startAngle = acc.length > 0 ? acc[acc.length - 1]!.startAngle + acc[acc.length - 1]!.angle : 0;
    acc.push({
      ...category,
      percentage,
      startAngle,
      angle,
    });

    return acc;
  }, []);

  // Créer le path SVG pour chaque segment
  const createArc = (startAngle: number, angle: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (startAngle + angle - 90) * (Math.PI / 180);
    const largeArc = angle > 180 ? 1 : 0;

    const x1 = 50 + 40 * Math.cos(start);
    const y1 = 50 + 40 * Math.sin(start);
    const x2 = 50 + 40 * Math.cos(end);
    const y2 = 50 + 40 * Math.sin(end);

    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          {/* Mini Donut Chart */}
          <div className="flex h-24 w-24 items-center justify-center">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={createArc(segment.startAngle, segment.angle)}
                  fill={segment.color}
                  className="transition-opacity hover:opacity-80"
                />
              ))}
              {/* Trou central pour effet donut */}
              <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
          </div>
        </div>

        {/* Liste des catégories */}
        <div className="mt-4 space-y-2">
          {categories.map((category, index) => {
            const percentage = ((category.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-600">{category.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {formatCompactNumber(category.value)}
                  </span>
                  <span className="text-gray-400">
                    (
                    {percentage}
                    %)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
