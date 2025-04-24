import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useTheme, Input, Button} from '@design-system';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, Controller} from 'react-hook-form';
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from '@/validation/authSchemas';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuthStore} from '@/stores/authStore';
import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationProp} from '@/navigation/types';
import {useTranslation} from 'react-i18next';

export const ForgotPasswordScreen = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const {forgotPassword, isLoading, error, clearError} = useAuthStore();
  const [success, setSuccess] = React.useState(false);
  const navigation = useNavigation<AuthStackNavigationProp>();
  const {t} = useTranslation();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      console.log('Forgot password failed:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingTop: insets.top},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          {paddingBottom: insets.bottom},
        ]}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.textPrimary}]}>
            {t('auth.forgotPassword.resetPassword')}
          </Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            {t('auth.forgotPassword.instructions')}
          </Text>
        </View>

        {error && (
          <View
            style={[
              styles.errorContainer,
              {backgroundColor: colors.background, borderColor: colors.accent},
            ]}>
            <Text style={[styles.errorText, {color: colors.accent}]}>
              {error}
            </Text>
          </View>
        )}

        {success ? (
          <View style={styles.successContainer}>
            <View
              style={[
                styles.successIconContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.accent,
                },
              ]}>
              <Icon name="check-circle" size={48} color={colors.accent} />
            </View>
            <Text style={[styles.successTitle, {color: colors.textPrimary}]}>
              {t('auth.forgotPassword.emailSent')}
            </Text>
            <Text
              style={[styles.successMessage, {color: colors.textSecondary}]}>
              {t('auth.forgotPassword.emailSentMessage')}
            </Text>
            <Button
              title={t('auth.forgotPassword.backToLogin')}
              onPress={() => navigation.navigate('Login')}
              style={styles.backToLoginButton}
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <Input
                  label={t('auth.forgotPassword.email')}
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  iconLeft="email"
                />
              )}
            />

            <Button
              title={
                isLoading
                  ? t('auth.forgotPassword.sending')
                  : t('auth.forgotPassword.resetPasswordButton')
              }
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              style={styles.submitButton}
            />

            {isLoading && (
              <ActivityIndicator
                size="small"
                color={colors.accent}
                style={styles.loader}
              />
            )}
          </View>
        )}
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
  backButton: {
    marginBottom: 16,
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
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  backToLoginButton: {
    width: '100%',
  },
});
