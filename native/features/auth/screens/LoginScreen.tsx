import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme, Input, Button, Text } from '@design-system';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { loginSchema, LoginFormData } from '@/validation/authSchemas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthStackNavigationProp, RootStackNavigationProp } from '@/navigation/types';
import { SocialLoginButtons } from '../components/SocialMediaButtons';
import { useTranslation } from 'react-i18next';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    replace: (screen: string) => void;
    reset: (config: any) => void;
  };
}

export const LoginScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const authNavigation = useNavigation<AuthStackNavigationProp>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginEmail: '',
      loginPassword: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login({ email: data.loginEmail, password: data.loginPassword });
      rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  {
                    name: 'Profile',
                    state: {
                      routes: [{ name: 'AuthUser' }],
                    },
                  },
                ],
              },
            },
          ],
        }),
      );
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text variant="heading1" bold>
            {t('auth.login.welcomeBack')}
          </Text>
          <Text variant="body" color="secondary">
            {t('auth.login.signInAccount')}
          </Text>
        </View>

        {error && (
          <View
            style={[
              styles.errorContainer,
              {
                backgroundColor: colors.background,
                borderColor: colors.accent,
              },
            ]}>
            <Text variant="body" color="accent">
              {error}
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <Controller
            control={control}
            name="loginEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.login.email')}
                placeholder={t('auth.login.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.loginEmail?.message}
                iconLeft="email"
              />
            )}
          />

          <Controller
            control={control}
            name="loginPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.login.password')}
                placeholder={t('auth.login.passwordPlaceholder')}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.loginPassword?.message}
                iconLeft="lock"
                iconRight={showPassword ? 'visibility' : 'visibility-off'}
                onIconRightPress={toggleShowPassword}
              />
            )}
          />

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => authNavigation.navigate('ForgotPassword')}>
            <Text variant="bodySmall" color="accent">
              {t('auth.login.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <Button
            title={isLoading ? t('auth.login.signingIn') : t('auth.login.signIn')}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={styles.submitButton}
          />

          {isLoading && (
            <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
          )}
        </View>

        <View style={styles.registerContainer}>
          <Text variant="bodySmall" color="secondary">
            {t('auth.login.dontHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => authNavigation.navigate('Signup')}>
            <Text variant="bodySmall" color="accent" semiBold>
              {t('auth.login.signUp')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={styles.dividerText}>{t('auth.login.or')}</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>
        <SocialLoginButtons />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  submitButton: {
    marginVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
  },
});
