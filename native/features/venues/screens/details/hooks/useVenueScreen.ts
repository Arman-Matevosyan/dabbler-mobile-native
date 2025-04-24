import {useState, useCallback} from 'react';
import {Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {VenuesStackParamList} from '@/navigation/types';

export const useVenueScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<VenuesStackParamList>>();
  const [activeVenueId, setActiveVenueId] = useState<string | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const animatedFilterHeight = new Animated.Value(0);

  const selectVenue = useCallback((id: string) => {
    setActiveVenueId(id);
  }, []);

  const navigateToVenueDetails = useCallback(
    (venueId: string) => {
      navigation.navigate('VenueDetails', {id: venueId});
    },
    [navigation],
  );

  const clearSelection = useCallback(() => {
    setActiveVenueId(null);
  }, []);

  const toggleFilter = useCallback(() => {
    const toValue = filterVisible ? 0 : 300;

    Animated.timing(animatedFilterHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setFilterVisible(!filterVisible);
  }, [filterVisible, animatedFilterHeight]);

  const formatVenueData = useCallback((data: any) => {
    if (!data) return [];

    return data.map((venue: any) => ({
      id: venue.id,
      name: venue.name,
      address: venue.address?.city ? `${venue.address.city}` : 'No address',
      image: venue.covers?.[0]?.url,
      coordinates: {
        latitude: venue.location?.coordinates?.[1] || 0,
        longitude: venue.location?.coordinates?.[0] || 0,
      },
      category: venue.category,
      rating: venue.rating,
      distance: venue.distance,
      description: venue.description,
    }));
  }, []);

  return {
    activeVenueId,
    filterVisible,
    animatedFilterHeight,
    selectVenue,
    clearSelection,
    toggleFilter,
    formatVenueData,
    navigateToVenueDetails,
  };
};
