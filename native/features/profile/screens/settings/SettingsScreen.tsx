import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, Button, useTheme, Skeleton } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

interface SettingItem {
  label: string;
  description: string;
  icon: string;
  onPress: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { logout, isLoading } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const settingsOptions: SettingSection[] = [
    {
      title: t('profile.account'),
      items: [
        {
          label: t('profile.accountDetails'),
          description: t('profile.actions.edit'),
          icon: 'account-circle',
          // TypeScript might complain about the navigation.navigate type
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('ProfileDetails'),
        },
      ],
    },
    {
      title: 'Membership',
      items: [
        {
          label: 'Membership Details',
          description: 'View and manage your subscription',
          icon: 'card-membership',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Membership'),
        },
        {
          label: 'Payment Methods',
          description: 'Manage your payment options',
          icon: 'credit-card',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Payment'),
        },
      ],
    },
    {
      title: t('profile.settings.preferences'),
      items: [
        {
          label: t('profile.language.title'),
          description: t('profile.settings.changeLanguage'),
          icon: 'translate',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Language'),
        },
        {
          label: t('profile.settings.displaySettings'),
          description: t('profile.settings.customizeAppearance'),
          icon: 'palette',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Display'),
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
          <Skeleton width="50%" height={24} />
        </View>
        <ScrollView style={styles.scrollView}>
          {[1, 2, 3].map(section => (
            <View key={section} style={{ marginBottom: 24, padding: 16 }}>
              <Skeleton width="40%" height={20} style={{ marginBottom: 16 }} />
              {[1, 2].map(item => (
                <View
                  key={item}
                  style={[styles.settingItemSkeleton, { backgroundColor: colors.card }]}>
                  <Skeleton width={24} height={24} style={{ marginRight: 16 }} />
                  <View style={{ flex: 1 }}>
                    <Skeleton width="60%" height={16} style={{ marginBottom: 4 }} />
                    <Skeleton width="80%" height={14} />
                  </View>
                  <Skeleton width={16} height={16} />
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={1}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="heading1" color="primary">
          {t('profile.settings.title')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {settingsOptions.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text variant="heading3" color="primary" bold style={styles.sectionTitle}>
                {section.title}
              </Text>

              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  activeOpacity={1}
                  style={[styles.settingItemContainer, { backgroundColor: colors.background }]}
                  onPress={item.onPress}>
                  <View style={styles.settingItemContent}>
                    <MaterialIcons name={item.icon} size={24} color={colors.accent} />
                    <View style={styles.settingInfo}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: colors.textPrimary,
                          marginBottom: 2,
                        }}>
                        {item.label}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.textSecondary,
                        }}>
                        {item.description}
                      </Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={colors.accent} />
                  </View>
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.settingItemContainer, { backgroundColor: colors.background }]}
            activeOpacity={1}
            onPress={handleLogout}>
            <View style={styles.settingItemContent}>
              <MaterialIcons name="logout" size={24} color={colors.error} />
              <View style={styles.settingInfo}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: colors.error,
                    marginBottom: 2,
                  }}>
                  {t('profile.logout')}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                  }}>
                  {t('auth.login.signInAccount')}
                </Text>
              </View>
            </View>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingItem: {
    marginBottom: 12,
    padding: 0,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  settingItemSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEEEE',
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingItemContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  separator: {
    height: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
