import {IVenue} from '@/types/class.interfaces';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VenuesStackParamList} from '@/navigation/types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  BackHandler,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Skeleton, useTheme} from '@/design-system';
import {useVenuesBottomSheet} from '../hooks';
import {useAuthStore} from '@/stores/authStore';
import {useFavorites} from '@/hooks/useFavorites';

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
  covers?: Array<{url: string}>;
  categories?: Array<{name: string}> | string[];
}

interface VenueBottomSheetProps {
  onVenuePress?: (venue: ExtendedVenue) => void;
  totalVenues: number;
  searchParams?: any;
  isLoading: boolean;
  selectedVenue?: ExtendedVenue;
}

interface BottomSheetContentProps {
  searchParams: any;
  onVenuePress: (venue: ExtendedVenue) => void;
  colors: any;
  goToIndex: (index: number) => void;
}

const VenueSkeletonItem = React.memo(() => {
  return (
    <View
      style={[
        styles.skeletonContainer,
        {borderRadius: 16, overflow: 'hidden'},
      ]}>
      <View style={{flexDirection: 'row', height: 130}}>
        <View style={styles.leftContainer}>
          <Skeleton />
        </View>
        <View
          style={[styles.skeletonContent, {flex: 1, justifyContent: 'center'}]}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </View>
      </View>
      <View
        style={[
          styles.separator,
          {backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 16},
        ]}
      />
    </View>
  );
});
interface FavoriteButtonProps {
  venue: ExtendedVenue;
}
const FavoriteButton = React.memo(({venue}: FavoriteButtonProps) => {
  const {favorites, toggleFavorite} = useFavorites();
  const {isAuthenticated} = useAuthStore();

  const isFavorite = useMemo(
    () => favorites?.some(fav => fav.id === venue.id),
    [favorites, venue.id],
  );

  const handlePress = () => {
    if (!isAuthenticated) {
      return;
    }
    toggleFavorite(venue.id);
  };

  return (
    <TouchableOpacity
      style={[styles.favoriteButton]}
      onPress={handlePress}
      activeOpacity={1}>
      <Icon
        name={'favorite'}
        size={20}
        color={isFavorite ? '#FF3B30' : '#F3F3F3'}
      />
    </TouchableOpacity>
  );
});

const VenueCard = React.memo(
  ({
    item,
    onPress,
  }: {
    item: ExtendedVenue;
    onPress?: (venue: ExtendedVenue) => void;
  }) => {
    const {colors} = useTheme();
    const navigation =
      useNavigation<NativeStackNavigationProp<VenuesStackParamList>>();
    const [imageError, setImageError] = useState(false);

    const hasImage =
      item.covers && item.covers.length > 0 && item.covers[0]?.url;
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
        navigation.navigate('VenueDetails', {id: item.id});
      }
    }, [item, onPress, navigation]);

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <>
        <TouchableOpacity
          style={[
            styles.venueCard,
            {
              backgroundColor: colors.background,
              borderBottomWidth: 0,
              borderWidth: 0,
              borderColor: 'transparent',
            },
          ]}
          onPress={handlePress}
          activeOpacity={1}>
          <View style={styles.leftContainer}>
            {hasImage && !imageError ? (
              <Image
                source={{uri: imageUrl}}
                style={styles.venueImage}
                resizeMode="cover"
                onError={handleImageError}
              />
            ) : (
              <View
                style={[
                  styles.placeholderImage,
                  {backgroundColor: colors.border},
                ]}>
                <Icon
                  name="image-outline"
                  size={40}
                  color={colors.textSecondary}
                />
              </View>
            )}
            <View style={styles.favoriteButtonContainer}>
              <FavoriteButton venue={item} />
            </View>
          </View>

          <View style={styles.venueDetails}>
            <Text style={[styles.venueName, {color: colors.textPrimary}]}>
              {item.name}
            </Text>
            <Text
              style={[styles.venueLocation, {color: colors.textSecondary}]}
              numberOfLines={1}>
              {locationText}
            </Text>
            {item.description && (
              <Text
                style={[styles.venueDescription, {color: colors.textSecondary}]}
                numberOfLines={2}>
                {item.description.length > 100
                  ? `${item.description.substring(0, 100)}...`
                  : item.description}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={[
            styles.separator,
            {
              backgroundColor: colors.border,
              marginVertical: 16,
            },
          ]}
        />
      </>
    );
  },
);

