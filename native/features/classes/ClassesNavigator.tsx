import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClassesScreen from './ClassesScreen';
import { useTheme } from '@/design-system';
import { ClassesScreenSkeleton } from './components';

const ClassDetailsScreen = lazy(() =>
  import('./screens/details/ClassDetailsScreen').then(module => {
    return { default: module.default || module };
  }),
);

export type ClassesStackParamList = {
  ClassesList: undefined;
  ClassDetails: {
    id: string;
    date?: string;
  };
  ClassScreen: undefined;
};

const Stack = createNativeStackNavigator<ClassesStackParamList>();

const ClassesScreenWrapper = (props: any) => (
  <Suspense fallback={<ClassesScreenSkeleton />}>
    <ClassesScreen {...props} />
  </Suspense>
);

const ClassDetailsScreenWrapper = (props: any) => (
  <Suspense fallback={<ClassesScreenSkeleton />}>
    <ClassDetailsScreen {...props} />
  </Suspense>
);

export const ClassesNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="ClassScreen"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="ClassScreen" component={ClassesScreenWrapper} />
      <Stack.Screen name="ClassDetails" component={ClassDetailsScreenWrapper} />
    </Stack.Navigator>
  );
};

export default ClassesNavigator;
