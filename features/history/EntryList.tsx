import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { CheckInEntry } from '@/store';
import { EntryItem } from './EntryItem';

interface EntryListProps {
  entries: CheckInEntry[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function EntryList({ entries, onRefresh, refreshing }: EntryListProps) {
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No check-ins yet. Start your day!</ThemedText>
    </View>
  );

  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EntryItem entry={item} />}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
});
