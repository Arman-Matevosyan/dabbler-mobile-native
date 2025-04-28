import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Skeleton, useTheme} from '@/design-system';

const {width} = Dimensions.get('window');

export const HeaderSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.header, {borderBottomColor: colors.border}]}>
      <View style={styles.headerContent}>
        <Skeleton width={width * 0.6} height={24} style={styles.title} />
        <Skeleton width={24} height={24} style={{borderRadius: 12}} />
      </View>
    </View>
  );
};

export const DateSelectorSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.dateSelector, {backgroundColor: colors.background}]}>
      {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
        <View key={index} style={styles.dateItem}>
          <Skeleton width={40} height={16} style={{marginBottom: 4}} />
          <Skeleton width={28} height={28} style={{borderRadius: 14}} />
        </View>
      ))}
    </View>
  );
};

export const ClassCardSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.card, borderColor: colors.border},
      ]}>
      <View style={styles.cardHeader}>
        <View style={styles.timeContainer}>
          <Skeleton width={60} height={18} style={{marginBottom: 4}} />
          <Skeleton width={40} height={14} />
        </View>
        <Skeleton width={80} height={24} style={{borderRadius: 12}} />
      </View>

      <View style={styles.cardBody}>
        <Skeleton width={width * 0.5} height={20} style={{marginBottom: 8}} />
        <Skeleton width={width * 0.7} height={16} style={{marginBottom: 16}} />

        <View style={styles.instructorRow}>
          <Skeleton
            width={36}
            height={36}
            style={{borderRadius: 18, marginRight: 12}}
          />
          <View>
            <Skeleton width={120} height={16} style={{marginBottom: 4}} />
            <Skeleton width={100} height={14} />
          </View>
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dateItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  classesContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'flex-start',
  },
  cardBody: {
    flex: 1,
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default VenueClassesListSkeleton;
