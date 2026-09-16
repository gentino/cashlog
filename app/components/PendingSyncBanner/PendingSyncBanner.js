import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '../../context/TransactionsContext';
import { useNetwork } from '../../context/NetworkContext';
import { spacing, typography } from '../../constants/theme';

export default function PendingSyncBanner() {
  const { pendingCount } = useTransactions();
  const { isConnected } = useNetwork();

  if (pendingCount === 0) return null;

  const label = pendingCount === 1 ? 'change' : 'changes';

  return (
    <View style={styles.banner}>
      <Ionicons name={isConnected ? 'sync' : 'time-outline'} size={14} color="#7A5C00" />
      <Text style={styles.text}>
        {isConnected
          ? `Syncing ${pendingCount} pending ${label}...`
          : `${pendingCount} ${label} waiting to sync`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    backgroundColor: '#FFF3CD', paddingVertical: 6,
  },
  text: { ...typography.small, color: '#7A5C00', fontWeight: '600' },
});