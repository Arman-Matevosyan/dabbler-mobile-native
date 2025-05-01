import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Skeleton, useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

export const HeaderSkeleton = ({ onClose }: { onClose?: () => void }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.backButton} onTouchEnd={onClose}>
        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
      </View>
      <Skeleton style={styles.headerTitle} width={150} height={20} />
    </View>
  );
};

export const ImageSkeleton = () => {
  return (
    <View style={styles.imageContainer}>
      <Skeleton style={styles.imageSkeleton} width="100%" height={300} />
    </View>
  );
};

export const TitleSkeleton = () => {
  return (
    <View style={styles.titleContainer}>
      <Skeleton style={styles.titleSkeleton} width={width * 0.7} height={28} />
    </View>
  );
};

export const DateTimeSkeleton = () => {
  return (
    <View style={styles.dateTimeSkeleton}>
      <Skeleton width={120} height={20} style={{ marginRight: 16 }} />
      <Skeleton width={80} height={20} />
    </View>
  );
};

export const CategorySkeleton = () => {
  return (
    <View style={styles.categoryContainer}>
      <Skeleton style={styles.categorySkeleton} width={width * 0.5} height={16} />
    </View>
  );
};

export const VenueSkeleton = () => {
  return (
    <View style={styles.venueContainer}>
      <Skeleton style={styles.venueSkeleton} width={width * 0.4} height={20} />
    </View>
  );
};

export const InstructorSkeleton = () => {
  return (
    <View style={styles.instructorSkeleton}>
      <Skeleton width={16} height={16} style={{ marginRight: 8, borderRadius: 8 }} />
      <Skeleton width={120} height={16} />
    </View>
  );
};

export const DescriptionSkeleton = () => {
  return (
    <View style={styles.descriptionSkeleton}>
      <Skeleton width="100%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="90%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={12} />
    </View>
  );
};

export const MapSkeleton = () => {
  return <Skeleton style={styles.mapSkeleton} width="100%" height={200} />;
};

export const ActionButtonSkeleton = () => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.bottomBar,
        { backgroundColor: colors.background, borderTopColor: colors.border },
      ]}>
      <Skeleton style={styles.buttonSkeleton} width="100%" height={50} borderRadius={25} />
    </View>
  );
};

export const ClassDetailsSkeleton: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderSkeleton onClose={onClose} />

      <View style={styles.scrollContent}>
        <ImageSkeleton />

        <View style={styles.contentContainer}>
          <TitleSkeleton />
          <DateTimeSkeleton />
          <CategorySkeleton />
          <VenueSkeleton />
          <InstructorSkeleton />
          <DescriptionSkeleton />
          <MapSkeleton />
        </View>

        <View style={{ height: 90 }} />
      </View>

      <ActionButtonSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    alignSelf: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
  },
  imageSkeleton: {
    borderRadius: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    marginBottom: 12,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  dateTimeSkeleton: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categorySkeleton: {
    marginBottom: 8,
  },
  venueContainer: {
    marginBottom: 16,
  },
  venueSkeleton: {
    marginBottom: 8,
  },
  instructorSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  descriptionSkeleton: {
    marginBottom: 24,
  },
  mapSkeleton: {
    marginBottom: 24,
    borderRadius: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    padding: 16,
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  buttonSkeleton: {
    borderRadius: 25,
  },
});
