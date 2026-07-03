import React from 'react';
import { render } from '@testing-library/react-native';
import { GroupedEntryList } from '../GroupedEntryList';
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
    timestamp: '2026-05-04T11:00:00Z',
    mood: 8,
    activity: 'Coffee break',
    skipped: false,
    autoSkipped: false,
    overriddenByEntryId: null,
  },
];

describe('GroupedEntryList', () => {
  it('renders correctly with entries and groups by date', () => {
    const { getByText, getAllByText } = render(<GroupedEntryList entries={mockEntries} />);
    
    // Check for activities
    expect(getByText('Working')).toBeTruthy();
    expect(getByText('Coffee break')).toBeTruthy();

    // Check for group headers
    // Using our manual formatting: e.g. "Sunday, May 3, 2026"
    const d1 = new Date(mockEntries[0].timestamp);
    const d2 = new Date(mockEntries[1].timestamp);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const header1 = `${days[d1.getDay()]}, ${months[d1.getMonth()]} ${d1.getDate()}, ${d1.getFullYear()}`;
    const header2 = `${days[d2.getDay()]}, ${months[d2.getMonth()]} ${d2.getDate()}, ${d2.getFullYear()}`;
    
    expect(getByText(header1)).toBeTruthy();
    expect(getByText(header2)).toBeTruthy();
  });

  it('renders empty state when no entries', () => {
    const { getByText } = render(<GroupedEntryList entries={[]} />);
    
    expect(getByText('No check-ins yet. Start your day!')).toBeTruthy();
  });
});
