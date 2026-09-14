
import { View, Text, StyleSheet,Pressable, Image } from 'react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import  logo from '../../assets/image/logo.png'

// variant: 'primary' (filled green) | 'outline' (green border, transparent fill)
export default function Header({title,navigation}) {


return (
        <View style={styles.header}>
          <Pressable>
            <Image
                        source={logo}
                        style={styles.illustrationImage}
                      />  
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
          <Pressable style={styles.profileIcon}
           onPress={()=>navigation.navigate('Profile')}
          >
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
  illustrationImage: {
    width:36,
    height:36,
    borderRadius: radius.pill

  }

})