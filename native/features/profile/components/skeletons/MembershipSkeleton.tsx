import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const MembershipSkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
        <Skeleton width="50%" height={24} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Skeleton width="70%" height={28} style={{ marginBottom: 24 }} />

          {/* Current Plan Card */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Skeleton width="60%" height={22} style={{ marginBottom: 12 }} />

            <View style={styles.planDetails}>
              <View style={styles.planInfo}>
                <Skeleton width="80%" height={24} style={{ marginBottom: 8 }} />
                <Skeleton width="50%" height={18} style={{ marginBottom: 4 }} />
                <Skeleton width="40%" height={18} />
              </View>

              <Skeleton width={60} height={60} style={{ borderRadius: 30 }} />
            </View>

            <View style={styles.divider} />

            <View style={styles.featuresList}>
              {[1, 2, 3].map(item => (
                <View key={item} style={styles.featureItem}>
                  <Skeleton width={20} height={20} style={{ marginRight: 12 }} />
                  <Skeleton width="70%" height={16} />
                </View>
              ))}
            </View>
          </View>

          {/* Payment Info */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Skeleton width="50%" height={22} style={{ marginBottom: 16 }} />

            <View style={styles.paymentMethod}>
              <Skeleton width={40} height={30} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
                <Skeleton width="40%" height={14} />
              </View>
            </View>

            <Skeleton width="100%" height={46} style={{ borderRadius: 8, marginTop: 16 }} />
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
    marginRight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
