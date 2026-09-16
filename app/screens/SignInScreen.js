import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import Button from '../components/Button/Button';
import  logo from '../assets/image/logo.png'
import { useAuth } from '../context/AuthContext';


export default function SignInScreen({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();

  // const handleLogin = () => {
  //   // TODO: replace with real Django auth call once backend is ready
  //   console.log('Login attempt:', { emailOrPhone, password });
  //   navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  // };


const [errorMessage, setErrorMessage] = useState('');

const [isLoggingIn, setIsLoggingIn] =useState(false)

const handleLogin = async () => {
  if (!emailOrPhone || !password) {
    setErrorMessage('Please enter your email/phone and password.');
    return;
  }

  setErrorMessage('');
  setIsLoggingIn(true);

  try {
    await login({ emailOrPhone, password });
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  } catch (error) {
    const message = error.response?.data?.error || 'Login failed. Please try again.';
    setErrorMessage(message);
  } finally {
    setIsLoggingIn(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Image
            source={logo}
            style={styles.illustrationImage}
          />   
           </View>
         

          <View style={[styles.card, shadow.card]}>
            <Text style={styles.welcomeText}>Welcome Back</Text>

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

            <Pressable style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <Button label="Login" onPress={handleLogin} style={{ marginTop: spacing.sm }} />
            <Button
              label="Create Account"
              variant="outline"
              onPress={() => navigation.navigate('SignUp')}
              style={{ marginTop: spacing.sm }}
            />
          </View>

          <View style={styles.secureRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.secureText}>Secure 256-bit Encryption</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  iconCircle: {
    width: 60, height: 60, borderRadius: radius.lg, backgroundColor: colors.card,
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: spacing.lg,overflow: 'hidden'
  },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg },
  welcomeText: { ...typography.h2, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.md },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground,
    borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.sm,
  },
  inputIcon: { marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, ...typography.body, color: colors.textPrimary,outlineStyle: 'none',},
  forgotWrap: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  forgotText: { ...typography.small, color: colors.primary, fontWeight: '600' },
  secureRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: spacing.lg },
  secureText: { ...typography.small, color: colors.textSecondary },
  illustrationImage: { width: '100%', height: '100%' },
  errorText: { ...typography.small, color: colors.danger, marginBottom: spacing.sm, textAlign: 'center' },

});