import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {useTheme} from '@/design-system';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

interface Venue {
  id?: string;
  name?: string;
  address?: string;
  openingHours?: string;
  contacts?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface VenueInfoProps {
  address?: {
    street?: string;
    houseNumber?: string;
    city?: string;
    stateOrProvince?: string;
  };
  openingHours?: string[];
  contacts?: string[];
  websiteUrl?: string;
}

export const VenueInfo: React.FC<{venue: Venue | undefined}> = ({venue}) => {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const openGoogleMaps = () => {
    if (!venue?.address) {
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue.address,
    )}`;
    Linking.openURL(url);
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      {venue?.address && (
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="place" size={24} color={colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, {color: colors.textPrimary}]}>
              {t('venues.address')}
            </Text>
            <TouchableOpacity onPress={openGoogleMaps}>
              <Text style={[styles.infoText, {color: colors.textSecondary}]}>
                {venue.address}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {venue?.openingHours && (
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="access-time" size={24} color={colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, {color: colors.textPrimary}]}>
              {t('venues.openingHours')}
            </Text>
            <Text style={[styles.infoText, {color: colors.textSecondary}]}>
              {venue.openingHours}
            </Text>
          </View>
        </View>
      )}

      {venue?.contacts?.phone && (
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="phone" size={24} color={colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, {color: colors.textPrimary}]}>
              {t('venues.phone')}
            </Text>
            <TouchableOpacity onPress={() => venue.contacts && callPhone(venue.contacts.phone!)}>
              <Text
                style={[
                  styles.infoText,
                  {color: colors.accent, textDecorationLine: 'underline'},
                ]}>
                {venue.contacts.phone}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {venue?.contacts?.email && (
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="email" size={24} color={colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, {color: colors.textPrimary}]}>
              {t('venues.email')}
            </Text>
            <TouchableOpacity onPress={() => venue.contacts && openEmail(venue.contacts.email!)}>
              <Text
                style={[
                  styles.infoText,
                  {color: colors.accent, textDecorationLine: 'underline'},
                ]}>
                {venue.contacts.email}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {venue?.contacts?.website && (
        <View style={styles.infoSection}>
          <View style={styles.iconContainer}>
            <MaterialIcon name="language" size={24} color={colors.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, {color: colors.textPrimary}]}>
              {t('venues.website')}
            </Text>
            <TouchableOpacity
              onPress={() => venue.contacts && openWebsite(venue.contacts.website!)}>
              <Text
                style={[
                  styles.infoText,
                  {color: colors.accent, textDecorationLine: 'underline'},
                ]}>
                {venue.contacts.website}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 