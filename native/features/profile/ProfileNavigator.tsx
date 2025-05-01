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
  ProfileSkeleton,
} from './components/skeletons';

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

const WithDefaultSkeleton = (Component: React.ComponentType<any>) => (props: any) => (
  <Suspense fallback={<ProfileSkeleton />}>
    <Component {...props} />
  </Suspense>
);

export default function ProfileNavigator() {
  const { isAuthenticated, showSubscriptionModal, setShowSubscriptionModal } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UnAuth' }],
        }),
      );
    }
  }, [isAuthenticated]);

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? 'AuthUser' : 'UnAuth'}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="AuthUser" component={WithDefaultSkeleton(AuthenticatedProfile)} />
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
          <Stack.Screen name="UnAuth" component={WithDefaultSkeleton(UnAuthProfile)} />
        )}
      </Stack.Navigator>

      {showSubscriptionModal && <PlansModal onClose={() => setShowSubscriptionModal(false)} />}
    </>
  );
}
