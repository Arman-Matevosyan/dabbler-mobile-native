import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { useTheme } from '@/design-system';
import { ImageSlider } from '@/design-system/components/ImageSlider';

interface Cover {
  url: string;
  id?: string;
}

interface ClassImageSliderProps {
  covers?: Cover[];
  className?: string;
  onBackPress: () => void;
}

export const ClassImageSlider = React.memo(
  ({ covers, className, onBackPress }: ClassImageSliderProps) => {
    const defaultImage = {
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    };

    const imagesToShow =
      covers && covers.length > 0 ? covers.filter(cover => !!cover.url) : [defaultImage];

    if (!imagesToShow.length) {
      imagesToShow.push(defaultImage);
    }

    return (
      <View style={styles.imageContainer}>
        <ImageSlider
          images={imagesToShow}
          height={300}
          onBackPress={onBackPress}
          title={className || ''}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
  },
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});
