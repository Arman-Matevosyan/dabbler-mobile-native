import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { useTheme } from '@design-system';

const { width } = Dimensions.get('window');

type NotificationMessage = {
  title?: string;
  body?: string;
  data?: Record<string, any>;
};

export const NotificationBanner = () => {
  const { colors } = useTheme();
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const onMessageHandler = async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (remoteMessage.notification) {
        setNotification({
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
        });

        // Show banner
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();

        // Auto hide after 4 seconds
        setTimeout(() => {
          hideBanner();
        }, 4000);
      }
    };

    // Subscribe to foreground messages
    const unsubscribe = messaging().onMessage(onMessageHandler);

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [translateY]);

  const hideBanner = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  };

  if (!notification) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          transform: [{ translateY }],
        },
      ]}>
      <Pressable style={styles.content} onPress={hideBanner}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{notification.title}</Text>
          {notification.body ? (
            <Text style={[styles.body, { color: colors.textSecondary }]}>{notification.body}</Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    width,
    paddingTop: 40, // Account for status bar
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
  },
});
