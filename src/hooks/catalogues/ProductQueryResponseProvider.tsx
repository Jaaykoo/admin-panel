'use client';

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from 'react';
import type { PaginationState } from '@/types/_types';
import type { ProductList } from '@/types/ProductTypes';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers';
import { getProducts } from '@/services/ProductService';
import { initialQueryResponse, initialQueryState } from '@/types/_types';
import { useQueryRequest } from '../_QueryRequestProvider';

const QueryResponseContext = createResponseContext<ProductList>(initialQueryResponse);

const ProductQueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  // eslint-disable-next-line react/prefer-use-state-lazy-initialization
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    [QUERIES.PRODUCTS_LIST, query],
    () => {
      return getProducts(query);
    },
    {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  );

  const contextValue = useMemo(
    () => ({ isLoading: isFetching, refetch, response, query }),
    [isFetching, refetch, response, query],
  );

  return (
    <QueryResponseContext value={contextValue}>
      {children}
    </QueryResponseContext>
  );
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
  const defaultPaginationState: PaginationState<ProductList> = {
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
  ProductQueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
};
