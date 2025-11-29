'use client';

import type { Period } from '@/utils/aggregateChartData';
import { useMemo, useState } from 'react';
import { LineChart } from '@/components/charts/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aggregateChartData } from '@/utils/aggregateChartData';
import { formatCompactNumber } from '@/utils/formatNumber';

export type SalesLineChartProps = {
  title: string;
  value: number;
  objectiveMessage: string;
  labels: string[];
  dataset: number[];
  onPeriodChange?: (periodDays: number) => void;
};

const PERIOD_OPTIONS = [
  { label: '28 jours', value: '28days' as Period, days: 28 },
  { label: '1 an', value: '1year' as Period, days: 365 },
  { label: 'Années', value: 'years' as Period, days: 365 * 3 }, // 3 ans par défaut
] as const;

export function SalesLineChartCard({
  title,
  value,
  labels,
  dataset,
  onPeriodChange,
}: SalesLineChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('28days');

  // Agréger les données selon la période sélectionnée
  const aggregatedData = useMemo(() => {
    return aggregateChartData(labels, dataset, selectedPeriod);
  }, [labels, dataset, selectedPeriod]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    const option = PERIOD_OPTIONS.find(opt => opt.value === period);
    if (option && onPeriodChange) {
      onPeriodChange(option.days);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {formatCompactNumber(value)}
              {' '}
              FCFA
            </div>
          </div>

          {/* Sélecteur de période */}
          <div className="flex gap-2">
            {PERIOD_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePeriodChange(option.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedPeriod === option.value
                    ? 'bg-[#009ef7] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LineChart
          labels={aggregatedData.labels}
          dataset={aggregatedData.dataset}
          color="#009ef7"
          height={300}
        />
      </CardContent>
    </Card>
  );
}
