import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useClientToken } from './hooks/useClientToken';
import { Text, useTheme } from '@/design-system';
import { usePlans } from '@/hooks/usePlans';
import { IPlan } from '@/types/venues.interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PaymentStackNavigationProp, PaymentStackParamList } from '@/navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

type ProcessPaymentProps = NativeStackScreenProps<PaymentStackParamList, 'ProcessPayment'>;

export default function ProcessPayment({ route }: ProcessPaymentProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useClientToken();
  const token = Array.isArray(data) && data.length > 0 ? data[0].token : null;
  const merchantId = Array.isArray(data) && data.length > 0 ? data[0].merchantId : null;
  const { colors, mode } = useTheme();
  const navigation = useNavigation<PaymentStackNavigationProp>();
  const insets = useSafeAreaInsets();
  const { plan } = route.params;
  const { data: plans = [] } = usePlans();
  const currentPlan = plans.find((item: IPlan) => item.planId === plan || item.id === plan);

  const handleMessage = (event: any) => {
    try {
      const receivedData = JSON.parse(event.nativeEvent.data);
      const nonce = receivedData?.payload?.nonce;
      if (receivedData.action === 'paymentSuccess') {
        navigation.navigate('PaymentResult', {
          nonce,
          plan: currentPlan?.planId || currentPlan?.id || '',
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  if (isLoading && !merchantId && !token) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { marginTop: 20 }]}>{t('payment.preparingPayment')}</Text>
      </View>
    );
  }
  return (
    <WebView
      source={{
        uri: `https://dev-site.dabblerclub.com/payment?clientToken=${token}&merchantId=${merchantId}&planName=${currentPlan?.name}&currency=${currentPlan?.currencyIsoCode}&theme=${mode}&countryCode=${currentPlan?.countryCode}&price=${currentPlan?.price}`,
      }}
      onMessage={handleMessage}
      onShouldStartLoadWithRequest={request => {
        if (request.url.startsWith('dabbler://')) {
          Linking.openURL(request.url);
          return false;
        }
        return true;
      }}
      style={styles.flex}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
