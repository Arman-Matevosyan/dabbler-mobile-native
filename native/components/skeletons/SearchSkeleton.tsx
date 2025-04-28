import {Skeleton, useTheme} from '@/design-system';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const SearchSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.searchSkeleton,
        {backgroundColor: colors.card, paddingTop: insets.top},
      ]}>
      <View style={styles.searchBarContainer}>
        <Skeleton width="100%" height={48} style={{borderRadius: 24}} />
      </View>
      <View style={styles.categoriesContainer}>
        <Skeleton
          width={150}
          height={36}
          style={{
            borderRadius: 18,
            marginRight: 8,
          }}
        />
        <Skeleton width={100} height={16} style={{alignSelf: 'center'}} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  searchSkeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    paddingBottom: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBarContainer: {
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
});
