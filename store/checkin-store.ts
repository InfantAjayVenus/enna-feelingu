import * as SQLite from 'expo-sqlite';
import { CheckInEntry } from './types';

const DB_NAME = 'checkins.db';

let db: SQLite.SQLiteDatabase | null = null;

async function getDb() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS check_in_entries (
        id TEXT PRIMARY KEY NOT NULL,
        timestamp TEXT NOT NULL,
        mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 10),
        activity TEXT NOT NULL,
        skipped INTEGER NOT NULL,
        autoSkipped INTEGER NOT NULL,
        overriddenByEntryId TEXT
      );
    `);
  }
  return db;
}

// For testing purposes only
export function _resetDbForTesting() {
  db = null;
}

export async function saveEntry(entry: CheckInEntry): Promise<void> {
  if (entry.mood < 1 || entry.mood > 10) {
    throw new Error(`Invalid mood value: ${entry.mood}. Mood must be between 1 and 10.`);
  }

  const database = await getDb();
  await database.runAsync(
    `INSERT INTO check_in_entries (id, timestamp, mood, activity, skipped, autoSkipped, overriddenByEntryId)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.timestamp,
      entry.mood,
      entry.activity,
      entry.skipped ? 1 : 0,
      entry.autoSkipped ? 1 : 0,
      entry.overriddenByEntryId
    ]
  );
}

export async function getEntries(): Promise<CheckInEntry[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<any>('SELECT * FROM check_in_entries ORDER BY timestamp DESC');

  return rows.map(row => ({
    ...row,
    skipped: row.skipped === 1,
    autoSkipped: row.autoSkipped === 1
  }));
}
