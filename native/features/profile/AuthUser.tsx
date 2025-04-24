import {useTheme, Skeleton} from '@/design-system';
import {useNavigation} from '@react-navigation/native';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserInfoCard from './components/UserInfoCard';
import ProfileActions from './components/ProfileActions';
import {MembershipStatus, MySchedules} from './components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMemo} from 'react';
import {useAuthStore} from '@/stores/authStore';
import {useUser} from '@/hooks/useUser';
import {launchImageLibrary} from 'react-native-image-picker';
import {AxiosError} from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';

export const ProfileSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View
      style={[styles.skeletonContainer, {backgroundColor: colors.background}]}>
      <View style={styles.headerContainer}>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
      <Skeleton style={styles.avatarSkeleton} />
      <Skeleton width="80%" height={24} style={{alignSelf: 'center'}} />
      <Skeleton
        width="50%"
        height={16}
        style={{alignSelf: 'center', marginBottom: 24}}
      />

      <Skeleton width="100%" height={100} style={styles.cardSkeleton} />
      <Skeleton width="100%" height={150} style={styles.cardSkeleton} />
      <Skeleton width="100%" height={120} style={styles.cardSkeleton} />
    </View>
  );
};

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
  skeletonContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  avatarSkeleton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardSkeleton: {
    borderRadius: 8,
    marginBottom: 16,
  },
});

interface FileData {
  uri: string;
  type: string;
  name: string;
}

const AuthenticatedProfile: React.FC = () => {
  const {colors} = useTheme();
  const router = useNavigation();
  const {isLoading, uploadAvatar, isUploading} = useAuthStore();
  const insets = useSafeAreaInsets();
  const {data: user} = useUser();
  const {t} = useTranslation();

  const handleAvatarUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 800,
        maxWidth: 800,
        quality: 0.8,
      });

      if (result.didCancel || !result.assets?.[0]) return;

      const asset = result.assets[0];
      if (!asset.uri) return;

      const fileType = asset.uri.split('.').pop() || 'jpg';

      const fileData: FileData = {
        uri: asset.uri,
        type: asset.type || `image/${fileType}`,
        name: asset.fileName || `avatar.${fileType}`,
      };

      const formData = new FormData();
      formData.append('file', fileData as unknown as Blob);

      await uploadAvatar(formData);
    } catch (error) {
      const err = error as AxiosError;
      console.error('Upload failed:', err.response?.data || err.message);
    }
  };

  const handleNavigateToProfile = (path: string) => {
    router.navigate(path as never);
  };

  const userInfoCard = useMemo(
    () => (
      <UserInfoCard
        user={user as any}
        handleAvatarUpload={handleAvatarUpload}
        isAvatarUploadLoading={isUploading}
        title={t('profile.title')}
      />
    ),
    [user, handleAvatarUpload, isUploading, t],
  );

  const profileActions = useMemo(
    () => (
      <ProfileActions
        colors={{
          accentPrimary: colors.accent,
          textPrimary: colors.textPrimary,
          cardBackground: colors.background,
        }}
        translations={{
          settings: t('profile.settings.title'),
          preferences: t('profile.settings.preferences'),
          language: t('profile.language.title'),
          changeLanguage: t('profile.settings.changeLanguage'),
          history: t('profile.history.title'),
          checkinHistory: t('profile.history.checkinHistory'),
          support: t('profile.support.title'),
          contactUs: t('profile.support.contactUs'),
          about: t('profile.about.title'),
          version: t('profile.about.version'),
          logout: t('profile.logout')
        }}
      />
    ),
    [colors, t],
  );

  if (isLoading) {
    return <ProfileSkeleton />;
  }

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
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => handleNavigateToProfile('Settings')}
            activeOpacity={1}>
            <Icon name="settings" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        {userInfoCard}
        <MembershipStatus />
        {profileActions}
        <MySchedules />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AuthenticatedProfile;
