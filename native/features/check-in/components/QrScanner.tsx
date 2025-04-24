import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useTheme, Text} from '@design-system';
import {Camera, CameraType} from 'react-native-camera-kit';
import {usePermissions} from '../hooks/usePermissions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

interface QrScannerProps {
  onQrCodeScanned: (data: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const QrScanner = ({
  onQrCodeScanned,
  onClose,
  isLoading = false,
}: QrScannerProps) => {
  const {colors} = useTheme();
  const {hasCameraPermission, requestCameraPermission} = usePermissions();
  const [scanning, setScanning] = useState(true);
  const {t} = useTranslation();

  const handleQrCodeDetected = (event: any) => {
    if (!scanning || !event.nativeEvent.codeStringValue) return;

    setScanning(false);
    onQrCodeScanned(event.nativeEvent.codeStringValue);
  };

  if (!hasCameraPermission) {
    return (
      <View style={styles.container}>
        <Text style={[styles.permissionText, {color: colors.textPrimary}]}>
          {t('checkin.cameraPermission')}
        </Text>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.accent}]}
          onPress={requestCameraPermission}>
          <Text style={[styles.buttonText, {color: 'white'}]}>
            {t('checkin.grantPermission')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        cameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={handleQrCodeDetected}
        showFrame={false}>
        <View style={styles.overlay}>
          <View style={styles.unfocusedArea} />
          <View style={styles.focusedArea}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              {isLoading && (
                <View style={styles.loadingIndicator}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </View>
          </View>
          <View style={styles.unfocusedArea} />
        </View>
      </Camera>

      <TouchableOpacity
        style={[styles.closeButton, {backgroundColor: colors.accent}]}
        onPress={onClose}
        activeOpacity={0.8}>
        <MaterialIcons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  unfocusedArea: {
    flex: 1,
  },
  focusedArea: {
    flex: 2,
    flexDirection: 'row',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
