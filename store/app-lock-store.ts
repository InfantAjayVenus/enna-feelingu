import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const LOCK_KEY = 'enna_app_lock_enabled';

/**
 * Returns true if app lock is enabled.
 * Defaults to false (on first launch or if the key has never been written).
 * Always returns false on non-Android platforms.
 */
export async function getAppLockEnabled(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  const val = await SecureStore.getItemAsync(LOCK_KEY);
  return val === 'true';
}

/**
 * Persists the app lock preference to the device's encrypted keystore.
 * No-op on non-Android platforms.
 */
export async function setAppLockEnabled(enabled: boolean): Promise<void> {
  if (Platform.OS !== 'android') return;
  await SecureStore.setItemAsync(LOCK_KEY, enabled ? 'true' : 'false');
}
