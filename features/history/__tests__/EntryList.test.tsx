import React from 'react';
import { render } from '@testing-library/react-native';
import { EntryList } from '../EntryList';
import { CheckInEntry } from '@/store';

const mockEntries: CheckInEntry[] = [
  {
    id: '1',
    timestamp: '2026-05-03T10:00:00Z',
    mood: 7,
    activity: 'Working',
    skipped: false,
    autoSkipped: false,
    overriddenByEntryId: null,
  },
  {
    id: '2',
    timestamp: '2026-05-03T11:00:00Z',
    mood: 8,
    activity: 'Coffee break',
    skipped: false,
    autoSkipped: false,
    overriddenByEntryId: null,
  },
];

describe('EntryList', () => {
  it('renders correctly with entries', () => {
    const { getByText, getAllByText } = render(<EntryList entries={mockEntries} />);
    
    expect(getByText('Working')).toBeTruthy();
    expect(getByText('Coffee break')).toBeTruthy();
    // Time rendering depends on locale, but let's check if it exists in some form
    // In our EntryItem we use toLocaleTimeString
  });

  it('renders empty state when no entries', () => {
    const { getByText } = render(<EntryList entries={[]} />);
    
    expect(getByText('No check-ins yet. Start your day!')).toBeTruthy();
  });
});
