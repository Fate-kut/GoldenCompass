import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts } from '@/constants/theme';
import { GoldButton, DisplayText, MonoText } from '@/components/ui';
import { useStore } from '@/store';
import { CompassSVG } from '@/components/CompassSVG';

type Tab = 'investor' | 'register' | 'admin';

export default function LoginScreen() {
  const router = useRouter();
  const { login, adminLogin, register } = useStore();
  const [tab, setTab] = useState<Tab>('investor');
  const [loading, setLoading] = useState(false);

  // Investor login fields
  const [email, setEmail] = useState('demo@compass.co.ke');
  const [password, setPassword] = useState('password123');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');

  // Admin fields
  const [adminEmail, setAdminEmail] = useState('admin@compass.co.ke');
  const [adminPass, setAdminPass] = useState('admin123');

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Enter email and password'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/home');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Authentication Failed', 'Invalid email or password.\n\nDemo: demo@compass.co.ke / password123');
    }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPhone || !regPass) { Alert.alert('Error', 'Fill all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    register(regName, regEmail, regPhone, regPass);
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)/home');
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = adminLogin(adminEmail, adminPass);
    setLoading(false);
    if (ok) {
      router.replace('/(admin)/dashboard');
    } else {
      Alert.alert('Access Denied', 'Invalid admin credentials');
    }
  };

  return (
    <LinearGradient colors={[Colors.navy, '#0D1320', Colors.navy]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

            {/* Header */}
            <View style={styles.header}>
              <CompassSVG size={90} spin />
              <DisplayText style={styles.title}>Golden Compass</DisplayText>
              <Text style={styles.tagline}>Navigate Your Wealth</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
              {(['investor', 'register', 'admin'] as Tab[]).map(t => (
                <TouchableOpacity key={t} onPress={() => setTab(t)} style={[styles.tab, tab === t && styles.tabActive]}>
                  <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                    {t === 'investor' ? 'Sign In' : t === 'register' ? 'Register' : 'Admin'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Investor Login */}
            {tab === 'investor' && (
              <View style={styles.form}>
                <FormInput label="Email Address" value={email} onChangeText={setEmail} placeholder="captain@compass.co.ke" keyboardType="email-address" autoCapitalize="none" />
                <FormInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
                <GoldButton title="⚓  Set Sail" onPress={handleLogin} loading={loading} style={styles.submitBtn} />
              </View>
            )}

            {/* Register */}
            {tab === 'register' && (
              <View style={styles.form}>
                <FormInput label="Full Name" value={regName} onChangeText={setRegName} placeholder="James Mwangi" />
                <FormInput label="Email Address" value={regEmail} onChangeText={setRegEmail} placeholder="james@example.com" keyboardType="email-address" autoCapitalize="none" />
                <FormInput label="M-Pesa Phone" value={regPhone} onChangeText={setRegPhone} placeholder="+254 700 000 000" keyboardType="phone-pad" />
                <FormInput label="Password" value={regPass} onChangeText={setRegPass} placeholder="Min. 8 characters" secureTextEntry />
                <GoldButton title="⚓  Join the Crew" onPress={handleRegister} loading={loading} style={styles.submitBtn} />
              </View>
            )}

            {/* Admin */}
            {tab === 'admin' && (
              <View style={styles.form}>
                <View style={styles.adminBadge}>
                  <MonoText style={{ fontSize: 10, color: Colors.danger, letterSpacing: 1 }}>🔐  ADMIN ACCESS</MonoText>
                </View>
                <FormInput label="Admin Email" value={adminEmail} onChangeText={setAdminEmail} placeholder="admin@compass.co.ke" autoCapitalize="none" keyboardType="email-address" />
                <FormInput label="Password" value={adminPass} onChangeText={setAdminPass} placeholder="••••••••" secureTextEntry />
                <GoldButton title="🔐  Admin Entry" onPress={handleAdminLogin} loading={loading} style={styles.submitBtn} variant="danger" />
              </View>
            )}

            <MonoText style={styles.compliance}>
              CMA Licensed Structure · CBK Compliant Architecture
            </MonoText>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FormInput({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.inputGroup}>
      <MonoText style={styles.label}>{label}</MonoText>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 32 },
  title: { fontSize: 26, marginTop: 16, marginBottom: 6 },
  tagline: { fontFamily: 'serif', fontStyle: 'italic', color: Colors.textSecondary, fontSize: 15, letterSpacing: 2 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10,14,26,0.7)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: Colors.gold },
  tabText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5 },
  tabTextActive: { color: Colors.navy, fontFamily: Fonts.monoBold },
  form: { gap: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 10, letterSpacing: 1.2, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    backgroundColor: 'rgba(10,14,26,0.8)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  submitBtn: { marginTop: 8 },
  adminBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(192,57,43,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.3)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
  },
  compliance: { textAlign: 'center', fontSize: 10, color: Colors.textMuted, marginTop: 24, letterSpacing: 0.5 },
});
