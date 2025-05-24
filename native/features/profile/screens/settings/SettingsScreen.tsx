import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme } from '@/design-system';
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
  const { logout } = useAuthStore();
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
      title: t('profile.membership'),
      items: [
        {
          label: t('profile.membershipDetails'),
          description: t('profile.viewManageSubscription'),
          icon: 'card-membership',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Membership'),
        },
        {
          label: t('profile.paymentMethods'),
          description: t('profile.managePaymentOptions'),
          icon: 'credit-card',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Payment'),
        },
      ],
    },
    {
      title: t('profile.preferences'),
      items: [
        {
          label: t('profile.profile'),
          description: t('profile.changeLanguage'),
          icon: 'translate',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Language'),
        },
        {
          label: t('profile.displaySettings'),
          description: t('profile.customizeAppearance'),
          icon: 'palette',
          // @ts-ignore - Navigation typing would need to be updated
          onPress: () => navigation.navigate('Display'),
        },
      ],
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={1}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text variant="heading1" color="primary">
          {t('profile.profile')}
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
                  {t('profile.signOutAccount')}
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
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#FFEEEE',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  separator: {
    bottom: 0,
    height: 1,
    left: 0,
    position: 'absolute',
    width: '100%',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  settingItem: {
    marginBottom: 12,
    padding: 0,
  },
  settingItemContainer: {
    marginBottom: 8,
    position: 'relative',
  },
  settingItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    width: '100%',
  },
});
