import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';

const initialCategories = ['Stock', 'Rent', 'Utilities', 'Transport', 'Salaries', 'Fuel', 'Other'];
export default function ManageCategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');

  const handleAdd = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory('');
  };

  const handleDelete = (category) => {
    setCategories((prev) => prev.filter((c) => c !== category));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Categories</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={newCategory}
          onChangeText={setNewCategory}
          placeholder="New category name"
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleAdd}
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={22} color={colors.textInverse} />
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.categoryRow, shadow.card]}>
            <Text style={styles.categoryText}>{item}</Text>
            <Pressable onPress={() => handleDelete(item)}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
        )}
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
  addRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  input: {
    flex: 1, backgroundColor: colors.inputBackground, borderRadius: radius.md,
    padding: spacing.md, ...typography.body, color: colors.textPrimary,
  },
  addButton: {
    width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  categoryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
  },
  categoryText: { ...typography.body, color: colors.textPrimary },
});