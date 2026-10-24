import { Tabs } from 'expo-router';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { PressScale } from '@/components/motion/press-scale';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { CheckInDrawer } from '@/features/checkin/CheckInDrawer';
import { CheckInForm } from '@/features/checkin/CheckInForm';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: themeColors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
              backgroundColor: themeColors.background,
            },
            default: {
              backgroundColor: themeColors.background,
              borderTopColor: themeColors.border,
            },
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={28} color={color} />
            ),
          }}
        />
      </Tabs>

      <PressScale
        accessibilityRole="button"
        accessibilityLabel="Add check-in"
        style={[styles.fab, { bottom: bottom + 78, backgroundColor: themeColors.primary }]}
        onPress={() => setIsDrawerVisible(true)}
      >
        <MaterialIcons name="add" size={32} color="#FFFFFF" />
      </PressScale>

      <CheckInDrawer
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
      >
        <CheckInForm onSuccess={() => setIsDrawerVisible(false)} />
      </CheckInDrawer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
