import * as SQLite from 'expo-sqlite';
import { saveEntry, getEntries } from '../checkin-store';
import { CheckInEntry } from '../types';

describe('checkin-store', () => {
  const mockDb = {
    execAsync: jest.fn().mockResolvedValue(null),
    runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 1, changes: 1 }),
    getAllAsync: jest.fn().mockResolvedValue([]),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (SQLite.openDatabaseAsync as jest.Mock).mockResolvedValue(mockDb);
  });

  describe('saveEntry', () => {
    const validEntry: CheckInEntry = {
      id: '1',
      timestamp: '2024-05-01T12:00:00Z',
      mood: 5,
      activity: 'Testing',
      skipped: false,
      autoSkipped: false,
      overriddenByEntryId: null,
    };

    it('should save a valid entry', async () => {
      await saveEntry(validEntry);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO check_in_entries'),
        expect.arrayContaining([
          validEntry.id,
          validEntry.timestamp,
          validEntry.mood,
          validEntry.activity,
          0, // skipped
          0, // autoSkipped
          null
        ])
      );
    });

    it('should map boolean values to 0/1 for SQLite', async () => {
      const entryWithBooleans: CheckInEntry = {
        ...validEntry,
        skipped: true,
        autoSkipped: true,
      };
      await saveEntry(entryWithBooleans);
      expect(mockDb.runAsync).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([
          entryWithBooleans.id,
          entryWithBooleans.timestamp,
          entryWithBooleans.mood,
          entryWithBooleans.activity,
          1, // skipped
          1, // autoSkipped
          null
        ])
      );
    });

    it('should throw an error for mood < 1', async () => {
      const invalidEntry = { ...validEntry, mood: 0 };
      await expect(saveEntry(invalidEntry)).rejects.toThrow('Invalid mood value: 0');
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });

    it('should throw an error for mood > 10', async () => {
      const invalidEntry = { ...validEntry, mood: 11 };
      await expect(saveEntry(invalidEntry)).rejects.toThrow('Invalid mood value: 11');
      expect(mockDb.runAsync).not.toHaveBeenCalled();
    });
  });

  describe('getEntries', () => {
    it('should map 0/1 from SQLite back to booleans', async () => {
      mockDb.getAllAsync.mockResolvedValue([
        {
          id: '1',
          timestamp: '2024-05-01T12:00:00Z',
          mood: 5,
          activity: 'Testing',
          skipped: 1,
          autoSkipped: 0,
          overriddenByEntryId: null,
        }
      ]);

      const entries = await getEntries();
      expect(entries[0]).toEqual({
        id: '1',
        timestamp: '2024-05-01T12:00:00Z',
        mood: 5,
        activity: 'Testing',
        skipped: true,
        autoSkipped: false,
        overriddenByEntryId: null,
      });
    });

    it('should order entries by timestamp DESC', async () => {
      await getEntries();
      expect(mockDb.getAllAsync).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY timestamp DESC')
      );
    });
  });
});
