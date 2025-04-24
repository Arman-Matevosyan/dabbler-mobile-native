import React, {useCallback, useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {Text, Button, useTheme, Skeleton} from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFavorites} from '@/hooks/useFavorites';

interface IVenue {
  id: string;
  name: string;
  address?: {
    city?: string;
    district?: string;
  };
  covers?: Array<{url: string}>;
  categories?: string[];
  description?: string;
}

const VenueSkeletonItem = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.skeletonItem, {backgroundColor: colors.card}]}>
      <Skeleton style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <Skeleton style={{height: 20, width: '60%', marginBottom: 12}} />

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.textSecondary,
              opacity: 0.5,
              marginRight: 8,
            }}
          />
          <Skeleton style={{height: 16, width: '70%'}} />
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: colors.textSecondary,
              opacity: 0.5,
              marginRight: 8,
            }}
          />
          <Skeleton style={{height: 16, width: '80%'}} />
        </View>
      </View>
    </View>
  );
};

const SkeletonHeader = () => {
  const {colors} = useTheme();
  return (
    <View style={[styles.header, {borderBottomColor: colors.border}]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Skeleton
          style={{width: 40, height: 40, borderRadius: 20, marginRight: 16}}
        />
        <Skeleton style={{width: 150, height: 26}} />
      </View>
      <Skeleton
        style={{width: '100%', height: 50, borderRadius: 8, marginTop: 16}}
      />
    </View>
  );
};

const VenueCard = ({
  item,
  onPress,
}: {
  item: IVenue;
  onPress: (venue: IVenue) => void;
}) => {
  const {colors} = useTheme();

  const imageUrl = item.covers?.[0]?.url || 'https://i.imgur.com/z9hbLVX.jpg';

  const location = item.address
    ? `${item.address.city || ''} ${
        item.address.district ? `- ${item.address.district}` : ''
      }`
    : '';

  const categoriesText = item.categories
    ? Array.isArray(item.categories)
      ? item.categories.join(', ')
      : ''
    : '';

  return (
    <TouchableOpacity
      style={[styles.venueCard, {backgroundColor: colors.card}]}
      activeOpacity={1}
      onPress={() => onPress(item)}>
      <Image
        source={{uri: imageUrl}}
        style={styles.venueImage}
        resizeMode="cover"
      />

      <View style={styles.venueDetails}>
        <Text variant="heading3" style={styles.venueName}>
          {item.name}
        </Text>

        <View style={styles.locationContainer}>
          <MaterialIcons
            name="location-on"
            size={14}
            color={colors.textSecondary}
          />
          <Text
            variant="bodySmall"
            color="secondary"
            style={styles.locationText}>
            {location}
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          <MaterialIcons
            name="local-offer"
            size={14}
            color={colors.textSecondary}
            style={styles.tagIcon}
          />
          <Text
            variant="bodySmall"
            color="secondary"
            style={styles.tagsText}
            numberOfLines={2}>
            {categoriesText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const FavoritesScreen = () => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {favorites, isLoading} = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isLoading]);

  const filteredFavorites = searchQuery
    ? favorites.filter(
        venue =>
          venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.address?.city
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          venue.address?.district
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    : favorites;

  const handleVenuePress = useCallback(
    (venue: IVenue) => {
      // For typesafety, we'll need to have a proper navigation type
      // This is just a workaround for the current implementation
      // @ts-ignore - Navigation typing would need to be updated
      navigation.navigate('VenueDetails', {id: venue.id});
    },
    [navigation],
  );

  const renderSkeletons = () => {
    return (
      <Animated.View style={{opacity: fadeAnim}}>
        {[1, 2, 3, 4, 5].map(key => (
          <VenueSkeletonItem key={key} />
        ))}
      </Animated.View>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons
          name="favorite-border"
          size={64}
          color={colors.textSecondary}
        />
        <Text
          variant="heading3"
          color="secondary"
          style={styles.emptyStateText}>
          No favorite venues found
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    if (isLoading) {
      return <SkeletonHeader />;
    }

    return (
      <View style={[styles.header, {borderBottomColor: colors.border}]}>
        <View style={styles.headerTop}>
          <Button
            variant="ghost"
            onPress={() => navigation.goBack()}
            icon={
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            }
            style={styles.backButton}
          />
          <Text variant="heading1">Favorites</Text>
        </View>

        <View style={[styles.searchContainer, {backgroundColor: colors.card}]}>
          <MaterialIcons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search favorites..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, {color: colors.textPrimary}]}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}>
              <MaterialIcons
                name="close"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return renderSkeletons();
    }

    if (!isLoading && filteredFavorites.length === 0) {
      return renderEmptyState();
    }

    return (
      <FlatList
        data={filteredFavorites}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <VenueCard item={item} onPress={handleVenuePress} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
        },
      ]}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: 'center',
  },
  venueCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  venueImage: {
    height: 160,
    width: '100%',
  },
  venueDetails: {
    padding: 16,
  },
  venueName: {
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tagIcon: {
    marginTop: 2,
  },
  tagsText: {
    marginLeft: 4,
    flex: 1,
  },
  skeletonItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  skeletonImage: {
    height: 160,
    width: '100%',
  },
  skeletonContent: {
    padding: 16,
  },
});
