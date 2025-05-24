import React, { ReactNode } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/design-system';

interface CardProps {
  imageUrl?: string;

  onPress?: () => void;

  badge?: ReactNode;

  children: ReactNode;

  style?: object;

  imageStyle?: object;

  contentStyle?: object;
  onImageError?: () => void;
}

export const Card: React.FC<CardProps> = ({
  imageUrl,
  onPress,
  badge,
  children,
  style,
  imageStyle,
  contentStyle,
}) => {
  const { colors } = useTheme();
  const renderCardContent = () => (
    <View style={[styles.container, style, { borderBottomColor: colors.border }]}>
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={[styles.image, imageStyle]} resizeMode="cover" />
          {badge && badge}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        {renderCardContent()}
      </TouchableOpacity>
    );
  }

  return renderCardContent();
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 24,
  },
});

export default Card;
