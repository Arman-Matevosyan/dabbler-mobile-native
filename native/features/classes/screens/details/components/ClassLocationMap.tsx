import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme } from '@/design-system';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface ClassLocationMapProps {
  coordinates?: Coordinates;
  venueName?: string;
}

export const ClassLocationMap = React.memo(({ coordinates, venueName = 'Venue' }: ClassLocationMapProps) => {
  const { colors } = useTheme();
  
  if (!coordinates?.latitude || !coordinates?.longitude) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, {color: colors.textPrimary}]}>
        Location
      </Text>
      
      <View style={[styles.mapContainer, {backgroundColor: colors.border}]}>
        <MapView
          style={styles.map}
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
});

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