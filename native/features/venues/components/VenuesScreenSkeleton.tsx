import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '@/design-system';
import {
  SearchSkeleton,
  MapSkeleton,
  BottomSheetSkeleton,
} from './VenueSkeleton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const VenuesScreenSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingTop: insets.top},
      ]}>
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
