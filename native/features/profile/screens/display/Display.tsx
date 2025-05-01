import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

type ThemeOption = 'light' | 'dark';

interface ThemeOptionItem {
  id: ThemeOption;
  label: string;
  description: string;
  icon: string;
}

const RadioButton = ({
  selected,
  onPress,
  disabled,
}: {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      disabled={disabled}
      style={[styles.radioButton, disabled && { opacity: 0.5 }]}>
      <View style={[styles.radioOuter, { borderColor: selected ? colors.accent : colors.border }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />}
      </View>
    </TouchableOpacity>
  );
};

export const DisplayScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors, mode, setMode, systemTheme } = useTheme();
  const navigation = useNavigation();
  const [isChangingTheme, setIsChangingTheme] = useState(false);
  const { t } = useTranslation();

  const themeOptions: ThemeOptionItem[] = [
    {
      id: 'light',
      label: t('profile.settings.light'),
      description: t('profile.settings.useSystemTheme'),
      icon: 'light-mode',
    },
    {
      id: 'dark',
      label: t('profile.settings.dark'),
      description: t('profile.settings.customizeAppearance'),
      icon: 'dark-mode',
    },
  ];

  const handleThemeChange = useCallback(
    (themeMode: ThemeOption) => {
      if (mode === themeMode || isChangingTheme) {
        return;
      }

      setIsChangingTheme(true);

      try {
        setMode(themeMode);
        setTimeout(() => setIsChangingTheme(false), 300);
      } catch (error) {
        console.error('Error changing theme:', error);
        setIsChangingTheme(false);
        Alert.alert('Theme Change Failed', 'Please try again later.');
      }
    },
    [mode, setMode, isChangingTheme],
  );

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
        <Text variant="heading1" style={{ color: colors.textPrimary }}>
          {t('profile.settings.display')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text variant="heading2" style={[styles.screenTitle, { color: colors.textPrimary }]}>
            {t('profile.settings.displaySettings')}
          </Text>

          <View style={styles.systemInfo}>
            <MaterialIcons
              name="info-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.infoIcon}
            />
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              {t('profile.settings.systemTheme')}{' '}
              {systemTheme === 'dark' ? t('profile.settings.dark') : t('profile.settings.light')}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {themeOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                activeOpacity={1}
                style={[styles.themeOption, isChangingTheme && { opacity: 0.7 }]}
                disabled={isChangingTheme}
                onPress={() => handleThemeChange(option.id)}>
                <View style={styles.themeOptionContent}>
                  <MaterialIcons
                    name={option.icon}
                    size={24}
                    color={colors.accent}
                    style={styles.themeIcon}
                  />
                  <View style={styles.themeTextContainer}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: colors.textPrimary,
                        marginBottom: 2,
                      }}>
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                      }}>
                      {option.description}
                    </Text>
                  </View>
                  <RadioButton
                    selected={mode === option.id}
                    onPress={() => handleThemeChange(option.id)}
                    disabled={isChangingTheme}
                  />
                </View>
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
              </TouchableOpacity>
            ))}
          </View>

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
    padding: 8,
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
  screenTitle: {
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  systemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  themeOption: {
    marginBottom: 8,
    position: 'relative',
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  themeIcon: {
    marginRight: 16,
  },
  themeTextContainer: {
    flex: 1,
  },
  radioButton: {
    padding: 4,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  separator: {
    height: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});
