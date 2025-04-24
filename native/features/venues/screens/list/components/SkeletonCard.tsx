import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, Skeleton} from '@/design-system';

export const SkeletonCard = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.card}]}>
      <Skeleton
        width="100%"
        height={180}
        style={{borderTopLeftRadius: 8, borderTopRightRadius: 8}}
      />
      <View style={styles.content}>
        <Skeleton width="70%" height={20} style={{marginBottom: 8}} />
        <Skeleton width="50%" height={16} style={{marginBottom: 16}} />

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Skeleton width={18} height={18} style={{marginRight: 8}} />
            <Skeleton width="60%" height={15} />
          </View>

          <View style={styles.detailRow}>
            <Skeleton width={18} height={18} style={{marginRight: 8}} />
            <Skeleton width="50%" height={15} />
          </View>

          <View style={styles.detailRow}>
            <Skeleton width={18} height={18} style={{marginRight: 8}} />
            <Skeleton width="40%" height={15} />
          </View>

          <Skeleton width="30%" height={14} style={{marginTop: 10}} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
