import React from 'react';
import { StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { PressScale } from '@/components/motion/press-scale';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function SuccessScreen() {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Success', headerLeft: () => null, headerShown: false }} />
      
      <ThemedText style={styles.emoji}>✅</ThemedText>
      <ThemedText type="title">Check-in Saved!</ThemedText>
      <ThemedText style={styles.message}>
        Your mood has been recorded. See you next hour!
      </ThemedText>
      
      <Link href="/(tabs)" replace asChild>
        <PressScale style={{...styles.button, backgroundColor: primaryColor }}>
          <ThemedText style={styles.buttonText}>Done</ThemedText>
        </PressScale>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    lineHeight: 80,
    marginBottom: 20,
    paddingVertical: 10,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    opacity: 0.7,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
