
import { View, Text, StyleSheet,Pressable } from 'react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

// variant: 'primary' (filled green) | 'outline' (green border, transparent fill)
export default function Header({title}) {


return (
        <View style={styles.header}>
          <Pressable>
            <Ionicons name="menu" size={26} color={colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <Pressable style={styles.profileIcon}>
            <Ionicons name="person" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>
)
}


const styles = StyleSheet.create({

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  headerTitle: { ...typography.h2, color: colors.primary, marginTop: -3 },
  profileIcon: {
    width: 36, height: 36, borderRadius: radius.pill,
    backgroundColor: colors.inputBackground, justifyContent: 'center', alignItems: 'center',
  },

})