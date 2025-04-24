import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useTheme} from '@/design-system';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {darkMapStyle} from '@/constants/MapColors';

interface VenueMapProps {
  location?: {
    coordinates?: number[];
  };
  name?: string;
  address?: {
    street?: string;
    houseNumber?: string;
    city?: string;
    stateOrProvince?: string;
  };
}

export const VenueMap: React.FC<VenueMapProps> = ({
  location,
  name,
  address,
}) => {
  const {colors, mode} = useTheme();
  
  const coordinates = location?.coordinates || [0, 0];
  const latitude = coordinates[1];
  const longitude = coordinates[0];
  
  const locationText = address
    ? `${address.street || ''} ${address.houseNumber || ''}, ${address.city || ''} - ${address.stateOrProvince || ''}`
    : 'N/A';

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
        {'classes.location'}
      </Text>
      <View style={styles.mapContainer}>
        <MapView
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          style={styles.map}
          customMapStyle={mode === 'dark' ? darkMapStyle : []}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.00008,
            longitudeDelta: 0.00008,
          }}>
          <Marker
            coordinate={{latitude, longitude}}
            title={name || ''}
            description={locationText}>
            <MaterialCommunityIcons
              name="map-marker"
              size={36}
              color={colors.accent}
              style={styles.markerIcon}
            />
          </Marker>
        </MapView>
      </View>
      <Text style={[styles.addressText, {color: colors.textSecondary}]}>
        {locationText}
      </Text>
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
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerIcon: {
    height: 36,
    width: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  addressText: {
    fontSize: 14,
    marginTop: 8,
  },
}); 