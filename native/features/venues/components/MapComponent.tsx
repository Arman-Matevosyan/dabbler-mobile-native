import { darkMapStyle, lightMapStyle } from '@/constants/MapColors';
import React, { memo, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Platform, StyleSheet, View, Animated } from 'react-native';
import MapView, {
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Region,
  Marker,
  MarkerAnimated,
} from 'react-native-maps';
import { useTheme } from '@/design-system';
import { useVenueSearch } from '../hooks/useVenueSearch';
import { useIsFocused } from '@react-navigation/native';
import { useLocationParams } from '@/stores/searchStore';
import VenueMarker from './VenueMarker';
import ClusterMarker from './ClusterMarker';
import { Venue, Cluster } from '../hooks/useVenueSearch';

const INITIAL_ZOOM_LEVEL = 10;
const ZOOM_ANIMATION_DURATION = 500; // ms

interface MarkerAnimationState {
  [key: string]: {
    opacity: Animated.Value;
    scale: Animated.Value;
    isVisible: boolean;
  };
}

const MapComponent = () => {
  const { mode } = useTheme();
  const mapRef = useRef<MapView>(null);
  const isFocused = useIsFocused();
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM_LEVEL);
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isMapMoving, setIsMapMoving] = useState(false);
  const lastRegionChangeTimestamp = useRef<number>(0);
  const debounceTimeout = useRef<number | null>(null);
  const [prevData, setPrevData] = useState<{ venues: Venue[]; clusters: Cluster[] } | null>(null);
  const [markerAnimations, setMarkerAnimations] = useState<MarkerAnimationState>({});
  const [clusterAnimations, setClusterAnimations] = useState<MarkerAnimationState>({});

  const { locationLat, locationLng, radius, updateLocation } = useLocationParams();

  // Calculate dynamic radius based on zoom level - in meters
  const calculateRadiusFromZoom = (zoom: number): number => {
    // These are in meters already
    if (zoom >= 16) return 1000; // ~1km radius
    if (zoom >= 14) return 3000; // ~3km radius
    if (zoom >= 12) return 5000; // ~5km radius
    if (zoom >= 10) return 15000; // ~15km radius
    if (zoom >= 8) return 50000; // ~50km radius
    return 100000; // ~100km radius - very zoomed out
  };

  const calculateZoomLevel = (delta: number): number => {
    if (delta <= 0.001) return 16;
    if (delta <= 0.01) return 14;
    if (delta <= 0.05) return 12;
    if (delta <= 0.1) return 10;
    if (delta <= 0.5) return 8;
    return 6;
  };

  // Get venues and clusters based on current parameters
  const searchParams = {
    locationLat,
    locationLng,
    radius,
    zoomLevel,
    limit: 100,
    offset: 0,
  };

  const { data } = useVenueSearch(searchParams, isFocused);

  // Initialize and update animations for markers and clusters
  useEffect(() => {
    if (!data) return;

    // Store current data for animation
    if (prevData) {
      // Handle venue animations
      const newVenueAnimations = { ...markerAnimations };

      // Animate out disappearing venues
      prevData.venues.forEach(venue => {
        const stillExists = data.venues.some(v => v.id === venue.id);
        if (!stillExists) {
          if (newVenueAnimations[venue.id]) {
            // Fade out animation
            Animated.timing(newVenueAnimations[venue.id].opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              // Remove after animation completes
              setMarkerAnimations(current => {
                const updated = { ...current };
                delete updated[venue.id];
                return updated;
              });
            });
          }
        }
      });

      // Initialize animations for new venues
      data.venues.forEach(venue => {
        if (!newVenueAnimations[venue.id]) {
          newVenueAnimations[venue.id] = {
            opacity: new Animated.Value(0),
            scale: new Animated.Value(0.5),
            isVisible: true,
          };

          // Fade in animation
          Animated.parallel([
            Animated.timing(newVenueAnimations[venue.id].opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(newVenueAnimations[venue.id].scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });

      setMarkerAnimations(newVenueAnimations);

      // Handle cluster animations
      const newClusterAnimations = { ...clusterAnimations };

      // Animate out disappearing clusters
      prevData.clusters.forEach(cluster => {
        const stillExists = data.clusters.some(c => c.id === cluster.id);
        if (!stillExists) {
          if (newClusterAnimations[cluster.id]) {
            // Fade out animation
            Animated.timing(newClusterAnimations[cluster.id].opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              // Remove after animation completes
              setClusterAnimations(current => {
                const updated = { ...current };
                delete updated[cluster.id];
                return updated;
              });
            });
          }
        }
      });

      // Initialize animations for new clusters
      data.clusters.forEach(cluster => {
        if (!newClusterAnimations[cluster.id]) {
          newClusterAnimations[cluster.id] = {
            opacity: new Animated.Value(0),
            scale: new Animated.Value(0.5),
            isVisible: true,
          };

          // Fade in animation
          Animated.parallel([
            Animated.timing(newClusterAnimations[cluster.id].opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(newClusterAnimations[cluster.id].scale, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }
      });

      setClusterAnimations(newClusterAnimations);
    } else {
      // First load - initialize all animations
      const newVenueAnimations: MarkerAnimationState = {};
      const newClusterAnimations: MarkerAnimationState = {};

      data.venues.forEach(venue => {
        newVenueAnimations[venue.id] = {
          opacity: new Animated.Value(1),
          scale: new Animated.Value(1),
          isVisible: true,
        };
      });

      data.clusters.forEach(cluster => {
        newClusterAnimations[cluster.id] = {
          opacity: new Animated.Value(1),
          scale: new Animated.Value(1),
          isVisible: true,
        };
      });

      setMarkerAnimations(newVenueAnimations);
      setClusterAnimations(newClusterAnimations);
    }

    setPrevData({
      venues: data.venues || [],
      clusters: data.clusters || [],
    });
  }, [data]);

  // Debounced region change handler to reduce API calls during continuous zoom/pan
  const handleRegionChange = useCallback(
    (region: Region) => {
      const now = Date.now();

      // Clear any existing timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Mark that the map is moving
      setIsMapMoving(true);

      // Debounce the actual region change handling
      debounceTimeout.current = setTimeout(() => {
        const newZoomLevel = calculateZoomLevel(region.latitudeDelta);
        setZoomLevel(newZoomLevel);

        // Update search params with new center and radius
        updateLocation({
          locationLat: region.latitude,
          locationLng: region.longitude,
          radius: calculateRadiusFromZoom(newZoomLevel),
        });

        setIsMapMoving(false);
        lastRegionChangeTimestamp.current = now;
      }, 300); // 300ms debounce
    },
    [updateLocation],
  );

  // Handle region change start to mark map as moving
  const handleRegionChangeStart = useCallback(() => {
    setIsMapMoving(true);
  }, []);

  // Handle cluster press
  const handleClusterPress = useCallback((cluster: any) => {
    if (!mapRef.current) return;

    const { coordinate, venues } = cluster;

    // Find the boundaries of the venues in the cluster
    let minLat = Infinity,
      maxLat = -Infinity;
    let minLng = Infinity,
      maxLng = -Infinity;

    venues.forEach((venue: any) => {
      minLat = Math.min(minLat, venue.location.latitude);
      maxLat = Math.max(maxLat, venue.location.latitude);
      minLng = Math.min(minLng, venue.location.longitude);
      maxLng = Math.max(maxLng, venue.location.longitude);
    });

    // Add padding around the cluster area
    const PADDING = 0.01;
    minLat -= PADDING;
    maxLat += PADDING;
    minLng -= PADDING;
    maxLng += PADDING;

    // Animate to the region containing all venues in the cluster
    mapRef.current.animateToRegion(
      {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(maxLat - minLat, 0.01),
        longitudeDelta: Math.max(maxLng - minLng, 0.01),
      },
      ZOOM_ANIMATION_DURATION,
    );
  }, []);

  // Handle venue marker press
  const handleVenuePress = useCallback((venueId: string) => {
    setSelectedVenueId(venueId);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={mode === 'dark' ? darkMapStyle : lightMapStyle}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        showsUserLocation={true}
        onRegionChangeComplete={handleRegionChange}
        onRegionChange={handleRegionChangeStart}
        moveOnMarkerPress={false}
        maxZoomLevel={18}
        minZoomLevel={3}
        rotateEnabled={false}
        pitchEnabled={false}
        zoomEnabled={true}
        zoomControlEnabled={true}
        zoomTapEnabled={true}>
        {/* Render all venues with animations */}
        {data?.venues?.map(venue => {
          const animation = markerAnimations[venue.id];
          if (!animation) return null;

          return (
            <MarkerAnimated
              key={venue.id}
              coordinate={venue.location}
              onPress={() => handleVenuePress(venue.id)}
              tracksViewChanges={false}
              opacity={animation.opacity}>
              <Animated.View
                style={{
                  transform: [{ scale: animation.scale }],
                }}>
                <View pointerEvents="none">
                  <VenueMarker
                    coordinate={venue.location}
                    onPress={() => handleVenuePress(venue.id)}
                    isSelected={venue.id === selectedVenueId}
                  />
                </View>
              </Animated.View>
            </MarkerAnimated>
          );
        })}

        {/* Render all clusters with animations */}
        {data?.clusters?.map(cluster => {
          const animation = clusterAnimations[cluster.id];
          if (!animation) return null;

          return (
            <MarkerAnimated
              key={cluster.id}
              coordinate={cluster.coordinate}
              onPress={() => handleClusterPress(cluster)}
              tracksViewChanges={false}
              opacity={animation.opacity}>
              <Animated.View
                style={{
                  transform: [{ scale: animation.scale }],
                }}>
                <View pointerEvents="none">
                  <ClusterMarker
                    coordinate={cluster.coordinate}
                    count={cluster.count}
                    onPress={() => handleClusterPress(cluster)}
                  />
                </View>
              </Animated.View>
            </MarkerAnimated>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
});

export default memo(MapComponent);
