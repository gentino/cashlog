import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';

// data: [{ label: 'Mon', value: 12000 }, ...]
export default function SalesBarChart({ data }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1); // avoid divide-by-zero

  return (
    <View style={styles.chartWrap}>
      <View style={styles.barsRow}>
        {data.map((d) => {
          const heightPercent = (d.value / maxValue) * 100;
          return (
            <View key={d.label} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: `${heightPercent}%` }]} />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {data.map((d) => (
          <Text key={d.label} style={styles.label}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
}

const BAR_TRACK_HEIGHT = 120;

const styles = StyleSheet.create({
  chartWrap: { marginTop: spacing.sm },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: BAR_TRACK_HEIGHT },
  barColumn: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: { width: 18, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', backgroundColor: colors.primary, borderRadius: radius.sm, minHeight: 4 },
  labelsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  label: { flex: 1, textAlign: 'center', ...typography.small, color: colors.textSecondary },
});