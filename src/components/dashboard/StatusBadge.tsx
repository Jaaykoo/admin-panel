'use client';

import { Badge } from '@/components/ui/badge';

export type StatusBadgeProps = {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
};

const STATUS_VARIANTS: Record<string, { label: string, variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  completed: { label: 'Terminé', variant: 'success' },
  pending: { label: 'En attente', variant: 'warning' },
  cancelled: { label: 'Annulé', variant: 'destructive' },
  processing: { label: 'En cours', variant: 'default' },
  shipped: { label: 'Expédié', variant: 'secondary' },
  delivered: { label: 'Livré', variant: 'success' },
  'in-stock': { label: 'En stock', variant: 'success' },
  'low-stock': { label: 'Stock faible', variant: 'warning' },
  'out-of-stock': { label: 'Rupture', variant: 'destructive' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = STATUS_VARIANTS[status.toLowerCase()] || {
    label: status,
    variant: 'default' as const,
  };

  return (
    <Badge variant={statusConfig.variant} className="capitalize">
      {statusConfig.label}
    </Badge>
  );
}

