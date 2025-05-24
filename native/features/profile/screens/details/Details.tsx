import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

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
  const { user: userData } = useAuthStore();
  const { t } = useTranslation();

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
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <Button
        variant="ghost"
        onPress={() => navigation.goBack()}
        icon={<MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />}
        style={styles.backButton}
      />
      <Text variant="heading1">{t('profile.account')}</Text>
    </View>
  );

  const renderContent = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
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
  backButton: {
    marginRight: 8,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailItem: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailsContainer: {
    marginBottom: 32,
  },
  editButton: {
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  screenTitle: {
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
});
