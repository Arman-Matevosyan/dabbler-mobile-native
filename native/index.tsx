import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@design-system';
import { queryClient } from '@/config/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { AppLoading } from '@/components';
import '@/services/i18n';
import { AppContainer } from './containers/AppContainer';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ErrorBoundary>
          <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
              <BottomSheetModalProvider>
                <AppLoading>
                  <AppContainer />
                </AppLoading>
              </BottomSheetModalProvider>
            </QueryClientProvider>
          </SafeAreaProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
