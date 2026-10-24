import { Platform, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useSettings } from './use-settings';

function SectionHeader({ label }: { label: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <ThemedText
      type="defaultSemiBold"
      style={[styles.sectionHeader, { color: Colors[colorScheme].textSecondary }]}
    >
      {label.toUpperCase()}
    </ThemedText>
  );
}

/**
 * Settings screen component.
 * Exposes the App Lock toggle for Android and a graceful degradation message
 * when the device has no screen lock enrolled or no biometric hardware.
 */
export function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { appLockEnabled, biometricSupport, loading, toggleAppLock } = useSettings();

  const isAndroid = Platform.OS === 'android';
  const lockUnavailable = !isAndroid || biometricSupport === 'none';
  const lockNotEnrolled = isAndroid && biometricSupport === 'available';
  const toggleDisabled = loading || lockUnavailable || lockNotEnrolled;

  const lockSubtitle = lockUnavailable
    ? 'Not available on this device'
    : lockNotEnrolled
      ? 'Set up a screen lock in device Settings first'
      : appLockEnabled
        ? 'App requires authentication on open'
        : 'Require biometric or screen lock on open';

  return (
    <ThemedView style={styles.container}>
      {/* Page heading */}
      <ThemedText type="title" style={styles.heading}>
        Settings
      </ThemedText>

      {/* ── Security ────────────────────────────────── */}
      <SectionHeader label="Security" />

      <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <View style={[styles.row, { borderColor: themeColors.border }]}>
          <View style={styles.rowText}>
            <ThemedText type="defaultSemiBold">App Lock</ThemedText>
            <ThemedText
              type="default"
              style={[styles.subtitle, { color: themeColors.textSecondary }]}
            >
              {lockSubtitle}
            </ThemedText>
          </View>
          <Switch
            accessibilityLabel="Toggle app lock"
            value={appLockEnabled}
            onValueChange={toggleAppLock}
            disabled={toggleDisabled}
            trackColor={{ false: themeColors.border, true: themeColors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  heading: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 12,
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowText: {
    flex: 1,
    marginRight: 16,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});
