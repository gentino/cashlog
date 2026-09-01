import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';

// variant: 'primary' (filled green) | 'outline' (green border, transparent fill)
export default function Button({ label, onPress, variant = 'primary', icon, style }) {
  const isOutline = variant === 'outline';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        isOutline ? styles.outline : styles.primary,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.label, isOutline ? styles.labelOutline : styles.labelPrimary]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  label: { ...typography.bodyBold },
  labelPrimary: { color: colors.textInverse },
  labelOutline: { color: colors.primary },
});