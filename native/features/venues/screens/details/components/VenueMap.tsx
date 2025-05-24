import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/design-system';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { darkMapStyle } from '@/constants/MapColors';

interface Address {
  street: string;
  houseNumber: string;
  city: string;
  stateOrProvince: string;
}

interface Location {
  coordinates: [number, number];
}

interface VenueMapProps {
  location?: Location;
  name?: string;
  address?: Address;
}

export const VenueMap: React.FC<VenueMapProps> = ({ location, name, address }) => {
  const { colors, mode } = useTheme();
  const { t } = useTranslation();

  if (!location?.coordinates || !location.coordinates.length) {
    return null;
  }

  const longitude = location.coordinates[0];
  const latitude = location.coordinates[1];

  const addressText = address
    ? `${address.street} ${address.houseNumber}, ${address.city} - ${address.stateOrProvince}`
    : t('common.noResults');

  return (
    <View style={[styles.sectionContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {t('classes.location')}
      </Text>
      <View style={styles.mapContainer}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          style={styles.map}
          customMapStyle={mode === 'dark' ? darkMapStyle : []}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.00008,
            longitudeDelta: 0.00008,
          }}>
          <Marker coordinate={{ latitude, longitude }} title={name} description={addressText}>
            <MaterialIcons
              name="location-on"
              size={36}
              color={colors.accent}
              style={styles.markerIcon}
            />
          </Marker>
        </MapView>
      </View>
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address
          ? `${address.street} ${address.houseNumber}, ${address.city} - ${address.stateOrProvince}`
          : t('common.noResults')}
      </Text>
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
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressText: {
    fontSize: 14,
    marginTop: 8,
  },
  markerIcon: {
    height: 36,
    width: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
