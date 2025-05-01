import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, Easing } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

interface SkeletonProps {
  width?: number | 'auto' | `${number}%`;
  height?: number | 'auto' | `${number}%`;
  style?: ViewStyle;
  borderRadius?: number;
}

let globalRenderCounter = 0;

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  style,
  borderRadius = 4,
}) => {
  const { colors, mode } = useTheme();
  const shimmerValue = useRef(new Animated.Value(-300)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const renderIdRef = useRef(globalRenderCounter++);

  const getAnimationDelay = () => {
    return (renderIdRef.current % 3) * 180;
  };

  const getShimmerColors = () => {
    return mode === 'dark'
      ? [`${colors.border}10`, `${colors.border}40`, `${colors.border}10`]
      : [`${colors.border}05`, `${colors.border}30`, `${colors.border}05`];
  };

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }

    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(getAnimationDelay()),
        Animated.timing(shimmerValue, {
          toValue: 300,
          duration: 2200,
          easing: Easing.bezier(0.12, 0.45, 0.5, 0.95),
          useNativeDriver: true,
        }),
        Animated.delay(100),
        Animated.timing(shimmerValue, {
          toValue: -300,
          duration: 10,
          useNativeDriver: true,
        }),
        Animated.delay(400),
      ]),
    );

    animationRef.current = shimmerAnimation;
    shimmerAnimation.start();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [shimmerValue]);

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: mode === 'dark' ? colors.border + '25' : colors.border + '15',
          borderRadius,
          overflow: 'hidden' as const,
        },
        style,
      ]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            transform: [{ translateX: shimmerValue }],
          },
        ]}>
        <LinearGradient
          colors={getShimmerColors()}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1, width: '200%' }}
        />
      </Animated.View>
    </View>
  );
};

interface SkeletonListProps {
  count: number;
  height?: number | 'auto' | `${number}%`;
  style?: ViewStyle;
  gap?: number;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count,
  height = 20,
  style,
  gap = 8,
}) => {
  return (
    <View style={[styles.listContainer, { gap }]}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={`skeleton-${index}`} height={height} style={style} />
      ))}
    </View>
  );
};

export const SkeletonCard = ({ style }: { style?: ViewStyle }) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <Skeleton height={160} borderRadius={8} />
      <View style={styles.cardContent}>
        <Skeleton width="70%" height={22} style={styles.cardTitle} />
        <Skeleton width="90%" height={16} style={styles.cardText} />
        <Skeleton width="60%" height={16} style={styles.cardText} />

        <View style={styles.cardFooter}>
          <Skeleton width={80} height={36} borderRadius={18} />
          <Skeleton width={80} height={36} borderRadius={18} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonAvatar = ({ size = 50, style }: { size?: number; style?: ViewStyle }) => {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
  cardContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    marginBottom: 12,
  },
  cardText: {
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
