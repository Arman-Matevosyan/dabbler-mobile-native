import React, {lazy, Suspense, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet, Platform, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme, Skeleton} from '@design-system';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProfileSkeleton} from '@/features/profile';
import {VenuesScreenSkeleton} from '@/features/venues/components/VenuesScreenSkeleton';
import {ClassesScreenSkeleton} from '@/features/classes/components/ClassesScreenSkeleton';
import {useAuthStore} from '@/stores/authStore';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const LazyVenuesNavigator = lazy(() =>
  import('@/features/venues').then(m => ({default: m.VenuesNavigator})),
);
const LazyClassesNavigator = lazy(() =>
  import('@/features/classes').then(m => ({default: m.ClassesNavigator})),
);
const LazyCheckInNavigator = lazy(() =>
  import('@/features/check-in').then(m => ({default: m.CheckInNavigator})),
);
const LazyProfileNavigator = lazy(() =>
  import('@/features/profile').then(m => ({default: m.ProfileNavigator})),
);

const GenericScreenFallback = () => {
  const {colors} = useTheme();
  return (
    <View
      style={[styles.fallbackContainer, {backgroundColor: colors.background}]}>
      <Skeleton width="80%" height={50} style={{marginBottom: 16}} />
      <Skeleton width="100%" height="70%" style={{borderRadius: 8}} />
    </View>
  );
};

const VenuesNavigatorWithSuspense = () => (
  <Suspense fallback={<VenuesScreenSkeleton />}>
    <LazyVenuesNavigator />
  </Suspense>
);

const ClassesNavigatorWithSuspense = () => (
  <Suspense fallback={<ClassesScreenSkeleton />}>
    <LazyClassesNavigator />
  </Suspense>
);

const CheckInNavigatorWithSuspense = () => (
  <Suspense fallback={<GenericScreenFallback />}>
    <LazyCheckInNavigator />
  </Suspense>
);

const ProfileNavigatorWithSuspense = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <LazyProfileNavigator />
  </Suspense>
);

const TabNavigator = () => {
  const {colors} = useTheme();
  const {isAuthenticated, hasActiveSubscription, initialize} = useAuthStore();
  useEffect(() => {
    const initializeAuth = async () => {
      await initialize();
    };
    initializeAuth();
  }, [initialize]);

  const renderProfileIcon = ({color, size}: {color: string; size: number}) => (
    <View style={styles.iconContainer}>
      <Icon name="person" color={color} size={size} />
      {isAuthenticated && !hasActiveSubscription && (
        <View style={styles.notificationBadge} />
      )}
    </View>
  );

  return (
    <Tab.Navigator
      initialRouteName="Venues"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarButton: props => (
          <Pressable
            {...props}
            android_ripple={{color: 'transparent'}}
            style={({pressed}) => [props.style, {opacity: 1}]}
          />
        ),
      }}>
      <Tab.Screen
        name="Venues"
        component={VenuesNavigatorWithSuspense}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) || 'VenuesList';
          const hideTabBarScreens = ['VenueDetails', 'VenueClassesList'];
          const tabBarStyle = hideTabBarScreens.includes(routeName)
            ? {display: 'none' as const}
            : {display: 'flex' as const};

          return {
            tabBarIcon: ({color, size}) => (
              <Icon name="place" size={size} color={color} />
            ),
            tabBarStyle,
          };
        }}
      />

      <Tab.Screen
        name="Classes"
        component={ClassesNavigatorWithSuspense}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) || 'ClassScreen';
          const hideTabBarScreens = ['ClassDetails'];
          const tabBarStyle = hideTabBarScreens.includes(routeName)
            ? {display: 'none' as const}
            : {display: 'flex' as const};

          return {
            tabBarIcon: ({color, size}) => (
              <Icon name="calendar-today" size={size} color={color} />
            ),
            tabBarStyle,
          };
        }}
      />

      <Tab.Screen
        name="CheckIn"
        component={CheckInNavigatorWithSuspense}
        options={({route}) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) || 'CheckInMain';
          const hideTabBarScreens = ['CheckInListScreen'];
          const tabBarStyle = hideTabBarScreens.includes(routeName)
            ? {display: 'none' as const}
            : {display: 'flex' as const};

          return {
            tabBarLabel: 'Check-in',
            tabBarIcon: ({color, size}) => (
              <Icon name="qr-code-scanner" size={size} color={color} />
            ),
            tabBarStyle,
          };
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileNavigatorWithSuspense}
        options={({route}) => {
          const routeName = getFocusedRouteNameFromRoute(route) || 'AuthUser';
          const hideTabBarScreens = [
            'Settings',
            'ProfileDetails',
            'Display',
            'Plans',
            'Language',
            'Favorites',
            'CheckinHistory',
            'Membership',
            'Payment',
          ];
          const tabBarStyle = hideTabBarScreens.includes(routeName)
            ? {display: 'none' as const}
            : {display: 'flex' as const};

          return {
            tabBarIcon: renderProfileIcon,
            tabBarStyle,
          };
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F44336',
    borderWidth: 1,
    borderColor: 'white',
  },
});
