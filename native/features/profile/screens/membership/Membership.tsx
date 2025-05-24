import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, useTheme, Skeleton } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { ISubscription } from '@/types/payment.interfaces';
import { useTranslation } from 'react-i18next';

const MembershipDetailSkeleton = () => {
  const { colors } = useTheme();

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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
        <View>
          <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
          <Skeleton width={180} height={18} />
          <Skeleton width={150} height={14} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
};

export const MembershipScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { data: subscriptionData, isLoading } = useSubscriptions();
  const subscription = subscriptionData as ISubscription | undefined;
  const { t } = useTranslation();

  const hasSubscriptionData =
    subscription && subscription.plan && subscription.plan.name && subscription.status;

  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Button
        variant="ghost"
        onPress={() => navigation.goBack()}
        icon={<MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />}
        style={styles.backButton}
      />
      <Text variant="heading1">{t('profile.membership')}</Text>
    </View>
  );

  const renderNoMembership = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="card-membership"
        size={90}
        color={colors.accent}
        style={{ marginBottom: 20 }}
      />

      <Text
        variant="heading2"
        style={{
          textAlign: 'center',
          marginBottom: 20,
        }}>
        {t('membership.noMembershipFound')}
      </Text>

      <Text
        variant="bodySmall"
        color="secondary"
        style={{
          textAlign: 'center',
          marginBottom: 30,
        }}>
        {t('membership.noActivePlan')}
      </Text>

      <Button
        variant="primary"
        title={t('membership.viewPlans')}
        // @ts-ignore - Navigation typing would need to be updated
        onPress={() => navigation.navigate('Plans')}
        style={styles.viewPlansButton}
      />
    </View>
  );

  const renderLoadingState = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Skeleton width="70%" height={24} style={{ marginBottom: 24 }} />

        {/* Skeleton loading for membership details */}
        <View style={{ gap: 8 }}>
          <MembershipDetailSkeleton />
          <MembershipDetailSkeleton />
          <MembershipDetailSkeleton />
          <MembershipDetailSkeleton />
        </View>
      </View>
    </ScrollView>
  );

  const renderMembershipDetails = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text variant="heading2" style={styles.screenTitle}>
          {t('profile.membershipDetails')}
        </Text>

        <View style={{ gap: 16, marginTop: 16 }}>
          {/* Plan Details */}
          <View
            style={[
              styles.detailItem,
              {
                borderBottomColor: colors.border,
              },
            ]}>
            <View style={styles.detailItemLeft}>
              <MaterialIcons
                name="star"
                size={24}
                color={colors.textPrimary}
                style={styles.detailIcon}
              />
              <View>
                <Text variant="bodySmall" color="secondary">
                  {t('membership.plan')}
                </Text>
                <Text variant="bodySmall" bold>
                  {subscription?.plan?.name || ''}
                </Text>
                {subscription?.plan?.description && (
                  <Text variant="bodySmall" color="secondary">
                    {subscription.plan.description}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View
            style={[
              styles.detailItem,
              {
                borderBottomColor: colors.border,
              },
            ]}>
            <View style={styles.detailItemLeft}>
              <MaterialIcons
                name="credit-card"
                size={24}
                color={colors.textPrimary}
                style={styles.detailIcon}
              />
              <View>
                <Text variant="bodySmall" color="secondary">
                  {t('membership.paymentMethod')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {subscription?.paymentMethod?.details?.imageUrl && (
                    <Image
                      source={{
                        uri: subscription.paymentMethod.details.imageUrl,
                      }}
                      style={{ width: 24, height: 16 }}
                    />
                  )}
                  <Text variant="bodySmall" bold>
                    {subscription?.paymentMethod?.details?.last4
                      ? `•••• ${subscription.paymentMethod.details.last4}`
                      : t('common.noResults')}
                  </Text>
                </View>
                {subscription?.paymentMethod?.details?.expirationMonth &&
                  subscription?.paymentMethod?.details?.expirationYear && (
                    <Text variant="bodySmall" color="secondary">
                      {t('membership.expires')} {subscription.paymentMethod.details.expirationMonth}
                      /{subscription.paymentMethod.details.expirationYear}
                    </Text>
                  )}
              </View>
            </View>
          </View>

          {/* Billing Period */}
          <View
            style={[
              styles.detailItem,
              {
                borderBottomColor: colors.border,
              },
            ]}>
            <View style={styles.detailItemLeft}>
              <MaterialIcons
                name="date-range"
                size={24}
                color={colors.textPrimary}
                style={styles.detailIcon}
              />
              <View>
                <Text variant="bodySmall" color="secondary">
                  {t('membership.billingPeriod')}
                </Text>
                {subscription?.billingPeriodStartDate && subscription?.billingPeriodEndDate ? (
                  <Text variant="bodySmall" bold>
                    {format(new Date(subscription.billingPeriodStartDate), 'MMM dd')} -{' '}
                    {format(new Date(subscription.billingPeriodEndDate), 'MMM dd, yyyy')}
                  </Text>
                ) : (
                  <Text variant="bodySmall" bold>
                    {t('common.noResults')}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Subscription Status */}
          <View
            style={[
              styles.detailItem,
              {
                borderBottomColor: colors.border,
              },
            ]}>
            <View style={styles.detailItemLeft}>
              <MaterialIcons
                name="info"
                size={24}
                color={colors.textPrimary}
                style={styles.detailIcon}
              />
              <View>
                <Text variant="bodySmall" color="secondary">
                  {t('profile.status')}
                </Text>
                <Text
                  variant="bodySmall"
                  bold
                  style={{
                    color: subscription?.status === 'active' ? colors.success : colors.error,
                  }}>
                  {subscription?.status || t('common.noResults')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {subscription?.status === 'active' && (
          <Button
            variant="outline"
            title={t('profile.cancelSubscription')}
            onPress={() => {
              console.log('Cancel subscription pressed');
            }}
            style={styles.cancelButton}
          />
        )}
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (!hasSubscriptionData) {
      return renderNoMembership();
    }

    return renderMembershipDetails();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
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
  viewPlansButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
  },
  detailItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  detailItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 16,
  },
  cancelButton: {
    marginTop: 32,
  },
});

export default MembershipScreen;
