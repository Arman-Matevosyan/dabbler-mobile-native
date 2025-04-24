import {useTheme} from '@/design-system';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
  lazy,
} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useVenueDetails} from '../../hooks';
import {useFavorites} from '@/hooks/useFavorites';
import {useAuthStore} from '@/stores/authStore';
import {VenueDetailsSkeleton} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  import('./components/VenueMap').then(module => ({default: module.VenueMap})),
);
const VenueActions = lazy(() =>
  import('./components/VenueActions').then(module => ({
    default: module.VenueActions,
  })),
);

const HeaderFallback = () => (
  <View style={{height: 400, backgroundColor: '#eee'}} />
);
const SectionFallback = () => <View style={{height: 200, margin: 16}} />;

export default function VenueDetailsScreen() {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const route = useRoute();
  const router = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {id} = route.params as {id: string};
  const scrollY = useRef(new Animated.Value(0)).current;

  const {data, isLoading, error} = useVenueDetails(id);
  const venueDetails = data as any;
  const {
    favorites,
    toggleFavorite,
    isLoading: favoritesLoading,
  } = useFavorites();
  const {isAuthenticated} = useAuthStore();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImportantInfo, setShowImportantInfo] = useState(false);

  const [isFavoriteState, setIsFavoriteState] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const isCurrentVenueFavorite =
      favorites?.some(fav => fav.id === id) ?? false;
    setIsFavoriteState(isCurrentVenueFavorite);
  }, [favorites, id]);

  const handleToggleFavorite = useCallback(() => {
    if (favoritesLoading) return;

    if (!isAuthenticated) {
      return;
    }

    setIsFavoriteState(prev => !prev);

    toggleFavorite(id)
      .then(() => {})
      .catch(error => {
        setIsFavoriteState(prev => !prev);
      });
  }, [id, toggleFavorite, isFavoriteState, favoritesLoading, isAuthenticated]);

  const toggleDescription = useCallback(() => {
    setShowFullDescription(prev => !prev);
  }, []);

  const toggleImportantInfo = useCallback(() => {
    setShowImportantInfo(prev => !prev);
  }, []);

  const handleNavigateToClasses = useCallback(() => {
    if (venueDetails?.id) {
      router.navigate('VenueClassesList', {id: venueDetails.id});
    }
  }, [router, venueDetails]);

  if (isLoading) {
    return <VenueDetailsSkeleton />;
  }

  if (error || !venueDetails) {
    return (
      <View
        style={[styles.errorContainer, {backgroundColor: colors.background}]}>
        <VenueDetailsSkeleton />
      </View>
    );
  }

  const images =
    venueDetails.covers?.map((img: any) => ({url: img.url || ''})) || [];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: colors.background,
            opacity: headerOpacity,
            borderBottomColor: colors.border,
            paddingTop:
              Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
            height:
              (Platform.OS === 'ios'
                ? insets.top
                : StatusBar.currentHeight || 0) + 60,
            zIndex: 1000,
          },
        ]}>
        <TouchableOpacity
          style={styles.fixedHeaderButton}
          onPress={() => router.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.fixedHeaderTitle, {color: colors.textPrimary}]}>
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

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingTop: 0}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        <Suspense fallback={<HeaderFallback />}>
          <VenueHeader
            name={venueDetails.name || ''}
            images={images}
            onBackPress={() => router.goBack()}
            onFavoritePress={handleToggleFavorite}
            isFavorite={isFavoriteState}
            isLoading={favoritesLoading}
            headerOpacity={headerOpacity}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <VenueDescription
            description={venueDetails.description}
            showFullDescription={showFullDescription}
            toggleDescription={toggleDescription}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <VenueInfo
            address={venueDetails.address}
            openingHours={venueDetails.openingHours}
            contacts={venueDetails.contacts}
            websiteUrl={venueDetails.websiteUrl}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <VenueAmenities categories={venueDetails.categories} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <VenueImportantInfo
            importantInfo={venueDetails.importantInfo}
            showImportantInfo={showImportantInfo}
            toggleImportantInfo={toggleImportantInfo}
          />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <VenuePlans plans={venueDetails.plans} />
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <VenueMap
            location={venueDetails.location}
            name={venueDetails.name}
            address={venueDetails.address}
          />
        </Suspense>

        <View style={{height: 100}} />
      </Animated.ScrollView>

      <Suspense fallback={null}>
        <VenueActions
          onClassesPress={handleNavigateToClasses}
          hasClasses={venueDetails.hasClasses}
          showDirections
          directionsText={t('venues.details.getDirections')}
          classesText={t('venues.details.viewClasses')}
        />
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
});
