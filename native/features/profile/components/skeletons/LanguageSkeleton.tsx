import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Skeleton, useTheme} from '@/design-system';

export const LanguageSkeleton = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingTop: insets.top},
      ]}>
      <View style={styles.header}>
        <Skeleton width={24} height={24} style={{marginRight: 16}} />
        <Skeleton width="50%" height={24} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Skeleton width="70%" height={28} style={{marginBottom: 24}} />
          
          <View style={[styles.searchBarSkeleton, {backgroundColor: colors.card}]}>
            <Skeleton width={24} height={24} style={{marginRight: 8}} />
            <Skeleton width="80%" height={18} />
          </View>
          
          <View style={styles.languageList}>
            {[1, 2, 3, 4, 5, 6].map(item => (
              <View 
                key={item} 
                style={[
                  styles.languageItem, 
                  {backgroundColor: colors.card}
                ]}
              >
                <View style={styles.languageInfo}>
                  <Skeleton width={30} height={20} style={{marginRight: 12}} />
                  <Skeleton width="50%" height={18} />
                </View>
                <Skeleton width={24} height={24} borderRadius={12} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  searchBarSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  languageList: {
    marginTop: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 