import React, { useCallback, useMemo, useRef, useState, Suspense, useEffect, lazy } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVenueSearch, SearchResult } from './hooks/useVenueSearch';
import { useUserLocation } from './hooks/useUserLocation';
import { ARMENIA_REGION } from './stores/useVenueSearchStore';
import { Region } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { Venue } from './components/MapComponent';

type Timeout = ReturnType<typeof setTimeout>;

const SearchComponent = lazy(() =>
  import('../../components/SearchWithCategories').then(module => ({
    default: module.SearchWithCategories,
  })),
);

const MapComponent = lazy(() => import('./components/MapComponent'));
const VenueBottomSheet = lazy(() =>
  import('./components').then(module => ({
    default: module.VenueBottomSheet,
  })),
);

import { useLocationParams, useSearchStore, useVenueSearchFilters } from '@/stores/searchStore';
import { useShallow } from 'zustand/react/shallow';
import { useIsFocused } from '@react-navigation/native';
import { BottomSheetSkeleton, MapSkeleton, VenuesScreenSkeleton } from './components/skeletons';
import { SearchSkeleton } from '@/components/skeletons';

export default function VenuesScreen() {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const lastUpdate = useRef<number>(0);
  const regionChangeTimeoutRef = useRef<Timeout | null>(null);
  const initialized = useRef<boolean>(false);
  const insets = useSafeAreaInsets();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const [pendingRegion, setPendingRegion] = useState<{
    region: Region;
    radius: number;
  } | null>(null);

  const venueParams = useSearchStore(useShallow(state => state.venueParams));

  const { locationLat, locationLng, radius, updateLocation } = useLocationParams();

  const { query, category, setQuery, setCategory } = useVenueSearchFilters();

  const { fetchUserLocation } = useUserLocation();

  const searchParams = useMemo(
    () => ({
      locationLat,
      locationLng,
      radius,
      limit: venueParams.limit,
      offset: venueParams.offset,
      query,
      category,
    }),
    [locationLat, locationLng, radius, venueParams.limit, venueParams.offset, query, category],
  );

  useEffect(() => {
    if (!initialized.current && isFocused) {
      initialized.current = true;
      updateLocation({
        locationLat: ARMENIA_REGION.latitude,
        locationLng: ARMENIA_REGION.longitude,
        radius: ARMENIA_REGION.radius,
      });
      fetchUserLocation();
    }
  }, [isFocused, updateLocation, fetchUserLocation]);

  const { data, isLoading, refetch } = useVenueSearch(searchParams, isFocused);

  const handleMapReady = useCallback(() => {
    if (locationLat && locationLng && radius) {
      refetch();
    }
  }, [locationLat, locationLng, radius, refetch]);

  useEffect(() => {
    return () => {
      if (regionChangeTimeoutRef.current) {
        clearTimeout(regionChangeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading && pendingRegion && Date.now() - lastUpdate.current > 1000) {
      updateLocation({
        locationLat: pendingRegion.region.latitude,
        locationLng: pendingRegion.region.longitude,
        radius: Math.round(pendingRegion.radius),
      });
      lastUpdate.current = Date.now();
      setPendingRegion(null);
    }
  }, [isLoading, pendingRegion, updateLocation]);

  const {
    venues = [],
    clusters = [],
    totalVenues = 0,
  } = useMemo(() => {
    if (!data) return { venues: [], clusters: [], totalVenues: 0 };

    const result = data as unknown as SearchResult;

    return {
      venues: result.venues || [],
      clusters: result.clusters || [],
      totalVenues: result.total || 0,
    };
  }, [data]);

  useEffect(() => {
    if (isFocused) {
      fetchUserLocation();
    }
  }, [fetchUserLocation, isFocused]);

  const handleRegionChange = useCallback(
    (region: Region, radius: number) => {
      setPendingRegion({ region, radius });

      if (regionChangeTimeoutRef.current) {
        clearTimeout(regionChangeTimeoutRef.current);
      }

      regionChangeTimeoutRef.current = setTimeout(() => {
        if (Date.now() - lastUpdate.current < 1500) return;

        updateLocation({
          locationLat: region.latitude,
          locationLng: region.longitude,
          radius: Math.round(radius),
        });

        lastUpdate.current = Date.now();
        setPendingRegion(null);
      }, 300);
    },
    [updateLocation],
  );

  const mapVenues = useMemo(() => {
    return venues.map(venue => ({
      id: venue.id,
      name: venue.name,
      description: venue.description || '',
      location: {
        coordinates: [venue.location.longitude, venue.location.latitude],
        type: 'Point',
      },
      address: {
        city: venue.address?.city,
        district: venue.address?.district,
        addressLine2: '',
        country: '',
        houseNumber: '',
        landmark: '',
        postalCode: '',
        stateOrProvince: '',
        street: '',
      },
      covers: venue.covers || [],
      categories: [],
    }));
  }, [venues]);

  const handleVenuePress = useCallback((venue: Venue | null) => {
    setSelectedVenue(venue);
  }, []);

  if (isLoading && venues.length === 0 && !initialized.current) {
    return <VenuesScreenSkeleton />;
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}>
      <Suspense fallback={<SearchSkeleton />}>
        <View style={styles.searchContainer}>
          <SearchComponent
            searchValue={query}
            onSearchChange={setQuery}
            selectedCategories={category || []}
            onCategoryToggle={(categories: string[]) => {
              setCategory(categories);
            }}
            isLoading={isLoading}
            placeholder={t('venues.searchVenues')}
          />
        </View>
      </Suspense>

      <Suspense fallback={<MapSkeleton />}>
        <MapComponent
          venues={mapVenues}
          clusters={clusters}
          onRegionChange={handleRegionChange}
          onMapReady={handleMapReady}
          initialRegion={{
            latitude: locationLat || ARMENIA_REGION.latitude,
            longitude: locationLng || ARMENIA_REGION.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showUserLocation={true}
          selectedVenue={selectedVenue}
          onVenuePress={handleVenuePress}
        />
      </Suspense>

      <Suspense fallback={<BottomSheetSkeleton />}>
        <VenueBottomSheet
          totalVenues={totalVenues}
          searchParams={searchParams}
          isLoading={isLoading}
        />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  searchContainer: {
    left: 0,
    right: 0,
    zIndex: 2,
  },
});
