import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../constants/theme';

export default function TransactionActionsModal({ visible, transaction, onClose, onEdit, onDelete }) {
  if (!transaction) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title} numberOfLines={1}>{transaction.description}</Text>

          <Pressable style={styles.actionRow} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>

          <Pressable style={styles.actionRow} onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={[styles.actionText, { color: colors.danger }]}>Delete</Text>
          </Pressable>

          <Pressable style={styles.cancelRow} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
    padding: spacing.md, paddingBottom: spacing.xl,
  },
  title: { ...typography.bodyBold, color: colors.textSecondary, marginBottom: spacing.md, textAlign: 'center' },
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  actionText: { ...typography.body, color: colors.textPrimary },
  cancelRow: { paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.xs },
  cancelText: { ...typography.bodyBold, color: colors.textSecondary },
});