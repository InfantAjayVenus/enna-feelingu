import { PropsWithChildren } from 'react';
import { StyleSheet, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/constants/theme';

type Props = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
  }
>;

export function PressScale({ children, onPressIn, onPressOut, ...props }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      {...props}
      style={[styles.root, props.style]}
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

const styles = StyleSheet.create({
  root: {
    minHeight: 48,
    minWidth: 48,
  },
});
