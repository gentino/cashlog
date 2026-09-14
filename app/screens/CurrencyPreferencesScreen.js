import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import { useBusiness } from '../context/BusinessContext';

export default function CurrencyPreferencesScreen({ navigation }) {
  const { business, setCurrency, currencyOptions } = useBusiness();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Currency Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={currencyOptions}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const selected = item.code === business.currency;
          return (
            <Pressable
              style={[styles.row, shadow.card, selected && styles.rowSelected]}
              onPress={() => setCurrency(item.code)}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <View>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.code}>{item.code}</Text>
                </View>
              </View>
              {selected && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </Pressable>
          );
        }}
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
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
  },
  rowSelected: { borderWidth: 1.5, borderColor: colors.primary },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  symbol: { fontSize: 22, fontWeight: '700', color: colors.primary, width: 30 },
  label: { ...typography.bodyBold, color: colors.textPrimary },
  code: { ...typography.small, color: colors.textSecondary },
});