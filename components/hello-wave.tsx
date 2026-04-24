import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useEffect } from 'react';
import { motion } from '@/constants/theme';

export function HelloWave() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: motion.fast, easing: Easing.out(Easing.quad) }),
        withTiming(14, { duration: motion.fast, easing: Easing.inOut(Easing.quad) }),
        withTiming(-10, { duration: motion.fast, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: motion.fast, easing: Easing.out(Easing.quad) })
      ),
      2,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.Text
      style={[
        {
          fontSize: 28,
          lineHeight: 32,
          marginTop: -6,
        },
        animatedStyle,
      ]}>
      👋
    </Animated.Text>
  );
}
