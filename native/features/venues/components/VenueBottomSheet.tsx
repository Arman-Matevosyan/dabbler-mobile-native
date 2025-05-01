import { IVenue } from '@/types/class.interfaces';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VenuesStackParamList } from '@/navigation/types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  Dimensions,
} from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import { useVenuesBottomSheet } from '../hooks';
import { useAuthStore } from '@/stores/authStore';
import { useFavorites } from '@/hooks/useFavorites';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { height: screenHeight } = Dimensions.get('window');
const MAX_SHEET_HEIGHT_PERCENTAGE = 90;

interface ExtendedVenue extends IVenue {
  id: string;
  name: string;
  description?: string;
  location: {
    coordinates?: number[];
    type?: string;
    latitude?: number;
    longitude?: number;
  };
  address?: {
    city?: string;
    district?: string;
    addressLine2?: string;
    country?: string;
    houseNumber?: string;
    landmark?: string;
    postalCode?: string;
    stateOrProvince?: string;
    street?: string;
  };
  isInPlan?: boolean;
  isFavorite?: boolean;
  covers?: Array<{ url: string }>;
  categories?: Array<{ name: string }> | string[];
}

interface VenueBottomSheetProps {
  totalVenues: number;
  searchParams?: any;
  isLoading: boolean;
}

interface BottomSheetContentProps {
  searchParams: any;
  onVenuePress: (venue: ExtendedVenue) => void;
  colors: any;
  goToIndex: (index: number) => void;
  isExpanded: boolean;
  updateLoadingState: (loading: boolean) => void;
}

interface FavoriteButtonProps {
  venue: ExtendedVenue;
}

const FavoriteButton = React.memo(({ venue }: FavoriteButtonProps) => {
  const { toggleFavorite, isLoading, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  const handlePress = () => {
    if (!isAuthenticated) {
      // If you have a toast or tooltip system, you could use it here
      // showTooltip(t('venues.signInToSaveFavorites'));
      return;
    }
    toggleFavorite(venue.id);
  };

  return (
    <TouchableOpacity
      style={[styles.favoriteButton]}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.6}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#FF3B30" />
      ) : (
        <MaterialIcons
          name={venue.isFavorite || isFavorite(venue.id) ? 'favorite' : 'favorite-border'}
          size={20}
          color={venue.isFavorite || isFavorite(venue.id) ? '#FF3B30' : 'white'}
        />
      )}
    </TouchableOpacity>
  );
});

