import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const DisplaySkeleton = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
        <Skeleton width="40%" height={24} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Skeleton width="70%" height={28} style={{ marginBottom: 24 }} />

          <View style={styles.section}>
            <Skeleton width="50%" height={20} style={{ marginBottom: 16 }} />
            <View style={[styles.optionContainer, { backgroundColor: colors.card }]}>
              {[1, 2].map(item => (
                <View key={item} style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Skeleton width={24} height={24} style={{ marginRight: 12 }} />
                    <Skeleton width="60%" height={18} />
                  </View>
                  <Skeleton width={24} height={24} borderRadius={12} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />
            <View style={[styles.optionContainer, { backgroundColor: colors.card }]}>
              {[1, 2, 3].map(item => (
                <View key={item} style={[styles.optionItem, { borderBottomColor: colors.border }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Skeleton width={24} height={24} style={{ marginRight: 12 }} />
                    <Skeleton width="70%" height={18} />
                  </View>
                  <Skeleton width={40} height={24} borderRadius={12} />
                </View>
              ))}
            </View>
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
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  optionContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});
