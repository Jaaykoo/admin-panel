import type { QuoteStatus } from '@/types/QuoteTypes';
import { Badge } from '@/components/ui/badge';
import {
  getQuoteStatusColor,
  getQuoteStatusIcon,
  getQuoteStatusLabel,
} from '@/types/QuoteTypes';

interface QuoteStatusBadgeProps {
  status: QuoteStatus;
  className?: string;
}

export function QuoteStatusBadge({ status, className }: QuoteStatusBadgeProps) {
  const label = getQuoteStatusLabel(status);
  const icon = getQuoteStatusIcon(status);
  const color = getQuoteStatusColor(status);

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 hover:bg-red-200',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  };

  return (
    <Badge className={`${variantClasses[color]} ${className || ''}`}>
      <span className="mr-1">{icon}</span>
      {label}
    </Badge>
  );
}

