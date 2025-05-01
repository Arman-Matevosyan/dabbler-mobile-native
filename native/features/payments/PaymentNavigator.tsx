import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProcessPayment from './screens/ProcessPayment/ProcessPayment';
import PaymentResult from './screens/PaymentResult/PaymentResult';
import { PaymentStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<PaymentStackParamList>();

export const PaymentNavigator = () => (
  <Stack.Navigator initialRouteName="ProcessPayment" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProcessPayment" component={ProcessPayment} />
    <Stack.Screen name="PaymentResult" component={PaymentResult} />
  </Stack.Navigator>
);
