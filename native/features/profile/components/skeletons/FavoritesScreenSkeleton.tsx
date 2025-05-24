import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const FavoritesScreenSkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const renderSkeletonItem = (key: number) => (
    <View key={key} style={[styles.skeletonItem, { backgroundColor: colors.card }]}>
      <Skeleton style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <Skeleton style={{ height: 24, width: '60%', marginBottom: 12 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.textSecondary,
              opacity: 0.5,
              marginRight: 8,
            }}
          />
          <Skeleton style={{ height: 16, width: '70%' }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.textSecondary,
              opacity: 0.5,
              marginRight: 8,
            }}
          />
          <Skeleton style={{ height: 16, width: '80%' }} />
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
          <Skeleton width="50%" height={28} />
        </View>
        <Skeleton width="100%" height={48} style={{ borderRadius: 8, marginTop: 16 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {[1, 2, 3, 4, 5].map(key => renderSkeletonItem(key))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  skeletonItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  skeletonImage: {
    height: 160,
    width: '100%',
  },
  skeletonContent: {
    padding: 16,
  },
});
