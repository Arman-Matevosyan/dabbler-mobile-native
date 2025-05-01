import {
  getMessaging,
  AuthorizationStatus,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import { NotificationApi } from '../api/notification';

type AndroidChannel = {
  channelId: string;
  channelName: string;
  channelDescription?: string;
  soundName?: string;
  importance?: number;
  vibrate?: boolean | number[];
};

export const initializeNotificationChannels = () => {
  if (Platform.OS === 'android') {
    const defaultChannel: AndroidChannel = {
      channelId: 'default-channel',
      channelName: 'Default Channel',
      channelDescription: 'Default notifications channel',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    };

    PushNotification.createChannel(defaultChannel, created =>
      console.log(`Channel ${defaultChannel.channelId} created: ${created}`),
    );
  }
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'App needs notification permission to send you updates',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('Android notification permission denied');
        return false;
      }
    }

    const messaging = getMessaging();
    const authStatus = await messaging.requestPermission({
      alert: true,
      badge: true,
      sound: true,
      announcement: false,
      carPlay: false,
      provisional: false,
      criticalAlert: false,
    });

    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.warn('Notification permission not granted');
    }

    return enabled;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messaging = getMessaging();
    const token = await messaging.getToken();
    console.log('FCM Token retrieved:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

const registerTokenRefreshListener = () => {
  const messaging = getMessaging();
  return messaging.onTokenRefresh(async (newToken: string) => {
    console.log('FCM token refreshed:', newToken);
    await updateDeviceToken(newToken);
  });
};

const updateDeviceToken = async (token: string) => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    await NotificationApi.registerDevice(token, deviceId);
    console.log('Device token updated successfully');
  } catch (error) {
    console.error('Error updating device token:', error);
  }
};

export const registerDevice = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      Alert.alert('Notifications disabled', 'Please enable notifications in settings');
      return false;
    }

    const token = await getFCMToken();
    if (!token) {
      throw new Error('Failed to get FCM token');
    }

    await updateDeviceToken(token);
    registerTokenRefreshListener();
    return true;
  } catch (error) {
    console.error('Device registration failed:', error);
    Alert.alert('Registration failed', 'Failed to register for notifications');
    return false;
  }
};

const handleForegroundNotification = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  console.log('Foreground notification:', remoteMessage);

  if (Platform.OS === 'ios') {
    PushNotification.localNotification({
      alertTitle: remoteMessage.notification?.title,
      alertBody: remoteMessage.notification?.body,
      userInfo: remoteMessage.data,
      soundName: 'default',
      playSound: true,
    });
  }

  if (Platform.OS === 'android') {
    PushNotification.localNotification({
      channelId: 'default-channel',
      title: remoteMessage.notification?.title,
      message: remoteMessage.notification?.body || '',
      data: remoteMessage.data,
      vibrate: true,
      vibration: 300,
    });
  }
};

export const setupNotificationHandlers = async () => {
  try {
    initializeNotificationChannels();
    await registerDevice();

    const messaging = getMessaging();

    const unsubscribeForeground = messaging.onMessage(handleForegroundNotification);

    messaging.onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app from background:', remoteMessage);
    });

    const initialNotification = await messaging.getInitialNotification();
    if (initialNotification) {
      console.log('App opened from quit state by notification:', initialNotification);
    }

    return () => {
      unsubscribeForeground();
    };
  } catch (error) {
    console.error('Notification setup error:', error);
    return () => {};
  }
};

export const firebaseMessaging = {
  initialize: initializeNotificationChannels,
  requestPermission: requestNotificationPermissions,
  getToken: getFCMToken,
  registerDevice,
  setupNotifications: setupNotificationHandlers,
};
