'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarGroup } from './AvatarGroup';

export type NewCustomersCardProps = {
  title: string;
  value: number;
  avatars: string[];
};

export function NewCustomersCard({ title, value, avatars }: NewCustomersCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup avatars={avatars} maxDisplay={5} size="md" />
          <span className="text-sm text-gray-500">
            {avatars.length}
            {' '}
            nouveaux clients
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

