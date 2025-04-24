import React, {memo, useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Marker} from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Venue} from './MapComponent';
import {
  CLUSTER_COLORS_DARK,
  CLUSTER_COLORS_LIGHT,
  VENUE_COLORS,
  useTheme,
} from '@/design-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
interface VenueMarkerProps {
  venue: Venue;
  isSelected: boolean;
  onPress: (venue: Venue) => void;
}

const VenueMarkerComponent: React.FC<VenueMarkerProps> = memo(
  ({venue, isSelected, onPress}) => {
    const {mode} = useTheme();
    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);
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
      }, 1000);

      return () => clearTimeout(trackingTimeout);
    }, [venue.id]);

    useEffect(() => {
      setTracksViewChanges(true);

      if (isSelected) {
        scale.value = withSequence(
          withTiming(1.2, {duration: 150}),
          withSpring(1.1, {
            damping: 10,
            stiffness: 100,
          }),
        );
      } else {
        scale.value = withSpring(1, {
          damping: 12,
          stiffness: 100,
        });
      }

      const trackingTimeout = setTimeout(() => {
        setTracksViewChanges(false);
      }, 500);

      return () => clearTimeout(trackingTimeout);
    }, [isSelected]);

    const hasValidCoordinates = useMemo(
      () =>
        Array.isArray(venue.location?.coordinates) &&
        venue.location.coordinates.length >= 2 &&
        typeof venue.location.coordinates[1] === 'number' &&
        typeof venue.location.coordinates[0] === 'number',
      [venue.location?.coordinates],
    );

    if (!hasValidCoordinates) {
      console.warn(`Invalid coordinates for venue ${venue.id}`);
      return null;
    }

    const handlePress = () => {
      setTracksViewChanges(true);
      scale.value = withSequence(
        withTiming(1.3, {duration: 100}),
        withDelay(
          50,
          withSpring(isSelected ? 1.1 : 1, {
            damping: 10,
            stiffness: 100,
          }),
        ),
      );

      onPress(venue);
    };

    const coordinate = useMemo(
      () => ({
        latitude: venue.location.coordinates[1],
        longitude: venue.location.coordinates[0],
      }),
      [venue.location.coordinates],
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
        onPress={handlePress}
        zIndex={isSelected ? 10000 : 9999}
        anchor={{x: 0.5, y: 1}}
        tracksViewChanges={tracksViewChanges}>
        <Animated.View style={animatedStyle}>
          <Icon
            name="room"
            size={36}
            color={
              isSelected
                ? mode === 'dark'
                  ? VENUE_COLORS.selectedDark
                  : VENUE_COLORS.selectedLight
                : mode === 'dark'
                ? VENUE_COLORS.dark
                : VENUE_COLORS.light
            }
            style={[
              styles.icon,
              {
                shadowColor:
                  mode === 'dark'
                    ? CLUSTER_COLORS_DARK.MARKER_STROKE
                    : CLUSTER_COLORS_LIGHT.MARKER_STROKE,
                textShadowColor:
                  mode === 'dark'
                    ? CLUSTER_COLORS_DARK.MARKER_STROKE
                    : CLUSTER_COLORS_LIGHT.MARKER_STROKE,
                textShadowRadius: 2,
              },
            ]}
          />
        </Animated.View>
      </Marker>
    );
  },
  (prev, next) =>
    prev.venue.id === next.venue.id &&
    prev.isSelected === next.isSelected &&
    Array.isArray(prev.venue.location?.coordinates) &&
    Array.isArray(next.venue.location?.coordinates) &&
    prev.venue.location.coordinates[1] === next.venue.location.coordinates[1] &&
    prev.venue.location.coordinates[0] === next.venue.location.coordinates[0],
);

const styles = StyleSheet.create({
  icon: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});

export default VenueMarkerComponent;
