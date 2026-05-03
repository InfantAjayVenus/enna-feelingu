import { StyleSheet, ScrollView } from 'react-native';
import { CheckInForm } from '@/features/checkin/CheckInForm';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">How are you feeling?</ThemedText>
        <ThemedText style={styles.subtitle}>Record your mood for this hour</ThemedText>
      </ThemedView>

      <CheckInForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 8,
  },
});
