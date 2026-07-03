import { PressScale } from '@/components/motion/press-scale';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { CheckInDrawer } from '@/features/checkin/CheckInDrawer';
import { CheckInForm } from '@/features/checkin/CheckInForm';
import { EntryList } from '@/features/history/EntryList';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckInEntry, getEntries } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { top } = useSafeAreaInsets();

  const fetchEntries = useCallback(async () => {
    try {
      setError(null);
      const allEntries = await getEntries();
      
      // Filter for today's entries (local day)
      const now = new Date();
      const todayStr = now.toLocaleDateString();
      
      const todayEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toLocaleDateString() === todayStr;
      });
      
      setEntries(todayEntries);
    } catch (err) {
      console.error('Failed to fetch entries:', err);
      setError('Failed to load entries');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not load today\'s entries.',
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

  const handleCheckInSuccess = () => {
    setIsDrawerVisible(false);
    fetchEntries();
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: top + 12 }]}>
      <View style={styles.header}>
        <ThemedText type="title">Your Day</ThemedText>
        <ThemedText style={styles.subtitle}>Today&apos;s check-ins</ThemedText>
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
          <EntryList 
            entries={entries} 
            onRefresh={onRefresh} 
            refreshing={refreshing} 
          />
        )}
      </View>

      <PressScale
        style={[styles.fab, { backgroundColor: themeColors.primary }]}
        onPress={() => setIsDrawerVisible(true)}
      >
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </PressScale>

      <CheckInDrawer 
        visible={isDrawerVisible} 
        onClose={() => setIsDrawerVisible(false)}
      >
        <CheckInForm onSuccess={handleCheckInSuccess} />
      </CheckInDrawer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
