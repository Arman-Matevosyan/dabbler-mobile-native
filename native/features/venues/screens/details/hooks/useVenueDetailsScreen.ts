import {useVenueDetails} from '@/features/venues/hooks';
import {useState, useCallback, useRef} from 'react';
import {Animated} from 'react-native';

export const useVenueDetailsScreen = (venueId: string) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showImportantInfo, setShowImportantInfo] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    data: venueResponse,
    isLoading,
    error,
    refetch,
  } = useVenueDetails(venueId);

  const venueDetails = venueResponse?.response;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const toggleDescription = useCallback(() => {
    setShowFullDescription(prev => !prev);
  }, []);

  const toggleImportantInfo = useCallback(() => {
    setShowImportantInfo(prev => !prev);
  }, []);

  const handleToggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
  }, []);

  const navigateToClasses = useCallback(() => {
    console.log('Navigate to classes for venue:', venueId);
  }, [venueId]);

  const getVenueCoordinates = useCallback(() => {
    if (!venueDetails?.location?.coordinates) {
      return {latitude: 0, longitude: 0};
    }

    const coordinates = venueDetails.location.coordinates;
    return {
      latitude: Number(coordinates[1]),
      longitude: Number(coordinates[0]),
    };
  }, [venueDetails]);

  const getAddressText = useCallback(() => {
    if (!venueDetails?.address) {
      return 'No address available';
    }

    const address = venueDetails.address;
    const {street, houseNumber, city, stateOrProvince} = address;
    return `${street || ''} ${houseNumber || ''}, ${city || ''} ${
      stateOrProvince ? `- ${stateOrProvince}` : ''
    }`.trim();
  }, [venueDetails]);

  return {
    venueDetails,
    isLoading,
    error,
    refetch,

    showFullDescription,
    showImportantInfo,
    isFavorite,
    scrollY,
    headerOpacity,

    toggleDescription,
    toggleImportantInfo,
    handleToggleFavorite,
    navigateToClasses,

    getVenueCoordinates,
    getAddressText,
  };
};
