import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Skeleton, useTheme} from '@/design-system';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

export const ProfileScreenSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <View style={styles.headerContainer}>
        <Skeleton width={24} height={24} style={{borderRadius: 12}} />
      </View>

      <View style={styles.userSection}>
        <Skeleton width={120} height={120} style={styles.avatar} />

        <Skeleton width={180} height={24} style={styles.name} />
      </View>

      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <View style={styles.cardHeader}>
          <Skeleton width={150} height={20} style={{marginBottom: 8}} />
          <Skeleton width={100} height={16} />
        </View>
        <View style={styles.cardContent}>
          <Skeleton width="90%" height={16} style={{marginBottom: 8}} />
          <Skeleton width="60%" height={16} />
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <View style={styles.cardHeader}>
          <Skeleton width={160} height={20} style={{marginBottom: 8}} />
        </View>
        <View style={styles.actionsGrid}>
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <View key={index} style={styles.actionItem}>
              <Skeleton width={40} height={40} style={styles.actionIcon} />
              <Skeleton width={60} height={14} style={styles.actionText} />
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <View style={styles.cardHeader}>
          <Skeleton width={140} height={20} style={{marginBottom: 8}} />
        </View>
        <View style={styles.scheduleItem}>
          <Skeleton
            width={60}
            height={60}
            style={{borderRadius: 8, marginRight: 12}}
          />
          <View style={styles.scheduleDetails}>
            <Skeleton width="80%" height={16} style={{marginBottom: 8}} />
            <Skeleton width="50%" height={14} style={{marginBottom: 6}} />
            <Skeleton width="40%" height={14} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    borderRadius: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardContent: {
    marginTop: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    borderRadius: 20,
    marginBottom: 8,
  },
  actionText: {
    borderRadius: 4,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleDetails: {
    flex: 1,
  },
});
