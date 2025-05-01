import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';

const ActivityChip = ({ title, style }: { title: string; style?: any }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.activityChip, { backgroundColor: colors.card }, style]}>
      <Text style={[styles.activityChipText, { color: colors.textPrimary }]}>{title}</Text>
    </View>
  );
};

interface VenueAmenitiesProps {
  categories?: string[];
}

export const VenueAmenities: React.FC<VenueAmenitiesProps> = ({ categories }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.sectionContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t('venues.amenities')}
      </Text>
      <View style={styles.activitiesContainer}>
        {categories && categories.length > 0 ? (
          categories.map((activity, index) => (
            <ActivityChip
              key={`activity-${index}`}
              title={activity}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))
        ) : (
          <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
            {t('common.noResults')}
          </Text>
        )}
      </View>
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
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activityChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
