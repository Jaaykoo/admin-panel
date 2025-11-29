'use client';

import { useState } from 'react';
import { SalesLineChartCard } from './SalesLineChartCard';

type SalesLineChartWrapperProps = {
  initialData: {
    title: string;
    value: number;
    objectiveMessage: string;
    labels: string[];
    dataset: number[];
  };
};

export function SalesLineChartWrapper({ initialData }: SalesLineChartWrapperProps) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handlePeriodChange = async (periodDays: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/sales-line-chart?period_days=${periodDays}`,
      );
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Erreur lors du changement de période:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={isLoading ? 'pointer-events-none opacity-50' : ''}>
      <SalesLineChartCard
        {...data}
        onPeriodChange={handlePeriodChange}
      />
    </div>
  );
}
