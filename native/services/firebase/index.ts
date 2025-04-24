import {Platform} from 'react-native';
import {getApp, getApps} from '@react-native-firebase/app';
import {getMessaging} from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export const initializeFirebase = async () => {
  try {
    const app = getApps().length > 0 ? getApp() : null;

    if (app) {
      return;
    } else {
      console.log('Firebase not initialized yet, check your configuration');
    }

    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'default-channel',
          channelName: 'Default Channel',
          channelDescription: 'A default channel for notifications',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => console.log(`Channel created: ${created}`),
      );

      const messaging = getMessaging();
      messaging.setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message received:', remoteMessage);
      });
    }

    return app;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

export * from './messaging';
