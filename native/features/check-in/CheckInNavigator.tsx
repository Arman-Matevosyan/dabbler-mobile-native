import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckInScreen from './CheckInScreen';
import CheckInListScreen from './screens/CheckinClassesScreen';
import {useTranslation} from 'react-i18next';

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

const Stack = createNativeStackNavigator<CheckInStackParamList>();

const CheckInNavigator = () => {
  const {t} = useTranslation();
  
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen 
        name="CheckIn" 
        component={CheckInScreen} 
        options={{title: t('checkin.checkIn')}}
      />
      <Stack.Screen 
        name="CheckInListScreen" 
        component={CheckInListScreen} 
        options={{title: t('checkin.checkins')}}
      />
    </Stack.Navigator>
  );
};

export default CheckInNavigator;
