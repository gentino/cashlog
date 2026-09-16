import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import Button from '../components/Button/Button';
import  logo from '../assets/image/logo.png'
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [businessName, setBusinessName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleCreateAccount = () => {
  //   if (!businessName || !emailOrPhone || !password) {
  //     setError('Please fill in all fields.');
  //     return;
  //   }
  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match.');
  //     return;
  //   }
  //   setError('');
  //   // TODO: replace with real Django registration call once backend is ready
  //   console.log('New account:', { businessName, emailOrPhone, password });
  //   navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  // };

  const handleCreateAccount = async () => {
  if (!businessName || !emailOrPhone || !password) {
    setError('Please fill in all fields.');
    return;
  }
  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  setError('');
  setIsSubmitting(true);

  try {
    await register({ businessName, emailOrPhone, password });
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  } catch (err) {
    const apiErrors = err.response?.data;
    if (apiErrors?.email_or_phone) {
      setError(apiErrors.email_or_phone[0]);
    } else if (apiErrors?.password) {
      setError(apiErrors.password[0]);
    } else {
      setError('Something went wrong. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.iconCircle}>
                      <Image
                      source={logo}
                      style={styles.illustrationImage}
                    />   
          </View>
          
          <Text style={styles.tagline}>Create your account to get started.</Text>

          <View style={[styles.card, shadow.card]}>
            <Text style={styles.welcomeText}>Create Account</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="storefront-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Business name"
                placeholderTextColor={colors.textSecondary}
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email or phone number"
                placeholderTextColor={colors.textSecondary}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
              />
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons
                  name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!passwordVisible}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* <Button label="Create Account" onPress={handleCreateAccount} style={{ marginTop: spacing.sm }} /> */}
            <Button label="Create Account" onPress={handleCreateAccount} loading={isSubmitting} disabled={isSubmitting} style={{ marginTop: spacing.sm }} />
          </View>

          <Pressable style={styles.loginLinkWrap} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Log In</Text>
            </Text>
          </Pressable>

          <View style={styles.secureRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.secureText}>Secure 256-bit Encryption</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, justifyContent: 'center' },
  header: { position: 'absolute', top: spacing.md, left: spacing.lg },
  iconCircle: {
    width: 60, height: 60, borderRadius: radius.md, backgroundColor: colors.card,
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: spacing.sm, marginTop: spacing.xl,overflow: 'hidden'
  },
  tagline: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg },
  welcomeText: { ...typography.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground,
    borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.sm,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, ...typography.body, color: colors.textPrimary,outlineStyle: 'none', },
  errorText: { ...typography.small, color: colors.danger, marginBottom: spacing.sm },
  loginLinkWrap: { alignSelf: 'center', marginTop: spacing.md },
  loginLinkText: { ...typography.body, color: colors.textSecondary },
  loginLinkBold: { color: colors.primary, fontWeight: '700' },
  secureRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  secureText: { ...typography.small, color: colors.textSecondary },
  illustrationImage: { width: '100%', height: '100%' },
});