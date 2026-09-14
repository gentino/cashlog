import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import Button from '../components/Button/Button';
import  logo from '../assets/image/logo.png'

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration card - swap this URI for a local asset when you have one */}
        <View style={[styles.illustrationCard, shadow.card]}>
          <Image
            source={logo}
            style={styles.illustrationImage}
          />
        </View>

        <Text style={styles.appName}>E-CASHLOG</Text>
        <Text style={styles.tagline}>Know your sales. Track your cash.{'\n'}Understand your business.</Text>

        <View style={styles.buttonGroup}>
          <Button
            label="Get Started"
            variant="primary"
            onPress={() => navigation.navigate('HowItWorks')}
          />
          <Button
            label="Log In"
            variant="outline"
            onPress={() => navigation.navigate('SignIn')}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg },
  illustrationCard: {
    width: '20%', aspectRatio: 1, backgroundColor: colors.card,
    borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.lg,
  },
  illustrationImage: { width: '100%', height: '100%' },
  appName: { ...typography.h1, color: colors.primary, marginBottom: spacing.xs, textAlign: 'center' },
  tagline: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  buttonGroup: { width: '100%' },
});