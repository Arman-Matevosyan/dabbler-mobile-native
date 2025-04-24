import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/design-system';
import {
  SearchSkeleton,
  MapSkeleton,
  BottomSheetSkeleton,
} from './VenueSkeleton';

export const VenuesScreenSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SearchSkeleton />
      <MapSkeleton />
      <BottomSheetSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});

export default VenuesScreenSkeleton;
