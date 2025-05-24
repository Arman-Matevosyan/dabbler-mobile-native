import React, { Suspense, lazy } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import {
  LoginScreenSkeleton,
  SignupScreenSkeleton,
  ForgotPasswordScreenSkeleton,
} from './components/skeletons';
import { useTranslation } from 'react-i18next';

const LazyLoginScreen = lazy(() =>
  import('./screens/LoginScreen').then(module => ({
    default: module.LoginScreen,
  })),
);

const LazySignupScreen = lazy(() =>
  import('./screens/SignupScreen').then(module => ({
    default: module.SignupScreen,
  })),
);

const LazyForgotPasswordScreen = lazy(() =>
  import('./screens/ForgotPasswordScreen').then(module => ({
    default: module.ForgotPasswordScreen,
  })),
);

const Stack = createNativeStackNavigator<AuthStackParamList>();

const WithLoginSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<LoginScreenSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithSignupSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<SignupScreenSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithForgotPasswordSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<ForgotPasswordScreenSkeleton />}>
    <Component {...props} />
  </Suspense>
);

export const AuthNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Login"
        component={WithLoginSkeleton(LazyLoginScreen)}
        options={{ title: t('auth.signIn') }}
      />
      <Stack.Screen
        name="Signup"
        component={WithSignupSkeleton(LazySignupScreen)}
        options={{ title: t('auth.createAccount') }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={WithForgotPasswordSkeleton(LazyForgotPasswordScreen)}
        options={{ title: t('auth.resetPassword') }}
      />
    </Stack.Navigator>
  );
};
