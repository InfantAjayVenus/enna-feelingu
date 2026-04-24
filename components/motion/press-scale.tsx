import { PropsWithChildren } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/constants/theme';

type Props = PropsWithChildren<PressableProps>;

export function PressScale({ children, onPressIn, onPressOut, ...props }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...props}
      onPressIn={(event) => {
        scale.value = withTiming(motion.pressScale, { duration: motion.fast });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withTiming(1, { duration: motion.fast });
        onPressOut?.(event);
      }}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}
