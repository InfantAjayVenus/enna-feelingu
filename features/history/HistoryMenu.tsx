import { PressScale } from '@/components/motion/press-scale';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type IconSymbolName } from '@/components/ui/icon-mapping';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

export interface MenuAction {
  id: string;
  label: string;
  iconName: IconSymbolName;
  onPress: () => void;
}

interface AnchorLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HistoryMenuProps {
  visible: boolean;
  onClose: () => void;
  actions: MenuAction[];
  /** Ref to the trigger element — used to measure its screen position. */
  anchorRef: React.RefObject<View | null>;
}

export function HistoryMenu({ visible, onClose, actions, anchorRef }: HistoryMenuProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const [anchor, setAnchor] = useState<AnchorLayout | null>(null);

  // Measure the anchor button every time the menu opens.
  useEffect(() => {
    if (visible) {
      anchorRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
        setAnchor({ x: pageX, y: pageY, width, height });
      });
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 18,
          stiffness: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => setAnchor(null));
    }
  }, [visible, anchorRef, scaleAnim, opacityAnim]);

  const handleActionPress = (action: MenuAction) => {
    setTimeout(action.onPress, 120);
  };

  const popupBg = isDark ? Colors.dark.surface : Colors.light.background;
  const dividerColor = themeColors.border;

  // Position the popup below-left of the anchor button.
  // Falls back to top-right corner of the screen if measure hasn't resolved yet.
  const popupStyle: ViewStyle = anchor
    ? {
      position: 'absolute',
      // align right edge of popup with right edge of button
      right: undefined,
      left: anchor.x + anchor.width - POPUP_WIDTH,
      top: anchor.y + anchor.height + 8,
    }
    : { position: 'absolute', top: 80, right: 16 };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      testID="history-menu-modal"
    >
      {/* Invisible full-screen dismiss target */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityLabel="Close menu"
        testID="close-menu-backdrop"
      />

      {/* Floating popup card */}
      <Animated.View
        style={[
          styles.popup,
          popupStyle,
          {
            backgroundColor: popupBg,
            borderColor: dividerColor,
            opacity: opacityAnim,
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1],
                }),
              },
            ],
          },
        ]}
        accessibilityViewIsModal
      >
        {actions.map((action, idx) => (
          <React.Fragment key={action.id}>
            <PressScale
              id={`history-menu-action-${action.id}`}
              onPress={() => handleActionPress(action)}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <ThemedView
                style={styles.actionRow}
              >
                <IconSymbol
                  name={action.iconName}
                  size={16}
                  color={themeColors.primary}
                  style={styles.actionIcon}
                />
                <ThemedText style={styles.actionLabel}>{action.label}</ThemedText>
              </ThemedView>
            </PressScale>
            {idx < actions.length - 1 && (
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
            )}
          </React.Fragment>
        ))}
      </Animated.View>
    </Modal>
  );
}

const POPUP_WIDTH = 180;

const styles = StyleSheet.create({
  popup: {
    width: POPUP_WIDTH,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    // Scale origin: top-right corner (where the trigger lives)
    transformOrigin: 'top right',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  actionIcon: {
    marginRight: 10,
  },
  actionLabel: {
    fontSize: 15,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
