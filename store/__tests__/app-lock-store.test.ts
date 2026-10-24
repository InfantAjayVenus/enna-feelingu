// Locally override the platform to android for all tests in this file
jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

// Override SecureStore so we can control return values per-test
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

import * as SecureStore from 'expo-secure-store';
import { getAppLockEnabled, setAppLockEnabled } from '../app-lock-store';

const mockGetItem = SecureStore.getItemAsync as jest.Mock;
const mockSetItem = SecureStore.setItemAsync as jest.Mock;

describe('app-lock-store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── getAppLockEnabled ──────────────────────────────────────────────────────
  describe('getAppLockEnabled', () => {
    it('returns false when the key has never been written (null)', async () => {
      mockGetItem.mockResolvedValue(null);
      expect(await getAppLockEnabled()).toBe(false);
      expect(mockGetItem).toHaveBeenCalledWith('enna_app_lock_enabled');
    });

    it('returns true when the stored value is "true"', async () => {
      mockGetItem.mockResolvedValue('true');
      expect(await getAppLockEnabled()).toBe(true);
    });

    it('returns false when the stored value is "false"', async () => {
      mockGetItem.mockResolvedValue('false');
      expect(await getAppLockEnabled()).toBe(false);
    });

    it('returns false for any unexpected stored value', async () => {
      mockGetItem.mockResolvedValue('yes');
      expect(await getAppLockEnabled()).toBe(false);
    });
  });

  // ── setAppLockEnabled ──────────────────────────────────────────────────────
  describe('setAppLockEnabled', () => {
    it('writes "true" when enabling', async () => {
      mockSetItem.mockResolvedValue(null);
      await setAppLockEnabled(true);
      expect(mockSetItem).toHaveBeenCalledWith('enna_app_lock_enabled', 'true');
    });

    it('writes "false" when disabling', async () => {
      mockSetItem.mockResolvedValue(null);
      await setAppLockEnabled(false);
      expect(mockSetItem).toHaveBeenCalledWith('enna_app_lock_enabled', 'false');
    });
  });
});
