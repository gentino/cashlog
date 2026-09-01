import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import Button from '../components/Button/Button';import { useTransactions } from '../context/TransactionsContext';

const PAYMENT_METHODS = ['Cash', 'Transfer'];
const CATEGORIES = ['Stock', 'Rent', 'Utilities', 'Transport', 'Salaries', 'Fuel', 'Other'];

export default function AddExpenseScreen({ navigation }) {const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [note, setNote] = useState('');

 const handleSave = () => {
  addTransaction({
    type: 'expense',
    amount: parseFloat(amount) || 0,
    description,
    category,
    paymentMethod,
    note,
  });
  navigation.goBack();
};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Add New Expense</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.content}>
          {/* Amount */}
          <Text style={styles.fieldLabel}>AMOUNT</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Description */}
          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Fuel for generator"
            placeholderTextColor={colors.textSecondary}
          />

          {/* Category dropdown */}
          <Text style={styles.fieldLabel}>EXPENSE CATEGORY</Text>
          <Pressable style={styles.dropdown} onPress={() => setCategoryModalVisible(true)}>
            <Text style={category ? styles.dropdownTextSelected : styles.dropdownText}>
              {category || 'Select category...'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
          </Pressable>

          {/* Payment method */}
          <Text style={styles.fieldLabel}>PAYMENT METHOD</Text>
          <View style={styles.pillRow}>
            {PAYMENT_METHODS.map((method) => {
              const selected = method === paymentMethod;
              return (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  style={[styles.methodBox, selected && styles.methodBoxSelected]}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {method}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Optional note */}
          <Text style={styles.fieldLabel}>OPTIONAL NOTE</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="Add any extra details here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Save button */}
        <View style={styles.footer}>
          <Button label="Save Expense" onPress={handleSave} style={{ backgroundColor: colors.danger }} />
        </View>

        {/* Category picker modal */}
        <Modal
          visible={categoryModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setCategoryModalVisible(false)}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                    {item === category && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
  },
  headerTitle: { ...typography.h3, color: colors.primary },
  content: { flex: 1, paddingHorizontal: spacing.md },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  amountRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground,
    borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
  },
  currencySymbol: { fontSize: 22, color: colors.danger, fontWeight: '700', marginRight: 8 },
  amountInput: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  input: {
    backgroundColor: colors.inputBackground, borderRadius: radius.md,
    padding: spacing.md, ...typography.body, color: colors.textPrimary,
  },
  noteInput: { minHeight: 90 },
  dropdown: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.inputBackground, borderRadius: radius.md, padding: spacing.md,
  },
  dropdownText: { ...typography.body, color: colors.textSecondary },
  dropdownTextSelected: { ...typography.body, color: colors.textPrimary },
  pillRow: { flexDirection: 'row', gap: spacing.sm },
  methodBox: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md,
    borderRadius: radius.md, backgroundColor: colors.inputBackground,
  },
  methodBoxSelected: { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.primary },
  pillText: { ...typography.bodyBold, color: colors.textPrimary },
  pillTextSelected: { color: colors.primary },
  footer: { padding: spacing.md },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
    padding: spacing.md, maxHeight: '60%',
  },
  modalTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: spacing.sm },
  modalItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalItemText: { ...typography.body, color: colors.textPrimary },
});