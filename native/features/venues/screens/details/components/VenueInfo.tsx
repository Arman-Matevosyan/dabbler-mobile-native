import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface VenueInfoProps {
  venue: {
    id?: string;
    name?: string;
    address?: {
      street?: string;
      houseNumber?: string;
      city?: string;
      stateOrProvince?: string;
    };
    openingHours?: string;
    contacts?: {
      phone?: string;
      website?: string;
    };
  };
}

export const VenueInfo: React.FC<VenueInfoProps> = ({ venue }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.sectionContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t('venues.details')}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons name="location-on" size={22} color={colors.textSecondary} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
            {t('classes.location')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
            {venue.address
              ? `${venue.address.street} ${venue.address.houseNumber}, ${venue.address.city}`
              : t('common.noResults')}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons name="access-time" size={22} color={colors.textSecondary} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
            {t('venues.hours')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
            {venue.openingHours || t('common.noResults')}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons name="phone" size={22} color={colors.textSecondary} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
            {t('venues.phone')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
            {venue.contacts?.phone || t('common.noResults')}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconContainer}>
          <MaterialIcons name="language" size={22} color={colors.textSecondary} />
        </View>
        <View style={styles.infoTextContainer}>
          <Text style={[styles.infoLabel, { color: colors.textPrimary }]}>
            {t('venues.website')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
            {venue.contacts?.website || t('common.noResults')}
          </Text>
        </View>
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
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
});
