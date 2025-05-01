import { useCallback, useEffect, useState } from 'react';
import { firebaseMessaging } from '@/services/firebase/messaging';

export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const hasPermission = await firebaseMessaging.requestPermission();
        setPermission(hasPermission);
      } catch (error) {
        console.error('Error checking notification permission:', error);
        setPermission(false);
      }
    };

    checkPermission();
  }, []);

  const requestPermission = useCallback(async () => {
    setLoading(true);
    try {
      const hasPermission = await firebaseMessaging.requestPermission();
      setPermission(hasPermission);
      return hasPermission;
    } catch (error) {
      setPermission(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const registerDevice = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseMessaging.registerDevice();
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    hasPermission: permission,
    requestPermission,
    registerDevice,
  };
};
