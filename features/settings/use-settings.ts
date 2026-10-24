import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

import { getAppLockEnabled, setAppLockEnabled } from '@/store/app-lock-store';

/** Describes the device's screen-lock capability. */
export type BiometricSupport =
  /** Platform is not Android, or no biometric hardware detected */
  | 'none'
  /** Hardware present, but no screen lock (biometric or device credential) is enrolled */
  | 'available'
  /** At least one credential (PIN, pattern, password, biometric) is enrolled — lock is usable */
  | 'enrolled';

export interface SettingsState {
  appLockEnabled: boolean;
  biometricSupport: BiometricSupport;
  loading: boolean;
  toggleAppLock: (value: boolean) => Promise<void>;
}

/**
 * Domain hook for the Settings screen.
 * Reads the current app-lock preference and the device's authentication capability,
 * and exposes a safe toggle that requires identity verification before enabling.
 *
 * Bug fixes vs. initial implementation:
 *  1. Uses `getEnrolledLevelAsync()` (SecurityLevel) instead of `isEnrolledAsync()`.
 *     `isEnrolledAsync()` only detects biometric enrollment (fingerprint/face/iris) and
 *     returns false even when the user has a PIN, pattern, or password set. `SecurityLevel`
 *     returns NONE (0), SECRET/1 (device credential), or BIOMETRIC_WEAK/STRONG (2/3),
 *     covering all authentication types that `authenticateAsync` can use.
 *  2. Adds an AppState listener so the capability is re-evaluated whenever the user
 *     returns to the app from Android's device-settings screen.
 */
export function useSettings(): SettingsState {
  const [appLockEnabled, setLocalAppLock] = useState(false);
  const [biometricSupport, setBiometricSupport] = useState<BiometricSupport>('none');
  const [loading, setLoading] = useState(true);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const checkCapability = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setLoading(false);
      return;
    }

    const [enabled, hasHardware, enrolledLevel] = await Promise.all([
      getAppLockEnabled(),
      LocalAuthentication.hasHardwareAsync(),
      // FIX 1: getEnrolledLevelAsync() returns SecurityLevel which includes
      //         NONE=0, SECRET=1 (PIN/pattern/password), BIOMETRIC_WEAK=2, BIOMETRIC_STRONG=3.
      //         isEnrolledAsync() only returns true for biometric credentials.
      LocalAuthentication.getEnrolledLevelAsync(),
    ]);

    setLocalAppLock(enabled);

    if (!hasHardware) {
      setBiometricSupport('none');
    } else if (enrolledLevel === LocalAuthentication.SecurityLevel.NONE) {
      // No credential at all (no PIN, no pattern, no password, no biometric)
      setBiometricSupport('available');
    } else {
      // SecurityLevel.SECRET (1), BIOMETRIC_WEAK (2), or BIOMETRIC_STRONG (3)
      setBiometricSupport('enrolled');
    }

    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    void checkCapability();
  }, [checkCapability]);

  // FIX 2: Re-check capability whenever the app returns from background.
  //         Without this, a user who goes to Android Settings to enroll a screen lock
  //         and then returns to this screen sees stale 'available' state.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      const wasBackground = prev === 'background' || prev === 'inactive';
      if (wasBackground && next === 'active') {
        void checkCapability();
      }
    });
    return () => sub.remove();
  }, [checkCapability]);

  async function toggleAppLock(value: boolean) {
    if (value) {
      // Require identity verification before enabling the lock,
      // so a third party cannot silently activate app lock on someone else's device.
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity to enable App Lock',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      if (!result.success) return; // user cancelled — abort
    }

    await setAppLockEnabled(value);
    setLocalAppLock(value);
  }

  return { appLockEnabled, biometricSupport, loading, toggleAppLock };
}
