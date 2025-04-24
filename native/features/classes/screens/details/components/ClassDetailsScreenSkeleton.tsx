import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/design-system';
import {
  HeaderSkeleton,
  ImageSkeleton,
  TitleSkeleton,
  DateTimeSkeleton,
  CategorySkeleton,
  VenueSkeleton,
  InstructorSkeleton,
  DescriptionSkeleton,
  MapSkeleton,
  ActionButtonSkeleton,
} from './ClassDetailsSkeleton';

interface ClassDetailsScreenSkeletonProps {
  onClose?: () => void;
}

export const ClassDetailsScreenSkeleton: React.FC<
  ClassDetailsScreenSkeletonProps
> = ({onClose}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
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

        {/* Extra space for bottom bar */}
        <View style={{height: 90}} />
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
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});
