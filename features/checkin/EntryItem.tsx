import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CheckInEntry } from '@/store';
import { MOOD_EMOJIS } from './MoodSlider';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface EntryItemProps {
  entry: CheckInEntry;
}

export function EntryItem({ entry }: EntryItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const date = new Date(entry.timestamp);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ThemedView style={[styles.container, { borderBottomColor: themeColors.border }]}>
      <View style={styles.content}>
        <ThemedText style={styles.emoji}>{MOOD_EMOJIS[entry.mood]}</ThemedText>
        <View style={styles.details}>
          <ThemedText type="defaultSemiBold">{timeString}</ThemedText>
          {entry.activity ? (
            <ThemedText style={styles.activity} numberOfLines={1}>
              {entry.activity}
            </ThemedText>
          ) : null}
        </View>
      </View>
      <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(entry.mood, themeColors) }]} />
    </ThemedView>
  );
}

function getMoodColor(mood: number, themeColors: any) {
  if (mood <= 4) return themeColors.moodNegative;
  if (mood === 5) return themeColors.moodNeutral;
  return themeColors.moodPositive;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    paddingVertical: 2,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  activity: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
});
