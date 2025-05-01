import { VenueQueryKeys } from '@/constants/queryKeys';
import { ContentAPI } from '@/services/api';
import { IVenuesListResponse } from '@/types/venues.interfaces';
import { useQuery } from '@tanstack/react-query';
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
  const queryKey = useMemo(
    () => [
      VenueQueryKeys.venuesSearchBottomSheet,
      params.query || '',
      params.locationLat,
      params.locationLng,
      params.radius,
      params.limit,
      params.offset,
      params.category?.join(','),
    ],
    [params],
  );

  return useQuery<IVenuesListResponse>({
    queryKey,
    queryFn: () =>
      ContentAPI.searchVenues({
        q: params.query || '',
        latitude: params.locationLat,
        longitude: params.locationLng,
        distance: params.radius,
        limit: params.limit || 20,
        offset: params.offset || 0,
        category: params.category?.join(','),
      }),
    enabled: enabled && (!!params.locationLat || !!params.query),
    select: data => data,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
};
