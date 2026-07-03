import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { STATUS_ICON_MAP } from '@/components/ui/icon-mapping';

export function StatusIcon({
  status,
  size = 20,
  color,
}: {
  status: 'logged' | 'skipped' | 'auto' | 'overridden';
  size?: number;
  color: string;
}) {
  return <MaterialIcons name={STATUS_ICON_MAP[status]} size={size} color={color} />;
}
