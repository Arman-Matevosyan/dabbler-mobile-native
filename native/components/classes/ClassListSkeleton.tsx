import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, Skeleton} from '@design-system';

interface ClassListSkeletonProps {
  count?: number;
}

export const ClassListSkeleton = ({count = 3}: ClassListSkeletonProps) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      {[...Array(count)].map((_, index) => (
        <View 
          key={`skeleton-${index}`} 
          style={[
            styles.card, 
            {backgroundColor: colors.card}
          ]}
        >
          <View style={styles.imageContainer}>
            <Skeleton
              width={90}
              height={90}
              style={{borderRadius: 8}}
            />
          </View>
          <View style={styles.content}>
            <Skeleton width="80%" height={20} style={{marginBottom: 8}} />
            
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Skeleton width={16} height={16} style={{marginRight: 8, borderRadius: 8}} />
                <Skeleton width="60%" height={13} />
              </View>

              <View style={styles.detailRow}>
                <Skeleton width={16} height={16} style={{marginRight: 8, borderRadius: 8}} />
                <Skeleton width="70%" height={13} />
              </View>

              <View style={styles.detailRow}>
                <Skeleton width={16} height={16} style={{marginRight: 8, borderRadius: 8}} />
                <Skeleton width="50%" height={13} />
              </View>

              <View style={styles.tagsRow}>
                <Skeleton width={70} height={20} style={{borderRadius: 10, marginRight: 8}} />
                <Skeleton width={60} height={20} style={{borderRadius: 10}} />
              </View>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Skeleton width={24} height={24} style={{borderRadius: 12}} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 8,
  },
});

export default ClassListSkeleton; 