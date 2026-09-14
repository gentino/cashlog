import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';

export default function EmptyState({ icon = 'document-text-outline', title, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={28} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  iconCircle: {
    width: 64, height: 64, borderRadius: radius.pill, backgroundColor: colors.inputBackground,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  title: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
});