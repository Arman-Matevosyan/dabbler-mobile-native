import React from 'react';
import {FlatList, View, ActivityIndicator, StyleSheet} from 'react-native';

interface ClassListProps {
  classes: any[];
  renderItem: (item: {item: any; index: number}) => React.ReactElement;
  keyExtractor: (item: any, index: number) => string;
  ListEmptyComponent: React.ComponentType<any> | React.ReactElement | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
});

export const ClassList: React.FC<ClassListProps> = ({
  classes,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  isLoading,
  onRefresh,
}: ClassListProps) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={onRefresh}
        refreshing={isLoading}
        style={styles.list}
      />
    </View>
  );
};