export interface VenueBottomSheetRef {
  expand: () => void;
  collapse: () => void;
  close: () => void;
}

export const VenueBottomSheet = React.memo(
  forwardRef<VenueBottomSheetRef, VenueBottomSheetProps>(
    (
      {
        onVenuePress,
        totalVenues,
        searchParams,
        isLoading: externalIsLoading,
      }: VenueBottomSheetProps,
      ref,
    ) => {
      const {colors} = useTheme();
      const bottomSheetRef = useRef<BottomSheet>(null);
      const snapPoints = useMemo(() => ['8.5%', '100%'], []);
      const [currentIndex, setCurrentIndex] = useState(0);
      const isExpanded = currentIndex > 0;

      const [isDataLoading, setIsDataLoading] = useState(false);

      useImperativeHandle(ref, () => ({
        expand: () => {
          bottomSheetRef.current?.snapToIndex(1);
        },
        collapse: () => {
          bottomSheetRef.current?.snapToIndex(0);
        },
        close: () => {
          bottomSheetRef.current?.snapToIndex(0);
        },
      }));

      const handleSheetChange = useCallback(
        (index: number) => {
          if (!isDataLoading) {
            setCurrentIndex(index);
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

          const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress,
          );

          return () => subscription.remove();
        }, [isExpanded]),
      );

      const memoizedSearchParams = useMemo(
        () => searchParams,
        [JSON.stringify(searchParams)],
      );

      const handleVenuePress = useCallback(
        (venue: ExtendedVenue) => {
          if (onVenuePress) {
            onVenuePress(venue);
            bottomSheetRef.current?.snapToIndex(0);
          }
        },
        [onVenuePress],
      );

      const renderHeader = useMemo(
        () => () =>
          (
            <View
              style={[
                styles.header,
                {
                  backgroundColor: colors.background,
                  borderTopLeftRadius: 20,
                  height: 90,
                  borderTopRightRadius: 20,
                  paddingVertical: 8,
                  borderColor: 'transparent',
                  alignItems: 'center',
                },
              ]}>
              <View
                style={[
                  styles.handle,
                  {
                    backgroundColor: colors.border,
                    width: 60,
                    height: 6,
                    marginVertical: 2,
                    alignSelf: 'center',
                  },
                ]}
              />

              {externalIsLoading ? (
                <Skeleton style={{marginTop: 6}} width={120} height={24} />
              ) : (
                <Text
                  style={[
                    styles.headerText,
                    {
                      color: colors.textPrimary,
                      fontSize: 20,
                      fontWeight: '700',
                      marginTop: 6,
                    },
                  ]}>
                  {totalVenues} venues
                </Text>
              )}
            </View>
          ),
        [totalVenues, colors, externalIsLoading],
      );

      const isExpandedRef = useRef(isExpanded);
      useEffect(() => {
        isExpandedRef.current = isExpanded;
      }, [isExpanded]);

      const renderContent = useMemo(
        () => () =>
          (
            <View
              style={{
                flex: 1,
                backgroundColor: colors.background,
              }}>
              <BottomSheetContent
                searchParams={memoizedSearchParams}
                onVenuePress={handleVenuePress}
                colors={colors}
                goToIndex={(index: number) =>
                  bottomSheetRef.current?.snapToIndex(index)
                }
                isExpanded={isExpanded}
                updateLoadingState={updateLoadingState}
              />
            </View>
          ),
        [
          colors,
          handleVenuePress,
          memoizedSearchParams,
          isExpanded,
          updateLoadingState,
        ],
      );

      const renderBackdrop = useCallback((props: any) => {
        return (
          <View
            {...props}
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'transparent',
              opacity: 0,
              zIndex: -1,
            }}
          />
        );
      }, []);

      return (
        <>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              backgroundColor: 'transparent',
              pointerEvents: 'none',
            }}
          />

          <View
            style={[
              styles.bottomSheetContainer,
              {
                backgroundColor: 'transparent',
                pointerEvents: isExpanded ? 'auto' : 'box-none',
                zIndex: isExpanded ? 1000 : 50,
              },
            ]}>
            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              handleComponent={renderHeader}
              backgroundStyle={[
                styles.bottomSheetBackground,
                {
                  backgroundColor: colors.background,
                  opacity: 1,
                },
              ]}
              backdropComponent={renderBackdrop}
              handleIndicatorStyle={{display: 'none'}}
              handleStyle={{
                backgroundColor: colors.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 0,
                height: 96,
              }}
              bottomInset={0}
              onChange={handleSheetChange}
              enablePanDownToClose={false}
              enableOverDrag={false}
              animateOnMount={false}
              detached={true}
              index={0}>
              {renderContent()}
            </BottomSheet>
          </View>
        </>
      );
    },
  ),
);

