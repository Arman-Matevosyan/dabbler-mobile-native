import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface SkeletonProps {
  width?: number | "auto" | `${number}%`;
  height?: number | "auto" | `${number}%`;
  style?: ViewStyle;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  style,
  borderRadius = 4,
}) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Store the animation reference so we can stop it later
    animationRef.current = animation;
    animation.start();

    return () => {
      // Make sure animation is properly stopped on unmount
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

interface SkeletonListProps {
  count: number;
  height?: number | "auto" | `${number}%`;
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
        <Skeleton 
          key={`skeleton-${index}`} 
          height={height} 
          style={style} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
}); 