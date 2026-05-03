export type CheckInEntry = {
  /** UUID, generated at save time */
  id: string;
  /** ISO 8601, minute precision (e.g. "2026-03-13T14:00:00") */
  timestamp: string;
  /** Integer 1–10 (inclusive) */
  mood: number;
  /** Free text; empty string when omitted */
  activity: string;
  /** false for all Phase 1 entries */
  skipped: boolean;
  /** false for all Phase 1 entries */
  autoSkipped: boolean;
  /** null for all Phase 1 entries */
  overriddenByEntryId: string | null;
};
