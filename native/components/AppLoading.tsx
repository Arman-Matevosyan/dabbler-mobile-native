import React, { useState, useEffect, ReactNode } from 'react';
import SplashScreen from './SplashScreen';
import { initializeFirebase } from '@/services/firebase';
import { View } from 'react-native';

interface AppLoadingProps {
  children: ReactNode;
  onFinish?: () => void;
}

const AppLoading: React.FC<AppLoadingProps> = ({ children, onFinish }) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeFirebase();

        // Setup any other required services or load data
        // This can include:
        // - Pre-fetching important API data
        // - Loading fonts
        // - Setting up other services

        setStartAnimation(true);
      } catch (error) {
        console.log('Error initializing app:', error);
        setStartAnimation(true);
      }
    }

    prepare();
  }, []);

  const handleSplashComplete = () => {
    setSplashComplete(true);
    if (onFinish) {
      onFinish();
    }
  };

  if (!splashComplete) {
    return <SplashScreen onReady={handleSplashComplete} startAnimation={startAnimation} />;
  }

  return <>{children}</>;
};

export default AppLoading;
