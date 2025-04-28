import {Skeleton, useTheme} from '@/design-system';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  },
  actionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
});

export const ProfileSkeleton = () => {
  const {colors} = useTheme();
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
          <Skeleton width="70%" height={24} style={{marginBottom: 8}} />
          <Skeleton width="50%" height={16} style={{marginBottom: 24}} />
        </View>

        <View style={styles.cardContainer}>
          <Skeleton width="100%" height={100} borderRadius={8} />
        </View>

        <View style={styles.cardContainer}>
          <View
            style={[
              styles.actionItemContainer,
              {borderBottomColor: colors.border},
            ]}>
            <Skeleton
              width={40}
              height={40}
              borderRadius={20}
              style={{marginRight: 16}}
            />
            <View style={{flex: 1}}>
              <Skeleton width="40%" height={16} style={{marginBottom: 4}} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View
            style={[
              styles.actionItemContainer,
              {borderBottomColor: colors.border},
            ]}>
            <Skeleton
              width={40}
              height={40}
              borderRadius={20}
              style={{marginRight: 16}}
            />
            <View style={{flex: 1}}>
              <Skeleton width="40%" height={16} style={{marginBottom: 4}} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View
            style={[
              styles.actionItemContainer,
              {borderBottomColor: colors.border},
            ]}>
            <Skeleton
              width={40}
              height={40}
              borderRadius={20}
              style={{marginRight: 16}}
            />
            <View style={{flex: 1}}>
              <Skeleton width="40%" height={16} style={{marginBottom: 4}} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View
            style={[
              styles.actionItemContainer,
              {borderBottomColor: colors.border},
            ]}>
            <Skeleton
              width={40}
              height={40}
              borderRadius={20}
              style={{marginRight: 16}}
            />
            <View style={{flex: 1}}>
              <Skeleton width="40%" height={16} style={{marginBottom: 4}} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>

          <View
            style={[
              styles.actionItemContainer,
              {borderBottomColor: colors.border},
            ]}>
            <Skeleton
              width={40}
              height={40}
              borderRadius={20}
              style={{marginRight: 16}}
            />
            <View style={{flex: 1}}>
              <Skeleton width="40%" height={16} style={{marginBottom: 4}} />
              <Skeleton width="60%" height={14} />
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Skeleton width="100%" height={120} borderRadius={8} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
