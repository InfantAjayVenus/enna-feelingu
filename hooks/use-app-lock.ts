import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

import { getAppLockEnabled } from '@/store/app-lock-store';

export type AppLockState = 'checking' | 'unlocked' | 'locked';

/**
 * Manages app lock state and biometric/device-credential authentication.
 *
 * - On cold-start, reads the preference and immediately prompts if enabled.
 * - On every background → foreground transition, re-prompts if enabled.
 * - Android-only: always resolves to 'unlocked' on other platforms.
 */
export function useAppLock() {
  const [lockState, setLockState] = useState<AppLockState>('checking');
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const authenticate = useCallback(async () => {
    if (Platform.OS !== 'android') {
      setLockState('unlocked');
      return;
    }

    const enabled = await getAppLockEnabled();
    if (!enabled) {
      setLockState('unlocked');
      return;
    }

    setLockState('locked');

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock enna-feelingu',
      cancelLabel: 'Cancel',
      // Allow PIN / pattern / password as fallback when biometrics fail or are unavailable
      disableDeviceFallback: false,
    });

    if (result.success) {
      setLockState('unlocked');
    }
    // On failure or cancellation we remain 'locked'.
    // The next foreground transition will re-prompt.
  }, []);

  // Cold-start: authenticate immediately on mount
  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  // Background → foreground: re-authenticate whenever the app becomes active
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      const wasBackground = prev === 'background' || prev === 'inactive';
      if (wasBackground && next === 'active') {
        void authenticate();
      }
    });
    return () => sub.remove();
  }, [authenticate]);

  return { lockState, authenticate };
}
