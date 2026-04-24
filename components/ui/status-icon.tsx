import { IconSymbol } from '@/components/ui/icon-symbol';
import { getStatusIconName } from '@/components/ui/icon-mapping';

export function StatusIcon({
  status,
  size = 20,
  color,
}: {
  status: 'logged' | 'skipped' | 'auto' | 'overridden';
  size?: number;
  color: string;
}) {
  return <IconSymbol name={getStatusIconName(status)} size={size} color={color} />;
}
