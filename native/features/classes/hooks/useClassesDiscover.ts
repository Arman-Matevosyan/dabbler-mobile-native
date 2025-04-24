import {ClassQueryKeys} from '@/constants/queryKeys';
import {ContentAPI} from '@/services/api';
import {IDiscoverClassSearchResponse} from '@/types/class.interfaces';
import {useQuery} from '@tanstack/react-query';

export interface DiscoverClassSearchParams {
  q?: string;
  category?: string | string[];
  latitude?: number;
  longitude?: number;
  distance?: number;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

export const useDiscoverClassSearch = (
  params: DiscoverClassSearchParams = {},
) => {
  const formattedParams = {...params};
  
  if (Array.isArray(formattedParams.category)) {
    if (formattedParams.category.length === 0) {
      formattedParams.category = undefined;
    } else {
      formattedParams.category = formattedParams.category.join(',');
    }
  }

  return useQuery<IDiscoverClassSearchResponse>({
    queryKey: [ClassQueryKeys.discoverSearch, params],
    queryFn: () => ContentAPI.discoverClassSearch(formattedParams),
    enabled: Object.keys(params).length > 0,
  });
};
