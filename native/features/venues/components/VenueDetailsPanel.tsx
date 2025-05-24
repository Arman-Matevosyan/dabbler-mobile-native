import React, { memo, useCallback, useMemo } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Venue } from './MapComponent';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/design-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface VenueDetailsPanelProps {
  selectedVenue: Venue | null;
  isLoading: boolean;
  slideAnim: Animated.Value;
  opacityAnim: Animated.Value;
  onClose: () => void;
}

const VenueDetailsPanel: React.FC<VenueDetailsPanelProps> = memo(
  ({ selectedVenue, isLoading, slideAnim, opacityAnim, onClose }) => {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const { t } = useTranslation();

    const transformStyles = useMemo(
      () => ({
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
        containerStyle: {
          backgroundColor: colors.background,
          opacity: opacityAnim,
          width: SCREEN_WIDTH * 0.95,
        },
      }),
      [slideAnim, opacityAnim, colors.background],
    );

    const navigateToVenueDetails = useCallback(
      (venueId: string) => {
        onClose();
        navigation.navigate('VenueDetails', { id: venueId });
      },
      [onClose, navigation],
    );

    const venueContent = useMemo(() => {
      if (!selectedVenue) return null;

      return (
        <TouchableOpacity
          style={styles.venueContent}
          activeOpacity={1}
          onPress={() => navigateToVenueDetails(selectedVenue.id)}>
          <View style={styles.venueDetailsLayout}>
            <View style={styles.venueCoverContainer}>
              {selectedVenue?.covers?.[0] ? (
                <Image
                  source={{ uri: selectedVenue.covers[0]?.url }}
                  style={styles.venueCoverImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
              ) : (
                <View style={[styles.defaultImageContainer, { backgroundColor: colors.card }]}>
                  <Icon name="fitness-center" size={40} color={colors.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.venueInfoSection}>
              <Text style={[styles.venueName, { color: colors.textPrimary }]}>
                {selectedVenue.name}
              </Text>
              <Text style={[styles.venueCategories, { color: colors.textSecondary }]}>
                {Array.isArray(selectedVenue.categories) && selectedVenue.categories.length > 0
                  ? selectedVenue.categories.map((cat: any) => cat.name || cat).join(', ')
                  : 'Fitness, Yoga, Aerial'}
              </Text>
              <View style={[styles.plusButton, { backgroundColor: colors.accent }]}>
                <Text style={styles.plusButtonText}>{t('venues.viewMore')}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }, [selectedVenue, colors, navigateToVenueDetails, t]);

    const skeletonContent = useMemo(
      () => (
        <View style={styles.skeletonContainer}>
          <View
            style={[styles.skeletonItem, styles.skeletonTitle, { backgroundColor: colors.border }]}
          />
          <View
            style={[
              styles.skeletonItem,
              styles.skeletonSubtitle,
              { backgroundColor: colors.border },
            ]}
          />
          <View style={styles.ratingContainer}>
            <View
              style={[
                styles.skeletonItem,
                styles.skeletonRating,
                { backgroundColor: colors.border },
              ]}
            />
          </View>
        </View>
      ),
      [colors.border],
    );

    if (!selectedVenue) {
      return null;
    }

    return (
      <Animated.View
        style={[
          styles.venueDetailsContainer,
          transformStyles.containerStyle,
          { transform: [{ translateY: transformStyles.translateY }] },
        ]}
        renderToHardwareTextureAndroid
        shouldRasterizeIOS>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, right: 10, left: 10 }}>
          <Icon name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {isLoading ? skeletonContent : venueContent}
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.selectedVenue?.id === nextProps.selectedVenue?.id &&
      prevProps.slideAnim === nextProps.slideAnim &&
      prevProps.opacityAnim === nextProps.opacityAnim
    );
  },
);

const styles = StyleSheet.create({
  venueDetailsContainer: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.025,
    padding: 16,
    bottom: 0,
    top: -110,
    minHeight: 144,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 9999,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  venueContent: {
    paddingRight: 30,
  },
  venueDetailsLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  venueInfoSection: {
    flex: 1,
    paddingLeft: 16,
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venueCategories: {
    fontSize: 14,
    marginBottom: 8,
  },
  venueCoverContainer: {
    width: 100,
    height: 100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  venueCoverImage: {
    width: '100%',
    height: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  plusButton: {
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  plusButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  skeletonContainer: {
    padding: 4,
  },
  skeletonItem: {
    borderRadius: 4,
    marginBottom: 12,
    opacity: 0.7,
  },
  skeletonTitle: {
    width: '70%',
    height: 24,
  },
  skeletonSubtitle: {
    width: '50%',
    height: 16,
  },
  skeletonRating: {
    width: 120,
    height: 20,
  },
  defaultImageContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VenueDetailsPanel;
