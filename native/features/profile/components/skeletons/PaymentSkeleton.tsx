import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const PaymentSkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
        <Skeleton width="50%" height={28} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Skeleton width="70%" height={28} style={{ marginBottom: 24 }} />

          <View style={{ gap: 16, marginTop: 16 }}>
            {[1, 2, 3].map(item => (
              <View key={item} style={styles.paymentMethodContainer}>
                <Skeleton width={40} height={24} style={{ marginRight: 16 }} />
                <View style={styles.paymentMethodDetails}>
                  <Skeleton width="70%" height={18} style={{ marginBottom: 8 }} />
                  <Skeleton width="50%" height={14} style={{ marginBottom: 4 }} />
                  <Skeleton width="40%" height={14} />
                </View>
              </View>
            ))}
          </View>
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
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  paymentMethodDetails: {
    flex: 1,
  },
});
