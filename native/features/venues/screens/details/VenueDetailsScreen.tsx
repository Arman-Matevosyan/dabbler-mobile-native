import { useTheme, useToast } from '@/design-system';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState, Suspense, lazy } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useVenueDetails } from '../../hooks';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuthStore } from '@/stores/authStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ActivityIndicator } from 'react-native';
import {
  AmenitiesSkeleton,
  DescriptionSkeleton,
  HeaderSkeleton,
  ImportantInfoSkeleton,
  InfoSkeleton,
  MapSectionSkeleton,
  VenuePlansSkeleton,
  VenueNameSkeleton,
} from './components/skeletons';
import { ImageSliderSkeleton } from './components/skeletons';
import { useTranslation } from 'react-i18next';

const VenueHeader = lazy(() =>
  import('./components/VenueHeader').then(module => ({
    default: module.VenueHeader,
  })),
);
const VenueDescription = lazy(() =>
  import('./components/VenueDescription').then(module => ({
    default: module.VenueDescription,
  })),
);
const VenueInfo = lazy(() =>
  import('./components/VenueInfo').then(module => ({
    default: module.VenueInfo,
  })),
);
const VenueAmenities = lazy(() =>
  import('./components/VenueAmenities').then(module => ({
    default: module.VenueAmenities,
  })),
);
const VenueImportantInfo = lazy(() =>
  import('./components/VenueImportantInfo').then(module => ({
    default: module.VenueImportantInfo,
  })),
);
const VenuePlans = lazy(() =>
  import('./components/VenuePlans').then(module => ({
    default: module.VenuePlans,
  })),
);
const VenueMap = lazy(() =>
  import('./components/VenueMap').then(module => ({ default: module.VenueMap })),
);
const VenueActions = lazy(() =>
  import('./components/VenueActions').then(module => ({
    default: module.VenueActions,
  })),
);

export default function VenueDetailsScreen() {
  const { colors } = useTheme();
  const route = useRoute();
  const router = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { id } = route.params as { id: string };
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();

  const { data: venueData, isLoading, error } = useVenueDetails(id);
  const venueDetails = venueData as any;
  const { toggleFavorite, isLoading: favoritesLoading, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuthStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImportantInfo, setShowImportantInfo] = useState(false);
  const { showToast } = useToast();

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const isFavoriteState = isFavorite(id);

  const handleToggleFavorite = useCallback(() => {
    if (favoritesLoading) return;

    if (!isAuthenticated) {
      showToast(t('venues.signInToSaveFavorites'), 'warning', 'top');
      return;
    }

    toggleFavorite(id);
  }, [id, toggleFavorite, favoritesLoading, isAuthenticated]);

  const toggleDescription = useCallback(() => {
    setShowFullDescription(prev => !prev);
  }, []);

  const toggleImportantInfo = useCallback(() => {
    setShowImportantInfo(prev => !prev);
  }, []);

  const handleNavigateToClasses = useCallback(() => {
    if (venueDetails?.id) {
      router.navigate('VenueClassesList', { id: venueDetails.id });
    }
  }, [router, venueDetails]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <HeaderSkeleton />
        <VenueNameSkeleton />
        <DescriptionSkeleton />
        <InfoSkeleton />
        <AmenitiesSkeleton />
        <ImportantInfoSkeleton />
        <VenuePlansSkeleton />
        <MapSectionSkeleton />
      </View>
    );
  }

  if (error || !venueDetails) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <MaterialIcons name="error-outline" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          {error instanceof Error ? error.message : t('venues.couldntLoadVenue')}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.accent }]}
          onPress={() => router.goBack()}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = venueDetails?.covers?.map((img: any) => ({ url: img.url || '' })) || [];

  const venue = {
    id: venueDetails?.id,
    name: venueDetails?.name,
    address: venueDetails?.address,
    openingHours: venueDetails?.openingHours ? venueDetails.openingHours.join(', ') : undefined,
    contacts: {
      phone: venueDetails?.contacts?.[0],
      website: venueDetails?.websiteUrl,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Suspense fallback={<HeaderSkeleton />}>
        <Animated.View
          style={[
            styles.fixedHeader,
            {
              backgroundColor: colors.background,
              opacity: headerOpacity,
              borderBottomColor: colors.border,
              paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
              height: (Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0) + 60,
              zIndex: 1000,
            },
          ]}>
          <TouchableOpacity style={styles.fixedHeaderButton} onPress={() => router.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.fixedHeaderTitle, { color: colors.textPrimary }]}>
            {venueDetails?.name || ''}
          </Text>
          <TouchableOpacity
            style={styles.fixedHeaderButton}
            onPress={handleToggleFavorite}
            disabled={favoritesLoading}
            activeOpacity={0.7}>
            {favoritesLoading ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <MaterialIcons
                name={isFavoriteState ? 'favorite' : 'favorite-border'}
                size={26}
                color={isFavoriteState ? '#FF3B30' : colors.textPrimary}
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </Suspense>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}>
        <Suspense fallback={<ImageSliderSkeleton />}>
          <VenueHeader
            name={venueDetails?.name || ''}
            images={images || []}
            onBackPress={() => router.goBack()}
            onFavoritePress={handleToggleFavorite}
            isFavorite={isFavoriteState}
            isLoading={favoritesLoading}
            headerOpacity={headerOpacity}
          />
        </Suspense>
        <Suspense fallback={<DescriptionSkeleton />}>
          <VenueDescription
            description={venueDetails?.description}
            showFullDescription={showFullDescription}
            toggleDescription={toggleDescription}
          />
        </Suspense>

        <Suspense fallback={<InfoSkeleton />}>
          <VenueInfo venue={venue} />
        </Suspense>

        <Suspense fallback={<AmenitiesSkeleton />}>
          <VenueAmenities categories={venueDetails?.categories} />
        </Suspense>

        <Suspense fallback={<ImportantInfoSkeleton />}>
          <VenueImportantInfo
            importantInfo={venueDetails?.importantInfo}
            showImportantInfo={showImportantInfo}
            toggleImportantInfo={toggleImportantInfo}
          />
        </Suspense>

        <Suspense fallback={<VenuePlansSkeleton />}>
          <VenuePlans plans={venueDetails?.plans} />
        </Suspense>

        <Suspense fallback={<MapSectionSkeleton />}>
          <VenueMap
            location={venueDetails?.location}
            name={venueDetails?.name}
            address={venueDetails?.address}
          />
        </Suspense>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      <Suspense>
        <VenueActions onClassesPress={handleNavigateToClasses} />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  fixedHeaderButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  venueNameContainer: {
    padding: 16,
    paddingTop: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsText: {
    marginLeft: 8,
    fontSize: 14,
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  visitLimitsContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  visitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  visitsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  visitsLimitBadge: {
    backgroundColor: 'rgba(46, 125, 50, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visitsLimitText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 3,
  },
  progressLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
  },
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressText: {
    fontSize: 14,
    marginTop: 8,
  },
  scheduleButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    zIndex: 10,
  },
  scheduleButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  scheduleButton: {
    height: 44,
    width: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
