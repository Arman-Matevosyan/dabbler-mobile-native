import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const ProfileDetailsSkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
        <Skeleton width={150} height={28} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Skeleton width="70%" height={30} style={{ marginBottom: 24 }} />
          {[1, 2, 3, 4].map(item => (
            <View
              key={item}
              style={[styles.detailItemSkeleton, { borderBottomColor: colors.border }]}>
              <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="60%" height={18} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  detailItemSkeleton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});
