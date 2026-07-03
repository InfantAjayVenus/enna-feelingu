import { PressScale } from '@/components/motion/press-scale';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { GroupedEntryList } from '@/features/history/GroupedEntryList';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckInEntry, getEntries } from '@/store';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const fetchEntries = useCallback(async () => {
    try {
      setError(null);
      // getEntries already sorts by timestamp DESC
      const allEntries = await getEntries();
      setEntries(allEntries);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      setError('Failed to load history entries');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not load history entries.',
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [fetchEntries])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">History</ThemedText>
        <ThemedText style={styles.subtitle}>All your check-ins</ThemedText>
      </View>

      <View style={styles.listWrapper}>
        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <PressScale
              style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
              onPress={fetchEntries}
            >
              <ThemedText style={styles.retryText}>Retry</ThemedText>
            </PressScale>
          </View>
        ) : (
          <GroupedEntryList 
            entries={entries} 
            onRefresh={onRefresh} 
            refreshing={refreshing} 
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  listWrapper: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
