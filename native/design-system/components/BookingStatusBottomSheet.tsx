import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../theme/ThemeContext';
import {Button} from './Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NativeBottomSheet, {NativeBottomSheetRef} from '../NativeBottomSheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width} = Dimensions.get('window');

export type BookingStatus = 'success' | 'danger' | 'confirm' | 'cancelled';

interface BookingStatusBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
  status: BookingStatus;
  title?: string;
  message?: string;
  cancelMessage?: string;
  className?: string;
  dateTime?: string;
  venue?: string;
  cancellationFee?: string;
}

export const BookingStatusBottomSheet: React.FC<
  BookingStatusBottomSheetProps
> = ({
  isVisible,
  onClose,
  onConfirm,
  onAddToCalendar,
  onShare,
  status,
  title,
  message,
  cancelMessage,
  className,
  dateTime,
  cancellationFee,
}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<NativeBottomSheetRef>(null);

  useEffect(() => {
    if (isVisible && status === 'success') {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, status, onClose]);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        bottomSheetRef.current?.snapToIndex(1);
      }, 100);
    } else {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [isVisible]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleBackdropPress = () => {
    if (status === 'success' || status === 'cancelled') {
      onClose();
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <View
            style={[
              styles.contentContainer,
              {paddingBottom: insets.bottom || 24},
            ]}>
            <View style={styles.successIconContainer}>
              <View
                style={[styles.outerCircle, {backgroundColor: colors.success}]}>
                <View style={styles.innerCircle}>
                  <MaterialIcons
                    name="check"
                    size={38}
                    color={colors.success}
                  />
                </View>
              </View>
            </View>
            <Text style={[styles.title, {color: colors.textPrimary}]}>
              {title || 'Booking confirmed'}
            </Text>
            <Text style={[styles.message, {color: colors.textSecondary}]}>
              {message ||
                "We can't wait to see you! Keep track of your complete schedule on the profile screen."}
            </Text>
            <Text
              style={[
                styles.message,
                {color: colors.textSecondary, marginTop: 16},
              ]}>
              Don't forget to add this booking to your calendar app for perfect
              organization. See you soon!
            </Text>

            <Button
              title="Add to Calendar"
              variant="primary"
              size="large"
              onPress={onAddToCalendar}
              style={styles.button}
              icon={
                <MaterialIcons name="calendar-today" size={20} color="white" />
              }
            />

            {onShare && (
              <Button
                title="Share"
                variant="outline"
                size="large"
                onPress={onShare}
                style={{
                  ...styles.outlineButton,
                  borderColor: colors.accent,
                }}
                textStyle={{color: colors.accent}}
                icon={
                  <MaterialIcons name="share" size={20} color={colors.accent} />
                }
              />
            )}

            <Button
              title="Done"
              variant="ghost"
              size="large"
              onPress={onClose}
              style={styles.textButton}
              textStyle={{color: colors.textSecondary}}
            />
          </View>
        );

      case 'danger':
        return (
          <View
            style={[
              styles.contentContainer,
              {paddingBottom: insets.bottom || 24},
            ]}>
            <View style={styles.iconContainer}>
              <View
                style={[styles.outerCircle, {backgroundColor: '#E53E3E33'}]}>
                <View style={styles.innerCircle}>
                  <MaterialIcons name="warning" size={38} color="#E53E3E" />
                </View>
              </View>
            </View>
            <Text style={[styles.title, {color: colors.textPrimary}]}>
              Are you sure?
            </Text>
            <Text style={[styles.message, {color: colors.textSecondary}]}>
              {cancelMessage ||
                'Please cancel at least 12 hours prior to the class to avoid late cancellation or no-show fees.'}
            </Text>

            <Button
              title="Cancel Booking"
              variant="primary"
              size="large"
              onPress={handleConfirm}
              style={{
                ...styles.button,
                backgroundColor: '#E53E3E',
              }}
            />

            <Button
              title="Keep Booking"
              variant="outline"
              size="large"
              onPress={onClose}
              style={{
                ...styles.outlineButton,
                borderColor: colors.border,
              }}
              textStyle={{color: colors.textPrimary}}
            />
          </View>
        );

      case 'cancelled':
        return (
          <View
            style={[
              styles.contentContainer,
              {paddingBottom: insets.bottom || 24},
            ]}>
            <View style={styles.iconContainer}>
              <View
                style={[styles.outerCircle, {backgroundColor: '#E53E3E33'}]}>
                <View style={styles.innerCircle}>
                  <MaterialIcons name="check" size={38} color="#E53E3E" />
                </View>
              </View>
            </View>
            <Text style={[styles.title, {color: colors.textPrimary}]}>
              Booking Cancelled
            </Text>
            <Text style={[styles.message, {color: colors.textSecondary}]}>
              Your booking has been successfully cancelled. We hope to see you
              again soon!
            </Text>

            <Button
              title="Close"
              variant="outline"
              size="large"
              onPress={onClose}
              style={{
                ...styles.outlineButton,
                borderColor: colors.border,
                marginTop: 24,
              }}
              textStyle={{color: colors.textPrimary}}
            />
          </View>
        );

      case 'confirm':
        return (
          <View
            style={[
              styles.contentContainer,
              {paddingBottom: insets.bottom || 24},
            ]}>
            <Text style={[styles.title, {color: colors.textPrimary}]}>
              You need to cancel?
            </Text>

            <View style={styles.classInfoContainer}>
              <Text style={[styles.className, {color: colors.textPrimary}]}>
                {className}
              </Text>
              <Text style={[styles.classPrice, {color: colors.textPrimary}]}>
                € 0
              </Text>
            </View>

            <Text style={[styles.dateTime, {color: colors.textSecondary}]}>
              {dateTime}
            </Text>

            <Text
              style={[
                styles.message,
                {color: colors.textSecondary, marginTop: 16},
              ]}>
              {cancellationFee ||
                'The free cancellation period has ended. To avoid a €15 no-show fee, you can cancel up until 12 hours before the class starts, but a €0 late cancellation fee will apply.'}
            </Text>

            <Button
              title="Confirm cancellation"
              variant="primary"
              size="large"
              onPress={handleConfirm}
              style={{
                ...styles.button,
                backgroundColor: '#E53E3E',
              }}
              icon={
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              }
            />

            <Button
              title="Go Back"
              variant="outline"
              size="large"
              onPress={onClose}
              style={{
                ...styles.outlineButton,
                borderColor: colors.border,
              }}
              textStyle={{color: colors.textPrimary}}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleBackdropPress}
        />
      )}
      <NativeBottomSheet
        ref={bottomSheetRef}
        snapPoints={['0%', '80%']}
        index={isVisible ? 1 : 0}
        enablePanDownToClose={true}
        onChange={index => {
          if (index === 0 && isVisible) {
            onClose();
          }
        }}
        handleIndicatorStyle={{
          width: 40,
          height: 4,
          backgroundColor: colors.border,
        }}>
        <View style={styles.bottomSheet}>{renderContent()}</View>
      </NativeBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 90,
  },
  bottomSheet: {
    zIndex: 100,
    width: '100%',
    minHeight: 300,
  },
  contentContainer: {
    padding: 24,
    flex: 1,
    width: '100%',
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'left',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'left',
  },
  button: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    borderRadius: 4,
    width: '100%',
  },
  outlineButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
  },
  textButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderRadius: 4,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  classInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 16,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  classPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateTime: {
    fontSize: 14,
    marginBottom: 16,
  },
});
