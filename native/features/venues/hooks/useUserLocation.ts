import { useState, useEffect, useCallback } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { ARMENIA_REGION } from '../stores/useVenueSearchStore';

interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserLocation = useCallback(() => {
    setIsLoading(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(new Error(err.message));
        setUserLocation({
          latitude: ARMENIA_REGION.latitude,
          longitude: ARMENIA_REGION.longitude,
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  return {
    userLocation,
    error,
    isLoading,
    fetchUserLocation,
  };
}; 