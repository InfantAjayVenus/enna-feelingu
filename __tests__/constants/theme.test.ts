jest.mock('expo', () => ({
  Constants: {
    manifest: {
      extra: {},
    },
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (obj: any) => obj.default,
  },
}));

import { getMoodColor, getMoodBg } from '../../constants/theme';

describe('theme utilities', () => {
  describe('getMoodColor', () => {
    it('returns negative color for score <= 4', () => {
      expect(getMoodColor(1)).toBe('text-mood-negative');
      expect(getMoodColor(4)).toBe('text-mood-negative');
    });

    it('returns neutral color for score === 5', () => {
      expect(getMoodColor(5)).toBe('text-mood-neutral');
    });

    it('returns positive color for score > 5', () => {
      expect(getMoodColor(6)).toBe('text-mood-positive');
      expect(getMoodColor(10)).toBe('text-mood-positive');
    });
  });

  describe('getMoodBg', () => {
    it('returns negative background for score <= 4', () => {
      expect(getMoodBg(1)).toBe('bg-red-100 dark:bg-red-900');
      expect(getMoodBg(4)).toBe('bg-red-100 dark:bg-red-900');
    });

    it('returns neutral background for score === 5', () => {
      expect(getMoodBg(5)).toBe('bg-gray-100 dark:bg-gray-800');
    });

    it('returns positive background for score > 5', () => {
      expect(getMoodBg(6)).toBe('bg-green-100 dark:bg-green-900');
      expect(getMoodBg(10)).toBe('bg-green-100 dark:bg-green-900');
    });
  });
});