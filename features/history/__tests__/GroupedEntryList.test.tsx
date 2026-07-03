import React from 'react';
import { render } from '@testing-library/react-native';
import { GroupedEntryList } from '../GroupedEntryList';
import { CheckInEntry } from '@/store';

describe('GroupedEntryList', () => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const olderDate = new Date(now);
  olderDate.setDate(olderDate.getDate() - 10);

  const mockEntries: CheckInEntry[] = [
    {
      id: '1',
      timestamp: now.toISOString(),
      mood: 7,
      activity: 'Working',
      skipped: false,
      autoSkipped: false,
      overriddenByEntryId: null,
    },
    {
      id: '2',
      timestamp: yesterday.toISOString(),
      mood: 8,
      activity: 'Coffee break',
      skipped: false,
      autoSkipped: false,
      overriddenByEntryId: null,
    },
    {
      id: '3',
      timestamp: olderDate.toISOString(),
      mood: 5,
      activity: 'Reading',
      skipped: false,
      autoSkipped: false,
      overriddenByEntryId: null,
    },
  ];

  it('renders correctly with entries and groups by date', () => {
    const { getByText } = render(<GroupedEntryList entries={mockEntries} />);
    
    // Check for activities
    expect(getByText('Working')).toBeTruthy();
    expect(getByText('Coffee break')).toBeTruthy();
    expect(getByText('Reading')).toBeTruthy();

    // Check for relative group headers
    expect(getByText('Today')).toBeTruthy();
    expect(getByText('Yesterday')).toBeTruthy();
    
    // Check for fallback absolute date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const absoluteHeader = `${days[olderDate.getDay()]}, ${months[olderDate.getMonth()]} ${olderDate.getDate()}, ${olderDate.getFullYear()}`;
    expect(getByText(absoluteHeader)).toBeTruthy();
  });

  it('renders empty state when no entries', () => {
    const { getByText } = render(<GroupedEntryList entries={[]} />);
    expect(getByText('No check-ins yet. Start your day!')).toBeTruthy();
  });
});
