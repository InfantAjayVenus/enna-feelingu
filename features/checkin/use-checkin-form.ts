import { useState } from 'react';
import * as Crypto from 'expo-crypto';
import { saveEntry } from '@/store';

export function useCheckinForm() {
  const [mood, setMood] = useState<number | null>(null);
  const [activity, setActivity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (mood === null) return;

    setIsSubmitting(true);
    try {
      const now = new Date();
      // Minute precision: YYYY-MM-DDTHH:mm:00
      const timestamp = now.toISOString().split('.')[0].slice(0, 16) + ':00';

      await saveEntry({
        id: Crypto.randomUUID(),
        timestamp,
        mood,
        activity,
        skipped: false,
        autoSkipped: false,
        overriddenByEntryId: null,
      });
      
      // State reset is handled by the caller or after successful submission
      return true;
    } catch (error) {
      console.error('Failed to save check-in:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
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
