import React, {lazy, Suspense} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useTheme} from '@/design-system';
import {VenuesScreenSkeleton} from './components/VenuesScreenSkeleton';
import {VenueDetailsScreenSkeleton} from './screens/details/components/VenueDetailsScreenSkeleton';
import VenueClassesPage from './screens/list/VenueClassesList';

const VenuesScreen = lazy(() => import('./VenuesScreen'));
const VenueDetailsScreen = lazy(
  () => import('./screens/details/VenueDetailsScreen'),
);

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
  const navigation = props.navigation;

  return (
    <Suspense
      fallback={
        <VenueDetailsScreenSkeleton onClose={() => navigation.goBack()} />
      }>
      <VenueDetailsScreen {...props} />
    </Suspense>
  );
};

const Stack = createNativeStackNavigator<VenuesStackParamList>();

export const VenuesNavigator = () => {
  const {colors} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="VenuesList"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
      }}>
      <Stack.Screen name="VenuesList" component={VenuesScreenWrapper} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreenWrapper} />
      <Stack.Screen
        name="VenueClassesList"
        component={VenueClassesPage}
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
