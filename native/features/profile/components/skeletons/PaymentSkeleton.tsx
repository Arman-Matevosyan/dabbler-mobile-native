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
      <View style={styles.header}>
        <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
        <Skeleton width="50%" height={24} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Skeleton width="70%" height={28} style={{ marginBottom: 24 }} />

          <View style={styles.section}>
            <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />

            {[1, 2].map(item => (
              <View key={item} style={[styles.cardItem, { backgroundColor: colors.card }]}>
                <View style={styles.cardDetails}>
                  <Skeleton width={40} height={30} style={{ marginRight: 12 }} />
                  <View>
                    <Skeleton width={120} height={18} style={{ marginBottom: 6 }} />
                    <Skeleton width={80} height={14} />
                  </View>
                </View>
                <Skeleton width={24} height={24} borderRadius={12} />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Skeleton width="70%" height={20} style={{ marginBottom: 16 }} />

            <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
              {[1, 2, 3].map(item => (
                <View key={item} style={styles.historyItem}>
                  <View>
                    <Skeleton width={140} height={18} style={{ marginBottom: 6 }} />
                    <Skeleton width={100} height={14} />
                  </View>
                  <Skeleton width={70} height={22} />
                </View>
              ))}
            </View>
          </View>

          <Skeleton width="100%" height={50} style={{ borderRadius: 25, marginTop: 16 }} />
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
  section: {
    marginBottom: 24,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});
