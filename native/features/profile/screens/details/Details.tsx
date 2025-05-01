import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, useTheme, Skeleton } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type { User } from '@/services/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

interface ExtendedUser extends User {
  isVerified?: boolean;
}

const SkeletonDetailItem = ({ colors }: { colors: any }) => (
  <View style={[styles.detailItemSkeleton, { borderBottomColor: colors.border }]}>
    <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
    <View style={{ flex: 1 }}>
      <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="60%" height={18} />
    </View>
  </View>
);

const DetailItem = ({
  label,
  value,
  icon,
  colors,
}: {
  label: string;
  value: string;
  icon: string;
  colors: any;
}) => (
  <View style={[styles.detailItem, { borderBottomColor: colors.border }]}>
    <MaterialIcons name={icon} size={24} color={colors.textPrimary} style={styles.detailIcon} />
    <View style={styles.detailTextContainer}>
      <Text variant="bodySmall" color="secondary">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </View>
  </View>
);

export const ProfileDetailsScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { user: userData, isLoading: authLoading } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  const accountDetails = [
    {
      label: t('profile.name'),
      value: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'N/A',
      icon: 'account-circle',
    },
    {
      label: t('profile.email'),
      value: userData?.email || 'N/A',
      icon: 'email',
    },
    {
      label: t('profile.verificationStatus'),
      value: userData?.isVerified ? t('profile.verified') : t('profile.notVerified'),
      icon: userData?.isVerified ? 'check-circle' : 'error',
    },
    {
      label: t('profile.password'),
      value: '••••••••',
      icon: 'lock',
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      {loading ? (
        <>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginRight: 16 }} />
          <Skeleton width={150} height={28} />
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            onPress={() => navigation.goBack()}
            icon={<MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />}
            style={styles.backButton}
          />
          <Text variant="heading1">{t('profile.account')}</Text>
        </>
      )}
    </View>
  );

  const renderContent = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {loading ? (
          <>
            <Skeleton width="70%" height={30} style={{ marginBottom: 24 }} />
            {[1, 2, 3, 4].map(item => (
              <SkeletonDetailItem key={item} colors={colors} />
            ))}
          </>
        ) : (
          <>
            <Text variant="heading2" style={styles.screenTitle}>
              {t('profile.accountDetails')}
            </Text>
            <View style={styles.detailsContainer}>
              {accountDetails.map((detail, index) => (
                <DetailItem
                  key={index}
                  label={detail.label}
                  value={detail.value}
                  icon={detail.icon}
                  colors={colors}
                />
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );

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
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
  detailsContainer: {
    marginBottom: 32,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailItemSkeleton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  editButton: {
    marginTop: 16,
  },
});
