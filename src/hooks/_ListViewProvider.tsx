/* eslint-disable react/no-unstable-context-value */
import type { FC } from 'react';
import type { ID, ListViewContextProps } from '@/types/_types';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { createContext, use, useMemo, useState } from 'react';
import { calculatedGroupingIsDisabled, calculateIsAllDataSelected, groupingOnSelect, groupingOnSelectAll } from '@/helpers/crud-helper/helpers';
import { initialListView } from '@/types/_types';
import { useQueryResponse, useQueryResponseData } from './user/UserQueryResponseProvider';

const ListViewContext = createContext<ListViewContextProps>(initialListView);

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<ID>>(initialListView.selected);
  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID>(initialListView.itemIdForUpdate);
  const { isLoading } = useQueryResponse();
  const data = useQueryResponseData();
  const disabled = useMemo(() => calculatedGroupingIsDisabled(isLoading, data), [isLoading, data]);
  const isAllSelected = useMemo(() => calculateIsAllDataSelected(data, selected), [data, selected]);

  return (
    <ListViewContext
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        disabled,
        isAllSelected,
        onSelect: (id: ID) => {
          groupingOnSelect(id, selected, setSelected);
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, data);
        },
        clearSelected: () => {
          setSelected([]);
        },
      }}
    >
      {children}
    </ListViewContext>
  );
};

const useListView = () => use(ListViewContext);

// eslint-disable-next-line react-refresh/only-export-components
export { ListViewProvider, useListView };
