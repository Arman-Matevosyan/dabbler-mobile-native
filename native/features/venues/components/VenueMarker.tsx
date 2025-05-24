import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useTheme } from '@/design-system';
import { VENUE_COLORS } from '@/design-system/theme/colors';

interface VenueMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  onPress: () => void;
  isSelected?: boolean;
}

const VenueMarker: React.FC<VenueMarkerProps> = ({ coordinate, onPress, isSelected = false }) => {
  const { mode } = useTheme();

  const markerColor = isSelected
    ? mode === 'dark'
      ? VENUE_COLORS.selectedDark
      : VENUE_COLORS.selectedLight
    : mode === 'dark'
      ? VENUE_COLORS.dark
      : VENUE_COLORS.light;

  return (
    <Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <View style={styles.markerContainer}>
        <View style={[styles.marker, { backgroundColor: 'white' }]}>
          <View style={[styles.markerDot, { backgroundColor: markerColor }]} />
        </View>
        <View style={[styles.markerTail, { backgroundColor: markerColor }]} />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 40,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  markerTail: {
    width: 2,
    height: 8,
    marginTop: -2,
  },
});

export default VenueMarker;
