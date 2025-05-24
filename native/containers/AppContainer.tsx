import React from 'react';
import { useTheme, ToastProvider } from '@/design-system';
import RootNavigator from '@/navigation/RootNavigator';
import { linking } from '@/services/linking/linking';
import { useAuthStore } from '@/stores/authStore';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { Linking, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const AppContainer = () => {
  const { colors, mode } = useTheme();
  const systemPreference = useColorScheme();
  const isDarkMode =
    mode === 'dark' || ((mode as string) === 'system' && systemPreference === 'dark');
  const { handleSocialAuthCallback } = useAuthStore();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      console.log('event', event);
      if (!event.url.startsWith('dabbler://social-auth')) return;

      const queryString = event.url.split('?')[1] || '';
      const params = queryString.split('&').reduce((acc: Record<string, string>, pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {});
      const token = params.token;

      if (token) {
        handleSocialAuthCallback(token);
      }
    };

    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({ url });
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [handleSocialAuthCallback]);

  const navigationTheme = isDarkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.accent,
          background: colors.background,
          card: colors.background,
          text: colors.textPrimary,
          border: colors.border,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.accent,
          background: colors.background,
          card: colors.background,
          text: colors.textPrimary,
          border: colors.border,
        },
      };

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <NavigationContainer theme={navigationTheme} linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};
