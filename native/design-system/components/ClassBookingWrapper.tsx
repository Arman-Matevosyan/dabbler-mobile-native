import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {useClassBook, useCancelBooking} from '../hooks/useBooking';
import {BookingStatusBottomSheet} from './BookingStatusBottomSheet';
import {useTheme} from '../theme/ThemeContext';
import {Button} from '../components/Button';
import type {BookingStatus} from './BookingStatusBottomSheet';
import {useAuthStore} from '@/stores/authStore';

interface ClassBookingWrapperProps {
  classId: string;
  venueId?: string | null;
  className?: string;
  date?: string;
  formattedDate?: string;
  venue?: string;
  isClassBooked: boolean;
  onBookingChange: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
}

export const ClassBookingWrapper: React.FC<ClassBookingWrapperProps> = ({
  classId,
  venueId,
  className,
  date,
  formattedDate,
  venue,
  isClassBooked,
  onBookingChange,
  onAddToCalendar,
  onShare,
}) => {
  const {colors} = useTheme();
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('success');
  const [isBookingStatusVisible, setIsBookingStatusVisible] = useState(false);
  const {isAuthenticated} = useAuthStore();
  const {confirmClassBooking, isLoading: isBookingLoading} = useClassBook();
  const {cancelBookingMutation, isLoading: isCancellingLoading} =
    useCancelBooking();
  
  // Track previous booking state
  const prevIsClassBooked = useRef(isClassBooked);
  const isInitialRender = useRef(true);

  // Handle booking state changes - only needed for initialization
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else if (isClassBooked !== prevIsClassBooked.current) {
      prevIsClassBooked.current = isClassBooked;
      // Only reset status if sheet is not currently being shown
      if (!isBookingStatusVisible) {
        if (isClassBooked) {
          setBookingStatus('confirm');
        } else {
          setBookingStatus('success');
        }
      }
    }
  }, [isClassBooked, isBookingStatusVisible]);

  const handleBookClass = () => {
    if (!classId || !date) return;
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to book this class.');
      return;
    }
    
    // First set the booking state we want to show
    setBookingStatus('success');
    
    confirmClassBooking.mutate(
      {
        classId,
        venueId,
        startDate: date,
      },
      {
        onSuccess: () => {
          // Show the success message - importantly, set this after the mutation completes
          setIsBookingStatusVisible(true);
          onBookingChange();
        },
        onError: error => {
          console.error('Error booking class:', error);
        },
      },
    );
  };

  const handleCancelBooking = () => {
    // First set the state to danger (confirmation dialog)
    setBookingStatus('danger');
    // Then show the sheet
    setIsBookingStatusVisible(true);
  };

  const handleConfirmCancellation = () => {
    if (!classId || !date) return;

    cancelBookingMutation.mutate(
      {
        classId,
        date,
      },
      {
        onSuccess: () => {
          // Show cancellation success once the mutation completes
          setBookingStatus('cancelled');
          onBookingChange();
          // Important: keep the bottom sheet open to show the cancelled message
        },
        onError: error => {
          console.error('Error cancelling booking:', error);
        },
      },
    );
  };

  const handleCloseBottomSheet = () => {
    setIsBookingStatusVisible(false);
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        {isClassBooked ? (
          <Button
            title="Cancel Booking"
            variant="outline"
            size="large"
            onPress={handleCancelBooking}
            disabled={isCancellingLoading}
            style={{
              ...styles.actionButton,
              borderColor: '#E53E3E'
            }}
            textStyle={{color: '#E53E3E'}}
            contentContainerStyle={styles.buttonContent}
            icon={isCancellingLoading ? <ActivityIndicator size="small" color="#E53E3E" /> : undefined}
          />
        ) : (
          <Button
            title="Book Now"
            variant="primary"
            size="large"
            onPress={handleBookClass}
            disabled={isBookingLoading}
            style={styles.actionButton}
            contentContainerStyle={styles.buttonContent}
            icon={isBookingLoading ? <ActivityIndicator size="small" color="white" /> : undefined}
          />
        )}
      </View>

      <BookingStatusBottomSheet
        isVisible={isBookingStatusVisible}
        onClose={handleCloseBottomSheet}
        onConfirm={() => {
          if (bookingStatus === 'danger') {
            handleConfirmCancellation();
          }
        }}
        onAddToCalendar={onAddToCalendar}
        onShare={onShare}
        status={bookingStatus}
        className={className}
        dateTime={formattedDate}
        venue={venue}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionButton: {
    minWidth: 150,
    borderRadius: 4, // Less rounded corners
  },
  buttonContent: {
    paddingHorizontal: 12,
  },
});
