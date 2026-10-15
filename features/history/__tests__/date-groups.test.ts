import { CheckInEntry } from '@/store';
import { entriesForLocalDay, getLocalDayKey, groupEntriesByLocalHour, isValidDayKey } from '../date-groups';

const entry = (id: string, timestamp: string): CheckInEntry => ({
  id, timestamp, mood: 7, activity: id, skipped: false, autoSkipped: false, overriddenByEntryId: null,
});

describe('history date groups', () => {
  it('uses the local calendar date for ISO timestamps', () => {
    const timestamp = '2026-05-03T23:30:00Z';
    const expected = (() => {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    })();
    expect(getLocalDayKey(timestamp)).toBe(expected);
    expect(entriesForLocalDay([entry('a', timestamp)], expected)).toHaveLength(1);
  });

  it('groups by local hour and orders paragraphs and entries chronologically', () => {
    const groups = groupEntriesByLocalHour([
      entry('later-hour', '2026-05-03T14:10:00Z'),
      entry('same-hour-later', '2026-05-03T12:10:00Z'),
      entry('same-hour-earlier', '2026-05-03T12:05:00Z'),
      entry('next-day', '2026-05-04T12:05:00Z'),
    ]);
    expect(groups).toHaveLength(3);
    expect(groups.map((group) => group.entries.map(({ id }) => id))).toEqual([
      ['same-hour-earlier', 'same-hour-later'], ['later-hour'], ['next-day'],
    ]);
  });

  it('rejects malformed or impossible route dates', () => {
    expect(isValidDayKey('2026-05-03')).toBe(true);
    expect(isValidDayKey('2026-02-30')).toBe(false);
    expect(isValidDayKey('03-05-2026')).toBe(false);
  });
});
