import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useTheme } from '@/design-system';
import { CLUSTER_COLORS_DARK, CLUSTER_COLORS_LIGHT } from '@/design-system/theme/colors';

interface ClusterMarkerProps {
  count: number;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  onPress: () => void;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count, coordinate, onPress }) => {
  const { mode } = useTheme();

  const clusterColors = mode === 'dark' ? CLUSTER_COLORS_DARK : CLUSTER_COLORS_LIGHT;

  const getSize = () => {
    if (count < 10) return 40;
    if (count < 50) return 50;
    if (count < 100) return 60;
    return 70;
  };

  const size = getSize();

  return (
    <Marker coordinate={coordinate} onPress={onPress} tracksViewChanges={false}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            backgroundColor: clusterColors.CLUSTER_BACKGROUND,
            borderColor: clusterColors.CLUSTER_BORDER,
          },
        ]}>
        <Text style={[styles.text, { color: clusterColors.CLUSTER_TEXT }]}>{count}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClusterMarker;
