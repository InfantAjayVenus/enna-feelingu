import type { CheckInEntry } from '@/store';

export function getLocalDayKey(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDayKey(dayKey: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return false;
  const [year, month, day] = dayKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function entriesForLocalDay(entries: CheckInEntry[], dayKey: string): CheckInEntry[] {
  return entries.filter((entry) => getLocalDayKey(entry.timestamp) === dayKey);
}

export interface HourGroup {
  key: string;
  label: string;
  entries: CheckInEntry[];
}

export function groupEntriesByLocalHour(entries: CheckInEntry[]): HourGroup[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  const groups = new Map<string, HourGroup>();

  for (const entry of sorted) {
    const date = new Date(entry.timestamp);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${getLocalDayKey(entry.timestamp)}T${String(date.getHours()).padStart(2, '0')}`;
    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        label: date.toLocaleTimeString([], { hour: 'numeric' }),
        entries: [],
      };
      groups.set(key, group);
    }
    group.entries.push(entry);
  }

  return Array.from(groups.values());
}
