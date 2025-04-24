import React, {useCallback, useMemo, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Text, Button, useTheme} from '@/design-system';
import {IVenue} from '@/types/class.interfaces';

interface ExtendedVenue extends IVenue {
  categories?: Array<{name: string}>;
  covers?: Array<{url: string}>;
  address?: {
    city?: string;
    district?: string;
  };
  isInPlan?: boolean;
  isFavorite?: boolean;
  description?: string;
}

interface VenueCardProps {
  item: ExtendedVenue;
  onPress?: (venue: ExtendedVenue) => void;
}

const VenueCard = React.memo(({item, onPress}: VenueCardProps) => {
  const {colors} = useTheme();
  const [imageError, setImageError] = useState(false);

  const hasImage = item.covers && item.covers.length > 0 && item.covers[0]?.url;
  const imageUrl = hasImage ? item.covers?.[0].url : undefined;

  const locationText = useMemo(() => {
    if (item.address) {
      if (item.address.district && item.address.city) {
        return `${item.address.district}, ${item.address.city}`;
      }
      if (item.address.city) {
        return item.address.city;
      }
    }
    return '';
  }, [item.address]);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <>
      <Button onPress={handlePress} title="cover">
        <View style={styles.leftContainer}>
          {hasImage && !imageError ? (
            <Image
              source={{uri: imageUrl}}
              style={styles.venueImage}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <View
              style={[
                styles.placeholderImage,
                {backgroundColor: colors.border},
              ]}></View>
          )}

          <View style={styles.favoriteButtonContainer}></View>
        </View>

        <View style={styles.venueDetails}>
          <Text style={[styles.venueName, {color: colors.textPrimary}]}>
            {item.name}
          </Text>
          <Text
            style={[styles.venueLocation, {color: colors.textSecondary}]}
            numberOfLines={1}>
            {locationText}
          </Text>
          {item.description && (
            <Text
              style={[styles.venueDescription, {color: colors.textSecondary}]}
              numberOfLines={2}>
              {item.description.length > 100
                ? `${item.description.substring(0, 100)}...`
                : item.description}
            </Text>
          )}
        </View>
      </Button>
      <View
        style={[
          styles.separator,
          {
            backgroundColor: colors.border,
            marginVertical: 16,
          },
        ]}
      />
    </>
  );
});

const styles = StyleSheet.create({
  venueImage: {
    width: 110,
    height: '100%',
    borderRadius: 0,
    marginRight: 0,
  },
  venueDetails: {
    padding: 12,
    justifyContent: 'center',
    flex: 1,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  venueDescription: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  venueLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  placeholderImage: {
    width: 110,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    marginRight: 0,
  },
  leftContainer: {
    position: 'relative',
    width: 110,
    height: '100%',
    overflow: 'hidden',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 4,
    right: 4,
    zIndex: 2,
  },
});

export default VenueCard;
