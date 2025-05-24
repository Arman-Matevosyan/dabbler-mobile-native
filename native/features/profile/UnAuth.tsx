import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/design-system';
import { Text } from '@/design-system/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const UnauthenticatedProfile: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const handleLogin = () => {
    navigation.navigate('Auth', {
      screen: 'Login',
    });
  };

  const handleSignup = () => {
    navigation.navigate('Auth', {
      screen: 'Signup',
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.authContainer}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.border }]}>
              <Icon name="person" size={60} color={colors.textSecondary} />
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                color: colors.textPrimary,
              }}>
              {t('profile.welcomeToDabbler')}
            </Text>

            <Text
              style={{
                textAlign: 'center',
                marginTop: 8,
                marginBottom: 32,
                color: colors.textSecondary,
                fontSize: 16,
                maxWidth: '80%',
              }}>
              {t('profile.signInToAccess')}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.authButton,
              {
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handleLogin}
            activeOpacity={1}>
            <View style={styles.authButtonContent}>
              <View style={[styles.authButtonIcon, { backgroundColor: colors.background }]}>
                <Icon name="login" size={20} color={colors.textPrimary} />
              </View>
              <View style={styles.authButtonTextContainer}>
                <Text style={[styles.authButtonText, { color: colors.textPrimary }]}>
                  {t('auth.login')}
                </Text>
                <Text style={[styles.authButtonSubtext, { color: colors.textSecondary }]}>
                  {t('auth.signInAccount')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.authButton,
              {
                backgroundColor: 'transparent',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={handleSignup}
            activeOpacity={1}>
            <View style={styles.authButtonContent}>
              <View style={[styles.authButtonIcon, { backgroundColor: colors.background }]}>
                <Icon name="person-add" size={20} color={colors.textPrimary} />
              </View>
              <View style={styles.authButtonTextContainer}>
                <Text style={[styles.authButtonText, { color: colors.textPrimary }]}>
                  {t('auth.signup')}
                </Text>
                <Text style={[styles.authButtonSubtext, { color: colors.textSecondary }]}>
                  {t('auth.createAccount')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  authButton: {
    paddingVertical: 16,
    marginBottom: 8,
  },
  authButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  authButtonTextContainer: {
    flex: 1,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  authButtonSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default UnauthenticatedProfile;
