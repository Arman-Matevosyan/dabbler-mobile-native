import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StatusBar,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export interface ImageSliderProps {
  images: Array<{ url: string; id?: string }>;
  onBackPress: () => void;
  title?: string;
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  isLoading?: boolean;
  style?: any;
  height?: number | string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  onBackPress,
  title = '',
  showFavoriteButton = false,
  isFavorite = false,
  onFavoritePress,
  isLoading = false,
  style,
  height: customHeight,
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const headerOpacity = useSharedValue(1);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    },
    [currentIndex],
  );

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      headerOpacity.value = withTiming(0, { duration: 200 });
    })
    .onUpdate(e => {
      scale.value = Math.max(1, Math.min(e.scale, 3));
      translateX.value = e.focalX;
      translateY.value = e.focalY;
      setIsZoomed(scale.value > 1);
    })
    .onEnd(() => {
      if (scale.value < 1.2) {
        scale.value = withTiming(1, { duration: 150 });
        translateX.value = withTiming(0, { duration: 150 });
        translateY.value = withTiming(0, { duration: 150 });
        headerOpacity.value = withTiming(1, { duration: 200 });
        setIsZoomed(false);
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(e => {
      if (scale.value > 1) {
        scale.value = withTiming(1, { duration: 250 });
        translateX.value = withTiming(0, { duration: 250 });
        translateY.value = withTiming(0, { duration: 250 });
        headerOpacity.value = withTiming(1, { duration: 200 });
        setIsZoomed(false);
      } else {
        scale.value = withTiming(2, { duration: 250 });
        translateX.value = e.x;
        translateY.value = e.y;
        headerOpacity.value = withTiming(0, { duration: 200 });
        setIsZoomed(true);
      }
    });

  const panGesture = Gesture.Pan()
    .enabled(isZoomed)
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    });

  const gesture = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Exclusive(doubleTapGesture, panGesture),
  );

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [
        {
          translateY: interpolate(headerOpacity.value, [0, 1], [-50, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  return (
    <View style={[styles.container, customHeight ? { height: customHeight } : null, style]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
        style={styles.headerGradient}
        pointerEvents="none"
      />

      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {title && (
          <Text style={[styles.title, { color: 'white' }]} numberOfLines={1}>
            {title}
          </Text>
        )}

        {showFavoriteButton && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
            disabled={isLoading}
            activeOpacity={0.7}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <Icon
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={isFavorite ? '#FF3B30' : 'white'}
              />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>

      <GestureHandlerRootView style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => item.id || `image-${index}`}
          renderItem={({ item }) => (
            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.imageWrapper, animatedImageStyle]}>
                <Image source={{ uri: item.url }} style={styles.image} resizeMode="cover" />
              </Animated.View>
            </GestureDetector>
          )}
        />
      </GestureHandlerRootView>

      <Animated.View style={[styles.counter, animatedHeaderStyle]}>
        <View style={[styles.counterContainer, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
          <Text style={[styles.counterText, { color: colors.textPrimary }]}>
            {currentIndex + 1}/{images.length}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.4,
    width: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 5,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  favoriteButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  counter: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    zIndex: 10,
  },
  counterContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
