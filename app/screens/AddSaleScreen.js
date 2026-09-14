import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../constants/theme';
import Button from '../components/Button/Button';
import { useTransactions } from '../context/TransactionsContext';



const PAYMENT_METHODS = ['Cash', 'Transfer', 'POS', 'Other'];
export default function AddSaleScreen({ navigation }) {

  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
  const newErrors = {};
  const numericAmount = parseFloat(amount);

  if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
    newErrors.amount = 'Enter an amount greater than ₦0.';
  }
  if (!description.trim()) {
    newErrors.description = 'Description is required.';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


const handleSave = () => {
  if (!validate()) return;

  setIsSaving(true);

  // Simulated delay - replace with a real await fetch/axios call once Django is connected
  setTimeout(() => {
    addTransaction({
      type: 'sale',
      amount: parseFloat(amount) || 0,
      description,
      paymentMethod,
      note,
    });
    setIsSaving(false);
    navigation.goBack();
  }, 600);
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
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Add New Sale</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.content}>
          {/* Amount */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Sale Amount</Text>
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
            {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
          </View>

          {/* Description */}
          <Text style={styles.fieldLabel}>Description / Item</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Hair Treatment"
            placeholderTextColor={colors.textSecondary}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

          {/* Payment method */}
          <Text style={styles.fieldLabel}>Payment Method</Text>
          <View style={styles.pillRow}>
            {PAYMENT_METHODS.map((method) => {
              const selected = method === paymentMethod;
              return (
                <Pressable
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  style={[styles.pill, selected && styles.pillSelected]}
                >
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                    {method}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Optional note */}
          <Text style={styles.fieldLabel}>Optional Note</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="Add any details here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Save button pinned to bottom */}
        <View style={styles.footer}>
          <Button 
          label={isSaving ? 'Saving...' : 'Save Sale'}  
          onPress={handleSave}
          disabled={isSaving}
          />
        </View>

        
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
  amountBox: {
    backgroundColor: colors.inputBackground, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg,
  },
  amountLabel: { ...typography.small, color: colors.textSecondary, marginBottom: spacing.xs },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  currencySymbol: { fontSize: 28, color: colors.primary, fontWeight: '700', marginRight: 6 },
  amountInput: { 
    fontSize: 34, 
    fontWeight: '700', 
    color: colors.primary, 
    width:'100%',
    outlineStyle: 'none',
    maxWidth:'100%',
    textAlign: 'center',
    borderWidth: 0,
   },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.inputBackground, 
    borderRadius: radius.md,
    padding: spacing.md, ...typography.body,
    color: colors.textPrimary, 
    marginBottom: spacing.md,
  },
  noteInput: { minHeight: 90 },
  pillRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  pill: {
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: radius.pill, backgroundColor: colors.inputBackground,
  },
  pillSelected: { backgroundColor: colors.primary },
  pillText: { ...typography.bodyBold, color: colors.textPrimary },
  pillTextSelected: { color: colors.textInverse },
  footer: { padding: spacing.md },
  errorText: { ...typography.small, color: colors.danger, marginTop: -8, marginBottom: spacing.sm },
});