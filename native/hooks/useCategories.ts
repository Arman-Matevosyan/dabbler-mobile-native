import {ContentQueryKeys} from '@/constants/queryKeys';
import {ContentAPI} from '@/services/api';
import {ICategory} from '@/types/categories.interfaces';
import {useQuery} from '@tanstack/react-query';

export const useCategories = (offset = 0, limit = 50) => {
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ICategory[]>({
    queryKey: [ContentQueryKeys.categories, offset, limit],
    queryFn: async () => {
      try {
        const response = await ContentAPI.getCategories({offset, limit});
        return response || [];
      } catch (error) {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  return {
    categories,
    isLoading,
    error,
    refetch,
  };
};
