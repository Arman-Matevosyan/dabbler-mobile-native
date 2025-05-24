import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';

interface VenueDescriptionProps {
  description?: string;
  showFullDescription: boolean;
  toggleDescription: () => void;
}

export const VenueDescription: React.FC<VenueDescriptionProps> = ({
  description,
  showFullDescription,
  toggleDescription,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const descriptionText = description || t('common.noResults');

  return (
    <View style={[styles.sectionContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('venues.about')}</Text>
      <Text
        style={[styles.sectionText, { color: colors.textSecondary }]}
        numberOfLines={showFullDescription ? undefined : 3}>
        {descriptionText}
      </Text>
      {description && description.length > 120 && (
        <TouchableOpacity onPress={toggleDescription}>
          <Text style={[styles.readMore, { color: colors.accent }]}>
            {showFullDescription ? t('venues.showLess') : t('venues.showMore')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
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
