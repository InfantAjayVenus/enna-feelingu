import { useState, useRef } from 'react';
import { NativeModules, Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { saveEntry } from '@/store';

export function useCheckinForm() {
  const [mood, setMood] = useState<number | null>(null);
  const [activity, setActivity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const submit = async () => {
    if (mood === null || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const now = new Date();
      // Use full ISO string to include UTC offset 'Z'
      const timestamp = now.toISOString();

      await saveEntry({
        id: Crypto.randomUUID(),
        timestamp,
        mood,
        activity,
        skipped: false,
        autoSkipped: false,
        overriddenByEntryId: null,
      });

      if (Platform.OS === 'android') {
        try {
          NativeModules.QuickAddWidgetBridge?.refreshWidget?.();
        } catch (widgetError) {
          console.warn('Could not refresh the mood widget:', widgetError);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to save check-in:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return {
    mood,
    setMood,
    activity,
    setActivity,
    submit,
    isSubmitting,
    isValid: mood !== null,
  };
}
