import {useState} from 'react';
import {Animated, Dimensions, Platform, useColorScheme} from 'react-native';
import BootSplash from 'react-native-bootsplash';

const useNativeDriver = Platform.OS !== 'web';

type Props = {
  onAnimationEnd: () => void;
};

export const hide = (options?: {fade?: boolean}): Promise<void> => {
  return BootSplash.hide(options);
};

export const AnimatedBootSplash = ({onAnimationEnd}: Props) => {
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const manifest = isDarkMode
    ? require('./manifest.json')
    : require('./manifest_light.json');

  const {container, logo} = BootSplash.useHideAnimation({
    manifest: manifest,
    logo: isDarkMode ? require('./logo_light.png') : require('./logo.png'),

    statusBarTranslucent: true,
    navigationBarTranslucent: true,

    animate: () => {
      const {height} = Dimensions.get('window');

      Animated.stagger(250, [
        Animated.spring(translateY, {
          useNativeDriver,
          toValue: -50,
        }),
        Animated.spring(translateY, {
          useNativeDriver,
          toValue: height,
        }),
      ]).start();

      Animated.timing(opacity, {
        useNativeDriver,
        toValue: 0,
        duration: 150,
        delay: 350,
      }).start(() => {
        onAnimationEnd();
      });
    },
  });

  const logoSize = Platform.select({
    ios: {
      width: 100,
      height: 104,
    },
    android: {
      width: 200,
      height: 200,
    },
    default: {
      width: 200,
      height: 200,
    },
  });

  return (
    <Animated.View {...container} style={[container.style, {opacity}]}>
      <Animated.Image
        {...logo}
        style={[
          logo.style,
          {
            transform: [{translateY}],
            ...logoSize,
            resizeMode: 'contain',
          },
        ]}
      />
    </Animated.View>
  );
};
