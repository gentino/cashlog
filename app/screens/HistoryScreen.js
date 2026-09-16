import EmptyState from '../components/EmptyState/EmptyState';
import { View, Text, StyleSheet, ScrollView,FlatList, Pressable,TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import Header from '../components/Header/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactions } from '../context/TransactionsContext';
import { groupTransactionsByDay, formatLongDate, filterByRange } from '../utils/dateHelpers';
import { useState, useMemo } from 'react';
import { useBusiness } from '../context/BusinessContext';
import ErrorState from '../components/ErrorState/ErrorState';



const FILTERS = ['Today', 'This Week', 'This Month'];

export default function HistoryScreen({navigation}) {
  const { transactions, error, refetchTransactions } = useTransactions();
  // const { transactions } = useTransactions();
  const [activeFilter, setActiveFilter] = useState('This Week');
  const [searchQuery, setSearchQuery] = useState('');
  const { business } = useBusiness();

  
  const filteredTransactions = useMemo(() => {
  if (!searchQuery.trim()) return transactions;
  const query = searchQuery.trim().toLowerCase();
  return transactions.filter((t) =>
    t.description?.toLowerCase().includes(query) ||
    t.category?.toLowerCase().includes(query) ||
    t.paymentMethod?.toLowerCase().includes(query)
  );
}, [transactions, searchQuery]);

  const dailySummaries = useMemo(() => {
    const grouped = groupTransactionsByDay(filteredTransactions);
    return filterByRange(grouped, activeFilter);
  }, [filteredTransactions, activeFilter]);

  return (
  
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
       <Header title='History' navigation={navigation}/>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Filter pills */}
      <View style={styles.pillRow}>
        {FILTERS.map((filter) => {
          const selected = filter === activeFilter;
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.pill, selected && styles.pillSelected]}
            >
              <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Daily summary list */}
{error && transactions.length === 0 ? (
    <ErrorState message={error} onRetry={refetchTransactions} />
  ) : (
      <FlatList
        data={dailySummaries}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}

        ListEmptyComponent={
  <EmptyState
    icon={searchQuery ? 'search-outline' : 'calendar-outline'}
    title="Nothing here yet"
    subtitle={
      searchQuery
        ? `No results for "${searchQuery}".`
        : `No transactions found for "${activeFilter}".`
    }
  />
}        

    renderItem={({ item }) => (
          <Pressable style={[styles.card, shadow.card]} onPress={() => navigation.navigate('DayDetail', { date: item.date })}>
            <View style={styles.cardTopRow}>
              <Text style={styles.dateText}>{formatLongDate(item.date)}</Text>
              <Text style={styles.netText}>{business.currencySymbol}{item.net.toLocaleString()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Sales</Text>
                <View style={styles.statValueRow}>
                  <Ionicons name="arrow-up" size={14} color={colors.primary} />
                  <Text style={styles.salesValue}>{business.currencySymbol}{item.sales.toLocaleString()}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.statLabel}>Expenses</Text>
                <View style={styles.statValueRow}>
                  <Ionicons name="arrow-down" size={14} color={colors.danger} />
                  <Text style={styles.expenseValue}>{business.currencySymbol}{item.expenses.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />


      )}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },

  filterIconWrap: {
    width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: colors.inputBackground, justifyContent: 'center', alignItems: 'center',
  },
  pillRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginVertical: spacing.md },
  pill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.inputBackground },
  pillSelected: { backgroundColor: colors.primary },
  pillText: { ...typography.bodyBold, color: colors.textPrimary },
  pillTextSelected: { color: colors.textInverse },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { ...typography.bodyBold, color: colors.textPrimary },
  netText: { ...typography.h3, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 2 },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  salesValue: { ...typography.bodyBold, color: colors.primary },
  expenseValue: { ...typography.bodyBold, color: colors.danger },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  searchWrap: {
  flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground,
  borderRadius: radius.md, paddingHorizontal: spacing.md, marginHorizontal: spacing.md,
  marginTop: spacing.sm,
},
searchIcon: { marginRight: spacing.sm },
searchInput: { flex: 1, paddingVertical: spacing.sm + 2, ...typography.body, color: colors.textPrimary,outlineStyle: 'none', },

});
