import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
      </View>
      <Text style={styles.title}>{message}</Text>
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color={colors.textInverse} />
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  iconCircle: {
    width: 64, height: 64, borderRadius: radius.pill, backgroundColor: '#FBE7EC',
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  title: { ...typography.bodyBold, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  retryButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: colors.primary, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
  },
  retryText: { ...typography.bodyBold, color: colors.textInverse },
});