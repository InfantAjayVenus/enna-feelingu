import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PressScale } from '@/components/motion/press-scale';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CheckInEntry } from '@/store';
import { EntryItem } from './EntryItem';
import { Colors, MOOD_EMOJIS } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ---------------------------------------------------------------------------
// Public handle — lets the parent screen drive collapse/expand globally.
// ---------------------------------------------------------------------------
export interface GroupedEntryListHandle {
  collapseAll: () => void;
  expandAll: () => void;
}

interface GroupedEntryListProps {
  entries: CheckInEntry[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

interface Section {
  title: string;
  data: CheckInEntry[];
  averageMood: number;
}

export const GroupedEntryList = forwardRef<GroupedEntryListHandle, GroupedEntryListProps>(
  function GroupedEntryList({ entries, onRefresh, refreshing }, ref) {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    // Track which sections are collapsed; all sections start expanded.
    const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

    const toggleSection = useCallback((title: string) => {
      setCollapsedSections((prev) => {
        const next = new Set(prev);
        if (next.has(title)) {
          next.delete(title);
        } else {
          next.add(title);
        }
        return next;
      });
    }, []);

    const rawSections = useMemo<Section[]>(() => {
      const groups = entries.reduce((acc, entry) => {
        const d = new Date(entry.timestamp);
        const now = new Date();

        const dateMidnight = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        const nowMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
        const diffTime = nowMidnight - dateMidnight;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        let dateStr = '';
        if (diffDays === 0) {
          dateStr = 'Today';
        } else if (diffDays === 1) {
          dateStr = 'Yesterday';
        } else if (diffDays > 1 && diffDays < 7) {
          dateStr = `${diffDays} days ago`;
        } else {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          dateStr = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        }
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        acc[dateStr].push(entry);
        return acc;
      }, {} as Record<string, CheckInEntry[]>);

      return Object.entries(groups)
        .sort(([, aData], [, bData]) => {
          return new Date(bData[0].timestamp).getTime() - new Date(aData[0].timestamp).getTime();
        })
        .map(([dateStr, groupData]) => {
        const sum = groupData.reduce((acc, curr) => acc + curr.mood, 0);
        const avg = Math.round(sum / groupData.length);
        return {
          title: dateStr,
          data: groupData,
          averageMood: avg,
        };
      });
    }, [entries]);

    // Expose imperative actions to the parent screen.
    useImperativeHandle(ref, () => ({
      collapseAll: () =>
        setCollapsedSections(new Set(rawSections.map((s) => s.title))),
      expandAll: () =>
        setCollapsedSections(new Set()),
    }), [rawSections]);

    // Collapse by passing an empty data array for collapsed sections.
    // SectionList still renders the header while items are hidden.
    const sections = useMemo<Section[]>(
      () =>
        rawSections.map((section) => ({
          title: section.title,
          data: collapsedSections.has(section.title) ? [] : section.data,
          averageMood: section.averageMood,
        })),
      [rawSections, collapsedSections],
    );

    const renderEmpty = () => (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No check-ins yet. Start your day!</ThemedText>
      </ThemedView>
    );

    return (
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EntryItem entry={item} />}
        renderSectionHeader={({ section }) => {
          const { title, averageMood } = section;
          const isCollapsed = collapsedSections.has(title);
          return (
            <PressScale
              onPress={() => toggleSection(title)}
              accessibilityRole="button"
              accessibilityLabel={`${title}, ${isCollapsed ? 'collapsed' : 'expanded'}`}
              accessibilityState={{ expanded: !isCollapsed }}
            >
              <ThemedView
                style={[
                  styles.sectionHeader,
                  {
                    backgroundColor: themeColors.surface,
                    borderBottomColor: isCollapsed ? 'transparent' : themeColors.border,
                  },
                ]}
              >
                <View style={styles.headerTitleContainer}>
                  <ThemedText style={styles.headerEmoji}>{MOOD_EMOJIS[averageMood]}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={{ color: themeColors.primary }}>
                    {title}
                  </ThemedText>
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={14}
                  weight="medium"
                  color={themeColors.primary}
                  style={[
                    styles.chevron,
                    { transform: [{ rotate: isCollapsed ? '0deg' : '90deg' }] },
                  ]}
                />
              </ThemedView>
            </PressScale>
          );
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
      />
    );
  },
);

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  chevron: {
    marginLeft: 4,
  },
});
