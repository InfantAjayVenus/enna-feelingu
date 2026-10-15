import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { CheckInEntry, getEntries } from '@/store';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, MOOD_EMOJIS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { entriesForLocalDay, groupEntriesByLocalHour, isValidDayKey } from './date-groups';

interface DayJournalProps {
  dayKey: string;
}

function formatDayTitle(dayKey: string) {
  const [year, month, day] = dayKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString([], {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export function DayJournal({ dayKey }: DayJournalProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [entries, setEntries] = useState<CheckInEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const allEntries = await getEntries();
      setEntries(isValidDayKey(dayKey) ? entriesForLocalDay(allEntries, dayKey) : []);
    } catch (loadError) {
      console.error('Failed to fetch journal entries:', loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [dayKey]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  const groups = groupEntriesByLocalHour(entries);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {isValidDayKey(dayKey) ? <ThemedText type="title" style={styles.title}>{formatDayTitle(dayKey)}</ThemedText> : null}
        {loading ? (
          <ActivityIndicator accessibilityLabel="Loading journal" color={colors.primary} style={styles.state} />
        ) : error ? (
          <View style={styles.state}>
            <ThemedText style={styles.message}>Could not load this day&apos;s journal.</ThemedText>
            <ThemedText type="link" onPress={() => void loadEntries()}>Try again</ThemedText>
          </View>
        ) : !isValidDayKey(dayKey) ? (
          <ThemedText style={styles.message}>This journal date is unavailable.</ThemedText>
        ) : groups.length === 0 ? (
          <ThemedText style={styles.message}>No check-ins for this day.</ThemedText>
        ) : groups.map((group) => (
          <View key={group.key} style={styles.paragraphGroup}>
            <ThemedText style={[styles.hourLabel, { color: colors.textSecondary }]}>{group.label}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {group.entries.map((entry, index) => {
                const sentence = entry.activity.trim()
                  ? `${entry.activity.trim()}${/[.!?…]$/.test(entry.activity.trim()) ? '' : '.'}`
                  : '';
                const moodHighlight = entry.mood <= 4
                  ? colors.moodNegative
                  : entry.mood === 5
                    ? colors.accent
                    : colors.moodPositive;
                return (
                  <ThemedText key={entry.id}>
                    {index > 0 ? ' ' : ''}
                    {sentence ? `${sentence} ` : ''}
                    <ThemedText style={[styles.emojiHighlight, { backgroundColor: `${moodHighlight}33` }]}>
                      {` ${MOOD_EMOJIS[entry.mood]} `}
                    </ThemedText>
                  </ThemedText>
                );
              })}
            </ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  title: { fontSize: 26, lineHeight: 34, marginBottom: 28 },
  paragraphGroup: { marginBottom: 24 },
  hourLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  paragraph: { fontSize: 18, lineHeight: 30 },
  emojiHighlight: { borderRadius: 6 },
  state: { flex: 1, minHeight: 180, justifyContent: 'center', alignItems: 'center', gap: 12 },
  message: { textAlign: 'center', opacity: 0.7 },
});
