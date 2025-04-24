import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Skeleton, useTheme} from '@/design-system';

export const FavoritesScreenSkeleton = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  const renderSkeletonItem = (key: number) => (
    <View 
      key={key}
      style={[styles.skeletonItem, {backgroundColor: colors.card}]}
    >
      <Skeleton style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <Skeleton style={{height: 20, width: '60%', marginBottom: 12}} />

        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.textSecondary,
              opacity: 0.5,
              marginRight: 8,
            }}
          />
          <Skeleton style={{height: 16, width: '70%'}} />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.textSecondary,
              opacity: 0.5,
              marginRight: 8,
            }}
          />
          <Skeleton style={{height: 16, width: '80%'}} />
        </View>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingTop: insets.top},
      ]}>
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Skeleton
            style={{width: 40, height: 40, borderRadius: 20, marginRight: 16}}
          />
          <Skeleton style={{width: 150, height: 26}} />
        </View>
        <Skeleton
          style={{width: '100%', height: 50, borderRadius: 8, marginTop: 16}}
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {[1, 2, 3, 4, 5].map(key => renderSkeletonItem(key))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  skeletonItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
  },
}); 