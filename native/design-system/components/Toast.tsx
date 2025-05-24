import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
  PanResponder,
  TouchableWithoutFeedback,
  Platform,
  Modal,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  position?: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  position = 'top',
  style,
}) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const [expanded, setExpanded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const insets = useSafeAreaInsets();
  const timeoutRef = useRef<number | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (position === 'top' && gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        } else if (position === 'bottom' && gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (
          (position === 'top' && gestureState.dy < -20) ||
          (position === 'bottom' && gestureState.dy > 20)
        ) {
          dismissToast();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  const getIconName = (): string => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return '#FFC107';
      case 'info':
      default:
        return colors.accent;
    }
  };

  useEffect(() => {
    if (visible) {
      translateY.setValue(position === 'top' ? -100 : 100);
      fadeAnim.setValue(0);
      setUserInteracted(false);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Start show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }),
      ]).start();

      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          if (!userInteracted) {
            dismissToast();
          }
        }, duration);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [visible]);

  const dismissToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
      setExpanded(false);
      setUserInteracted(false);
    });
  };

  const handlePress = () => {
    setUserInteracted(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setExpanded(true);
  };

  if (!visible) return null;

  const topPosition = insets.top + 10;

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.container,
          position === 'top' ? { ...styles.topPosition, top: topPosition } : styles.bottomPosition,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
            backgroundColor: getBackgroundColor(),
          },
          style,
        ]}>
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.content}>
            <MaterialIcons name={getIconName()} size={16} color="white" style={styles.icon} />
            <Text style={styles.message} numberOfLines={1}>
              {message}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity onPress={dismissToast} style={styles.closeButton}>
          <MaterialIcons name="close" size={14} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Expanded Modal View */}
      <Modal
        transparent
        visible={expanded}
        animationType="fade"
        onRequestClose={() => setExpanded(false)}>
        <TouchableWithoutFeedback onPress={() => setExpanded(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, { backgroundColor: getBackgroundColor() }]}>
                <View style={styles.modalHeader}>
                  <MaterialIcons
                    name={getIconName()}
                    size={24}
                    color="white"
                    style={styles.modalIcon}
                  />
                  <TouchableOpacity
                    onPress={() => setExpanded(false)}
                    style={styles.modalCloseButton}>
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalMessage}>{message}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 150,
    minHeight: 32,
    maxWidth: 200,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 1000,
  },
  bottomPosition: {
    bottom: 60,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  message: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  closeButton: {
    padding: 3,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 80,
    maxWidth: 350,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalIcon: {
    marginRight: 10,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalMessage: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
});
