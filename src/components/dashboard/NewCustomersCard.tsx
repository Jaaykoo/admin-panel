'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCompactNumber } from '@/utils/formatNumber';

export type CustomerRole = {
  label: string;
  value: number;
};

export type NewCustomersCardProps = {
  title: string;
  value: number;
  roles: CustomerRole[];
};

export function NewCustomersCard({ title, value, roles }: NewCustomersCardProps) {
  const total = roles.reduce((sum, role) => sum + role.value, 0);
  const maxValue = Math.max(...roles.map(r => r.value), 1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900">
            {formatCompactNumber(value)}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Total des nouveaux clients
          </div>
        </div>

        {/* Mini Bar Chart pour les rôles */}
        <div className="space-y-3">
          {roles.map((role, index) => {
            const percentage = total > 0 ? (role.value / maxValue) * 100 : 0;
            const widthPercentage = Math.max(percentage, 5); // Minimum 5% pour visibilité

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{role.label}</span>
                  <span className="text-gray-900 font-semibold">
                    {formatCompactNumber(role.value)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${widthPercentage}%`,
                      backgroundColor: index === 0 ? '#009ef7' : '#50cd89',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

