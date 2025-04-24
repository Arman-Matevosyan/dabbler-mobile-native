import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from './index';

const {height} = Dimensions.get('window');

export interface NativeBottomSheetRef {
  snapToIndex: (index: number) => void;
}

export interface NativeBottomSheetProps {
  snapPoints: string[];
  handleComponent?: React.FC;
  backgroundStyle?: any;
  handleIndicatorStyle?: any;
  handleStyle?: any;
  onChange?: (index: number) => void;
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  index?: number;
  topInset?: number;
  children: React.ReactNode;
}

/**
 * A performant bottom sheet component using native animations
 */
const NativeBottomSheet = forwardRef<NativeBottomSheetRef, NativeBottomSheetProps>(
  (
    {
      snapPoints,
      handleComponent: HandleComponent,
      backgroundStyle,
      handleStyle,
      handleIndicatorStyle,
      onChange,
      enablePanDownToClose = true,
      enableOverDrag = true,
      index = 0,
      topInset = 0,
      children,
    },
    ref,
  ) => {
    const {colors} = useTheme();
    const [currentIndex, setCurrentIndex] = useState(index);
    
    // Define calculatePosition before using it
    const calculatePosition = (point: string) => {
      const percentage = parseInt(point.replace('%', '')) / 100;
      return height * percentage;
    };
    
    const translateY = useRef(new Animated.Value(height - calculatePosition(snapPoints[index]))).current;
    const lastGestureDy = useRef(0);

    const snapPoints_px = snapPoints.map(point => calculatePosition(point));

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        snapToPosition(index);
      },
    }));

    const snapToPosition = (index: number) => {
      if (index >= 0 && index < snapPoints.length) {
        const position = height - snapPoints_px[index];
        
        // Use only one spring configuration method (tension/friction)
        Animated.spring(translateY, {
          toValue: position,
          useNativeDriver: true,
          tension: 50,      // Controls the "spring stiffness"
          friction: 10,     // Controls the "spring damping"
        }).start();
        
        setCurrentIndex(index);
        if (onChange) {
          onChange(index);
        }
      }
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true, // Always respond to movement
        onPanResponderGrant: () => {
          // Store the current position when the gesture starts
          lastGestureDy.current = 0;
        },
        onPanResponderMove: (_, gesture) => {
          // Directly move the sheet based on the gesture
          translateY.setValue(height - snapPoints_px[currentIndex] + gesture.dy);
        },
        onPanResponderRelease: (_, gesture) => {
          // Find the closest snap point based on the final position
          const currentY = height - snapPoints_px[currentIndex] + gesture.dy;
          
          // Simple drag detection
          if (gesture.dy > 50) {
            // Dragging down - collapse the sheet
            snapToPosition(0);
          } else if (gesture.dy < -50) {
            // Dragging up - expand the sheet
            snapToPosition(snapPoints.length - 1);
          } else {
            // Small movement - find the closest snap point
            let closestIndex = 0;
            let minDistance = Math.abs(currentY - (height - snapPoints_px[0]));
            
            for (let i = 1; i < snapPoints_px.length; i++) {
              const distance = Math.abs(currentY - (height - snapPoints_px[i]));
              if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
              }
            }
            
            snapToPosition(closestIndex);
          }
          
          lastGestureDy.current = 0;
        },
      }),
    ).current;

    useEffect(() => {
      snapToPosition(index);
    }, [index]);

    return (
      <Animated.View
        style={[
          styles.container,
          backgroundStyle,
          {
            transform: [{translateY}],
          },
        ]}>
        {/* Only show backdrop when expanded */}
        {currentIndex > 0 && (
          <TouchableWithoutFeedback
            onPress={() => {
              // Use animation when closing on backdrop press
              snapToPosition(0);
            }}>
            <View style={[
              styles.backdrop, 
              { 
                backgroundColor: 'rgba(0,0,0,0.1)',
                // Start below the top search area
                top: topInset + 100,
              }
            ]} />
          </TouchableWithoutFeedback>
        )}
        
        <View 
          style={[
            styles.content, 
            { 
              marginTop: topInset,
              backgroundColor: colors.background,
            }
          ]} 
          {...panResponder.panHandlers}>
          <View 
            style={[
              styles.header, 
              handleStyle, 
              { 
                backgroundColor: colors.background,
                // Add touch indicator to show it's draggable
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,0.1)',
              }
            ]}>
            {handleIndicatorStyle?.display !== 'none' && (
              <View style={[styles.indicator, handleIndicatorStyle, { backgroundColor: colors.border }]} />
            )}
            {HandleComponent && <HandleComponent />}
          </View>
          <View style={styles.childrenContainer}>{children}</View>
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    backgroundColor: 'transparent',
    zIndex: 5, // Lowered z-index so it can slide under the search bar
    elevation: 5, // Lowered elevation for Android
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    minHeight: 60, // Increased height for better touch area
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  indicator: {
    width: 60, // Wider
    height: 6, // Thicker
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: '#ccc', // Default color
  },
  childrenContainer: {
    flex: 1,
  },
});

/**
 * ScrollView component optimized for use within NativeBottomSheet
 */
export const NativeBottomSheetScrollView = (props: any) => {
  return <Animated.ScrollView {...props} />;
};

/**
 * FlatList component optimized for use within NativeBottomSheet 
 */
export const NativeBottomSheetFlatList = (props: any) => {
  return <Animated.FlatList {...props} />;
};

export default NativeBottomSheet; 