import type { UseQueryResult } from '@tanstack/react-query';
import type { ProductClass } from '@/types/ProductClassTypes';
import { useQuery } from '@tanstack/react-query';
import { getProductClassBySlug } from '@/services/ProductTypeService';

export const useProductClassById = (slug: string): UseQueryResult<ProductClass | undefined> => {
  return useQuery({
    queryKey: ['productClass', slug],
    queryFn: () => getProductClassBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
