# 🔧 Guide de Migration - Appliquer le Pattern à d'autres Modules

Ce guide explique comment refactoriser d'autres modules (Users, Customers, Devis, Invoices) en suivant le même pattern que Orders.

---

## 📋 Checklist de Migration

### Étape 1 : Créer le QueryResponseProvider

**Fichier** : `src/hooks/<module>/<Module>QueryResponseProvider.tsx`

```typescript
'use client';

/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import type { FC } from 'react';
import type { PaginationState } from '@/types/_types';
import type { <ModuleType> } from '@/types/<Module>Types';
import type { WithChildren } from '@/utils/react18MigrationHelpers';
import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useMemo, useState } from 'react';
import { QUERIES } from '@/helpers/crud-helper/Consts';
import { createResponseContext, stringifyRequestQuery } from '@/helpers/crud-helper/helpers';
import { get<Module>s } from '@/services/<Module>Service';
import { initialQueryResponse, initialQueryState } from '@/types/_types';
import { useQueryRequest } from '../_QueryRequestProvider';

const QueryResponseContext = createResponseContext<<ModuleType>>(initialQueryResponse);

const <Module>QueryResponseProvider: FC<WithChildren> = ({ children }) => {
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
  } = useQuery(
    [QUERIES.<MODULE>_LIST, query],
    () => {
      return get<Module>s(query);
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
  if ('results' in response && Array.isArray(response.results)) {
    return response.results;
  }
  if ('data' in response && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState<<ModuleType>> = {
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
  <Module>QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
};
```

**Remplacer** :
- `<Module>` → Nom du module (User, Customer, Devis, Invoice)
- `<ModuleType>` → Type TypeScript (User, Customer, Devis, Invoice)
- `<module>` → nom en minuscules (user, customer, devis, invoice)
- `<MODULE>` → nom en majuscules (USER, CUSTOMER, DEVIS, INVOICE)

---

### Étape 2 : Ajouter les Constantes

**Fichier** : `src/helpers/crud-helper/Consts.ts`

```typescript
const QUERIES = {
  // ...existing
  <MODULE>S_LIST: '<module>s-list',
  <MODULE>_DETAIL: '<module>-detail',
};
```

**Exemple** :
```typescript
USERS_LIST: 'users-list',
USER_DETAIL: 'user-detail',
```

---

### Étape 3 : Refactoriser le Service

**Fichier** : `src/services/<Module>Service.ts`

**Ajouter** :

```typescript
// GET - Liste avec query string (pour provider)
export const get<Module>s = (
  query: string,
): Promise<PaginationResponse<<ModuleType>>> => {
  return api
    .get<PaginationResponse<<ModuleType>>>(`${<MODULE>_URL}?${query}`)
    .then(res => res as PaginationResponse<<ModuleType>>);
};

// GET - Liste avec filtres (pour compatibilité)
export function get<Module>sWithFilters(filters?: <Module>Filters): Promise<PaginationResponse<<ModuleType>>> {
  const params = new URLSearchParams();

  if (filters) {
    // Ajouter les filtres ici
    if (filters.search) {
      params.append('search', filters.search);
    }
    // ... autres filtres
  }

  const queryString = params.toString();
  return api.get(`${<MODULE>_URL}${queryString ? `?${queryString}` : ''}`);
}

// DELETE - Supprimer plusieurs (pour actions en masse)
export const deleteSelected<Module>s = (
  ids: ID[],
): Promise<void> => {
  return Promise.all(ids.map(id => api.delete(`${<MODULE>_URL}${id}/`))).then(
    () => {},
  );
};
```

---

### Étape 4 : Créer le Layout

**Fichier** : `src/app/<path>/<module>s/layout.tsx`

```typescript
'use client';

import type { FC, ReactNode } from 'react';
import { QueryRequestProvider } from '@/hooks/_QueryRequestProvider';
import { <Module>QueryResponseProvider } from '@/hooks/<module>/<Module>QueryResponseProvider';

type <Module>sLayoutProps = {
  children: ReactNode;
};

const <Module>sLayout: FC<<Module>sLayoutProps> = ({ children }) => {
  return (
    <QueryRequestProvider>
      <<Module>QueryResponseProvider>
        {children}
      </<Module>QueryResponseProvider>
    </QueryRequestProvider>
  );
};

export default <Module>sLayout;
```

