import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CheckInEntry } from '@/store';
import { EntryItem } from './EntryItem';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GroupedEntryListProps {
  entries: CheckInEntry[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function GroupedEntryList({ entries, onRefresh, refreshing }: GroupedEntryListProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const sections = useMemo(() => {
    const groups = entries.reduce((acc, entry) => {
      const d = new Date(entry.timestamp);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dateStr = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(entry);
      return acc;
    }, {} as Record<string, CheckInEntry[]>);

    return Object.keys(groups).map(dateStr => ({
      title: dateStr,
      data: groups[dateStr]
    }));
  }, [entries]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No check-ins yet. Start your day!</ThemedText>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EntryItem entry={item} />}
      renderSectionHeader={({ section: { title } }) => (
        <ThemedView style={[styles.sectionHeader, { 
          backgroundColor: themeColors.surface,
          borderBottomColor: themeColors.border
        }]}>
          <ThemedText type="defaultSemiBold" style={{ color: themeColors.primary }}>
            {title}
          </ThemedText>
        </ThemedView>
      )}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={true}
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
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  }
});
