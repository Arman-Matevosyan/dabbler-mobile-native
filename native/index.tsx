import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Linking, StatusBar, useColorScheme, Alert} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, useTheme} from '@design-system';
import {queryClient} from '@/config/queryClient';
import RootNavigator from '@/navigation/RootNavigator';
import {ErrorBoundary} from '@/components/ErrorBoundary';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {firebaseMessaging} from '@/services/firebase/messaging';
import {initializeFirebase} from '@/services/firebase';
import {useAuthStore} from './stores/authStore';
import '@/services/i18n';

const AppContainer = () => {
  const {colors, mode} = useTheme();
  const systemPreference = useColorScheme();
  const isDarkMode =
    mode === 'dark' ||
    ((mode as string) === 'system' && systemPreference === 'dark');
  const {handleSocialAuthCallback} = useAuthStore();

  useEffect(() => {
    const handleDeepLink = (event: {url: string}) => {
      if (!event.url.startsWith('dabbler://social-auth')) return;

      const queryString = event.url.split('?')[1] || '';
      const params = queryString
        .split('&')
        .reduce((acc: Record<string, string>, pair) => {
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
      if (url) handleDeepLink({url});
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [handleSocialAuthCallback]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeNotifications: (() => void) | null = null;

    const setupNotifications = async () => {
      try {
        await initializeFirebase();

        if (isMounted) {
          const unsubscribe = await firebaseMessaging.setupNotifications();
          if (isMounted) {
            unsubscribeNotifications = unsubscribe;
          } else if (unsubscribe) {
            unsubscribe();
          }
        }
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
        if (isMounted) {
          Alert.alert(
            'Notification Error',
            'Unable to initialize notifications. Some features may be limited.',
            [{text: 'OK'}],
          );
        }
      }
    };

    setupNotifications();

    return () => {
      isMounted = false;
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, []);

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
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider>
        <ErrorBoundary>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <AppContainer />
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </SafeAreaProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
