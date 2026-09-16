import { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadow } from '../constants/theme';
import { useTransactions } from '../context/TransactionsContext';
import { formatLongDate } from '../utils/dateHelpers';
import TransactionItem from '../components/TransactionItem/TransactionItem';
import TransactionActionsModal from '../components/TransactionActionsModal/TransactionActionsModal';
import { confirmDialog } from '../utils/confirmDialog';

export default function DayDetailScreen({ route, navigation }) {
  const { date } = route.params;
  const { transactions, deleteTransaction } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const dayTransactions = useMemo(() => {
    const targetDay = new Date(date).toDateString();
    return transactions.filter((t) => new Date(t.date).toDateString() === targetDay);
  }, [transactions, date]);

  const handleEdit = () => {
    const screen = selectedTransaction.type === 'sale' ? 'AddSale' : 'AddExpense';
    setSelectedTransaction(null);
    navigation.navigate(screen, { editTransaction: selectedTransaction });
  };

  const handleDelete = () => {
    const transaction = selectedTransaction;
    setSelectedTransaction(null);
    confirmDialog('Delete transaction?', `Remove "${transaction.description}"? This can't be undone.`, () => {
      deleteTransaction(transaction);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>{formatLongDate(date)}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={dayTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, shadow.card]}>
            <TransactionItem {...item} onPress={() => setSelectedTransaction(item)} />
          </View>
        )}
      />

      <TransactionActionsModal
        visible={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.textPrimary },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: spacing.sm, marginBottom: spacing.sm },
});