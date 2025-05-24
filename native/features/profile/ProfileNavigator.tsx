import React, { lazy, Suspense, useEffect } from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import { useAuthStore } from '@/stores/authStore';
import { CommonActions, useNavigation } from '@react-navigation/native';
import PlansModal from './modals/PlansModal';
import {
  SettingsScreenSkeleton,
  ProfileDetailsSkeleton,
  FavoritesScreenSkeleton,
  DisplaySkeleton,
  LanguageSkeleton,
  MembershipSkeleton,
  PaymentSkeleton,
  PlansSkeleton,
  CheckinHistorySkeleton,
  UnAuthSkeleton,
  AuthUserSkeleton,
} from './components/skeletons';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';

export type ProfileStackParamList = {
  AuthUser: undefined;
  UnAuth: undefined;
  Settings: undefined;
  ProfileDetails: undefined;
  Display: undefined;
  Language: undefined;
  Favorites: undefined;
  CheckinHistory: undefined;
  Membership: undefined;
  Payment: undefined;
  Plans: undefined;
};

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = StackScreenProps<
  ProfileStackParamList,
  T
>;

const UnAuthProfile = lazy(() => import('./UnAuth'));

const AuthenticatedProfile = lazy(() => import('./AuthUser'));
const SettingsScreen = lazy(() =>
  import('./screens/settings/SettingsScreen').then(module => ({
    default: module.SettingsScreen,
  })),
);
const Display = lazy(() =>
  import('./screens/display/Display').then(module => ({
    default: module.DisplayScreen,
  })),
);
const Language = lazy(() => import('./screens/language/LanguageScreen'));
const Details = lazy(() =>
  import('./screens/details/Details').then(module => ({
    default: module.ProfileDetailsScreen,
  })),
);
const Plans = lazy(() => import('./screens/plans/Plans'));
const FavoriteScreen = lazy(() =>
  import('./screens/favorites/FavoriteScreen').then(module => ({
    default: module.FavoritesScreen,
  })),
);
const CheckinHistory = lazy(() => import('./screens/history/CheckinHistory'));
const Membership = lazy(() => import('./screens/membership/Membership'));
const Payment = lazy(() => import('./screens/payment/Payment'));

const Stack = createStackNavigator<ProfileStackParamList>();

const WithSettingsSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<SettingsScreenSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithProfileDetailsSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<ProfileDetailsSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithDisplaySkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<DisplaySkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithLanguageSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<LanguageSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithFavoritesSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<FavoritesScreenSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithCheckinHistorySkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<CheckinHistorySkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithMembershipSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<MembershipSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithPaymentSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<PaymentSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithPlansSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<PlansSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithUnAuthSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<UnAuthSkeleton />}>
    <Component {...props} />
  </Suspense>
);

const WithAuthUserSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<AuthUserSkeleton />}>
    <Component {...props} />
  </Suspense>
);

export default function ProfileNavigator() {
  const { isAuthenticated, showSubscriptionModal, setShowSubscriptionModal, isLoading } =
    useAuthStore();
  const { colors } = useTheme();

  if (!isAuthenticated && isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="UnAuth">
            <Stack.Screen name="UnAuth" component={WithUnAuthSkeleton(UnAuthProfile)} />
          </Stack.Navigator>
        </View>

        <View style={[styles.overlay, { backgroundColor: colors.background + 'CC' }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? 'AuthUser' : 'UnAuth'}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="AuthUser" component={WithAuthUserSkeleton(AuthenticatedProfile)} />
            <Stack.Screen name="Settings" component={WithSettingsSkeleton(SettingsScreen)} />
            <Stack.Screen name="ProfileDetails" component={WithProfileDetailsSkeleton(Details)} />
            <Stack.Screen name="Display" component={WithDisplaySkeleton(Display)} />
            <Stack.Screen name="Plans" component={WithPlansSkeleton(Plans)} />
            <Stack.Screen name="Language" component={WithLanguageSkeleton(Language)} />
            <Stack.Screen name="Favorites" component={WithFavoritesSkeleton(FavoriteScreen)} />
            <Stack.Screen
              name="CheckinHistory"
              component={WithCheckinHistorySkeleton(CheckinHistory)}
            />
            <Stack.Screen name="Membership" component={WithMembershipSkeleton(Membership)} />
            <Stack.Screen name="Payment" component={WithPaymentSkeleton(Payment)} />
          </>
        ) : (
          <Stack.Screen name="UnAuth" component={WithUnAuthSkeleton(UnAuthProfile)} />
        )}
      </Stack.Navigator>

      {showSubscriptionModal && <PlansModal onClose={() => setShowSubscriptionModal(false)} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
