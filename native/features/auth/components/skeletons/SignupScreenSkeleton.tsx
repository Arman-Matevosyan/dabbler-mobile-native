import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton, useTheme } from '@/design-system';

export const SignupScreenSkeleton = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView
        style={(styles.scrollView, { paddingTop: insets.top })}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Skeleton width="70%" height={32} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={18} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
            <View style={[styles.input, { backgroundColor: colors.card }]}>
              <Skeleton width={24} height={24} style={{ marginRight: 10 }} />
              <Skeleton width="80%" height={20} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
            <View style={[styles.input, { backgroundColor: colors.card }]}>
              <Skeleton width={24} height={24} style={{ marginRight: 10 }} />
              <Skeleton width="80%" height={20} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
            <View style={[styles.input, { backgroundColor: colors.card }]}>
              <Skeleton width={24} height={24} style={{ marginRight: 10 }} />
              <Skeleton width="80%" height={20} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
            <View style={[styles.input, { backgroundColor: colors.card }]}>
              <Skeleton width={24} height={24} style={{ marginRight: 10 }} />
              <Skeleton width="75%" height={20} />
              <Skeleton width={24} height={24} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Skeleton width="50%" height={16} style={{ marginBottom: 8 }} />
            <View style={[styles.input, { backgroundColor: colors.card }]}>
              <Skeleton width={24} height={24} style={{ marginRight: 10 }} />
              <Skeleton width="75%" height={20} />
              <Skeleton width={24} height={24} />
            </View>
          </View>

          <Skeleton width="100%" height={50} style={{ marginVertical: 8, borderRadius: 25 }} />
        </View>

        <View style={styles.loginContainer}>
          <Skeleton width="45%" height={16} style={{ marginRight: 8 }} />
          <Skeleton width="20%" height={16} />
        </View>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Skeleton width={30} height={16} style={{ marginHorizontal: 10 }} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <View style={[styles.socialButton, { borderColor: colors.border }]}>
            <Skeleton width={20} height={20} />
          </View>

          <View style={[styles.socialButton, { borderColor: colors.border }]}>
            <Skeleton width={20} height={20} />
          </View>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 14,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
  },
});
