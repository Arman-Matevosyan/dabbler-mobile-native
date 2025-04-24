import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Marker} from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Cluster} from './MapComponent';
import {
  CLUSTER_COLORS_DARK,
  CLUSTER_COLORS_LIGHT,
  useTheme,
} from '@/design-system';

interface ClusterMarkerProps {
  cluster: Cluster;
  onPress: () => void;
}

const ClusterMarkerComponent: React.FC<ClusterMarkerProps> = memo(
  ({cluster, onPress}) => {
    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);
    const {mode} = useTheme();
    const [tracksViewChanges, setTracksViewChanges] = useState(false);

    useEffect(() => {
      setTracksViewChanges(true);
      opacity.value = withTiming(1, {duration: 250});
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });

      const trackingTimeout = setTimeout(() => {
        setTracksViewChanges(false);
      }, 800);

      return () => clearTimeout(trackingTimeout);
    }, [cluster.id]);

    const handlePress = () => {
      setTracksViewChanges(true);

      scale.value = withSequence(
        withTiming(1.2, {duration: 150}),
        withDelay(
          50,
          withSpring(1, {
            damping: 12,
            stiffness: 120,
          }),
        ),
      );

      onPress();
    };

    const coordinate = useMemo(
      () => ({
        latitude: cluster.center.latitude,
        longitude: cluster.center.longitude,
      }),
      [cluster.center.latitude, cluster.center.longitude],
    );

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{scale: scale.value}],
      };
    });

    return (
      <Marker
        coordinate={coordinate}
        zIndex={9999}
        onPress={handlePress}
        tracksViewChanges={tracksViewChanges}>
        <Animated.View style={animatedStyle}>
          <View
            style={[
              styles.marker,
              {
                backgroundColor:
                  mode === 'dark'
                    ? CLUSTER_COLORS_DARK.CLUSTER_BACKGROUND
                    : CLUSTER_COLORS_LIGHT.CLUSTER_BACKGROUND,
                borderColor:
                  mode === 'dark'
                    ? CLUSTER_COLORS_DARK.CLUSTER_BORDER
                    : CLUSTER_COLORS_LIGHT.CLUSTER_BORDER,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {
                  color:
                    mode === 'dark'
                      ? CLUSTER_COLORS_DARK.CLUSTER_TEXT
                      : CLUSTER_COLORS_LIGHT.CLUSTER_TEXT,
                },
              ]}>
              {cluster.count}
            </Text>
          </View>
        </Animated.View>
      </Marker>
    );
  },
  (prev, next) =>
    prev.cluster.id === next.cluster.id &&
    prev.cluster.count === next.cluster.count &&
    prev.cluster.center.latitude === next.cluster.center.latitude &&
    prev.cluster.center.longitude === next.cluster.center.longitude,
);

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClusterMarkerComponent;
