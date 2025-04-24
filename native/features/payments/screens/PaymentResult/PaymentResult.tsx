import {Text, useTheme} from '@/design-system';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {usePaymentSubscribe, useVerifyPayment} from './hooks';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  PaymentStackParamList,
  RootStackNavigationProp,
} from '@/navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

type PaymentResultProps = NativeStackScreenProps<
  PaymentStackParamList,
  'PaymentResult'
>;

export default function PaymentResult({route}: PaymentResultProps) {
  const {t} = useTranslation();
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeTextAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.95)).current;

  const {colors, mode} = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const insets = useSafeAreaInsets();
  const {nonce, plan} = route.params || {};

  const {data: paymentData, isSuccess: isVerifyPaymentSuccess} =
    useVerifyPayment(nonce);

  const {mutate: subscribeToPlan, isSuccess: isSubscribeSuccess} =
    usePaymentSubscribe();

  useEffect(() => {
    if (isVerifyPaymentSuccess && paymentData?.id && plan) {
      subscribeToPlan({paymentMethodId: paymentData.id, planId: plan});
    }
  }, [isVerifyPaymentSuccess, paymentData, plan]);

  useEffect(() => {
    if (isSubscribeSuccess && isVerifyPaymentSuccess) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }),

        Animated.stagger(150, [
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),

          Animated.parallel([
            Animated.timing(fadeTextAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.out(Easing.ease),
            }),
            Animated.timing(translateYAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
              easing: Easing.out(Easing.back(1)),
            }),
          ]),

          Animated.parallel([
            Animated.timing(buttonFadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.spring(buttonScaleAnim, {
              toValue: 1,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }),
          ]),
        ]),
      ]).start();
    }
  }, [isSubscribeSuccess, isVerifyPaymentSuccess]);

  const goToHome = () => {
    navigation.navigate('MainTabs', {
      screen: 'Profile',
      params: {
        screen: 'AuthUser',
      },
    });
  };

  const renderLoadingState = () => (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>
          <Text
            style={[
              styles.loadingText,
              {color: colors.textPrimary, marginTop: 24},
            ]}>
            {t('payment.processing')}
          </Text>
          <Text style={[styles.loadingSubText, {color: colors.textSecondary}]}>
            {t('payment.pleaseWait')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderSuccessState = () => (
    <SafeAreaView
      style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{scale: scaleAnim}],
                backgroundColor: colors.success + '15',
                borderColor: colors.success + '30',
              },
            ]}>
            <MaterialIcons
              name="check-circle"
              size={90}
              color={colors.success}
            />
          </Animated.View>

          <Animated.View style={[styles.textContainer, {opacity: fadeAnim}]}>
            <Text style={[styles.title, {color: colors.textPrimary}]}>
              {t('payment.successful')}
            </Text>

            <Animated.View
              style={{
                opacity: fadeTextAnim,
                transform: [{translateY: translateYAnim}],
              }}>
              <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
                {t('payment.thankYou')}
              </Text>

              <Text style={[styles.details, {color: colors.textSecondary}]}>
                {t('payment.membershipActive')}
              </Text>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: buttonFadeAnim,
                transform: [{scale: buttonScaleAnim}],
              },
            ]}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: colors.accent}]}
              onPress={goToHome}
              activeOpacity={0.8}>
              <MaterialIcons
                name="check"
                size={22}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonText, {color: '#fff'}]}>
                {t('payment.continueToProfile')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );

  if (!isVerifyPaymentSuccess || !isSubscribeSuccess) {
    return renderLoadingState();
  }

  return renderSuccessState();
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 30,
    width: '85%',
    maxWidth: 350,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(51, 123, 226, 0.08)',
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  details: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 28,
    width: '90%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
