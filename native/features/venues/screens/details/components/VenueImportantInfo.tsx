import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';

interface VenueImportantInfoProps {
  importantInfo?: string;
  showImportantInfo: boolean;
  toggleImportantInfo: () => void;
}

export const VenueImportantInfo: React.FC<VenueImportantInfoProps> = ({
  importantInfo,
  showImportantInfo,
  toggleImportantInfo,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.sectionContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t('venues.importantInfo')}
      </Text>
      <Text
        style={[styles.sectionText, { color: colors.textSecondary }]}
        numberOfLines={showImportantInfo ? undefined : 3}
      >
        {importantInfo || t('common.noResults')}
      </Text>
      <TouchableOpacity onPress={toggleImportantInfo}>
        <Text style={[styles.readMore, { color: colors.accent }]}>
          {showImportantInfo ? t('venues.showLess') : t('venues.showMore')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
