import React, { useState } from 'react';
import {
  View,
  Text as RNText,
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
import { signupSchema, SignupFormData } from '@/validation/authSchemas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/stores/authStore';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SocialLoginButtons } from '../components/SocialMediaButtons';
import { AuthStackNavigationProp, RootStackNavigationProp } from '@/navigation/types';
import { useTranslation } from 'react-i18next';

export const SignupScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { signup, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const authNavigation = useNavigation<AuthStackNavigationProp>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      signupEmail: '',
      signupPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      clearError();
      await signup({
        email: data.signupEmail,
        password: data.signupPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
            },
          ],
        }),
      );
    } catch (error) {
      console.log('Signup error:', error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('auth.signup.createAccount')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('auth.signup.getStarted')}
          </Text>
        </View>

        {error && (
          <View
            style={[
              styles.errorContainer,
              { backgroundColor: colors.background, borderColor: colors.accent },
            ]}>
            <Text style={[styles.errorText, { color: colors.accent }]}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.signup.firstName')}
                placeholder={t('auth.signup.firstNamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                iconLeft="person"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.signup.lastName')}
                placeholder={t('auth.signup.lastNamePlaceholder')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                iconLeft="person"
              />
            )}
          />

          <Controller
            control={control}
            name="signupEmail"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.signup.email')}
                placeholder={t('auth.signup.emailPlaceholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.signupEmail?.message}
                iconLeft="email"
              />
            )}
          />

          <Controller
            control={control}
            name="signupPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.signup.password')}
                placeholder={t('auth.signup.passwordPlaceholder')}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.signupPassword?.message}
                iconLeft="lock"
                iconRight={showPassword ? 'visibility' : 'visibility-off'}
                onIconRightPress={toggleShowPassword}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={t('auth.signup.confirmPassword')}
                placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                secureTextEntry={!showConfirmPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                iconLeft="lock"
                iconRight={showConfirmPassword ? 'visibility' : 'visibility-off'}
                onIconRightPress={toggleShowConfirmPassword}
              />
            )}
          />

          <Button
            title={
              isLoading ? t('auth.signup.creatingAccount') : t('auth.signup.createAccountButton')
            }
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            style={styles.submitButton}
          />

          {isLoading && (
            <ActivityIndicator size="small" color={colors.accent} style={styles.loader} />
          )}
        </View>

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            {t('auth.signup.alreadyHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => authNavigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: colors.accent }]}>
              {' '}
              {t('auth.signup.signIn')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={styles.dividerText}>{t('auth.signup.or')}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    marginBottom: 24,
  },
  submitButton: {
    marginVertical: 8,
  },
  loader: {
    marginTop: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
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
