import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { useBusiness } from '../../context/BusinessContext';

// type: 'sale' | 'expense'
import { Pressable } from 'react-native';

export default function TransactionItem({ title, type, paymentMethod, amount, pendingSync, onPress }) {
  const { business } = useBusiness();
  const isSale = type === 'sale';
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.iconWrap, { backgroundColor: isSale ? colors.primaryLight : '#FBE7EC' }]}>
        <Ionicons
          name={isSale ? 'cut-outline' : 'cart-outline'}
          size={18}
          color={isSale ? colors.primary : colors.danger}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
  <View style={[styles.badge, { backgroundColor: isSale ? colors.primaryLight : '#FBE7EC' }]}>
    <Text style={[styles.badgeText, { color: isSale ? colors.primary : colors.danger }]}>
      {isSale ? 'SALE' : 'EXPENSE'}
    </Text>
  </View>
  <Text style={styles.meta}> · {paymentMethod}</Text>
  {pendingSync && (
    <View style={styles.pendingBadge}>
      <Ionicons name="time-outline" size={10} color={colors.textSecondary} />
      <Text style={styles.pendingText}>Pending</Text>
    </View>
  )}
</View>
      </View>

      <Text style={[styles.amount, { color: isSale ? colors.success : colors.error }]}>
        {isSale ? '+' : '-'}{business.currencySymbol}{amount.toLocaleString()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  iconWrap: {
    width: 40, height: 40, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center', marginRight: spacing.md,
  },
  details: { flex: 1 },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.sm },
  badgeText: { fontSize: 10, fontWeight: '700' },
  meta: { ...typography.small, color: colors.textSecondary },
  amount: { ...typography.bodyBold },
  pendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: spacing.xs },
pendingText: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
});