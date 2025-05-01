import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export const usePermissions = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        setHasCameraPermission(granted);
      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    } else {
      setHasCameraPermission(true);
    }
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to scan QR codes',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        return false;
      }
    } else {
      return true;
    }
  };

  return {
    hasCameraPermission,
    requestCameraPermission,
  };
};
