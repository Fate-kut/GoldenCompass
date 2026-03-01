import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts } from '@/constants/theme';
import { Card, Tag, MonoText, DisplayText, Divider, Toggle, GoldButton } from '@/components/ui';
import { useStore } from '@/store';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, investments, logout } = useStore();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [twoFAOn, setTwoFAOn] = useState(false);
  const [biometricOn, setBiometricOn] = useState(false);

  const totalValue = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalInvested = investments.reduce((s, i) => s + i.investedAmount, 0);
  const totalReturns = totalValue - totalInvested;

  const handleLogout = () => {
    Alert.alert('Leave the Ship?', 'Are you sure you want to sign out?', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

          {/* Profile Header */}
          <LinearGradient colors={['#0F1520', '#1A2235']} style={styles.profileHeader}>
            <LinearGradient colors={[Colors.goldDark, Colors.gold]} style={styles.bigAvatar}>
              <Text style={styles.avatarText}>{currentUser?.avatar}</Text>
            </LinearGradient>
            <DisplayText style={styles.userName}>{currentUser?.fullName}</DisplayText>
            <MonoText style={styles.userEmail}>{currentUser?.email}</MonoText>
            <View style={styles.tagRow}>
              <Tag label={currentUser?.kycStatus === 'approved' ? 'KYC Verified' : 'KYC Pending'} variant={currentUser?.kycStatus === 'approved' ? 'success' : 'warning'} />
              <Tag label={currentUser?.role || 'investor'} variant="gold" />
            </View>
          </LinearGradient>

          {/* Portfolio Stats */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Total Invested', value: `KSh ${totalInvested.toLocaleString()}`, color: Colors.textPrimary },
              { label: 'Total Returns', value: `+${totalReturns.toLocaleString()}`, color: Colors.success },
              { label: 'Risk Level', value: 'Moderate', color: Colors.gold },
              { label: 'Member Since', value: 'Jan 2025', color: Colors.teal },
            ].map(({ label, value, color }) => (
              <Card key={label} style={styles.statCard}>
                <MonoText style={styles.statLabel}>{label}</MonoText>
                <Text style={[styles.statValue, { color }]}>{value}</Text>
              </Card>
            ))}
          </View>

          {/* KYC Status */}
          <Card style={styles.section}>
            <MonoText style={styles.sectionTitle}>KYC Verification</MonoText>
            {[
              { label: 'National ID', done: currentUser?.kycStatus === 'approved' },
              { label: 'Phone Verification', done: true },
              { label: 'Source of Funds', done: currentUser?.kycStatus === 'approved' },
              { label: 'Risk Disclosure', done: true },
            ].map(({ label, done }) => (
              <View key={label} style={styles.kycRow}>
                <Text style={styles.kycIcon}>{done ? '✅' : '⏳'}</Text>
                <Text style={[styles.kycLabel, { color: done ? Colors.textPrimary : Colors.textMuted }]}>{label}</Text>
                <Tag label={done ? 'Done' : 'Pending'} variant={done ? 'success' : 'warning'} />
              </View>
            ))}
            {currentUser?.kycStatus !== 'approved' && (
              <GoldButton title="Complete KYC" onPress={() => router.push('/kyc')} style={{ marginTop: 12 }} />
            )}
          </Card>

          {/* Settings */}
          <Card style={styles.section}>
            <MonoText style={styles.sectionTitle}>Security & Preferences</MonoText>
            {[
              { label: 'Push Notifications', desc: 'NAV updates & transaction alerts', value: notificationsOn, toggle: () => setNotificationsOn(!notificationsOn) },
              { label: 'Two-Factor Auth', desc: 'Extra account security via SMS', value: twoFAOn, toggle: () => setTwoFAOn(!twoFAOn) },
              { label: 'Biometric Login', desc: 'Face ID / fingerprint unlock', value: biometricOn, toggle: () => setBiometricOn(!biometricOn) },
            ].map(({ label, desc, value, toggle }) => (
              <View key={label} style={styles.settingsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingsLabel}>{label}</Text>
                  <MonoText style={styles.settingsDesc}>{desc}</MonoText>
                </View>
                <Toggle value={value} onToggle={toggle} />
              </View>
            ))}
          </Card>

          {/* Legal / Links */}
          <Card style={styles.section}>
            <MonoText style={styles.sectionTitle}>Account & Legal</MonoText>
            {[
              { label: '📋  Risk Disclosures', onPress: () => Alert.alert('Risk Disclosure', 'You accepted on Jan 15, 2025. Investments carry capital risk. Past returns do not guarantee future performance.') },
              { label: '🔒  Privacy Policy', onPress: () => Alert.alert('Privacy Policy', 'Your data is protected per Kenya Data Protection Act 2019 and our CMA-approved data governance policy.') },
              { label: '📞  Customer Support', onPress: () => Alert.alert('Support', 'Email: support@goldencompass.co.ke\nPhone: +254 700 COMPASS') },
              { label: '📊  Download Statement', onPress: () => Alert.alert('Statement', 'Your portfolio statement is being generated and will be sent to your email.') },
            ].map(({ label, onPress }) => (
              <TouchableOpacity key={label} onPress={onPress} style={styles.linkRow}>
                <Text style={styles.linkLabel}>{label}</Text>
                <Text style={{ color: Colors.gold, fontSize: 18 }}>›</Text>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Logout */}
          <View style={{ paddingHorizontal: 20 }}>
            <GoldButton title="⚓  Leave the Ship" onPress={handleLogout} variant="danger" />
          </View>

          <MonoText style={styles.footer}>Golden Compass v1.0 MVP · CMA Licensed Structure · CBK Compliant</MonoText>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  profileHeader: { padding: 30, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 16 },
  bigAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 3, borderColor: Colors.gold },
  avatarText: { fontFamily: Fonts.display, fontSize: 28, color: Colors.navy },
  userName: { fontSize: 22, marginBottom: 4 },
  userEmail: { fontSize: 12, color: Colors.textMuted, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10, marginBottom: 0 },
  statCard: { width: '47%', padding: 16, marginBottom: 0 },
  statLabel: { fontSize: 9, color: Colors.textMuted, marginBottom: 6, letterSpacing: 0.5 },
  statValue: { fontSize: 15, fontFamily: Fonts.mono },
  section: { marginHorizontal: 20 },
  sectionTitle: { fontSize: 10, color: Colors.gold, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 16 },
  kycRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.08)' },
  kycIcon: { fontSize: 18 },
  kycLabel: { flex: 1, fontSize: 15 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.08)' },
  settingsLabel: { fontSize: 15, color: Colors.textPrimary, marginBottom: 3 },
  settingsDesc: { fontSize: 10, color: Colors.textMuted },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.08)' },
  linkLabel: { fontSize: 15, color: Colors.textPrimary },
  footer: { textAlign: 'center', fontSize: 9, color: Colors.textMuted, marginTop: 24, marginHorizontal: 20, lineHeight: 16 },
});
