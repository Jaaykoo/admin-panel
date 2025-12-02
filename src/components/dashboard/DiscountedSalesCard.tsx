'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';

export type DiscountedSalesProps = {
  title: string;
  value: number;
  variation: number;
  labels: string[];
  dataset: number[];
};

export function DiscountedSalesCard({
  title,
  value,
  variation,
  labels,
  dataset,
}: DiscountedSalesProps) {
  const isPositive = variation >= 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="mb-2 text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
            {' '}
            FCFA
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive
              ? (
                  <TrendingUp className="h-4 w-4" />
                )
              : (
                  <TrendingDown className="h-4 w-4" />
                )}
            <span>
              {Math.abs(variation).toFixed(1)}
              %
            </span>
          </div>
        </div>

        <div className="mt-6">
          <LineChart labels={labels} dataset={dataset} color="#50cd89" height={200} />
        </div>
      </CardContent>
    </Card>
  );
}

