import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

export const usePermissions = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const { t } = useTranslation();

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
          title: t('permissions.cameraTitle'),
          message: t('permissions.cameraMessage'),
          buttonNeutral: t('permissions.askLater'),
          buttonNegative: t('permissions.cancel'),
          buttonPositive: t('permissions.ok'),
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
