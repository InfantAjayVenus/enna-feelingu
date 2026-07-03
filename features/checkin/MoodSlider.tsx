import { ThemedText } from '@/components/themed-text';
import { Colors, MOOD_EMOJIS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type MoodSliderProps = {
  value: number | null;
  onValueChange: (value: number) => void;
};

export function MoodSlider({ value, onValueChange }: MoodSliderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={styles.container} testID="mood-slider-container">
      <View style={styles.emojiContainer}>
        <ThemedText style={styles.emojiText}>{value ? MOOD_EMOJIS[value] : '❓'}</ThemedText>
      </View>

      <View style={styles.sliderWrapper}>
        <LinearGradient
          colors={[themeColors.moodNegative, themeColors.moodPositive]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradient}
        />
        <Slider
          testID="mood-slider"
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value ?? 5}
          onValueChange={onValueChange}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor={themeColors.surface}
        />
      </View>

      <View style={styles.graduations}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <View key={num} style={styles.graduationPoint}>
            <View
              style={[
                styles.tick,
                { backgroundColor: themeColors.textSecondary },
                value === num && { backgroundColor: themeColors.primary, height: 10 }
              ]}
            />
            <ThemedText
              style={[
                styles.graduationText,
                value === num && { opacity: 1, fontWeight: '700', color: themeColors.primary }
              ]}
            >
              {num}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  emojiContainer: {
    height: 'auto',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  emojiText: {
    fontSize: 48,
    lineHeight: 60,
    textAlign: 'center',
  },
  sliderWrapper: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 12,
    borderRadius: 6,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  graduations: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 12, // Align with slider thumb reach
    marginTop: -4,
  },
  graduationPoint: {
    alignItems: 'center',
    width: 20,
  },
  tick: {
    width: 2,
    height: 6,
    marginBottom: 4,
    borderRadius: 1,
  },
  graduationText: {
    fontSize: 12,
    opacity: 0.5,
  },
});
