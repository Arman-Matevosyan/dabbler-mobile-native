import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/navigation/types';
import {Text, Button, useTheme, Skeleton} from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSubscriptions} from '@/hooks/useSubscriptions';
import {IPlan, ISubscription} from '@/types/payment.interfaces';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {usePlans} from '@/hooks/usePlans';

const PlanSkeleton = () => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.skeletonCard,
        {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          marginBottom: 16,
          padding: 16,
        },
      ]}>
      <Skeleton width="40%" height={24} style={{marginBottom: 12}} />
      <Skeleton width="70%" height={16} style={{marginBottom: 16}} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          marginBottom: 16,
        }}>
        <Skeleton width={30} height={18} style={{marginRight: 8}} />
        <Skeleton width={50} height={32} style={{marginRight: 8}} />
        <Skeleton width={60} height={16} />
      </View>

      <View style={{gap: 8, marginBottom: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Skeleton
            width={20}
            height={20}
            style={{marginRight: 8, borderRadius: 10}}
          />
          <Skeleton width="60%" height={14} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Skeleton
            width={20}
            height={20}
            style={{marginRight: 8, borderRadius: 10}}
          />
          <Skeleton width="70%" height={14} />
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Skeleton
            width={20}
            height={20}
            style={{marginRight: 8, borderRadius: 10}}
          />
          <Skeleton width="50%" height={14} />
        </View>
      </View>

      <Skeleton width="100%" height={44} style={{borderRadius: 22}} />
    </View>
  );
};

export default function PlansScreen() {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {data: plans, isLoading: plansLoading} = usePlans();
  const {data: subscriptionData, isLoading: subscriptionLoading} =
    useSubscriptions();
  const [showAllPlans, setShowAllPlans] = useState(false);

  const subscription = subscriptionData as ISubscription | undefined;
  const hasActivePlan = Boolean(subscription?.plan?.planId);
  const isLoading = plansLoading || subscriptionLoading;

  const plansToDisplay = useMemo(() => {
    if (!plans || !Array.isArray(plans)) return [];

    if (!hasActivePlan || showAllPlans) {
      return plans;
    }

    if (subscription?.plan?.planId) {
      return plans.filter(plan => {
        const planId = plan.id || plan.planId || '';
        return planId === subscription.plan?.planId;
      });
    }

    return [];
  }, [plans, subscription, hasActivePlan, showAllPlans]);

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
      <Text variant="heading1">Membership Plans</Text>
    </View>
  );

  const renderPlanCard = (plan: IPlan, index: number) => {
    const planId = plan.id || plan.planId || '';
    const isPopular = index === 1;
    const isActive = subscription?.plan?.planId === planId;

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 200)}
        style={styles.cardContainer}
        key={planId}>
        <View style={styles.badgesContainer}>
          {isPopular && (
            <View
              style={[styles.popularBadge, {backgroundColor: colors.accent}]}>
              <Text style={styles.popularText}>Most Popular</Text>
            </View>
          )}
          {isActive && (
            <View
              style={[styles.activeBadge, {backgroundColor: colors.success}]}>
              <Text style={styles.activeText}>Current Plan</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.background,
            },
            isPopular
              ? {borderWidth: 2, borderColor: colors.accent}
              : {borderWidth: 1, borderColor: colors.border},
            isActive && {borderColor: colors.success},
          ]}>
          <Text style={[styles.planName, {color: colors.textPrimary}]}>
            {plan.name}
          </Text>
          <Text style={[styles.planDescription, {color: colors.textSecondary}]}>
            {plan.description || 'No description available'}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={[styles.currency, {color: colors.textPrimary}]}>
              {plan.currencyIsoCode}
            </Text>
            <Text style={[styles.price, {color: colors.textPrimary}]}>
              {plan.price}
            </Text>
            <Text style={[styles.period, {color: colors.textSecondary}]}>
              /month
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {[
              `Up to ${plan.limit} venues`,
              'Analytics Dashboard',
              'Priority Support',
              'API Access',
            ].map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color={colors.accent}
                />
                <Text style={[styles.featureText, {color: colors.textPrimary}]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <Button
            variant={isActive ? 'outline' : 'primary'}
            title={isActive ? 'Current Plan' : 'Choose Plan'}
            onPress={() =>
              !isActive &&
              navigation.navigate('PaymentScreens', {
                screen: 'ProcessPayment',
                params: {plan: planId},
              })
            }
            style={styles.button}
            disabled={isActive}
          />
        </View>
      </Animated.View>
    );
  };

  const renderLoadingState = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Skeleton
          width="70%"
          height={24}
          style={{marginBottom: 24, alignSelf: 'center'}}
        />

        <PlanSkeleton />
        <PlanSkeleton />
        <PlanSkeleton />
      </View>
    </ScrollView>
  );

  const renderNoPlans = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="category"
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
        No Plans Available
      </Text>

      <Text
        variant="bodySmall"
        color="secondary"
        style={{
          textAlign: 'center',
          marginBottom: 30,
          maxWidth: '80%',
        }}>
        We couldn't find any membership plans. Please try again later.
      </Text>

      <Button
        variant="primary"
        title="Refresh"
        onPress={() => navigation.goBack()}
        style={styles.refreshButton}
      />
    </View>
  );

  const renderPlans = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text variant="heading2" style={styles.screenTitle}>
            {hasActivePlan && !showAllPlans
              ? 'Your Current Plan'
              : 'Choose Your Plan'}
          </Text>

          {hasActivePlan && (
            <Button
              variant={showAllPlans ? 'ghost' : 'outline'}
              title={showAllPlans ? 'Show Current Only' : 'View All Plans'}
              onPress={() => setShowAllPlans(!showAllPlans)}
              style={styles.viewToggleButton}
            />
          )}
        </View>

        <View style={styles.plansContainer}>
          {plansToDisplay.map((plan, index) =>
            renderPlanCard(plan as IPlan, index),
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderContent = () => {
    if (isLoading) {
      return renderLoadingState();
    }

    if (!plans || !plans.length) {
      return renderNoPlans();
    }

    return renderPlans();
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
}

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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  screenTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  viewToggleButton: {
    minWidth: 150,
  },
  plansContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  refreshButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
  },
  cardContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  badgesContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
  },
  popularBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  activeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 4,
  },
  period: {
    fontSize: 14,
  },
  featuresContainer: {
    marginBottom: 24,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    borderRadius: 25,
  },
  currentPlanButton: {
    opacity: 0.7,
  },
  skeletonCard: {
    height: 300,
  },
});
