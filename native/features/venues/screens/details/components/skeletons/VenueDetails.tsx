import React from 'react';
import { StyleSheet, View, Dimensions, StatusBar, Platform } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const HeaderSkeleton = ({ onClose }: { onClose?: () => void }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.fixedHeader,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          paddingTop: Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0,
          height: (Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0) + 60,
        },
      ]}>
      <View style={styles.backButton} onTouchEnd={onClose}></View>
    </View>
  );
};

export const ImageSliderSkeleton = () => {
  return (
    <View style={styles.imageContainer}>
      <Skeleton style={styles.imageSkeleton} width="100%" height={400} />
      <View style={styles.dotsContainer}>
        <View style={styles.dots}>
          {[1, 2, 3].map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === 0 ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export const VenueNameSkeleton = () => {
  return (
    <View style={styles.venueNameContainer}>
      <Skeleton width={width * 0.7} height={28} style={styles.venueName} />
      <Skeleton width={width * 0.5} height={16} style={{ marginTop: 8 }} />
    </View>
  );
};

export const DescriptionSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Skeleton width={120} height={24} style={styles.sectionTitle} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="95%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="85%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={12} />
      <Skeleton width={100} height={16} style={{ marginTop: 8, alignSelf: 'flex-start' }} />
    </View>
  );
};

export const InfoSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Skeleton width={100} height={24} style={styles.sectionTitle} />

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <Skeleton width={22} height={22} style={{ borderRadius: 11 }} />
        </View>
        <View style={styles.infoContent}>
          <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={width * 0.6} height={14} />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <Skeleton width={22} height={22} style={{ borderRadius: 11 }} />
        </View>
        <View style={styles.infoContent}>
          <Skeleton width={100} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={width * 0.5} height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={width * 0.45} height={14} />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <Skeleton width={22} height={22} style={{ borderRadius: 11 }} />
        </View>
        <View style={styles.infoContent}>
          <Skeleton width={90} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={width * 0.4} height={14} />
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <Skeleton width={22} height={22} style={{ borderRadius: 11 }} />
        </View>
        <View style={styles.infoContent}>
          <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={width * 0.5} height={14} />
        </View>
      </View>
    </View>
  );
};

export const AmenitiesSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Skeleton width={140} height={24} style={styles.sectionTitle} />
      <View style={styles.amenitiesContainer}>
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <View key={i} style={styles.amenityItem}>
            <Skeleton width={40} height={40} style={styles.amenityIcon} />
            <Skeleton width={60} height={12} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const ImportantInfoSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Skeleton width={160} height={24} style={styles.sectionTitle} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="95%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="40%" height={12} />
      <Skeleton width={120} height={16} style={{ marginTop: 8, alignSelf: 'flex-start' }} />
    </View>
  );
};

export const VenuePlansSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <Skeleton width={120} height={24} style={styles.sectionTitle} />
      <View style={styles.plansContainer}>
        {[1, 2].map((_, i) => (
          <View key={i} style={[styles.planCard, { borderColor: colors.border }]}>
            <Skeleton width={100} height={20} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={14} style={{ marginBottom: 4 }} />
            <Skeleton width="70%" height={14} style={{ marginBottom: 12 }} />
            <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
            <Skeleton width={60} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const MapSectionSkeleton = () => {
  return (
    <View style={styles.section}>
      <Skeleton width={100} height={24} style={styles.sectionTitle} />
      <Skeleton width="100%" height={200} style={styles.mapSkeleton} />
    </View>
  );
};

export const ActionsSkeleton = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomBar,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom || 16 : 16,
        },
      ]}>
      <View style={styles.actionsWrapper}>
        <Skeleton width={150} height={44} style={{ borderRadius: 4 }} />
      </View>
    </View>
  );
};

export const VenueDetailsScreenSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderSkeleton />

      <View style={styles.scrollContent}>
        <ImageSliderSkeleton />
        <VenueNameSkeleton />
        <DescriptionSkeleton />
        <InfoSkeleton />
        <AmenitiesSkeleton />
        <ImportantInfoSkeleton />
        <VenuePlansSkeleton />
        <MapSectionSkeleton />

        <View style={{ height: 90 }} />
      </View>

      <ActionsSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 1000,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    alignSelf: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  imageSkeleton: {
    borderRadius: 0,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  venueNameContainer: {
    padding: 16,
    paddingTop: 20,
  },
  venueName: {
    marginBottom: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  amenityItem: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 20,
  },
  amenityIcon: {
    borderRadius: 20,
  },
  plansContainer: {
    marginTop: 10,
    gap: 12,
  },
  planCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  mapSkeleton: {
    borderRadius: 8,
    marginTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
