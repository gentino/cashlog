import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';

// type: 'sale' | 'expense'
export default function TransactionItem({ title, type, paymentMethod, amount }) {
  const isSale = type === 'sale';
  return (
    <View style={styles.row}>
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
        </View>
      </View>

      <Text style={[styles.amount, { color: isSale ? colors.success : colors.error }]}>
        {isSale ? '+' : '-'}₦{amount.toLocaleString()}
      </Text>
    </View>
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
});