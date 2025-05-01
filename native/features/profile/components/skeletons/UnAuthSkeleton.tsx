import { Skeleton, useTheme } from '@/design-system';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  authButton: {
    paddingVertical: 16,
    marginBottom: 8,
  },
});

export const UnAuthSkeleton = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.authContainer}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Skeleton width={120} height={120} borderRadius={60} style={{ marginBottom: 20 }} />

            <Skeleton width="70%" height={24} style={{ marginBottom: 8 }} />

            <Skeleton width="80%" height={32} style={{ marginBottom: 32 }} />
          </View>

          <View
            style={[styles.authButton, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
              <View>
                <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                <Skeleton width={180} height={14} />
              </View>
            </View>
          </View>

          <View
            style={[styles.authButton, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
              <View>
                <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
                <Skeleton width={180} height={14} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
