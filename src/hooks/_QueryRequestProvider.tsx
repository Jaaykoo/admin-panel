'use client';

/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react';
import type { QueryRequestContextProps, QueryState } from '@/types/_types';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { createContext, use, useCallback, useMemo, useState } from 'react';
import { initialQueryRequest } from '@/types/_types';

const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest);

const QueryRequestProvider: FC<WithChildren> = ({ children }) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state);

  const updateState = useCallback((updates: Partial<QueryState>) => {
    setState(prevState => ({ ...prevState, ...updates } as QueryState));
  }, []);

  const contextValue = useMemo(() => ({ state, updateState }), [state, updateState]);

  return (
    <QueryRequestContext value={contextValue}>
      {children}
    </QueryRequestContext>
  );
};

const useQueryRequest = () => use(QueryRequestContext);

const useQueryRequestLoading = (): boolean => {
  // This is a simple implementation - in practice, the loading state
  // is better managed by the QueryResponse provider
  return false;
};

export { QueryRequestProvider, useQueryRequest, useQueryRequestLoading };
