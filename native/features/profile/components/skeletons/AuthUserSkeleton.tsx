import { Skeleton, useTheme } from '@/design-system';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  settingsButton: {
    padding: 8,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  avatarSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  actionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  scheduleContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  schedulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scheduleCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 8,
    height: 140,
  },
});

export const AuthUserSkeleton = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
        },
      ]}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.settingsButton}>
            <Skeleton width={24} height={24} />
          </View>
        </View>

        <View style={styles.userInfoContainer}>
          <Skeleton style={styles.avatarSkeleton} />
          <Skeleton width="70%" height={24} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={16} style={{ marginBottom: 24 }} />
        </View>

        <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
          <Skeleton width="60%" height={20} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={16} style={{ marginBottom: 16 }} />
          <Skeleton width="30%" height={32} borderRadius={16} />
        </View>

        <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.actionItemContainer, { borderBottomColor: colors.border }]}>
            <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View style={[styles.actionItemContainer, { borderBottomColor: colors.border }]}>
            <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View style={[styles.actionItemContainer, { borderBottomColor: colors.border }]}>
            <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View style={[styles.actionItemContainer, { borderBottomColor: colors.border }]}>
            <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View
            style={[
              styles.actionItemContainer,
              { borderBottomColor: colors.border, borderBottomWidth: 0 },
            ]}>
            <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>
        </View>

        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleHeader}>
            <Skeleton width="40%" height={20} />
            <Skeleton width="20%" height={16} />
          </View>

          <View style={styles.schedulesGrid}>
            <Skeleton style={styles.scheduleCard} />
            <Skeleton style={styles.scheduleCard} />
            <Skeleton style={styles.scheduleCard} />
            <Skeleton style={styles.scheduleCard} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
