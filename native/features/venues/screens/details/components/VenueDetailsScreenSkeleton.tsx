import React from 'react';
import {StyleSheet, View, Platform, StatusBar} from 'react-native';
import {useTheme} from '@/design-system';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  HeaderSkeleton,
  ImageSliderSkeleton,
  VenueNameSkeleton,
  DescriptionSkeleton,
  InfoSkeleton,
  AmenitiesSkeleton,
  ImportantInfoSkeleton,
  VenuePlansSkeleton,
  MapSectionSkeleton,
  ActionsSkeleton,
} from './VenueDetailsSkeleton';

interface VenueDetailsScreenSkeletonProps {
  onClose?: () => void;
}

export const VenueDetailsScreenSkeleton: React.FC<
  VenueDetailsScreenSkeletonProps
> = ({onClose}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      
      <HeaderSkeleton onClose={onClose} />
      
      <View style={[styles.scrollContent, {paddingTop: insets.top + 60}]}>
        <ImageSliderSkeleton />
        <VenueNameSkeleton />
        <DescriptionSkeleton />
        <InfoSkeleton />
        <AmenitiesSkeleton />
        <ImportantInfoSkeleton />
        <VenuePlansSkeleton />
        <MapSectionSkeleton />
        
        <View style={{height: 90}} />
      </View>

      <ActionsSkeleton />
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
});
