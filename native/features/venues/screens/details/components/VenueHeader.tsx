import React from 'react';
import {View, Text, StyleSheet, Animated, TouchableOpacity, Platform} from 'react-native';
import {useTheme, ImageSlider} from '@/design-system';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ActivityIndicator} from 'react-native';

interface VenueHeaderProps {
  name: string;
  images: Array<{url: string}>;
  onBackPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
  isLoading: boolean;
  headerOpacity: Animated.AnimatedInterpolation<string | number>;
}

export const VenueHeader: React.FC<VenueHeaderProps> = ({
  name,
  images,
  onBackPress,
  onFavoritePress,
  isFavorite,
  isLoading,
  headerOpacity,
}) => {
  const {colors} = useTheme();

  return (
    <>
      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: colors.background,
            opacity: headerOpacity,
            borderBottomColor: colors.border,
          },
        ]}>
        <TouchableOpacity
          style={styles.fixedHeaderButton}
          onPress={onBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.fixedHeaderTitle, {color: colors.textPrimary}]}>
          {name}
        </Text>
        <TouchableOpacity
          style={styles.fixedHeaderButton}
          onPress={onFavoritePress}
          disabled={isLoading}
          activeOpacity={0.7}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF3B30" />
          ) : (
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={26}
              color={isFavorite ? '#FF3B30' : colors.textPrimary}
            />
          )}
        </TouchableOpacity>
      </Animated.View>

      <ImageSlider
        images={images}
        onBackPress={onBackPress}
        title={name}
        showFavoriteButton={true}
        isFavorite={isFavorite}
        onFavoritePress={onFavoritePress}
        isLoading={isLoading}
      />

      <View style={styles.venueNameContainer}>
        <Text style={[styles.venueName, {color: colors.textPrimary}]}>
          {name}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 90 : 60,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 100,
  },
  fixedHeaderButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  venueNameContainer: {
    padding: 16,
    paddingTop: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
}); 