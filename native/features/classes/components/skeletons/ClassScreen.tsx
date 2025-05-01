import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import { SearchSkeleton } from '@/components/skeletons';

export const ClassesScreenSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SearchSkeleton />
      <TimeRangeSkeleton />
      <DateSelectorSkeleton />
      <ClassesListSkeleton />
    </View>
  );
};

export const TimeRangeSkeleton = () => {
  const { colors } = useTheme();

  return <View style={[styles.timeSelectorPlaceholder, { backgroundColor: colors.card }]} />;
};

export const DateSelectorSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.dateSelector, { backgroundColor: colors.background }]}>
      {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
        <View key={index} style={styles.dateItem}>
          <Skeleton width={40} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={28} height={28} style={{ borderRadius: 14 }} />
        </View>
      ))}
    </View>
  );
};

export const ClassCardSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.imageContainer}>
        <Skeleton width={100} height={100} style={{ borderRadius: 8, marginRight: 16 }} />
      </View>
      <View style={styles.content}>
        <Skeleton width="80%" height={20} style={{ marginBottom: 4 }} />
        <Skeleton width="60%" height={16} style={{ marginBottom: 10 }} />

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Skeleton width={18} height={18} style={{ marginRight: 8 }} />
            <Skeleton width="70%" height={15} />
          </View>

          <View style={styles.detailRow}>
            <Skeleton width={18} height={18} style={{ marginRight: 8 }} />
            <Skeleton width="60%" height={15} />
          </View>

          <View style={styles.detailRow}>
            <Skeleton width={18} height={18} style={{ marginRight: 8 }} />
            <Skeleton width="50%" height={15} />
          </View>

          <Skeleton width="40%" height={14} style={{ marginTop: 10 }} />
        </View>
      </View>
    </View>
  );
};

export const ClassesListSkeleton = () => {
  return (
    <View style={styles.listContainer}>
      {[...Array(3)].map((_, index) => (
        <ClassCardSkeleton key={`skeleton-${index}`} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 20,
    marginBottom: 20,
    paddingTop: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  details: {
    gap: 8,
    marginTop: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listContainer: {
    paddingTop: 16,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    height: 48,
    borderRadius: 24,
    marginHorizontal: 0,
  },
  timeSelectorPlaceholder: {
    height: 48,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  dateSelectorPlaceholder: {
    height: 64,
    marginBottom: 12,
  },
});
