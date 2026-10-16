import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CheckInForm } from '@/features/checkin/CheckInForm';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function parseMood(value: string | string[] | undefined): number | null {
  if (typeof value !== 'string' || !/^(?:[1-9]|10)$/.test(value)) return null;
  return Number(value);
}

export default function QuickAddScreen() {
  const { mood: moodParam } = useLocalSearchParams<{ mood?: string }>();
  const mood = parseMood(moodParam);
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <ThemedText type="subtitle">Quick check-in</ThemedText>
        </View>
        {mood === null ? (
          <View style={styles.invalid}>
            <ThemedText>Choose a mood from the widget to start a check-in.</ThemedText>
            <ThemedText onPress={() => router.replace('/(tabs)')} style={{ color: colors.primary, marginTop: 16 }}>
              Go to today
            </ThemedText>
          </View>
        ) : (
          <View style={styles.form}>
            <CheckInForm
              initialMood={mood}
              onCancel={() => router.replace('/(tabs)')}
              onSuccess={() => router.replace('/(tabs)')}
            />
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  form: { flex: 1, justifyContent: 'center', padding: 12 },
  invalid: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
