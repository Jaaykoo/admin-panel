import type { AxiosResponse } from 'axios';
import type { ID, PaginationResponse } from '@/types/_types';
import type {
  CreateQuote,
  QuoteDetail,
  QuoteList,
  QuotesStats,
  RespondToQuote,
  UpdateQuote,
} from '@/types/QuoteTypes';
import { api } from '@/libs/api-client';

const QUOTES_URL = `admin/quotes`;
const QUOTES_STATS_URL = `analytics/admin/quotes-stats`;

/**
 * Récupère la liste paginée des devis avec filtres
 */
export const getQuotes = (
  query: string,
): Promise<PaginationResponse<QuoteList>> => {
  return api
    .get<PaginationResponse<QuoteList>>(`${QUOTES_URL}?${query}`)
    .then(res => res as PaginationResponse<QuoteList>);
};

/**
 * Récupère les détails d'un devis spécifique
 */
export const getQuoteById = (id: ID): Promise<QuoteDetail | undefined> => {
  return api.get(`${QUOTES_URL}/${id}/`).then();
};

/**
 * Crée un nouveau devis
 */
export const createQuote = (
  payload: CreateQuote,
): Promise<QuoteDetail | undefined> => {
  return api
    .post(`${QUOTES_URL}/`, payload)
    .then((response: AxiosResponse<QuoteDetail>) => response.data);
};

/**
 * Modifie un devis existant (PATCH)
 */
export const updateQuote = (
  id: ID,
  payload: UpdateQuote,
): Promise<QuoteDetail | undefined> => {
  return api
    .patch(`${QUOTES_URL}/${id}/`, payload)
    .then((response: AxiosResponse<QuoteDetail>) => response.data);
};

/**
 * Répond à un devis soumis avec les prix (endpoint spécial /respond/)
 */
export const respondToQuote = (
  id: ID,
  payload: RespondToQuote,
): Promise<QuoteDetail | undefined> => {
  return api
    .post(`${QUOTES_URL}/${id}/respond/`, payload)
    .then((response: AxiosResponse<QuoteDetail>) => response.data);
};

/**
 * Supprime un devis
 */
export const deleteQuote = (id: ID): Promise<number> => {
  return api.delete(`${QUOTES_URL}/${id}/`).then(res => res.status);
};

/**
 * Supprime plusieurs devis sélectionnés
 */
export const deleteSelectedQuotes = (
  ids: ID[],
): Promise<void> => {
  return Promise.all(ids.map(id => api.delete(`${QUOTES_URL}/${id}/`))).then(
    () => {},
  );
};

/**
 * Récupère les statistiques des devis
 */
export const getQuotesStats = (): Promise<QuotesStats | undefined> => {
  return api
    .get(`${QUOTES_STATS_URL}/`)
    .then((response: AxiosResponse<QuotesStats>) => response.data);
};

