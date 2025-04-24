import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useTheme, Skeleton} from '@/design-system';

const {width} = Dimensions.get('window');

export const VenueDetailsSkeleton: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.imageSlider, {backgroundColor: colors.border}]} />

      <View style={styles.section}>
        <Skeleton width={200} height={28} style={styles.skeletonItem} />
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={24} style={styles.skeletonItem} />
        <Skeleton width="90%" height={16} style={styles.skeletonItem} />
        <Skeleton width="80%" height={16} style={styles.skeletonItem} />
        <Skeleton width="70%" height={16} style={styles.skeletonItem} />
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={24} style={styles.skeletonItem} />

        <View style={styles.infoRow}>
          <Skeleton width={40} height={40} style={styles.iconSkeleton} />
          <View style={styles.infoContent}>
            <Skeleton width={100} height={16} style={styles.skeletonItem} />
            <Skeleton width={180} height={14} style={styles.skeletonItem} />
          </View>
        </View>

        <View style={styles.infoRow}>
          <Skeleton width={40} height={40} style={styles.iconSkeleton} />
          <View style={styles.infoContent}>
            <Skeleton width={80} height={16} style={styles.skeletonItem} />
            <Skeleton width={150} height={14} style={styles.skeletonItem} />
            <Skeleton width={130} height={14} style={styles.skeletonItem} />
          </View>
        </View>

        <View style={styles.infoRow}>
          <Skeleton width={40} height={40} style={styles.iconSkeleton} />
          <View style={styles.infoContent}>
            <Skeleton width={90} height={16} style={styles.skeletonItem} />
            <Skeleton width={120} height={14} style={styles.skeletonItem} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={24} style={styles.skeletonItem} />
        <View style={styles.amenitiesRow}>
          <Skeleton
            width={80}
            height={30}
            borderRadius={15}
            style={styles.skeletonItem}
          />
          <Skeleton
            width={100}
            height={30}
            borderRadius={15}
            style={styles.skeletonItem}
          />
          <Skeleton
            width={90}
            height={30}
            borderRadius={15}
            style={styles.skeletonItem}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton width={120} height={24} style={styles.skeletonItem} />
        <Skeleton width="100%" height={200} style={styles.mapSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSlider: {
    height: 240,
    width: '100%',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  skeletonItem: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  iconSkeleton: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mapSkeleton: {
    borderRadius: 12,
    marginTop: 8,
  },
});
