import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import Button from '../components/Button/Button';

const FEATURES = [
  {
    icon: 'trending-up',
    iconBg: '#E6F2EC',
    iconColor: colors.primary,
    title: 'Track daily sales',
    subtitle: 'Log income quickly and easily.',
  },
  {
    icon: 'receipt-outline',
    iconBg: '#FBE7EC',
    iconColor: colors.danger,
    title: 'Record expenses',
    subtitle: 'Keep tabs on where money goes.',
  },
  {
    icon: 'wallet-outline',
    iconBg: '#E5EEFB',
    iconColor: '#2563EB',
    title: 'Know your profit',
    subtitle: 'See clear daily balances instantly.',
  },
];

export default function HowItWorksScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.heroCard, shadow.card]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500' }}
            style={styles.heroImage}
          />
        </View>

        <Text style={styles.headline}>Simplify Your Business</Text>
        <Text style={styles.subtext}>
          Everything you need to track your daily financial health in one simple view.
        </Text>

        <View style={[styles.featuresCard, shadow.card]}>
          {FEATURES.map((f, i) => (
            <View key={f.title} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureBorder]}>
              <View style={[styles.iconCircle, { backgroundColor: f.iconBg }]}>
                <Ionicons name={f.icon} size={18} color={f.iconColor} />
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureSubtitle}>{f.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Get Started"
          icon={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, alignItems: 'center' },
  heroCard: { width: '100%', aspectRatio: 1.4, borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.lg },
  heroImage: { width: '100%', height: '100%' },
  headline: { ...typography.h1, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.xs },
  subtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  featuresCard: { width: '100%', backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  featureBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconCircle: { width: 36, height: 36, borderRadius: radius.pill, justifyContent: 'center', alignItems: 'center' },
  featureTextWrap: { flex: 1 },
  featureTitle: { ...typography.bodyBold, color: colors.textPrimary },
  featureSubtitle: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  footer: { padding: spacing.md },
});