const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = {
  resolver: {
    extraNodeModules: {
      '@': path.resolve(__dirname, 'native'),
      '@design-system': path.resolve(__dirname, 'native/design-system'),
    },
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
);
