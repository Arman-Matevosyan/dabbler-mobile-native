import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@/design-system';
import { VenuesScreenSkeleton, VenueClassesListScreenSkeleton } from './components/skeletons';
import { VenueDetailsScreenSkeleton } from './screens/details/components';

const VenuesScreen = lazy(() => import('./VenuesScreen'));
const VenueDetailsScreen = lazy(() => import('./screens/details/VenueDetailsScreen'));
const VenueClassesPage = lazy(() => import('./screens/list/VenueClassesList'));

export type VenuesStackParamList = {
  VenuesList: undefined;
  VenueDetails: {
    venueId: string;
  };
  VenueClassesList: {
    id: string;
  };
};

const VenuesScreenWrapper = (props: any) => (
  <Suspense fallback={<VenuesScreenSkeleton />}>
    <VenuesScreen {...props} />
  </Suspense>
);

const VenueDetailsScreenWrapper = (props: any) => {
  return (
    <Suspense fallback={<VenueDetailsScreenSkeleton />}>
      <VenueDetailsScreen {...props} />
    </Suspense>
  );
};

const VenueClassesPageWrapper = (props: any) => {
  return (
    <Suspense fallback={<VenueClassesListScreenSkeleton />}>
      <VenueClassesPage {...props} />
    </Suspense>
  );
};

const Stack = createNativeStackNavigator<VenuesStackParamList>();

export const VenuesNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="VenuesList"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="VenuesList" component={VenuesScreenWrapper} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreenWrapper} />
      <Stack.Screen
        name="VenueClassesList"
        component={VenueClassesPageWrapper}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack.Navigator>
  );
};

export default VenuesNavigator;
