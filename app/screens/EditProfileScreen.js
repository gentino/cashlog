import { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';
import { useBusiness } from '../context/BusinessContext';
import Button from '../components/Button/Button';

export default function EditProfileScreen({ navigation }) {
  const { business, updateBusiness, setCurrency, currencyOptions } = useBusiness();
  const [name, setName] = useState(business.name);
  const [photoUrl, setPhotoUrl] = useState(business.photoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to change your profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Business name cannot be empty.');
      return;
    }
    setError('');
    setIsSaving(true);

    // Simulated delay - replace with a real API call (including image upload) once Django is connected
    setTimeout(() => {
      updateBusiness({ name: name.trim(),  photoUrl });
      setIsSaving(false);
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Photo picker */}
        <View style={styles.avatarWrap}>
          <Image
            source={typeof photoUrl === 'string' ? { uri: photoUrl } : photoUrl}
            style={styles.avatar}
            />
          <Pressable style={styles.editBadge} onPress={handlePickImage}>
            <Ionicons name="camera" size={14} color={colors.textInverse} />
          </Pressable>
        </View>
        <Pressable onPress={handlePickImage}>
          <Text style={styles.changePhotoText}>Change photo</Text>
        </Pressable>

        {/* Business info */}
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.fieldLabel}>BUSINESS NAME</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your business name"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={styles.fieldLabel}>PHONE OR EMAIL</Text>
            <View style={styles.lockedField}>
            <Text style={styles.lockedText}>{business.phone}</Text>
            <Ionicons name="lock-closed" size={16} color={colors.textSecondary} />
            </View>
            <Text style={styles.lockedHint}>Contact support to change your phone or email.</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Currency */}
        <Text style={styles.sectionLabel}>CURRENCY</Text>
        <View style={[styles.card, shadow.card]}>
          {currencyOptions.map((c, i) => {
            const selected = c.code === business.currency;
            return (
              <Pressable
                key={c.code}
                style={[styles.currencyRow, i < currencyOptions.length - 1 && styles.currencyBorder]}
                onPress={() => setCurrency(c.code)}
              >
                <View style={styles.currencyLeft}>
                  <Text style={styles.currencySymbol}>{c.symbol}</Text>
                  <Text style={styles.currencyLabel}>{c.label}</Text>
                </View>
                {selected && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
              </Pressable>
            );
          })}
        </View>

        <Button
          label="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
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
  content: { padding: spacing.md, alignItems: 'center' },
  avatarWrap: { marginTop: spacing.sm },
  avatar: { width: 90, height: 90, borderRadius: radius.pill, backgroundColor: colors.inputBackground },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: radius.pill,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  changePhotoText: { ...typography.small, color: colors.primary, fontWeight: '600', marginTop: spacing.xs, marginBottom: spacing.md },
  card: { width: '100%', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  fieldLabel: { ...typography.label, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.inputBackground, borderRadius: radius.md,
    padding: spacing.md, ...typography.body, color: colors.textPrimary, marginBottom: spacing.sm,
  },
  errorText: { ...typography.small, color: colors.danger },
  sectionLabel: { ...typography.label, color: colors.textSecondary, alignSelf: 'flex-start', marginBottom: spacing.xs },
  currencyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  currencyBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  currencyLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  currencySymbol: { fontSize: 18, fontWeight: '700', color: colors.primary, width: 24 },
  currencyLabel: { ...typography.body, color: colors.textPrimary },
  errorText: { ...typography.small, color: colors.danger },

  lockedField: {
  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  backgroundColor: colors.inputBackground, borderRadius: radius.md,
  padding: spacing.md, opacity: 0.7,
},
lockedText: { ...typography.body, color: colors.textSecondary },
lockedHint: { ...typography.small, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.sm },
});