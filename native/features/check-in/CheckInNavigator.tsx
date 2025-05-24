import React, { Suspense, lazy } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckInScreen from './CheckInScreen';
import { useTranslation } from 'react-i18next';
import { CheckInScreenSkeleton } from './components';

const CheckInListScreen = lazy(() =>
  import('./screens').then(module => ({
    default: module.default,
  })),
);

export type CheckInStackParamList = {
  CheckIn: undefined;
  CheckInListScreen: {
    data: {
      freeClasses: any[];
      scheduledClasses: any[];
    };
    isLoading?: boolean;
  };
};

const CheckInScreenWrapper = (props: any) => (
  <Suspense fallback={<CheckInScreenSkeleton />}>
    <CheckInListScreen {...props} />
  </Suspense>
);

const Stack = createNativeStackNavigator<CheckInStackParamList>();

const CheckInNavigator = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{ title: t('checkin.title') }}
      />
      <Stack.Screen
        name="CheckInListScreen"
        component={CheckInScreenWrapper}
        options={{ title: t('checkin.titles') }}
      />
    </Stack.Navigator>
  );
};

export default CheckInNavigator;