**Exemple** :
```typescript
// src/app/users/layout.tsx
const UsersLayout: FC<UsersLayoutProps> = ({ children }) => {
  return (
    <QueryRequestProvider>
      <UserQueryResponseProvider>
        {children}
      </UserQueryResponseProvider>
    </QueryRequestProvider>
  );
};
```

---

### Étape 5 : Refactoriser la Page

**Fichier** : `src/app/<path>/<module>s/page.tsx`

**Remplacer** :

```typescript
// AVANT
const { data, isLoading } = use<Module>s({ search, filters, limit, offset })

// APRÈS
import { useQueryRequest } from '@/hooks/_QueryRequestProvider'
import {
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '@/hooks/<module>/<Module>QueryResponseProvider'

const { state, updateState } = useQueryRequest()
const items = useQueryResponseData()
const isLoading = useQueryResponseLoading()
const paginationData = useQueryResponsePagination()
const { refetch } = useQueryResponse()
```

**Ajouter la recherche avec debouncing** :

```typescript
const [searchQuery, setSearchQuery] = useState('')

// Recherche en temps réel avec debounce
useEffect(() => {
  const timeoutId = setTimeout(() => {
    updateState({ search: searchQuery, offset: 0 })
  }, 300)

  return () => clearTimeout(timeoutId)
}, [searchQuery])
```

**Ajouter les filtres** :

```typescript
const handleStatusFilterChange = (value: string) => {
  setStatusFilter(value)
  const currentFilter = state.filter || {}

  if (value === 'all') {
    const { status, ...restFilter } = currentFilter as any
    updateState({ filter: restFilter, offset: 0 })
  } else {
    updateState({
      filter: {
        ...currentFilter,
        status: value,
      },
      offset: 0,
    })
  }
}
```

---

### Étape 6 : Refactoriser le Tableau

**Fichier** : `src/components/<module>/<Module>Table.tsx`

**Remplacer** :

```typescript
// AVANT
import { use<Module>s } from '@/hooks/use<Module>s'

const [searchTerm, setSearchTerm] = useState('')
const [currentPage, setCurrentPage] = useState(1)

const { data, isLoading } = use<Module>s({
  search: searchTerm,
  limit: 10,
  offset: (currentPage - 1) * 10,
})

// APRÈS
import { useQueryRequest } from '@/hooks/_QueryRequestProvider'
import {
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
} from '@/hooks/<module>/<Module>QueryResponseProvider'

const { state, updateState } = useQueryRequest()
const items = useQueryResponseData()
const isLoading = useQueryResponseLoading()
const paginationData = useQueryResponsePagination()
const { refetch } = useQueryResponse()

const totalCount = paginationData.count || 0
const totalPages = Math.ceil(totalCount / (state.limit || 10))
const currentPage = Math.floor((state.offset || 0) / (state.limit || 10)) + 1
```

**Supprimer les filtres intégrés** (déplacer vers la page)

**Mettre à jour la pagination** :

```typescript
const handlePageChange = (page: number) => {
  const newOffset = (page - 1) * (state.limit || 10)
  updateState({ offset: newOffset })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
```

---

## 🎯 Exemple Complet : Module Users

### 1. Provider
`src/hooks/user/UserQueryResponseProvider.tsx`

```typescript
import type { User } from '@/types/UserTypes';
import { getUsers } from '@/services/UsersService';

const QueryResponseContext = createResponseContext<User>(initialQueryResponse);

const UserQueryResponseProvider: FC<WithChildren> = ({ children }) => {
  // ... même code que Orders
  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    [QUERIES.USERS_LIST, query],
    () => {
      return getUsers(query);
    },
    // ...
  );
  // ...
};

export {
  UserQueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponseLoading,
  useQueryResponsePagination,
};
```

### 2. Service
`src/services/UsersService.ts`

```typescript
// Nouvelle méthode
export const getUsers = (
  query: string,
): Promise<PaginationResponse<User>> => {
  return api
    .get<PaginationResponse<User>>(`${USERS_URL}?${query}`)
    .then(res => res as PaginationResponse<User>);
};

// Legacy (renommer l'ancienne)
export function getUsersWithFilters(filters?: UserFilters): Promise<PaginationResponse<User>> {
  // ... code existant
}
```

### 3. Layout
`src/app/users/layout.tsx`

```typescript
const UsersLayout: FC<UsersLayoutProps> = ({ children }) => {
  return (
    <QueryRequestProvider>
      <UserQueryResponseProvider>
        {children}
      </UserQueryResponseProvider>
    </QueryRequestProvider>
  );
};
```

### 4. Page
`src/app/users/page.tsx`

