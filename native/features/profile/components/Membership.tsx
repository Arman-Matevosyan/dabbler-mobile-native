import {Skeleton, useTheme} from '@/design-system';
import {useSubscriptions} from '@/hooks/useSubscriptions';
import {ISubscription} from '@/types/payment.interfaces';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@/navigation/types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const MembershipStatus: React.FC = () => {
  const {colors} = useTheme();
  const {data: subscription, isLoading} = useSubscriptions();
  const router =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width={120} height={24} />
      </View>
    );
  }

  const handlePress = () => {
    router.navigate('Plans');
  };

  const typedSubscription = subscription as ISubscription | undefined;

  const isActive = typedSubscription && typedSubscription.plan?.planId;

  const planName =
    isActive && typedSubscription?.plan
      ? typedSubscription.plan.name
      : 'profile.inactive';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.premiumBadgeContainer,
          {
            borderColor: colors.accent,
          },
        ]}
        onPress={handlePress}
        activeOpacity={1}>
        <Text
          style={[
            styles.premiumText,
            {
              color: isActive ? colors.textPrimary : colors.textSecondary,
            },
          ]}>
          {planName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  premiumBadgeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
