import { Platform } from 'react-native';

const lightPalette = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primaryLight: '#66BB6A',
  accent: '#FFC107',
  error: '#EF4444',
  icon: '#6B7280',
  tabIconDefault: '#6B7280',
  tabIconSelected: '#4CAF50',
  moodNegative: '#EF4444',
  moodNeutral: '#9CA3AF',
  moodPositive: '#4CAF50',
  moodPositiveLight: '#81C784',
  statusLogged: '#4CAF50',
  statusSkipped: '#9CA3AF',
  statusAuto: '#F59E0B',
  statusOverridden: '#8B5CF6',
};

const darkPalette = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#A1A1AA',
  border: '#2A2A2A',
  primary: '#66BB6A',
  primaryDark: '#2E7D32',
  primaryLight: '#81C784',
  accent: '#FFC107',
  error: '#F87171',
  icon: '#A1A1AA',
  tabIconDefault: '#A1A1AA',
  tabIconSelected: '#66BB6A',
  moodNegative: '#F87171',
  moodNeutral: '#A1A1AA',
  moodPositive: '#66BB6A',
  moodPositiveLight: '#81C784',
  statusLogged: '#66BB6A',
  statusSkipped: '#A1A1AA',
  statusAuto: '#F59E0B',
  statusOverridden: '#8B5CF6',
};

export const Colors = {
  light: {
    ...lightPalette,
  },
  dark: {
    ...darkPalette,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const ui = {
  screen: 'flex-1 bg-bg-light dark:bg-bg-dark px-md',
  card: 'bg-surface-light dark:bg-surface-dark rounded-lg p-md shadow-card',
  textPrimary: 'text-text-primary-light dark:text-text-primary-dark',
  textSecondary: 'text-text-secondary-light dark:text-text-secondary-dark',
  buttonPrimary: 'bg-primary dark:bg-primary-dark h-12 rounded-md items-center justify-center',
  buttonPrimaryText: 'text-white font-semibold text-sm',
  buttonSecondary: 'bg-gray-100 dark:bg-neutral-800 h-12 rounded-md items-center justify-center',
  buttonDisabled: 'bg-gray-200 dark:bg-neutral-700 h-12 rounded-md items-center justify-center',
  input:
    'border border-border-light dark:border-border-dark rounded-md p-sm text-text-primary-light dark:text-text-primary-dark',
  row: 'flex-row items-center',
} as const;

export const sliderStyles = {
  track: 'h-1 bg-border-light dark:bg-border-dark rounded-full',
  active: 'bg-primary',
  thumb: 'w-5 h-5 bg-primary rounded-full',
} as const;

export const cardVariants = {
  default: 'bg-surface-light dark:bg-surface-dark',
  skipped: 'opacity-60',
  auto: 'border border-yellow-400',
  overridden: 'border border-purple-500',
} as const;

export const buttonVariants = {
  primary: ui.buttonPrimary,
  secondary: ui.buttonSecondary,
  disabled: ui.buttonDisabled,
} as const;

export function getMoodColor(score: number) {
  if (score <= 4) return 'text-mood-negative';
  if (score === 5) return 'text-mood-neutral';
  return 'text-mood-positive';
}

export function getMoodBg(score: number) {
  if (score <= 4) return 'bg-red-100 dark:bg-red-900';
  if (score === 5) return 'bg-gray-100 dark:bg-gray-800';
  return 'bg-green-100 dark:bg-green-900';
}