const BottomSheetContent = React.memo(
  ({
    searchParams,
    onVenuePress,
    colors,
    goToIndex,
    isExpanded,
    updateLoadingState,
  }: BottomSheetContentProps & {
    isExpanded: boolean;
    updateLoadingState: (loading: boolean) => void;
  }) => {
    const isFocused = useIsFocused();
    const {data, isLoading} = useVenuesBottomSheet(searchParams, isFocused);

    useEffect(() => {
      updateLoadingState(isLoading);
    }, [isLoading, updateLoadingState]);

    const renderVenueItem = useCallback(
      ({item}: {item: ExtendedVenue}) => (
        <VenueCard key={item.id} item={item} onPress={onVenuePress} />
      ),
      [onVenuePress],
    );

    const keyExtractor = useCallback((item: ExtendedVenue) => item.id, []);

    const ListEmptyComponent = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Text style={{color: colors.textSecondary, textAlign: 'center'}}>
            No venues found
          </Text>
        </View>
      ),
      [colors.textSecondary],
    );

    const renderSkeletons = useCallback(
      () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          {[1, 2, 3, 4, 5, 6].map(key => (
            <VenueSkeletonItem key={key} />
          ))}
        </Animated.View>
      ),
      [],
    );

    if (!isExpanded) {
      return (
        <View style={{flex: 1}}>
          <BottomSheetScrollView
            contentContainerStyle={[{backgroundColor: colors.background}]}>
            <View style={{height: 1}} />
          </BottomSheetScrollView>
        </View>
      );
    }

    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        {isLoading ? (
          <BottomSheetScrollView
            contentContainerStyle={[
              {backgroundColor: colors.background, paddingTop: 24},
            ]}>
            <View style={{height: 16}} />
            {renderSkeletons()}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetFlatList
            data={(data || []) as ExtendedVenue[]}
            renderItem={renderVenueItem}
            keyExtractor={keyExtractor}
            ListEmptyComponent={ListEmptyComponent}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={7}
            initialNumToRender={3}
            updateCellsBatchingPeriod={50}
            contentContainerStyle={{
              paddingTop: 24,
              backgroundColor: colors.background,
            }}
            ListHeaderComponent={<View style={{height: 16}} />}
            ListFooterComponent={<View style={{height: 80}} />}
          />
        )}

        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.mapViewButton, {backgroundColor: colors.accent}]}
            onPress={() => goToIndex(0)}>
            <Icon name="map" size={18} color="white" />
            <Text style={styles.mapViewText}>Map View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  skeletonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  skeletonImage: {
    width: 110,
    height: '100%',
    marginBottom: 0,
  },
  skeletonContent: {
    padding: 12,
  },
  skeletonTitle: {
    height: 20,
    width: '70%',
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonSubtitle: {
    height: 16,
    width: '50%',
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonButton: {
    height: 32,
    borderRadius: 8,
    marginTop: 8,
    width: '30%',
  },
  venueCard: {
    borderRadius: 16,
    marginBottom: 0,
    overflow: 'hidden',
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'row',
    height: 130,
  },
  venueImage: {
    width: 110,
    height: '100%',
    borderRadius: 0,
    marginRight: 0,
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
  planBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    paddingBottom: 16,
    zIndex: 10,
  },
  handle: {
    width: 40,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 8,
  },
  headerContent: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
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
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    marginBottom: 0,
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
    backgroundColor: '#EEEEEE20',
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
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
});
