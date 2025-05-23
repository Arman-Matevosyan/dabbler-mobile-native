import React, { useMemo, Suspense, useEffect, lazy } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVenueSearch, SearchResult } from './hooks/useVenueSearch';
import { useUserLocation } from './hooks/useUserLocation';
import { useTranslation } from 'react-i18next';

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
  const insets = useSafeAreaInsets();

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

  const { data } = useVenueSearch(searchParams, isFocused);
  console.log(data?.response, '======DATA');
  useEffect(() => {
    if (isFocused) {
      fetchUserLocation();
    }
  }, [fetchUserLocation, isFocused]);

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
            isLoading={false}
            placeholder={t('venues.searchVenues')}
          />
        </View>
      </Suspense>

      <Suspense fallback={<MapSkeleton />}></Suspense>

      <Suspense fallback={<BottomSheetSkeleton />}>
        <VenueBottomSheet totalVenues={0} searchParams={searchParams} isLoading={false} />
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
