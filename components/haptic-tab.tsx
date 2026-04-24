import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/constants/theme';

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        scale.value = withTiming(motion.pressScale, { duration: motion.fast });
        props.onPressIn?.(ev);
      }}
      onPressOut={(ev) => {
        scale.value = withTiming(1, { duration: motion.fast });
        props.onPressOut?.(ev);
      }}>
      <Animated.View style={animatedStyle}>
        {props.children}
      </Animated.View>
    </PlatformPressable>
  );
}
