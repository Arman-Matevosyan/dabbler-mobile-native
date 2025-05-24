import { useQuery } from '@tanstack/react-query';
import { ContentAPI } from '@/services/api';
import { VenueQueryKeys } from '@/constants/queryKeys';
import { useMemo } from 'react';
import { client } from '@/services/client';

export interface VenueSearchParams {
  locationLat?: number;
  locationLng?: number;
  radius?: number;
  limit?: number;
  offset?: number;
  query?: string;
  category?: string[];
  zoomLevel?: number;
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
    country?: string;
    stateOrProvince?: string;
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    addressLine2?: string;
    landmark?: string;
  };
  covers?: Array<{ url: string; name?: string }>;
  isFavorite?: boolean;
  isInPlan?: boolean;
}

export interface Cluster {
  id: string;
  count: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  venues: Venue[];
}

export interface SearchResult {
  venues: Venue[];
  clusters: Cluster[];
  total: number;
}

interface ApiVenue {
  id: string;
  name: string;
  description?: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address?: {
    city?: string;
    district?: string;
    country?: string;
    stateOrProvince?: string;
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    addressLine2?: string;
    landmark?: string;
  };
  covers?: Array<{ url: string; name?: string }>;
  isFavorite?: boolean;
  isInPlan?: boolean;
}

interface VenueSearchResponse {
  response: ApiVenue[];
  metadata: {
    next_page: string | null;
  };
}

type SearchParams = VenueSearchParams;

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert to meters
};

// Get clustering distance based on zoom level
const getClusteringDistance = (zoomLevel: number = 12): number => {
  // Adjust these values based on your app's needs
  if (zoomLevel >= 16) return 100; // Very close - almost no clustering
  if (zoomLevel >= 14) return 300;
  if (zoomLevel >= 12) return 1000;
  if (zoomLevel >= 10) return 3000;
  if (zoomLevel >= 8) return 10000;
  return 30000; // Very zoomed out - aggressive clustering
};

// Create clusters from venues based on proximity
const createClusters = (
  venues: Venue[],
  zoomLevel: number = 12,
): { venues: Venue[]; clusters: Cluster[] } => {
  if (!venues.length) {
    return { venues: [], clusters: [] };
  }

  const clusteringDistance = getClusteringDistance(zoomLevel);
  const clusteredVenues: { [key: string]: boolean } = {};
  const clusters: Cluster[] = [];

  // First pass: create clusters
  venues.forEach((venue, venueIndex) => {
    // Skip if already in a cluster
    if (clusteredVenues[venue.id]) return;

    const closeVenues: Venue[] = [];

    // Find all venues close to this one
    venues.forEach((otherVenue, otherIndex) => {
      if (venueIndex === otherIndex || clusteredVenues[otherVenue.id]) return;

      const distance = calculateDistance(
        venue.location.latitude,
        venue.location.longitude,
        otherVenue.location.latitude,
        otherVenue.location.longitude,
      );

      if (distance <= clusteringDistance) {
        closeVenues.push(otherVenue);
        clusteredVenues[otherVenue.id] = true;
      }
    });

    // If we found close venues, create a cluster
    if (closeVenues.length > 0) {
      closeVenues.push(venue);
      clusteredVenues[venue.id] = true;

      // Calculate the center of the cluster
      const latSum = closeVenues.reduce((sum, v) => sum + v.location.latitude, 0);
      const lngSum = closeVenues.reduce((sum, v) => sum + v.location.longitude, 0);

      clusters.push({
        id: `cluster-${venueIndex}`,
        count: closeVenues.length,
        coordinate: {
          latitude: latSum / closeVenues.length,
          longitude: lngSum / closeVenues.length,
        },
        venues: closeVenues,
      });
    }
  });

  // Get venues that aren't in clusters
  const unclustered = venues.filter(venue => !clusteredVenues[venue.id]);

  return {
    venues: unclustered,
    clusters,
  };
};

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
      zoom: params.zoomLevel?.toString() || '12',
    }),
    [params],
  );

  const hasLocationParams = Boolean(params.locationLat && params.locationLng && params.radius);

  return useQuery({
    queryKey: [VenueQueryKeys.venuesSearch, serializedParams],
    queryFn: () => fetchVenues(params),
    enabled: isFocused && hasLocationParams,
    retry: 0,
    select: (data: VenueSearchResponse) => {
      const venuesArray = data.response || [];

      // Process venues to the expected format
      const processedVenues: Venue[] = venuesArray.map((venue: ApiVenue) => ({
        id: venue.id,
        name: venue.name,
        description: venue.description,
        location: {
          latitude: venue.location.coordinates[1],
          longitude: venue.location.coordinates[0],
        },
        address: venue.address,
        covers: venue.covers,
        isFavorite: venue.isFavorite,
        isInPlan: venue.isInPlan,
      }));

      // Create clusters based on venue proximity and zoom level
      const { venues, clusters } = createClusters(processedVenues, params.zoomLevel);

      return {
        venues,
        clusters,
        total: venuesArray.length,
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

const fetchVenues = async (params: SearchParams): Promise<VenueSearchResponse> => {
  try {
    let categoryParam = undefined;
    if (params.category && Array.isArray(params.category)) {
      if (params.category.length > 0) {
        categoryParam = params.category.join(',');
      }
    } else if (typeof params.category === 'string' && params.category) {
      categoryParam = params.category;
    }

    const response = await client.get('/content/venues/discover/search', {
      latitude: params.locationLat?.toString(),
      longitude: params.locationLng?.toString(),
      distance: params.radius?.toString(),
      q: params.query || '',
      category: categoryParam?.toString(),
    });

    return response as unknown as VenueSearchResponse;
  } catch (error) {
    throw error;
  }
};
