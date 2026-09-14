import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import Button from '../components/Button/Button';
import Header from '../components/Header/Header';
import TransactionItem from '../components/TransactionItem/TransactionItem';
import { useTransactions } from '../context/TransactionsContext';
import EmptyState from '../components/EmptyState/EmptyState';


export default function DashboardScreen({ navigation }) {
  const { todaysTransactions, totalSales, totalExpenses, estimatedNet } = useTransactions();


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Header title="Dashboard"  navigation={navigation} />


        {/* Greeting */}
        <Text style={styles.greeting}>Good Morning, {'Miracle'} 👋</Text>
        <Text style={styles.date}>{'date'}</Text>

        {/* Today's Business card */}
        <View style={[styles.card, shadow.card]}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>TODAY'S BUSINESS</Text>
            <View style={styles.trendIcon}>
              <Ionicons name="trending-up" size={16} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.netLabel}>Estimated Net</Text>
          <Text style={styles.netValue}>₦{estimatedNet.toLocaleString()}</Text>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View>
              <View style={styles.statLabelRow}>
                <Ionicons name="arrow-down" size={14} color={colors.primary} />
                <Text style={styles.statLabel}>Total Sales</Text>
              </View>
              <Text style={styles.statValue}>₦{totalSales.toLocaleString()}</Text>
            </View>
            <View>
              <View style={styles.statLabelRow}>
                <Ionicons name="arrow-up" size={14} color={colors.danger} />
                <Text style={styles.statLabel}>Total Expenses</Text>
              </View>
              <Text style={styles.statValue}>₦{totalExpenses.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <Button
            label="Add Sale"
            variant="primary"
            icon={<Ionicons name="add" size={16} color={colors.textInverse} />}
            onPress={() => navigation.navigate('AddSale')}
            style={{ flex: 1 }}
          />
          <Button
            label="Add Expense"
            variant="outline"
            icon={<Ionicons name="remove" size={16} color={colors.primary} />}
            onPress={() => navigation.navigate('AddExpense')}
            style={{ flex: 1 }}
          />
        </View>

        {/* Today's Activity */}
       <View style={[styles.card, shadow.card]}>
        {todaysTransactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No activity yet today"
            subtitle="Tap Add Sale or Add Expense to get started."
          />
        ) : (
          todaysTransactions.map((tx) => (
            <TransactionItem key={tx.id} {...tx} />
          ))
        )}
      </View>

        <View style={[styles.card, shadow.card]}>
          {todaysTransactions.map((tx) => (
  <TransactionItem key={tx.id} {...tx} />
))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  headerTitle: { ...typography.h2, color: colors.primary, marginTop: -3 },
  profileIcon: {
    width: 36, height: 36, borderRadius: radius.pill,
    backgroundColor: colors.inputBackground, justifyContent: 'center', alignItems: 'center',
  },
  greeting: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.sm },
  date: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  card: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { ...typography.label, color: colors.textSecondary },
  trendIcon: {
    width: 28, height: 28, borderRadius: radius.pill,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  netLabel: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  netValue: { fontSize: 34, fontWeight: '700', color: colors.primary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statLabel: { ...typography.small, color: colors.textSecondary },
  statValue: { ...typography.h3, color: colors.textPrimary, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  viewAll: { ...typography.small, color: colors.primary, fontWeight: '600' },
});