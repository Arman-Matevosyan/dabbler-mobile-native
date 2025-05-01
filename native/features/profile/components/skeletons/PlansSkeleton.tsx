import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

const { width: screenWidth } = Dimensions.get('window');

export const PlansSkeleton = () => {
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
          <Skeleton width="70%" height={28} style={{ marginBottom: 8 }} />
          <Skeleton width="90%" height={16} style={{ marginBottom: 24 }} />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.plansContainer}>
            {[1, 2, 3].map(item => (
              <View key={item} style={[styles.planCard, { backgroundColor: colors.card }]}>
                <View style={styles.planHeader}>
                  <Skeleton width="60%" height={24} style={{ marginBottom: 8 }} />
                  <Skeleton width="40%" height={16} style={{ marginBottom: 16 }} />
                </View>

                <View style={styles.pricingSection}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                    <Skeleton width={60} height={36} style={{ marginRight: 6 }} />
                    <Skeleton width={40} height={20} />
                  </View>
                  <Skeleton width="50%" height={16} style={{ marginTop: 8 }} />
                </View>

                <View style={styles.divider} />

                <View style={styles.featuresSection}>
                  {[1, 2, 3, 4].map(featureIndex => (
                    <View key={featureIndex} style={styles.featureItem}>
                      <Skeleton width={20} height={20} style={{ marginRight: 12 }} />
                      <Skeleton width="80%" height={16} />
                    </View>
                  ))}
                </View>

                <Skeleton width="100%" height={46} style={{ borderRadius: 23, marginTop: 16 }} />
              </View>
            ))}
          </ScrollView>

          <Skeleton width="100%" height={50} style={{ borderRadius: 8, marginTop: 24 }} />
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
  plansContainer: {
    paddingRight: 16,
  },
  planCard: {
    width: screenWidth * 0.75,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  planHeader: {
    marginBottom: 16,
  },
  pricingSection: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },
  featuresSection: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});
