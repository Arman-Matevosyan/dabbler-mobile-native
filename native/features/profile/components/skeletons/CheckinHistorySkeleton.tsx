import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Skeleton, useTheme} from '@/design-system';

export const CheckinHistorySkeleton = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();

  const renderCheckinItem = (key: number) => (
    <View 
      key={key}
      style={[styles.checkinItem, {backgroundColor: colors.card}]}
    >
      <View style={styles.checkinHeader}>
        <Skeleton width={120} height={18} style={{marginBottom: 4}} />
        <Skeleton width={80} height={14} />
      </View>
      
      <View style={styles.venueDetails}>
        <Skeleton 
          width={60} 
          height={60} 
          style={{borderRadius: 8, marginRight: 12}} 
        />
        <View style={{flex: 1}}>
          <Skeleton width="80%" height={18} style={{marginBottom: 6}} />
          <Skeleton width="60%" height={14} style={{marginBottom: 4}} />
          <Skeleton width="40%" height={14} />
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
      <View style={styles.header}>
        <Skeleton width={24} height={24} style={{marginRight: 16}} />
        <Skeleton width="60%" height={24} />
      </View>
      
      <View style={styles.filterSection}>
        <Skeleton 
          width="70%" 
          height={36} 
          style={{borderRadius: 18}} 
        />
        <Skeleton 
          width={36} 
          height={36} 
          style={{borderRadius: 18, marginLeft: 8}} 
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.monthSection}>
            <Skeleton width={120} height={20} style={{marginBottom: 16}} />
            {[1, 2, 3].map(item => renderCheckinItem(item))}
          </View>
          
          <View style={styles.monthSection}>
            <Skeleton width={100} height={20} style={{marginBottom: 16}} />
            {[4, 5].map(item => renderCheckinItem(item))}
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
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  monthSection: {
    marginBottom: 24,
  },
  checkinItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkinHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 8,
  },
  venueDetails: {
    flexDirection: 'row',
  },
}); 