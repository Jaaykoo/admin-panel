'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export type OrdersThisMonthProps = {
  title: string;
  value: number;
  variation: number;
  goal: {
    current: number;
    target: number;
  };
};

export function OrdersThisMonthCard({ title, value, variation, goal }: OrdersThisMonthProps) {
  const isPositive = variation >= 0;
  const progressPercentage = (goal.current / goal.target) * 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="mb-2 text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
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

        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-semibold text-gray-900">
              {goal.current.toLocaleString()}
              {' '}
              /
              {' '}
              {goal.target.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

