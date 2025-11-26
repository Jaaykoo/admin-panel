'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts/LineChart';

export type SalesLineChartProps = {
  title: string;
  value: number;
  objectiveMessage: string;
  labels: string[];
  dataset: number[];
};

export function SalesLineChartCard({
  title,
  value,
  objectiveMessage,
  labels,
  dataset,
}: SalesLineChartProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {value.toLocaleString()}
              {' '}
              FCFA
            </div>
            <p className="mt-1 text-sm text-gray-500">{objectiveMessage}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LineChart labels={labels} dataset={dataset} color="#009ef7" height={300} />
      </CardContent>
    </Card>
  );
}