```typescript
export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { state, updateState } = useQueryRequest()
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateState({ search: searchQuery, offset: 0 })
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery])
  
  return (
    // ... UI avec filtres
  )
}
```

### 5. Table
`src/components/users/UsersTable.tsx`

```typescript
export function UsersTable() {
  const { state, updateState } = useQueryRequest()
  const users = useQueryResponseData()
  const isLoading = useQueryResponseLoading()
  
  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (state.limit || 10)
    updateState({ offset: newOffset })
  }
  
  return (
    // ... UI du tableau
  )
}
```

---

## ✅ Checklist par Module

### Module Users
- [ ] Créer `UserQueryResponseProvider.tsx`
- [ ] Ajouter `USERS_LIST` dans `Consts.ts`
- [ ] Refactoriser `UsersService.ts`
- [ ] Créer `users/layout.tsx`
- [ ] Refactoriser `users/page.tsx`
- [ ] Refactoriser `UsersTable.tsx`
- [ ] Tester fonctionnalités
- [ ] Documenter

### Module Customers
- [ ] Créer `CustomerQueryResponseProvider.tsx`
- [ ] Ajouter `CUSTOMERS_LIST` dans `Consts.ts`
- [ ] Refactoriser `CustomersService.ts`
- [ ] Créer `customers/layout.tsx`
- [ ] Refactoriser `customers/page.tsx`
- [ ] Refactoriser `CustomersTable.tsx`
- [ ] Tester fonctionnalités
- [ ] Documenter

### Module Devis
- [ ] Créer `DevisQueryResponseProvider.tsx`
- [ ] Ajouter `DEVIS_LIST` dans `Consts.ts`
- [ ] Créer `DevisService.ts`
- [ ] Créer `devis/layout.tsx`
- [ ] Créer `devis/page.tsx`
- [ ] Créer `DevisTable.tsx`
- [ ] Tester fonctionnalités
- [ ] Documenter

### Module Invoices
- [ ] Créer `InvoiceQueryResponseProvider.tsx`
- [ ] Ajouter `INVOICES_LIST` dans `Consts.ts`
- [ ] Créer `InvoiceService.ts`
- [ ] Créer `invoices/layout.tsx`
- [ ] Créer `invoices/page.tsx`
- [ ] Créer `InvoicesTable.tsx`
- [ ] Tester fonctionnalités
- [ ] Documenter

---

## 🔍 Points d'Attention

### 1. Types TypeScript
Assurez-vous d'avoir :
- Type pour l'entité (ex: `User`, `Customer`)
- Type pour les filtres (ex: `UserFilters`)
- Type exporté dans `<Module>Types.ts`

### 2. Service API
Vérifiez :
- L'URL de base est correcte
- Les paramètres de pagination sont supportés
- Le format de réponse est DRF (count, next, previous, results)

### 3. Constantes
N'oubliez pas :
- Ajouter dans `QUERIES`
- Utiliser la bonne clé dans le provider
- Exporter depuis `Consts.ts`

### 4. Layout
Assurez-vous :
- Le layout est au bon niveau (ex: `/users/layout.tsx`)
- Les providers sont dans le bon ordre
- Le type est `type` et non `interface`

### 5. Hooks Legacy
Conservez :
- Les hooks existants pour compatibilité
- Renommez juste la méthode du service en `get<Module>sWithFilters`

---

## 🎓 Ressources

### Fichiers de Référence
- `src/hooks/orders/OrderQueryResponseProvider.tsx`
- `src/hooks/catalogues/CategoryQueryResponseProvider.tsx`
- `src/app/sales/orders/layout.tsx`
- `src/app/catalog/categories/page.tsx`

### Documentation
- `ORDERS_REFACTORING_ARCHITECTURE.md`
- `ORDERS_REFACTORING_CHECKLIST.md`

---

## 📝 Template de Commit

```bash
git commit -m "refactor(<module>): implement QueryResponseProvider architecture

- Add <Module>QueryResponseProvider for centralized query management
- Create <module>s layout with QueryRequestProvider wrapper
- Refactor <Module>sTable to use provider hooks
- Update <Module>Service with query string support
- Add search with debouncing and filters
- Maintain backward compatibility with use<Module>s hook
- Follow same pattern as Catalogue and Orders modules

Closes #<issue-number>
"
```

---

**Temps estimé par module** : 2-3 heures  
**Difficulté** : Moyenne  
**Bénéfices** : Architecture cohérente, performance, maintenabilité

Bonne chance ! 🚀

