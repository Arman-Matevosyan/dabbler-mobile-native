import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Skeleton, useTheme} from '@/design-system';

export const SettingsScreenSkeleton = () => {
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
        {[1, 2, 3].map(section => (
          <View key={section} style={{marginBottom: 24, padding: 16}}>
            <Skeleton width="40%" height={20} style={{marginBottom: 16}} />
            {[1, 2].map(item => (
              <View
                key={item}
                style={[
                  styles.settingItemSkeleton,
                  {backgroundColor: colors.card},
                ]}>
                <Skeleton width={24} height={24} style={{marginRight: 16}} />
                <View style={{flex: 1}}>
                  <Skeleton width="60%" height={16} style={{marginBottom: 4}} />
                  <Skeleton width="80%" height={14} />
                </View>
                <Skeleton width={16} height={16} />
              </View>
            ))}
          </View>
        ))}
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
  settingItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
}); 