const VenueCard = React.memo(
  ({ item, onPress }: { item: ExtendedVenue; onPress?: (venue: ExtendedVenue) => void }) => {
    const { colors } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<VenuesStackParamList>>();
    const { t } = useTranslation();
    const [imageError, setImageError] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const hasImage = item.covers && item.covers.length > 0 && item.covers[0]?.url;
    const imageUrl = hasImage ? item.covers?.[0].url : undefined;

    const locationText = useMemo(() => {
      if (item.address) {
        if (item.address.district && item.address.city) {
          return `${item.address.district}, ${item.address.city}`;
        }
        if (item.address.city) {
          return item.address.city;
        }
      }
      return '';
    }, [item.address]);

    const handlePress = useCallback(() => {
      if (onPress) {
        onPress(item);
      } else {
        navigation.navigate('VenueDetails', { id: item.id });
      }
    }, [item, onPress, navigation]);

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    const toggleExpand = useCallback(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(prev => !prev);
    }, []);

    return (
      <TouchableOpacity style={styles.cardContainer} onPress={handlePress} activeOpacity={0.8}>
        <View style={styles.venueCard}>
          <View style={styles.leftContainer}>
            {hasImage && !imageError ? (
              <Image
                source={{ uri: imageUrl }}
                style={[styles.venueImage, { borderRadius: 0 }]}
                resizeMode="cover"
                onError={handleImageError}
              />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: colors.border }]}>
                <MaterialIcons name="image" size={40} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.favoriteButtonContainer}>
              <FavoriteButton venue={item} />
            </View>
          </View>

          <View style={styles.venueDetails}>
            <Text style={[styles.venueName, { color: colors.textPrimary }]} numberOfLines={1}>
              {item.name || 'Venue'}
            </Text>
            {locationText ? (
              <Text
                style={[styles.venueLocation, { color: colors.textSecondary }]}
                numberOfLines={1}>
                {locationText}
              </Text>
            ) : null}
            {item.description ? (
              <>
                <Text
                  style={[styles.venueDescription, { color: colors.textSecondary }]}
                  numberOfLines={expanded ? undefined : 2}>
                  {expanded
                    ? item.description
                    : item.description.length > 100
                      ? `${item.description.substring(0, 100)}...`
                      : item.description}
                </Text>
                {item.description.length > 100 && (
                  <TouchableOpacity
                    onPress={toggleExpand}
                    style={styles.expandButton}
                    activeOpacity={0.7}>
                    <Text style={[styles.expandButtonText, { color: colors.accent }]}>
                      {expanded ? t('venues.readLess') : t('venues.readMore')}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

export interface VenueBottomSheetRef {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}

export const VenueBottomSheet = React.memo(
  ({ totalVenues, searchParams, isLoading: externalIsLoading }: VenueBottomSheetProps) => {
    const { colors } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['7.5%', '50%', '80%'], []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const isExpanded = currentIndex > 0;
    const { t } = useTranslation();
    const navigation = useNavigation<NativeStackNavigationProp<VenuesStackParamList>>();

    const [isDataLoading, setIsDataLoading] = useState(false);

    const isInitialRenderRef = useRef(true);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (isInitialRenderRef.current || !isDataLoading) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setCurrentIndex(index);
          if (isInitialRenderRef.current) {
            isInitialRenderRef.current = false;
          }
        }
      },
      [isDataLoading],
    );

    const updateLoadingState = useCallback((loading: boolean) => {
      setIsDataLoading(loading);
    }, []);

    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (isExpanded) {
            bottomSheetRef.current?.snapToIndex(0);
            return true;
          }
          return false;
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => subscription.remove();
      }, [isExpanded]),
    );

    const memoizedSearchParams = useMemo(() => searchParams, [JSON.stringify(searchParams)]);

    const handleVenuePress = useCallback(
      (venue: ExtendedVenue) => {
        navigation.navigate('VenueDetails', { id: venue.id });
      },
      [navigation],
    );

    const renderHeader = useMemo(
      () => () => (
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 1.5,
              elevation: 2,
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={styles.headerContent}>
            {externalIsLoading ? (
              <Skeleton style={styles.headerText} />
            ) : (
              <Text style={[styles.headerText, { color: colors.textPrimary }]}>
                {totalVenues} {t('venues.venues')}
              </Text>
            )}
          </View>
        </View>
      ),
      [totalVenues, colors, externalIsLoading, t],
    );

    const renderContent = useMemo(
      () => () => (
        <BottomSheetView style={{ flex: 1, backgroundColor: colors.background }}>
          <BottomSheetContent
            searchParams={memoizedSearchParams}
            onVenuePress={handleVenuePress}
            colors={colors}
            goToIndex={(index: number) => bottomSheetRef.current?.snapToIndex(index)}
            isExpanded={isExpanded}
            updateLoadingState={updateLoadingState}
          />
        </BottomSheetView>
      ),
      [colors, handleVenuePress, memoizedSearchParams, isExpanded, updateLoadingState],
    );

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={renderHeader}
        backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: colors.background }]}
        handleIndicatorStyle={{ display: 'none' }}
        handleStyle={{
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        style={styles.sheetContainer}
        onChange={handleSheetChange}
        enablePanDownToClose={false}
        enableOverDrag={false}
        enableDynamicSizing={true}
        maxDynamicContentSize={(screenHeight * MAX_SHEET_HEIGHT_PERCENTAGE) / 100}
        animateOnMount={false}
        index={0}
        bottomInset={0}
        topInset={0}>
        {renderContent()}
      </BottomSheet>
    );
  },
);

