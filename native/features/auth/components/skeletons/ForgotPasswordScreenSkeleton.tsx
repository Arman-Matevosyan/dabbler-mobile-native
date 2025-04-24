import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Skeleton, useTheme} from '@/design-system';

export const ForgotPasswordScreenSkeleton = () => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.background, paddingTop: insets.top},
      ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {/* Back button */}
        <Skeleton width={24} height={24} style={styles.backButton} />

        <View style={styles.header}>
          <Skeleton width="70%" height={32} style={{marginBottom: 8}} />
          <Skeleton width="90%" height={18} />
          <Skeleton width="60%" height={18} style={{marginTop: 4}} />
        </View>

        <View style={styles.form}>
          {/* Email input */}
          <View style={styles.inputContainer}>
            <Skeleton width="40%" height={16} style={{marginBottom: 8}} />
            <View style={[styles.input, {backgroundColor: colors.card}]}>
              <Skeleton width={24} height={24} style={{marginRight: 10}} />
              <Skeleton width="80%" height={20} />
            </View>
          </View>

          {/* Reset password button */}
          <Skeleton 
            width="100%" 
            height={50} 
            style={{marginVertical: 8, borderRadius: 25}} 
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 32,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
}); 