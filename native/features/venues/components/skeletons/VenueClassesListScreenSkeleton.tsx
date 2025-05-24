import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const VenueClassesListScreenSkeleton = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.backButton}>
          <Skeleton width={24} height={24} style={{ borderRadius: 12 }} />
        </View>

        <View style={styles.headerTitleContainer}>
          <Skeleton width={180} height={18} />
        </View>

        <View style={styles.shareButton} />
      </View>

      <View
        style={[
          styles.dateSelector,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}>
        {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
          <View key={index} style={styles.dateItem}>
            <Skeleton width={40} height={14} style={{ marginBottom: 4 }} />
            <Skeleton width={28} height={28} style={{ borderRadius: 14 }} />
          </View>
        ))}
      </View>

      <View style={styles.classesContainer}>
        {[1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderBottomColor: colors.border },
            ]}>
            <View style={styles.cardRow}>
              <Skeleton width={100} height={100} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Skeleton width="80%" height={20} style={{ marginBottom: 4 }} />
                <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />

                <View style={styles.iconRow}>
                  <Skeleton width={18} height={18} style={{ borderRadius: 9, marginRight: 8 }} />
                  <Skeleton width="70%" height={15} />
                </View>

                <View style={styles.iconRow}>
                  <Skeleton width={18} height={18} style={{ borderRadius: 9, marginRight: 8 }} />
                  <Skeleton width="60%" height={15} />
                </View>

                <View style={styles.iconRow}>
                  <Skeleton width={18} height={18} style={{ borderRadius: 9, marginRight: 8 }} />
                  <Skeleton width="50%" height={15} />
                </View>

                <Skeleton width="40%" height={14} style={{ marginTop: 10 }} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
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
    padding: 16,
    gap: 16,
  },
  card: {
    borderRadius: 8,
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 0,
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardImage: {
    borderRadius: 8,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

export default VenueClassesListScreenSkeleton;
