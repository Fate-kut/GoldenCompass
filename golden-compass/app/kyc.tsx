import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts } from '@/constants/theme';
import { GoldButton, MonoText, DisplayText, Card, ScreenHeader } from '@/components/ui';
import { useStore } from '@/store';

const TOTAL_STEPS = 3;

export default function KYCScreen() {
  const router = useRouter();
  const { currentUser, addAuditLog } = useStore();
  const [step, setStep] = useState(1);

  // Step 1
  const [nationalId, setNationalId] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  // Step 2
  const [employment, setEmployment] = useState('Employed');
  const [sourceOfFunds, setSourceOfFunds] = useState('Salary / Employment');
  const [annualIncome, setAnnualIncome] = useState('500K–1M');

  // Step 3
  const [consented, setConsented] = useState(false);

  const nextStep = () => {
    if (step === 1 && (!nationalId || !address)) { Alert.alert('Required', 'Fill in your National ID and address'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(s => s + 1);
  };

  const submit = () => {
    if (!consented) { Alert.alert('Consent Required', 'Please read and accept the risk disclosure'); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addAuditLog('KYC_SUBMITTED', 'user', currentUser?.id || '', currentUser?.email || '');
    Alert.alert('✅ KYC Submitted!', 'Your application is under review. We\'ll notify you within 24 hours.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title="KYC Verification" onBack={() => step > 1 ? setStep(s => s - 1) : router.back()} />

        {/* Step Indicators */}
        <View style={styles.stepRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                i < step - 1 && styles.stepDone,
                i === step - 1 && styles.stepActive,
              ]}
            />
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* ── Step 1: Identity ── */}
          {step === 1 && (
            <>
              <Card style={styles.stepCard}>
                <DisplayText style={{ fontSize: 16, marginBottom: 4 }}>Personal Information</DisplayText>
                <MonoText style={styles.stepSubtitle}>Step 1 of 3 — Identity Verification</MonoText>
              </Card>
              <StepInput label="National ID Number" value={nationalId} onChangeText={setNationalId} placeholder="e.g. 12345678" keyboardType="numeric" />
              <StepInput label="Date of Birth" value={dob} onChangeText={setDob} placeholder="DD/MM/YYYY" />
              <StepInput label="Residential Address" value={address} onChangeText={setAddress} placeholder="e.g. Westlands, Nairobi" />
              <GoldButton title="Continue →" onPress={nextStep} />
            </>
          )}

          {/* ── Step 2: Source of Funds ── */}
          {step === 2 && (
            <>
              <Card style={styles.stepCard}>
                <DisplayText style={{ fontSize: 16, marginBottom: 4 }}>Source of Funds</DisplayText>
                <MonoText style={styles.stepSubtitle}>Step 2 of 3 — AML Compliance (CBKA)</MonoText>
              </Card>
              <StepPicker label="Employment Status" value={employment} options={['Employed', 'Self-Employed', 'Business Owner', 'Retired', 'Student']} onChange={setEmployment} />
              <StepPicker label="Source of Investment Funds" value={sourceOfFunds} options={['Salary / Employment', 'Business Income', 'Savings', 'Investment Returns', 'Gift / Inheritance']} onChange={setSourceOfFunds} />
              <StepPicker label="Estimated Annual Income (KES)" value={annualIncome} options={['Below 500,000', '500K–1M', '1M–3M', '3M–10M', 'Above 10M']} onChange={setAnnualIncome} />
              <GoldButton title="Continue →" onPress={nextStep} />
            </>
          )}

          {/* ── Step 3: Risk Disclosure ── */}
          {step === 3 && (
            <>
              <Card style={styles.stepCard}>
                <DisplayText style={{ fontSize: 16, marginBottom: 4 }}>Risk Disclosure</DisplayText>
                <MonoText style={styles.stepSubtitle}>Step 3 of 3 — Consent & Agreement</MonoText>
              </Card>
              <Card style={styles.disclosureCard}>
                <MonoText style={{ fontSize: 11, color: Colors.gold, letterSpacing: 1, marginBottom: 12 }}>⚠️  IMPORTANT RISK DISCLOSURE</MonoText>
                <Text style={styles.disclosureText}>
                  Investments in Golden Compass pools involve market risk. Past performance does not guarantee future returns. The Net Asset Value (NAV) of units may go up or down. You may receive less than your invested capital.{'\n\n'}
                  Golden Compass operates within a CMA (Capital Markets Authority) licensed structure. All investor funds are held in segregated custody accounts separate from the company's operational funds.{'\n\n'}
                  Exit fees apply to redemptions within the holding period. Please review each pool's terms before investing.{'\n\n'}
                  This platform is regulated under the Capital Markets Authority (Kenya) Act and complies with Central Bank of Kenya (CBK) M-Pesa payment guidelines.
                </Text>
              </Card>
              <TouchableOpacity onPress={() => setConsented(!consented)} style={styles.consentRow} activeOpacity={0.8}>
                <View style={[styles.checkbox, consented && styles.checkboxChecked]}>
                  {consented && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.consentText}>
                  I have read, understood, and accept the risk disclosure. I consent to KYC verification and agree to the terms of service.
                </Text>
              </TouchableOpacity>
              <GoldButton title="✅  Submit KYC Application" onPress={submit} disabled={!consented} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StepInput({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 16 }}>
      <MonoText style={{ fontSize: 10, color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>{label}</MonoText>
      <TextInput
        style={{ backgroundColor: 'rgba(10,14,26,0.8)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, color: Colors.textPrimary, fontSize: 16 }}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        {...props}
      />
    </View>
  );
}

function StepPicker({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <MonoText style={{ fontSize: 10, color: Colors.textSecondary, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>{label}</MonoText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: opt === value ? Colors.gold : Colors.border,
              backgroundColor: opt === value ? 'rgba(201,168,76,0.1)' : 'transparent',
            }}
          >
            <MonoText style={{ fontSize: 11, color: opt === value ? Colors.gold : Colors.textMuted }}>{opt}</MonoText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  stepDot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: Colors.navyLight },
  stepActive: { backgroundColor: Colors.goldLight },
  stepDone: { backgroundColor: Colors.gold },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  stepCard: { marginHorizontal: 0, marginBottom: 20 },
  stepSubtitle: { fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5 },
  disclosureCard: { marginHorizontal: 0, marginBottom: 16, backgroundColor: 'rgba(10,14,26,0.8)' },
  disclosureText: { color: Colors.textSecondary, fontSize: 13, lineHeight: 22 },
  consentRow: { flexDirection: 'row', gap: 14, marginBottom: 20, padding: 16, backgroundColor: Colors.cardBg, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, alignItems: 'flex-start' },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  checkboxChecked: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  checkmark: { color: Colors.navy, fontSize: 14, fontWeight: '700' },
  consentText: { flex: 1, color: Colors.textSecondary, fontSize: 13, lineHeight: 20 },
});
