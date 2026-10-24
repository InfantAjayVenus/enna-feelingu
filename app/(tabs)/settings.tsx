import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsScreen } from '@/features/settings/SettingsScreen';

/** Thin screen wrapper — all logic lives in the settings feature. */
export default function SettingsTab() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <SettingsScreen />
    </SafeAreaView>
  );
}
