import React from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTheme } from '@/design-system';
import { darkMapStyle, lightMapStyle } from '@/constants/MapColors';
import { useTranslation } from 'react-i18next';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ClassLocationMapProps {
  coordinates?: Coordinates;
  venueName?: string;
}

export const ClassLocationMap = React.memo(
  ({ coordinates, venueName = 'Venue' }: ClassLocationMapProps) => {
    const { colors, mode } = useTheme();
    const { t } = useTranslation();

    if (!coordinates?.latitude || !coordinates?.longitude) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {t('classes.location')}
        </Text>

        <View style={[styles.mapContainer, { backgroundColor: colors.border }]}>
          <MapView
            customMapStyle={mode === 'dark' ? darkMapStyle : lightMapStyle}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            initialRegion={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
              }}
              title={venueName}
            />
          </MapView>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 200,
  },
});
