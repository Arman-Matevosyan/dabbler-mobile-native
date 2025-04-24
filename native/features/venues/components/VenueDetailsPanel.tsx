import React, {memo, useCallback, useMemo, useEffect} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {Venue} from './MapComponent';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@/design-system';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface VenueDetailsPanelProps {
  selectedVenue: Venue | null;
  isLoading: boolean;
  slideAnim: Animated.Value;
  opacityAnim: Animated.Value;
  onClose: () => void;
}

const VenueDetailsPanel: React.FC<VenueDetailsPanelProps> = memo(
  ({selectedVenue, isLoading, slideAnim, opacityAnim, onClose}) => {
    const navigation = useNavigation<any>();
    const {colors} = useTheme();
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
        navigation.navigate('VenueDetails', {id: venueId});
      },
      [onClose, navigation],
    );

    const handlePanelPress = useCallback(() => {
      if (selectedVenue?.id) {
        navigateToVenueDetails(selectedVenue.id);
      }
    }, [selectedVenue, navigateToVenueDetails]);

    const handleClose = useCallback(
      (e?: any) => {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        }

        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          onClose();
        });
      },
      [onClose, opacityAnim],
    );

    const venueContent = useMemo(() => {
      if (!selectedVenue) return null;

      return (
        <View style={styles.venueContent}>
          <View style={styles.venueDetailsLayout}>
            <View style={styles.venueCoverContainer}>
              {selectedVenue?.covers?.[0] ? (
                <Image
                  source={{uri: selectedVenue.covers[0]?.url}}
                  style={styles.venueCoverImage}
                  resizeMode="cover"
                  fadeDuration={0}
                />
              ) : (
                <View
                  style={[
                    styles.defaultImageContainer,
                    {backgroundColor: colors.card},
                  ]}>
                  <Icon name="fitness-center" size={40} color={colors.accent} />
                </View>
              )}
            </View>

            <View style={styles.venueInfoSection}>
              <Text style={[styles.venueName, {color: colors.textPrimary}]}>
                {selectedVenue.name}
              </Text>
              <Text
                style={[styles.venueCategories, {color: colors.textSecondary}]}>
                {Array.isArray(selectedVenue.categories) &&
                selectedVenue.categories.length > 0
                  ? selectedVenue.categories.map((cat: any) => cat.name)
                  : 'Venue'}
              </Text>
              <View
                style={[styles.plusButton, {backgroundColor: colors.accent}]}>
                <Text style={styles.plusButtonText}>Details</Text>
              </View>
            </View>
          </View>
        </View>
      );
    }, [selectedVenue, colors]);

    const skeletonContent = useMemo(
      () => (
        <View style={styles.skeletonContainer}>
          <View
            style={[
              styles.skeletonItem,
              styles.skeletonTitle,
              {backgroundColor: colors.border},
            ]}
          />
          <View
            style={[
              styles.skeletonItem,
              styles.skeletonSubtitle,
              {backgroundColor: colors.border},
            ]}
          />
          <View style={styles.ratingContainer}>
            <View
              style={[
                styles.skeletonItem,
                styles.skeletonRating,
                {backgroundColor: colors.border},
              ]}
            />
          </View>
        </View>
      ),
      [colors.border],
    );

    if (!selectedVenue) return null;

    return (
      <>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.overlay} pointerEvents="auto" />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.venueDetailsContainer,
            transformStyles.containerStyle,
            {transform: [{translateY: transformStyles.translateY}]},
          ]}
          pointerEvents="box-none">
          <TouchableOpacity
            style={[styles.closeButton, {backgroundColor: colors.card}]}
            onPress={handleClose}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
            activeOpacity={1}>
            <Icon name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={handlePanelPress}
            style={styles.contentTouchable}>
            <View style={styles.contentWrapper}>
              {isLoading ? skeletonContent : venueContent}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  venueDetailsContainer: {
    position: 'absolute',
    bottom: 75,
    left: SCREEN_WIDTH * 0.025,
    padding: 16,
    paddingBottom: 20,
    minHeight: 144,
    borderRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1010,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
      },
    }),
  },
  contentTouchable: {
    width: '100%',
    height: '100%',
    paddingRight: 30,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  venueContent: {
    zIndex: 5,
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
  defaultImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingCount: {
    fontSize: 14,
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
    height: 24,
    width: '70%',
  },
  skeletonSubtitle: {
    height: 16,
    width: '50%',
  },
  skeletonRating: {
    height: 16,
    width: 80,
  },
});

export default VenueDetailsPanel;
