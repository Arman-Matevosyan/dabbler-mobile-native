import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const PlansSkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
        <Skeleton width="50%" height={24} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Skeleton width="70%" height={24} style={{ marginBottom: 24, alignSelf: 'center' }} />

          {[1, 2, 3].map((_, index) => (
            <View
              key={index}
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}>
              <Skeleton width="40%" height={24} style={{ marginBottom: 12 }} />
              <Skeleton width="70%" height={16} style={{ marginBottom: 20 }} />

              <View style={styles.priceContainer}>
                <Skeleton width={30} height={16} style={{ marginRight: 4 }} />
                <Skeleton width={70} height={40} style={{ marginRight: 4 }} />
                <Skeleton width={50} height={14} />
              </View>

              <View style={{ gap: 12, marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Skeleton width={20} height={20} style={{ marginRight: 8, borderRadius: 10 }} />
                  <Skeleton width="60%" height={14} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Skeleton width={20} height={20} style={{ marginRight: 8, borderRadius: 10 }} />
                  <Skeleton width="70%" height={14} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Skeleton width={20} height={20} style={{ marginRight: 8, borderRadius: 10 }} />
                  <Skeleton width="65%" height={14} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Skeleton width={20} height={20} style={{ marginRight: 8, borderRadius: 10 }} />
                  <Skeleton width="50%" height={14} />
                </View>
              </View>

              <Skeleton width="100%" height={44} style={{ borderRadius: 22 }} />
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    paddingVertical: 4,
  },
});
