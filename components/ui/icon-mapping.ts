import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';

export type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export const ICON_SYMBOL_MAP = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'cube': 'inventory-2',
  'square.and.arrow.up': 'share',
  'ellipsis': 'more-horiz',
  'trash': 'delete',
} as const satisfies Record<string, MaterialIconName>;

export type IconSymbolName = keyof typeof ICON_SYMBOL_MAP;

export const STATUS_ICON_MAP = {
  logged: 'check-circle',
  skipped: 'skip-next',
  auto: 'bolt',
  overridden: 'swap-horiz',
} as const satisfies Record<'logged' | 'skipped' | 'auto' | 'overridden', MaterialIconName>;

export function getStatusIconName(status: keyof typeof STATUS_ICON_MAP) {
  return STATUS_ICON_MAP[status];
}
