'use client';

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from 'react';
import type { PaginationState } from '@/types/_types';
import type { QuoteList } from '@/types/QuoteTypes';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers';
import { getQuotes } from '@/services/QuoteService';
import { initialQueryResponse, initialQueryState } from '@/types/_types';
import { useQueryRequest } from '../_QueryRequestProvider';

const QueryResponseContext = createResponseContext<QuoteList>(initialQueryResponse);

const QuoteQueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery({
    queryKey: [QUERIES.QUOTES_LIST, query],
    queryFn: () => {
      return getQuotes(query);
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const contextValue = useMemo(
    () => ({ isLoading: isFetching, refetch, response, query }),
    [isFetching, refetch, response, query],
  );

  return <QueryResponseContext value={contextValue}>{children}</QueryResponseContext>;
};

const useQueryResponse = () => use(QueryResponseContext);

const useQueryResponseData = () => {
  const { response } = useQueryResponse();
  if (!response) {
    return [];
  }
  // Si response a results (DRF paginé), retourne-les
  if ('results' in response && Array.isArray(response.results)) {
    return response.results;
  }
  // Sinon, si response a data (réponse simple), retourne-la
  if ('data' in response && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState<QuoteList> = {
    ...initialQueryState,
    filter: {},
  };

  const { response } = useQueryResponse();

  if (!response || !('results' in response)) {
    return defaultPaginationState;
  }

  return response;
};

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse();
  return isLoading;
};

export {
  QuoteQueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
};