const BottomSheetContent = React.memo(
  ({
    searchParams,
    onVenuePress,
    colors,
    goToIndex,
    isExpanded,
    updateLoadingState,
  }: BottomSheetContentProps) => {
    const isFocused = useIsFocused();

    const enabled = useMemo(() => isExpanded && isFocused, [isExpanded, isFocused]);
    const { data, isLoading, refetch } = useVenuesBottomSheet(searchParams, enabled);
    const { t } = useTranslation();

    useEffect(() => {
      if (enabled) {
        refetch();
      }
    }, [enabled, refetch]);

    useEffect(() => {
      updateLoadingState(isLoading);
    }, [isLoading, updateLoadingState]);

    const processedVenues = useMemo(() => {
      if (!data) return [];

      let venuesArray: any[] = [];

      if (Array.isArray(data)) {
        venuesArray = data;
      } else if (data && typeof data === 'object') {
        if ((data as any).venues && Array.isArray((data as any).venues)) {
          venuesArray = (data as any).venues;
        } else if ((data as any).response && Array.isArray((data as any).response)) {
          venuesArray = (data as any).response;
        }
      }

      return venuesArray.map((venue: any) => {
        return {
          id: venue.id || `venue-${Math.random()}`,
          name: venue.name || 'Unknown Venue',
          description: venue.description || '',
          location: venue.location || {},
          address: venue.address || {},
          covers: venue.covers || [],
          isFavorite: venue.isFavorite || false,
          categories: venue.categories || [],
        };
      });
    }, [data]);

    const skeletonVenues = useMemo(() => {
      return Array.from({ length: 6 }, (_, index) => ({
        id: `skeleton-${index}`,
        name: 'Loading...',
        description: 'Loading venue details...',
        location: {},
        address: {},
        covers: [],
        isFavorite: false,
        categories: [],
      }));
    }, []);

    if (!isExpanded) {
      return (
        <BottomSheetView style={{ flex: 1 }}>
          <BottomSheetScrollView
            contentContainerStyle={[
              styles.contentContainer,
              { backgroundColor: colors.background },
            ]}>
            <View style={{ height: 1 }} />
          </BottomSheetScrollView>
        </BottomSheetView>
      );
    }

    return (
      <BottomSheetView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }}>
          {isLoading ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                backgroundColor: colors.background,
              }}>
              {skeletonVenues.map(item => (
                <TouchableOpacity key={item.id} style={styles.cardContainer} activeOpacity={1}>
                  <View style={styles.venueCard}>
                    <View style={styles.leftContainer}>
                      <Skeleton style={{ width: 110, height: '100%' }} />
                    </View>
                    <View style={styles.venueDetails}>
                      <Skeleton style={{ height: 20, width: '70%', marginBottom: 8 }} />
                      <Skeleton style={{ height: 16, width: '50%', marginBottom: 8 }} />
                      <Skeleton style={{ height: 16, width: '80%' }} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </BottomSheetScrollView>
          ) : (
            <BottomSheetFlatList
              data={processedVenues}
              renderItem={({ item }) => <VenueCard item={item} onPress={onVenuePress} />}
              keyExtractor={item => item.id.toString()}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>
                    {t('venues.noVenuesFound')}
                  </Text>
                </View>
              )}
              contentContainerStyle={{
                backgroundColor: colors.background,
              }}
            />
          )}
        </View>

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.mapViewButton, { backgroundColor: colors.accent }]}
            onPress={() => goToIndex(0)}>
            <MaterialCommunityIcons name="map-outline" size={18} color="white" />
            <Text style={styles.mapViewText}>{t('venues.mapView')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  skeletonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  skeletonContent: {
    padding: 12,
  },
  venueCard: {
    flexDirection: 'row',
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  venueImage: {
    width: 110,
    height: '100%',
    borderRadius: 0,
  },
  venueDetails: {
    padding: 12,
    justifyContent: 'center',
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  venueDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  venueLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  favoriteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 25,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 8,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '600',
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 30,
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    gap: 8,
  },
  mapViewText: {
    color: 'white',
    fontWeight: '500',
  },
  bottomSheetBackground: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  placeholderImage: {
    width: 110,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    marginRight: 0,
  },
  leftContainer: {
    position: 'relative',
    width: 110,
    height: '100%',
    overflow: 'hidden',
    borderRadius: 0,
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  expandButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VenueBottomSheet;
