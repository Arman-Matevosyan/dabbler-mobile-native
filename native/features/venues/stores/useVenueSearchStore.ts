import { useState, useCallback } from 'react';

// Location constants
export const ARMENIA_REGION = {
  latitude: 40.179,
  longitude: 44.499,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5,
  radius: 100000,
};

export interface LocationParams {
  locationLat: number;
  locationLng: number;
  radius: number;
}

export interface VenueParams {
  limit: number;
  offset: number;
}

export interface FilterParams {
  query: string;
  category: string[];
}

export const useVenueSearchStore = () => {
  const [venueParams, setVenueParams] = useState<VenueParams>({
    limit: 20,
    offset: 0,
  });

  const [locationParams, setLocationParams] = useState<LocationParams>({
    locationLat: ARMENIA_REGION.latitude,
    locationLng: ARMENIA_REGION.longitude,
    radius: ARMENIA_REGION.radius,
  });

  const [filters, setFilters] = useState<FilterParams>({
    query: '',
    category: [],
  });

  const updateLocation = useCallback(
    (params: LocationParams) => {
      setLocationParams(params);
    },
    []
  );

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => {
      const categories = [...prev.category];
      const index = categories.indexOf(category);
      
      if (index > -1) {
        categories.splice(index, 1);
      } else {
        categories.push(category);
      }
      
      return { ...prev, category: categories };
    });
  }, []);

  const useLocationParams = () => {
    return {
      ...locationParams,
      updateLocation,
    };
  };

  const useVenueFilters = () => {
    return {
      ...filters,
      setQuery,
      setCategory,
    };
  };

  return {
    venueParams,
    locationParams,
    filters,
    updateLocation,
    setQuery,
    setCategory,
    useLocationParams,
    useVenueFilters,
  };
}; 