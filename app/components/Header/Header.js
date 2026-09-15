
import { View, Text, StyleSheet,Pressable, Image } from 'react-native';
import { colors, spacing, radius, typography } from '../../constants/theme';
import  logo from '../../assets/image/logo.png'
import { useBusiness } from '../../context/BusinessContext';

// variant: 'primary' (filled green) | 'outline' (green border, transparent fill)
export default function Header({title,navigation}) {

  const {business} = useBusiness()


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
            {/* <Ionicons name="person" size={18} color={colors.textSecondary} /> */}
            <Image
                source={typeof business.photoUrl === 'string' ? { uri: business.photoUrl } : business.photoUrl}
                style={styles.avatar}
              />
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

  },
  avatar: {
    width:36,
    height:36,
    borderRadius: radius.pill

  } 

})