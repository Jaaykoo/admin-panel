'use client';

/* eslint-disable react/no-unstable-context-value */
/* eslint-disable react-refresh/only-export-components */
import type { FC } from 'react';
import type { QueryRequestContextProps, QueryState } from '@/types/_types';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { createContext, use, useState } from 'react';
import { initialQueryRequest } from '@/types/_types';

const QueryRequestContext = createContext<QueryRequestContextProps>(initialQueryRequest);

const QueryRequestProvider: FC<WithChildren> = ({ children }) => {
  const [state, setState] = useState<QueryState>(initialQueryRequest.state);

  const updateState = (updates: Partial<QueryState>) => {
    const updatedState = { ...state, ...updates } as QueryState;
    setState(updatedState);
  };

  return (
    <QueryRequestContext value={{ state, updateState }}>
      {children}
    </QueryRequestContext>
  );
};

const useQueryRequest = () => use(QueryRequestContext);

export { QueryRequestProvider, useQueryRequest };
