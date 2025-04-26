import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useTheme, Skeleton} from '@/design-system';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

export const SearchSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.searchSkeleton,
        {backgroundColor: colors.card, paddingTop: insets.top},
      ]}>
      <View style={styles.searchBarContainer}>
        <Skeleton width="100%" height={48} style={{borderRadius: 24}} />
      </View>
      <View style={styles.categoriesContainer}>
        <Skeleton
          width={150}
          height={36}
          style={{
            borderRadius: 18,
            marginRight: 8,
          }}
        />
        <Skeleton width={100} height={16} style={{alignSelf: 'center'}} />
      </View>
    </View>
  );
};

export const MapSkeleton = () => {
  const {colors} = useTheme();
  return (
    <View style={styles.mapSkeleton}>
      <Skeleton width="100%" height="100%" style={{borderRadius: 0}} />
      <View style={[styles.locationButton, {backgroundColor: colors.card}]}>
        <Skeleton width={24} height={24} style={{borderRadius: 12}} />
      </View>
    </View>
  );
};

export const BottomSheetSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomSheetContainer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -3},
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={styles.bottomSheetHeader}>
        <View style={[styles.handle, {backgroundColor: colors.border}]} />
        <Skeleton
          width={120}
          height={22}
          style={{borderRadius: 4, marginBottom: 4}}
        />
      </View>
    </View>
  );
};

export const VenueSkeletonItem = () => {
  const {colors} = useTheme();
  return (
    <View
      style={[
        styles.venueCardSkeleton,
        {backgroundColor: colors.background, borderBottomColor: colors.border},
      ]}>
      <View style={styles.venueCardContent}>
        <View style={styles.venueImageContainer}>
          <Skeleton width={70} height={70} style={{borderRadius: 8}} />
        </View>
        <View style={styles.venueDetailsContainer}>
          <Skeleton width={180} height={18} style={{marginBottom: 8}} />
          <Skeleton width={120} height={14} style={{marginBottom: 8}} />
          <Skeleton width={100} height={14} />
        </View>
      </View>
      <View style={[styles.separator, {backgroundColor: colors.border}]} />
    </View>
  );
};

export const VenuesScreenSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.mapContainer}>
        <MapSkeleton />
      </View>
      <SearchSkeleton />
      <BottomSheetSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  searchSkeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBarContainer: {
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  mapSkeleton: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 1,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetContainer: {
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 999,
  },
  bottomSheetHeader: {
    alignItems: 'center',
  },
  bottomSheetContentPreview: {
    flex: 1,
    overflow: 'hidden',
  },
  venueCardSkeleton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  venueCardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  venueImageContainer: {
    marginRight: 12,
  },
  venueDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    width: '100%',
  },
  handle: {
    width: 60,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
});

export default VenuesScreenSkeleton;
