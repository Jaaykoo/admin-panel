// Types pour les devis (Quotes)
import type { z } from 'zod';
import type {
  createQuoteSchema,
  quoteDetailSchema,
  quoteItemSchema,
  quoteListSchema,
  quotesStatsSchema,
  quoteStatusEnum,
  respondToQuoteSchema,
  updateQuoteSchema,
} from '@/schemas/QuoteSchemas';
import type { ProductList } from '@/types/ProductTypes';

// Énumération des statuts de devis
export type QuoteStatus = z.infer<typeof quoteStatusEnum>;

// Types dérivés des schémas Zod
export type QuoteItem = z.infer<typeof quoteItemSchema>;
export type QuoteDetail = z.infer<typeof quoteDetailSchema>;
export type QuoteList = z.infer<typeof quoteListSchema>;
export type CreateQuote = z.infer<typeof createQuoteSchema>;
export type UpdateQuote = z.infer<typeof updateQuoteSchema>;
export type RespondToQuote = z.infer<typeof respondToQuoteSchema>;
export type QuotesStats = z.infer<typeof quotesStatsSchema>;

// Type pour les options de statut (pour les sélecteurs)
export type QuoteStatusOption = {
  value: QuoteStatus;
  label: string;
  color: 'default' | 'success' | 'warning' | 'danger' | 'secondary' | 'blue';
  icon?: string;
  description: string;
};

// Type étendu pour QuoteItem avec product_detail
export type QuoteItemWithDetail = Omit<QuoteItem, 'product'> & {
  id: number;
  quote: number;
  product_detail: ProductList;
  quantity: number;
  unit_price: string;
  rate: string;
  subtotal: string;
};

// Type pour la création d'un item (sans les champs auto-générés)
export type CreateQuoteItem = {
  product: number;
  quantity: number;
  unit_price?: string;
  rate?: string;
};

// Type pour la modification d'un item existant
export type UpdateQuoteItem = {
  id: number;
  unit_price: string;
  rate?: string;
};

// Constantes pour les statuts
export const QUOTE_STATUS_OPTIONS: QuoteStatusOption[] = [
  {
    value: 'DRAFT',
    label: 'Brouillon',
    color: 'default',
    icon: '📝',
    description: 'Devis en cours de rédaction',
  },
  {
    value: 'SUBMITTED',
    label: 'Soumis',
    color: 'blue',
    icon: '📤',
    description: 'En attente de réponse administrateur',
  },
  {
    value: 'RESPONDED',
    label: 'Répondu',
    color: 'warning',
    icon: '💬',
    description: 'Administrateur a répondu avec les prix',
  },
  {
    value: 'ACCEPTED',
    label: 'Accepté',
    color: 'success',
    icon: '✅',
    description: 'Client a accepté le devis',
  },
  {
    value: 'REFUSED',
    label: 'Refusé',
    color: 'danger',
    icon: '❌',
    description: 'Client a refusé le devis',
  },
  {
    value: 'EXPIRED',
    label: 'Expiré',
    color: 'secondary',
    icon: '⏰',
    description: 'Date d\'expiration dépassée',
  },
];

// Helper pour obtenir le label d'un statut
export function getQuoteStatusLabel(status: QuoteStatus): string {
  return QUOTE_STATUS_OPTIONS.find(opt => opt.value === status)?.label ?? status;
}

// Helper pour obtenir la couleur d'un statut
export function getQuoteStatusColor(status: QuoteStatus): QuoteStatusOption['color'] {
  return QUOTE_STATUS_OPTIONS.find(opt => opt.value === status)?.color ?? 'default';
}

// Helper pour obtenir l'icône d'un statut
export function getQuoteStatusIcon(status: QuoteStatus): string {
  return QUOTE_STATUS_OPTIONS.find(opt => opt.value === status)?.icon ?? '📄';
}

// Helper pour obtenir la description d'un statut
export function getQuoteStatusDescription(status: QuoteStatus): string {
  return QUOTE_STATUS_OPTIONS.find(opt => opt.value === status)?.description ?? '';
}

// Workflow des statuts (transitions autorisées)
export const QUOTE_STATUS_WORKFLOW: Record<QuoteStatus, QuoteStatus[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['RESPONDED'],
  RESPONDED: ['ACCEPTED', 'REFUSED'],
  ACCEPTED: [],
  REFUSED: [],
  EXPIRED: [],
};

// Statuts qui empêchent la modification
export const NON_EDITABLE_STATUSES: QuoteStatus[] = ['ACCEPTED', 'REFUSED', 'EXPIRED'];

// Helper pour vérifier si un devis est modifiable
export function isQuoteEditable(status: QuoteStatus): boolean {
  return !NON_EDITABLE_STATUSES.includes(status);
}

// Helper pour vérifier si un devis peut recevoir une réponse
export function canRespondToQuote(status: QuoteStatus): boolean {
  return status === 'SUBMITTED';
}

// Helper pour obtenir les transitions possibles
export function getAvailableStatusTransitions(currentStatus: QuoteStatus): QuoteStatus[] {
  return QUOTE_STATUS_WORKFLOW[currentStatus] || [];
}
