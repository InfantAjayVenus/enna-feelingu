import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { DayJournal } from '../DayJournal';
import { getEntries } from '@/store';

jest.mock('@/store', () => ({
  getEntries: jest.fn(),
}));

const mockGetEntries = getEntries as jest.MockedFunction<typeof getEntries>;

describe('DayJournal', () => {
  beforeEach(() => {
    mockGetEntries.mockReset();
  });

  it('renders the full day with full text in one paragraph per local hour', async () => {
    mockGetEntries.mockResolvedValue([
      { id: 'a', timestamp: '2026-05-03T10:05:00Z', mood: 7, activity: 'A very long activity that should never be truncated from the journal', skipped: false, autoSkipped: false, overriddenByEntryId: null },
      { id: 'b', timestamp: '2026-05-03T10:55:00Z', mood: 5, activity: 'Second thought', skipped: false, autoSkipped: false, overriddenByEntryId: null },
      { id: 'c', timestamp: '2026-05-03T11:05:00Z', mood: 8, activity: 'Another hour', skipped: false, autoSkipped: false, overriddenByEntryId: null },
      { id: 'other-day', timestamp: '2026-05-04T10:05:00Z', mood: 3, activity: 'Not today', skipped: false, autoSkipped: false, overriddenByEntryId: null },
    ]);

    const screen = render(<DayJournal dayKey="2026-05-03" />);
    await waitFor(() => expect(screen.getByText(/A very long activity that should never be truncated from the journal/)).toBeTruthy());
    expect(screen.getByText(/Second thought/)).toBeTruthy();
    expect(screen.getByText('Another hour. 😁')).toBeTruthy();
    expect(screen.queryByText(/Not today/)).toBeNull();
  });

  it('shows an unavailable message for invalid route dates', async () => {
    mockGetEntries.mockResolvedValue([]);
    const screen = render(<DayJournal dayKey="2026-02-30" />);
    await waitFor(() => expect(screen.getByText('This journal date is unavailable.')).toBeTruthy());
  });
});
