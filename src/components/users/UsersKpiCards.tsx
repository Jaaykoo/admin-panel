'use client';

import { TrendingUp, UserCheck, Users, UserX } from 'lucide-react';
import { Card } from '@/components/ui/card';

export type UsersKpiCardsProps = {
  total?: number;
  active?: number;
  verified?: number;
  inactive?: number;
  isLoading?: boolean;
};

export function UsersKpiCards({
  total = 0,
  active = 0,
  verified = 0,
  inactive = 0,
  isLoading = false,
}: UsersKpiCardsProps) {
  const kpis = [
    {
      title: 'Total Utilisateurs',
      value: total ?? 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Actifs',
      value: active ?? 0,
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Inactifs',
      value: inactive ?? 0,
      icon: UserX,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Vérifiés',
      value: verified ?? 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="mb-3 h-4 w-24 rounded bg-gray-200" />
              <div className="h-8 w-16 rounded bg-gray-200" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {(kpi.value ?? 0).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${kpi.bgColor}`}>
                <Icon className={`h-6 w-6 ${kpi.textColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
