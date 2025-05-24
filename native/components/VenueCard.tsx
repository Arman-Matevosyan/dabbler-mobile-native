import React, { memo } from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/design-system';
import { useFavorites } from '@/hooks/useFavorites';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface VenueCardProps {
  item: {
    id: string;
    name: string;
    description?: string;
    covers?: Array<{ url: string }>;
    address?: {
      city?: string;
      district?: string;
    };
    isFavorite?: boolean;
    categories?: Array<{ name: string }> | string[];
  };
  onPress: (venue: any) => void;
}

const VenueCard = ({ item, onPress }: VenueCardProps) => {
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoritePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {item.covers && item.covers[0] ? (
          <Image
            source={{ uri: item.covers[0].url }}
            style={styles.image}
            resizeMode="cover"
            // For better performance, use FastImage instead:
            // <FastImage
            //   source={{ uri: item.covers[0].url }}
            //   style={styles.image}
            //   resizeMode={FastImage.resizeMode.cover}
            // />
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: colors.border }]}>
            <MaterialIcons name="fitness-center" size={30} color={colors.textSecondary} />
          </View>
        )}

        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: colors.card }]}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MaterialIcons
            name={isFavorite(item.id) ? 'favorite' : 'favorite-border'}
            size={22}
            color={isFavorite(item.id) ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
          {item.name}
        </Text>

        {item.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {item.address && (item.address.city || item.address.district) && (
          <View style={styles.addressContainer}>
            <MaterialIcons name="place" size={14} color={colors.textSecondary} />
            <Text style={[styles.address, { color: colors.textSecondary }]} numberOfLines={1}>
              {[item.address.city, item.address.district].filter(Boolean).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  imageContainer: {
    height: 150,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 12,
    marginLeft: 4,
  },
});

// Use memo to prevent unnecessary re-renders
export default memo(VenueCard, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.description === nextProps.item.description &&
    prevProps.item.covers?.[0]?.url === nextProps.item.covers?.[0]?.url
  );
});
