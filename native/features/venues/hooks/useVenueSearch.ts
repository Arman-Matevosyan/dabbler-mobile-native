import {useQuery} from '@tanstack/react-query';
import {ContentAPI} from '@/services/api';
import {VenueQueryKeys} from '@/constants/queryKeys';
import {MapCluster} from '@/types/venues.interfaces';
import {useMemo} from 'react';
import {client} from '@/services/client';

export interface VenueSearchParams {
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  query?: string;
  category?: string[];
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address?: {
    city?: string;
    district?: string;
  };
  covers?: Array<{url: string}>;
}

export interface Cluster {
  id: string;
  count: number;
  center: {
    latitude: number;
    longitude: number;
  };
}

export interface SearchResult {
  venues: Venue[];
  clusters: Cluster[];
  total: number;
}

interface MapSearchResponse {
  response: {
    clusters: MapCluster[];
    total: number;
  };
}

type SearchParams = VenueSearchParams;

export function useVenueSearch(params: SearchParams, isFocused: boolean) {
  const serializedParams = useMemo(
    () => ({
      q: params.query || '',
      lat: params.locationLat?.toString(),
      lng: params.locationLng?.toString(),
      rad: params.radius?.toString(),
      lim: (params.limit || 100).toString(),
      off: (params.offset || 0).toString(),
      cat: Array.isArray(params.category)
        ? [...params.category].sort().join(',')
        : params.category || '',
    }),
    [params],
  );
  console.log(serializedParams);

  const hasLocationParams = Boolean(
    params.locationLat && params.locationLng && params.radius,
  );

  return useQuery({
    queryKey: [VenueQueryKeys.venuesSearch, serializedParams],
    queryFn: () => fetchVenues(params),
    enabled: isFocused && hasLocationParams,
    retry: 0,
    select: (data: MapSearchResponse) => {
      const clusters = data.response?.clusters || [];
      return {
        clusters: clusters
          .filter(
            (c: MapCluster) =>
              c.count > 1 && c.center?.latitude && c.center?.longitude,
          )
          .map((c: MapCluster) => ({
            ...c,
            id: c.id || `cluster-${c.center.latitude}-${c.center.longitude}`,
          })),
        venues: clusters
          .filter(
            (c: MapCluster) =>
              c.count === 1 &&
              c.venue &&
              Array.isArray(c.venue.location.coordinates),
          )
          .map((c: MapCluster) => ({
            ...c.venue!,
            location: {
              latitude: c.venue!.location.coordinates[1],
              longitude: c.venue!.location.coordinates[0],
            },
          })),
        total: data.response.total || 0,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: previousData => previousData,
  });
}

export const useVenueDetails = (venueId: string) => {
  return useQuery({
    queryKey: [VenueQueryKeys.venueDetails, venueId],
    queryFn: () => ContentAPI.getVenueDetails(venueId),
    enabled: Boolean(venueId),
    staleTime: 1000 * 60 * 10,
  });
};

const fetchVenues = async (
  params: SearchParams,
): Promise<MapSearchResponse> => {
  try {
    let categoryParam = undefined;
    if (params.category && Array.isArray(params.category)) {
      if (params.category.length > 0) {
        categoryParam = params.category.join(',');
      }
    } else if (typeof params.category === 'string' && params.category) {
      categoryParam = params.category;
    }
    console.log(
      {
        latitude: params.locationLat?.toString(),
        longitude: params.locationLng?.toString(),
        distance: params.radius?.toString(),
        limit: params.limit?.toString() || '100',
        offset: params.offset?.toString() || '0',
        q: params.query || '',
        category: categoryParam?.toString(),
      },
      '======PARAM',
    );
    const response = await client.get('/content/venues/discover/map/search', {
      latitude: params.locationLat?.toString(),
      longitude: params.locationLng?.toString(),
      distance: params.radius?.toString(),
      limit: params.limit?.toString() || '100',
      offset: params.offset?.toString() || '0',
      q: params.query || '',
      category: categoryParam?.toString(),
    });

    return response as unknown as MapSearchResponse;
  } catch (error) {
    console.error('Venue search error:', error);
    throw error;
  }
};
