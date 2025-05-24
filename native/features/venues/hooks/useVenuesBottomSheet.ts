import { VenueQueryKeys } from '@/constants/queryKeys';
import { ContentAPI } from '@/services/api';
import { IVenuesListResponse } from '@/types/venues.interfaces';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface ISearchParams {
  query?: string;
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  category?: string[];
}

export const useVenuesBottomSheet = (params: ISearchParams, enabled: boolean) => {
  const pageSize = params.limit || 10;

  const queryKey = useMemo(
    () => [
      VenueQueryKeys.venuesInfiniteSearchBottomSheet,
      params.query || '',
      params.locationLat,
      params.locationLng,
      params.radius,
      pageSize,
      params.category?.join(','),
    ],
    [params, pageSize],
  );

  return useInfiniteQuery<IVenuesListResponse>({
    queryKey,
    queryFn: ({ pageParam = 0 }) =>
      ContentAPI.searchVenues({
        q: params.query || '',
        latitude: params.locationLat,
        longitude: params.locationLng,
        distance: params.radius,
        limit: pageSize,
        offset: pageParam,
        category: params.category?.join(','),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (lastPage.metadata?.next_page) {
        return Number(lastPageParam) + pageSize;
      }
      return null;
    },
    enabled: enabled && (!!params.locationLat || !!params.query),
    staleTime: 5 * 60 * 1000,
  });
};
