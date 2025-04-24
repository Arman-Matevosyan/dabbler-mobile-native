module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './native',
          '@design-system': './native/design-system',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
