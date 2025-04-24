import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import {AuthNavigator} from '@/features/auth/AuthNavigator';
import {PaymentNavigator} from '@/features/payments/PaymentNavigator';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="PaymentScreens" component={PaymentNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
