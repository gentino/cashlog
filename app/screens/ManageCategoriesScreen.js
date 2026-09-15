import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import { useCategories } from '../context/CategoriesContext';

export default function ManageCategoriesScreen({ navigation }) {
  const { categories, addCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const success = addCategory(newCategory);
    if (!success) {
      setError(newCategory.trim() ? 'That category already exists.' : 'Enter a category name.');
      return;
    }
    setError('');
    setNewCategory('');
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.categoryRow, shadow.card]}>
            <Text style={styles.categoryText}>{item}</Text>
            <Pressable onPress={() => deleteCategory(item)}>
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
  addRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.xs },
  input: {
    flex: 1, backgroundColor: colors.inputBackground, borderRadius: radius.md,
    padding: spacing.md, ...typography.body, color: colors.textPrimary,
  },
  addButton: {
    width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  errorText: { ...typography.small, color: colors.danger, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  categoryRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm,
  },
  categoryText: { ...typography.body, color: colors.textPrimary },
});