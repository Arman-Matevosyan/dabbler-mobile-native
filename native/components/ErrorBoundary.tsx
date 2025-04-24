import React, {Component, ErrorInfo, ReactNode} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Button} from '@design-system';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
            <Text style={styles.stackTrace}>
              {this.state.errorInfo?.componentStack ||
                'No stack trace available'}
            </Text>
          </ScrollView>
          <Button
            title="Try Again"
            onPress={this.resetError}
            style={styles.button}
            variant="primary"
          />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#dc3545',
  },
  scrollView: {
    maxHeight: 300,
    width: '100%',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 12,
  },
  stackTrace: {
    fontSize: 14,
    color: '#6c757d',
    fontFamily: 'monospace',
  },
  button: {
    marginTop: 20,
    width: 200,
  },
});
