import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme } from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ProfileScreenProps } from '../../ProfileNavigator';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/services/i18n';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { LANGUAGE_KEY } from '@/services/i18n';

interface LanguageOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const RadioButton = ({ selected, onPress }: { selected: boolean; onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.radioButton}>
      <View style={[styles.radioOuter, { borderColor: selected ? colors.accent : colors.border }]}>
        {selected && <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />}
      </View>
    </TouchableOpacity>
  );
};

type LanguageScreenNavigationProps = ProfileScreenProps<'Language'>;

const LanguageScreen: React.FC<LanguageScreenNavigationProps> = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language);

  const storage = new MMKVLoader().withEncryption().initialize();

  useEffect(() => {
    const savedLanguage = storage.getString(LANGUAGE_KEY);
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const languages: LanguageOption[] = [
    {
      id: 'en',
      label: t('profile.english'),
      description: t('profile.englishDescription'),
      icon: 'translate',
    },
    {
      id: 'ru',
      label: t('profile.russian'),
      description: t('profile.russianDescription'),
      icon: 'translate',
    },
    {
      id: 'hy',
      label: t('profile.armenian'),
      description: t('profile.armenianDescription'),
      icon: 'translate',
    },
  ];

  const handleLanguageChange = (languageId: string) => {
    setSelectedLanguage(languageId);

    // Update language in i18n and save preference
    changeLanguage(languageId);
  };

  const getLanguageOptionStyle = (borderColor: string): ViewStyle => ({
    ...styles.languageOption,
    borderBottomColor: borderColor,
  });

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
        <Text variant="heading1" style={{ color: colors.textPrimary }}>
          {t('profile.profile')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text variant="heading2" style={[styles.screenTitle, { color: colors.textPrimary }]}>
            {t('profile.languageSettings')}
          </Text>

          <View style={styles.optionsContainer}>
            {languages.map(language => (
              <TouchableOpacity
                key={language.id}
                activeOpacity={1}
                style={styles.languageOption}
                onPress={() => handleLanguageChange(language.id)}>
                <View style={styles.languageOptionContent}>
                  <MaterialIcons
                    name={language.icon}
                    size={24}
                    color={colors.accent}
                    style={styles.languageIcon}
                  />
                  <View style={styles.languageTextContainer}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: colors.textPrimary,
                        marginBottom: 2,
                      }}>
                      {language.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                      }}>
                      {language.description}
                    </Text>
                  </View>
                  <RadioButton
                    selected={selectedLanguage === language.id}
                    onPress={() => handleLanguageChange(language.id)}
                  />
                </View>
                <View style={[styles.separator, { backgroundColor: colors.border }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Export both named and default exports
export { LanguageScreen };
export default LanguageScreen;

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
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  languageOption: {
    marginBottom: 8,
    position: 'relative',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  languageIcon: {
    marginRight: 16,
  },
  languageTextContainer: {
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
