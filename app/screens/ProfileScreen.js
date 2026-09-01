import { useState } from 'react';
import { View, Text, Image, Pressable, Switch, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography, shadow } from '../constants/theme';

// Static sample data for now - will come from Business Profile model / Django API later
const businessProfile = {
  name: 'Acme Corp',
  category: 'Retail & Services',
  phone: '+1 (555) 123-4567',
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
};

export default function ProfileScreen({ navigation }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          // TODO: clear auth token / session, then navigate to SignIn
          console.log('Logged out');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar + name */}
        <View style={styles.avatarWrap}>
          <Image source={{ uri: businessProfile.photoUrl }} style={styles.avatar} />
          <Pressable style={styles.editBadge}>
            <Ionicons name="pencil" size={12} color={colors.textInverse} />
          </Pressable>
        </View>
        <Text style={styles.businessName}>{businessProfile.name}</Text>
        <Text style={styles.businessCategory}>{businessProfile.category}</Text>

        {/* Business Info card */}
        <Text style={styles.sectionLabel}>BUSINESS INFO</Text>
        <View style={[styles.card, shadow.card]}>
          <InfoRow icon="storefront-outline" label="Business Name" value={businessProfile.name} />
          <Divider />
          <InfoRow icon="apps-outline" label="Category" value={businessProfile.category} />
          <Divider />
          <InfoRow icon="call-outline" label="Phone Number" value={businessProfile.phone} isLast />
        </View>

        {/* Settings card */}
        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <View style={[styles.card, shadow.card]}>
          <SettingRow icon="person-circle-outline" label="Edit Profile" />
          <Divider />
          <SettingRow icon="pricetag-outline" label="Manage Categories" />
          <Divider />
          <SettingRow icon="swap-horizontal-outline" label="Currency Preferences" />
          <Divider />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} style={styles.rowIcon} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textInverse}
            />
          </View>
        </View>

        {/* Account card */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={[styles.card, shadow.card]}>
          <Pressable style={styles.settingRow} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} style={styles.rowIcon} />
              <Text style={[styles.settingLabel, { color: colors.danger }]}>Logout</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value, isLast }) {
  return (
    <Pressable style={styles.infoRow}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function SettingRow({ icon, label }) {
  return (
    <Pressable style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color={colors.primary} style={styles.rowIcon} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl, alignItems: 'center' },
  avatarWrap: { marginTop: spacing.md },
  avatar: { width: 90, height: 90, borderRadius: radius.pill, backgroundColor: colors.inputBackground },
  editBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: radius.pill,
    backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  businessName: { ...typography.h2, color: colors.textPrimary, marginTop: spacing.sm },
  businessCategory: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  sectionLabel: {
    ...typography.label, color: colors.textSecondary, alignSelf: 'flex-start',
    marginTop: spacing.md, marginBottom: spacing.xs,
  },
  card: { width: '100%', backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  infoTextWrap: { flex: 1 },
  infoLabel: { ...typography.small, color: colors.textSecondary },
  infoValue: { ...typography.bodyBold, color: colors.textPrimary, marginTop: 2 },
  iconCircle: {
    width: 32, height: 32, borderRadius: radius.pill,
    backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center',
  },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  rowIcon: { marginRight: spacing.md },
  settingLabel: { ...typography.body, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border },
});