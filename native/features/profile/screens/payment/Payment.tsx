import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Text, Button, useTheme, Skeleton} from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {IPaymentMethod} from '@/types/payment.interfaces';
import {usePaymentMethods} from './hooks/usePaymentMethods';

const PaymentMethodSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.detailItem,
        {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingVertical: 16,
        },
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Skeleton width={40} height={24} style={{marginRight: 16}} />
        <View>
          <Skeleton width={150} height={16} style={{marginBottom: 8}} />
          <Skeleton width={100} height={14} />
        </View>
      </View>
    </View>
  );
};

export const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {data: paymentMethods, isLoading} = usePaymentMethods();
  const hasPaymentMethods = paymentMethods && paymentMethods.length > 0;

  const renderHeader = () => (
    <View style={[styles.header, {borderBottomColor: colors.border}]}>
      <Button
        variant="ghost"
        onPress={() => navigation.goBack()}
        icon={
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={colors.textPrimary}
          />
        }
        style={styles.backButton}
      />
      <Text variant="heading1">Payment Methods</Text>
    </View>
  );

  const renderNoPaymentMethods = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="credit-card-off"
        size={90}
        color={colors.accent}
        style={{marginBottom: 20}}
      />

      <Text
        variant="heading2"
        style={{
          textAlign: 'center',
          marginBottom: 20,
        }}>
        No Payment Methods
      </Text>

      <Text
        variant="bodySmall"
        color="secondary"
        style={{
          textAlign: 'center',
          marginBottom: 30,
          maxWidth: '80%',
        }}>
        You haven't added any payment methods yet. Add a method to easily manage
        your subscriptions.
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Skeleton width="70%" height={24} style={{marginBottom: 24}} />

        <View style={{gap: 8}}>
          <PaymentMethodSkeleton />
          <PaymentMethodSkeleton />
          <PaymentMethodSkeleton />
        </View>
      </View>
    </ScrollView>
  );

  const renderPaymentMethods = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text variant="heading2" style={styles.screenTitle}>
          Your Payment Methods
        </Text>

        <View style={{gap: 16, marginTop: 16}}>
          {paymentMethods?.map((method: IPaymentMethod, index: number) => (
            <View style={styles.paymentMethodContainer}>
              {method.details?.imageUrl && (
                <Image
                  source={{uri: method.details.imageUrl}}
                  style={styles.paymentMethodImage}
                />
              )}
              <View style={styles.paymentMethodDetails}>
                <Text preset="bodyLarge" bold>
                  {method.details?.cardType || 'Card'} ending in{' '}
                  {method.details?.last4 || '****'}
                </Text>
                <Text variant="bodySmall" color="secondary">
                  Expires {method.details?.expirationMonth || 'MM'}/
                  {method.details?.expirationYear || 'YY'}
                </Text>
                {method.details?.cardholderName && (
                  <Text variant="bodySmall" color="secondary">
                    {method.details.cardholderName}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (!hasPaymentMethods) {
      return renderNoPaymentMethods();
    }

    return renderPaymentMethods();
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingTop: insets.top},
      ]}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 8,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  screenTitle: {
    marginBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  addButton: {
    marginTop: 32,
  },
  detailItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  paymentMethodImage: {
    width: 40,
    height: 24,
    marginRight: 16,
    resizeMode: 'contain',
  },
  paymentMethodDetails: {
    flex: 1,
  },
});

export default PaymentScreen;
