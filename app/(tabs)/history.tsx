import { PressScale } from '@/components/motion/press-scale';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { GroupedEntryList, GroupedEntryListHandle } from '@/features/history/GroupedEntryList';
import { HistoryMenu, type MenuAction } from '@/features/history/HistoryMenu';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CheckInEntry, getEntries } from '@/store';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { top } = useSafeAreaInsets();

  const listRef = useRef<GroupedEntryListHandle>(null);
  const menuButtonRef = useRef<View>(null);

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

  const menuActions: MenuAction[] = [
    {
      id: 'collapse-all',
      label: 'Collapse all',
      iconName: 'arrow.up.to.line',
      onPress: () => listRef.current?.collapseAll(),
    },
    {
      id: 'expand-all',
      label: 'Expand all',
      iconName: 'arrow.down.to.line',
      onPress: () => listRef.current?.expandAll(),
    },
  ];

  return (
    <ThemedView style={[styles.container, { paddingTop: top + 12 }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText type="title">History</ThemedText>
          <ThemedText style={styles.subtitle}>All your check-ins</ThemedText>
        </View>
        <View ref={menuButtonRef}>
          <PressScale
            id="history-menu-button"
            onPress={() => setMenuVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="View options"
            style={styles.menuButton}
          >
            <IconSymbol
              name="ellipsis"
              size={20}
              color={themeColors.text}
            />
          </PressScale>
        </View>
      </View>

      <View style={styles.listWrapper}>
        {error ? (
          <View style={styles.errorContainer}>
            <ThemedText style={[styles.errorText, { color: themeColors.error }]}>{error}</ThemedText>
            <PressScale
              style={[styles.retryButton, { backgroundColor: themeColors.primary }]}
              onPress={fetchEntries}
            >
              <ThemedText style={styles.retryText}>Retry</ThemedText>
            </PressScale>
          </View>
        ) : (
          <GroupedEntryList
            ref={listRef}
            entries={entries}
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        )}
      </View>

      <HistoryMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        actions={menuActions}
        anchorRef={menuButtonRef}
      />
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
