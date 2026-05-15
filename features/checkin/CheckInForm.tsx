import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { MoodSlider } from './MoodSlider';
import { useCheckinForm } from './use-checkin-form';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { PressScale } from '@/components/motion/press-scale';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CheckInFormProps {
  onSuccess?: () => void;
}

export function CheckInForm({ onSuccess }: CheckInFormProps) {
  const { mood, setMood, activity, setActivity, submit, isSubmitting, isValid } = useCheckinForm();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const handleSubmit = async () => {
    try {
      const success = await submit();
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Check-in saved successfully!',
        });
        onSuccess?.();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save check-in. Please try again.',
      });
    }
  };

  return (
    <ThemedView style={styles.container} testID="check-in-form">
      <MoodSlider value={mood} onValueChange={setMood} />

      <View style={styles.inputContainer}>
        <ThemedText style={styles.label}>What I did this hour</ThemedText>
        <TextInput
          testID="activity-input"
          style={[styles.input, { borderColor: themeColors.border, color: themeColors.text, backgroundColor: themeColors.surface }]}
          value={activity}
          onChangeText={setActivity}
          placeholder="Optional activity description..."
          placeholderTextColor={themeColors.textSecondary}
          multiline
        />
      </View>

      <PressScale
        testID="submit-button"
        onPress={handleSubmit}
        disabled={!isValid || isSubmitting}
        style={[
          styles.button,
          { backgroundColor: themeColors.primary },
          (!isValid || isSubmitting) && { backgroundColor: themeColors.statusSkipped, opacity: 0.6 }
        ]}
      >
        <ThemedText style={styles.buttonText}>
          {isSubmitting ? 'Saving...' : 'Submit'}
        </ThemedText>
      </PressScale>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
