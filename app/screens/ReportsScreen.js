import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import { useTransactions } from '../context/TransactionsContext';
import { filterTransactionsByPeriod, getLast7DaysSales } from '../utils/dateHelpers';
import SalesBarChart from '../components/SalesBarChart/SalesBarChart';

const PERIODS = ['This Month', 'Last Month', 'This Year'];

export default function ReportsScreen() {
  const { transactions } = useTransactions();
  const [activePeriod, setActivePeriod] = useState('This Month');

  const periodTransactions = useMemo(
    () => filterTransactionsByPeriod(transactions, activePeriod),
    [transactions, activePeriod]
  );

  const totalSales = periodTransactions
    .filter((t) => t.type === 'sale')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = periodTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const estimatedNet = totalSales - totalExpenses;

  const chartData = useMemo(() => getLast7DaysSales(transactions), [transactions]);
  const dailyAvg = Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / 7);

  // Quick insights
  const bestSalesDay = useMemo(() => {
    if (chartData.every((d) => d.value === 0)) return '—';
    const best = chartData.reduce((a, b) => (b.value > a.value ? b : a));
    return best.label;
  }, [chartData]);

  const highestExpense = useMemo(() => {
    const expenses = periodTransactions.filter((t) => t.type === 'expense');
    if (expenses.length === 0) return null;
    return expenses.reduce((a, b) => (b.amount > a.amount ? b : a));
  }, [periodTransactions]);

  const topPaymentMethod = useMemo(() => {
    const totals = {};
    periodTransactions.forEach((t) => {
      totals[t.paymentMethod] = (totals[t.paymentMethod] || 0) + t.amount;
    });
    const entries = Object.entries(totals);
    if (entries.length === 0) return '—';
    return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  }, [periodTransactions]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports</Text>
          <Pressable style={styles.filterIconWrap}>
            <Ionicons name="filter" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Period pills */}
        <View style={styles.pillRow}>
          {PERIODS.map((period) => {
            const selected = period === activePeriod;
            return (
              <Pressable
                key={period}
                onPress={() => setActivePeriod(period)}
                style={[styles.pill, selected && styles.pillSelected]}
              >
                <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                  {period}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Estimated Net card */}
        <View style={[styles.card, shadow.card]}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardLabel}>ESTIMATED NET</Text>
            <Ionicons name="wallet-outline" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.netValue}>₦{estimatedNet.toLocaleString()}</Text>
        </View>

        {/* Total Sales card */}
        <View style={[styles.card, shadow.card, styles.smallCard]}>
          <View style={styles.smallCardRow}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="cash-outline" size={16} color={colors.primary} />
            </View>
            <Text style={styles.smallCardLabel}>TOTAL SALES</Text>
          </View>
          <Text style={styles.smallCardValue}>₦{totalSales.toLocaleString()}</Text>
        </View>

        {/* Total Expenses card */}
        <View style={[styles.card, shadow.card, styles.smallCard]}>
          <View style={styles.smallCardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FBE7EC' }]}>
              <Ionicons name="cart-outline" size={16} color={colors.danger} />
            </View>
            <Text style={styles.smallCardLabel}>TOTAL EXPENSES</Text>
          </View>
          <Text style={[styles.smallCardValue, { color: colors.danger }]}>
            ₦{totalExpenses.toLocaleString()}
          </Text>
        </View>

        {/* Sales performance chart */}
        <View style={[styles.card, shadow.card]}>
          <View style={styles.chartHeaderRow}>
            <View>
              <Text style={styles.chartTitle}>Sales Performance</Text>
              <Text style={styles.chartSubtitle}>Last 7 days</Text>
            </View>
            <View style={styles.avgBadge}>
              <Text style={styles.avgBadgeText}>DAILY AVG: ₦{Math.round(dailyAvg / 1000)}K</Text>
            </View>
          </View>
          <SalesBarChart data={chartData} />
        </View>

        {/* Quick Insights */}
        <Text style={styles.sectionTitle}>Quick Insights</Text>

        <View style={[styles.insightRow, shadow.card]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="trophy-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.insightTextWrap}>
            <Text style={styles.insightTitle}>Best Sales Day</Text>
            <Text style={styles.insightSubtitle}>Consistent peak this period</Text>
          </View>
          <Text style={styles.insightValue}>{bestSalesDay}</Text>
        </View>

        <View style={[styles.insightRow, shadow.card]}>
          <View style={[styles.iconCircle, { backgroundColor: '#FBE7EC' }]}>
            <Ionicons name="pricetag-outline" size={18} color={colors.danger} />
          </View>
          <View style={styles.insightTextWrap}>
            <Text style={styles.insightTitle}>Highest Expense</Text>
            <Text style={styles.insightSubtitle}>
              {highestExpense ? (highestExpense.category || highestExpense.description) : 'No expenses yet'}
            </Text>
          </View>
          <Text style={[styles.insightValue, { color: colors.danger }]}>
            {highestExpense ? `₦${highestExpense.amount.toLocaleString()}` : '—'}
          </Text>
        </View>

        <View style={[styles.insightRow, shadow.card]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.inputBackground }]}>
            <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.insightTextWrap}>
            <Text style={styles.insightTitle}>Top Payment Method</Text>
            <Text style={styles.insightSubtitle}>Most used by customers</Text>
          </View>
          <Text style={styles.insightValue}>{topPaymentMethod}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { ...typography.h1, color: colors.textPrimary },
  filterIconWrap: {
    width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: colors.inputBackground, justifyContent: 'center', alignItems: 'center',
  },
  pillRow: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.md },
  pill: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.inputBackground },
  pillSelected: { backgroundColor: colors.primary },
  pillText: { ...typography.bodyBold, color: colors.textPrimary },
  pillTextSelected: { color: colors.textInverse },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { ...typography.label, color: colors.textSecondary },
  netValue: { fontSize: 30, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },
  smallCard: { paddingVertical: spacing.md },
  smallCardRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  smallCardLabel: { ...typography.label, color: colors.textSecondary },
  smallCardValue: { ...typography.h2, color: colors.textPrimary },
  iconCircle: { width: 32, height: 32, borderRadius: radius.pill, justifyContent: 'center', alignItems: 'center' },
  chartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  chartTitle: { ...typography.bodyBold, color: colors.textPrimary },
  chartSubtitle: { ...typography.small, color: colors.textSecondary },
  avgBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.sm },
  avgBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  sectionTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.xs },
  insightRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.md,
  },
  insightTextWrap: { flex: 1 },
  insightTitle: { ...typography.bodyBold, color: colors.textPrimary },
  insightSubtitle: { ...typography.small, color: colors.textSecondary },
  insightValue: { ...typography.bodyBold, color: colors.primary },
});