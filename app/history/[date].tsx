import { Stack, useLocalSearchParams } from 'expo-router';
import { DayJournal } from '@/features/history/DayJournal';

export default function HistoryDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const dayKey = Array.isArray(date) ? date[0] : date;

  return (
    <>
      <Stack.Screen options={{ title: 'Journal' }} />
      <DayJournal dayKey={dayKey ?? ''} />
    </>
  );
}
