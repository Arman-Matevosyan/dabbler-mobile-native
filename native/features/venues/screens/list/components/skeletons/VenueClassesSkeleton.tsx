import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';

const { width } = Dimensions.get('window');

export const HeaderSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <View style={styles.headerContent}>
        <Skeleton width={width * 0.6} height={24} style={styles.title} />
        <Skeleton width={24} height={24} style={{ borderRadius: 12 }} />
      </View>
    </View>
  );
};

export const DateSelectorSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.dateSelector, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
        <View key={index} style={styles.dateItem}>
          <Skeleton width={40} height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={28} height={28} style={{ borderRadius: 14 }} />
        </View>
      ))}
    </View>
  );
};

export const ClassCardSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardRow}>
        <View style={styles.imageContainer}>
          <Skeleton width={80} height={80} style={styles.cardImage} />
        </View>

        <View style={styles.cardContent}>
          <Skeleton width={150} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={120} height={14} style={{ marginBottom: 8 }} />
          
          <View style={styles.iconRow}>
            <Skeleton width={14} height={14} style={{ borderRadius: 7, marginRight: 4 }} />
            <Skeleton width={60} height={12} />
          </View>
          
          <View style={styles.iconRow}>
            <Skeleton width={14} height={14} style={{ borderRadius: 7, marginRight: 4 }} />
            <Skeleton width={80} height={12} />
          </View>
          
          <View style={styles.iconRow}>
            <Skeleton width={14} height={14} style={{ borderRadius: 7, marginRight: 4 }} />
            <Skeleton width={50} height={12} />
          </View>
          
          <Skeleton width={100} height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
    </View>
  );
};

export const VenueClassesListSkeleton = () => {
  return (
    <View style={styles.container}>
      <HeaderSkeleton />
      <DateSelectorSkeleton />

      <View style={styles.classesContainer}>
        <ClassCardSkeleton />
        <ClassCardSkeleton />
        <ClassCardSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginBottom: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  classesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  cardRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 12,
  },
  cardImage: {
    borderRadius: 6,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
});

export default VenueClassesListSkeleton;
