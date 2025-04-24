import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import { ClassesListSkeleton } from './ClassSkeleton';

const { width } = Dimensions.get('window');

export const ClassesScreenSkeleton = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchWrapper}>
        <View style={[styles.searchPlaceholder, { backgroundColor: colors.card }]} />
      </View>

      <View style={[styles.timeSelectorPlaceholder, { backgroundColor: colors.card }]} />

      <View style={[styles.dateSelectorPlaceholder, { backgroundColor: colors.card }]} />

      <ClassesListSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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