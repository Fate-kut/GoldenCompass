import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, POOLS } from '@/constants/theme';
import { Card, Tag, MiniBarChart, GoldButton, MonoText, DisplayText, ScreenHeader, Divider, NAVBadge } from '@/components/ui';
import { useStore } from '@/store';

export default function PoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { invest } = useStore();
  const pool = POOLS[id as keyof typeof POOLS];

  const [investModal, setInvestModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!pool) return null;

  const units = amount ? (parseFloat(amount) / pool.nav).toFixed(4) : '0.0000';
  const change7d = ((pool.nav - pool.navHistory[0]) / pool.navHistory[0] * 100).toFixed(2);

  const handleInvest = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt < 1000) { Alert.alert('Error', `Minimum investment is KSh ${pool.minInvestment.toLocaleString()}`); return; }
    setProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await invest(amt, pool.id);
      setInvestModal(false);
      setAmount('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('✅ Investment Confirmed', `${units} units in ${pool.name}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScreenHeader title={pool.name} onBack={() => router.back()} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 30 }}>

          {/* Hero */}
          <LinearGradient colors={['#0F1520', '#1A2235']} style={styles.hero}>
            <View style={styles.heroTop}>
              <Text style={styles.heroEmoji}>{pool.emoji}</Text>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.heroName}>{pool.name}</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Tag label={pool.type} variant={pool.type === 'Stable' ? 'teal' : 'gold'} />
                  <Tag label="Active" variant="success" />
                </View>
              </View>
            </View>
            <View style={styles.navRow}>
              <View>
                <MonoText style={styles.navLabel}>Current NAV</MonoText>
                <DisplayText style={styles.navValue}>KSh {pool.nav}</DisplayText>
              </View>
              <NAVBadge value={change7d} isPositive />
            </View>
          </LinearGradient>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Pool Size', value: `KSh ${(pool.totalValue / 1000000).toFixed(1)}M` },
              { label: 'Total Units', value: pool.totalUnits.toLocaleString() },
              { label: 'Investors', value: pool.investors.toLocaleString() },
              { label: 'YTD Return', value: `+${pool.returnYTD}%`, color: Colors.success },
              { label: 'Exit Fee', value: `${pool.exitFeePercent}%` },
              { label: 'Hold Period', value: `${pool.holdingPeriodDays}d` },
            ].map(({ label, value, color }) => (
              <Card key={label} style={styles.statCard}>
                <MonoText style={styles.statLabel}>{label}</MonoText>
                <MonoText style={[styles.statValue, color ? { color } : {}]}>{value}</MonoText>
              </Card>
            ))}
          </View>

          {/* Chart */}
          <Card>
            <MonoText style={styles.chartTitle}>7-Day NAV History</MonoText>
            <MiniBarChart data={pool.navHistory} variant={pool.type === 'Stable' ? 'teal' : 'gold'} height={100} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <MonoText style={styles.chartAxisLabel}>Day 1</MonoText>
              <MonoText style={styles.chartAxisLabel}>KSh {pool.navHistory[0]}</MonoText>
              <MonoText style={styles.chartAxisLabel}>Day 7</MonoText>
            </View>
          </Card>

          {/* About */}
          <Card>
            <MonoText style={{ fontSize: 11, color: Colors.gold, letterSpacing: 1, marginBottom: 10 }}>ABOUT THIS POOL</MonoText>
            <Text style={styles.description}>{pool.description}</Text>
            <Divider />
            <View style={styles.complianceRow}>
              <Text style={styles.complianceIcon}>🔒</Text>
              <MonoText style={styles.complianceTxt}>NAV immutably recorded daily. CMA licensed. CBK compliant.</MonoText>
            </View>
          </Card>

          <GoldButton
            title={`⚓  Invest in ${pool.name.split(' ')[0]}`}
            onPress={() => setInvestModal(true)}
            variant={pool.type === 'Stable' ? 'teal' : 'gold'}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Invest Modal */}
      <Modal visible={investModal} transparent animationType="slide" onRequestClose={() => setInvestModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <DisplayText style={{ fontSize: 18, marginBottom: 4 }}>{pool.emoji} Invest Now</DisplayText>
            <Text style={{ color: Colors.textSecondary, fontSize: 14, marginBottom: 20 }}>Current NAV: KSh {pool.nav} per unit</Text>

            <MonoText style={styles.inputLabel}>Investment Amount (KES)</MonoText>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder={`Min. ${pool.minInvestment.toLocaleString()}`}
              placeholderTextColor={Colors.textMuted}
              selectionColor={Colors.gold}
            />

            {amount && parseFloat(amount) >= 100 && (
              <View style={styles.preview}>
                <View style={styles.previewRow}>
                  <MonoText style={styles.previewLabel}>Units to receive</MonoText>
                  <MonoText style={[styles.previewValue, { color: Colors.gold }]}>{units} units</MonoText>
                </View>
                <View style={styles.previewRow}>
                  <MonoText style={styles.previewLabel}>NAV per unit</MonoText>
                  <MonoText style={styles.previewValue}>KSh {pool.nav}</MonoText>
                </View>
                <View style={styles.previewRow}>
                  <MonoText style={styles.previewLabel}>Exit fee</MonoText>
                  <MonoText style={styles.previewValue}>{pool.exitFeePercent}% (after {pool.holdingPeriodDays} days = 0%)</MonoText>
                </View>
              </View>
            )}

            <GoldButton title="✅  Confirm Investment" onPress={handleInvest} loading={processing} style={{ marginBottom: 10 }} variant={pool.type === 'Stable' ? 'teal' : 'gold'} />
            <GoldButton title="Cancel" onPress={() => setInvestModal(false)} variant="outline" />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 18, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  heroTop: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  heroEmoji: { fontSize: 36 },
  heroName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  navLabel: { fontSize: 10, color: Colors.textMuted, marginBottom: 4 },
  navValue: { fontSize: 26 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  statCard: { width: '31%', padding: 14, marginBottom: 0 },
  statLabel: { fontSize: 9, color: Colors.textMuted, marginBottom: 6 },
  statValue: { fontSize: 14, color: Colors.textPrimary },
  chartTitle: { fontSize: 11, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 12 },
  chartAxisLabel: { fontSize: 9, color: Colors.textMuted },
  description: { color: Colors.textSecondary, fontSize: 14, lineHeight: 22 },
  complianceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  complianceIcon: { fontSize: 16 },
  complianceTxt: { fontSize: 11, color: Colors.textMuted, flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.navyMid, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 24, paddingBottom: 44 },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  inputLabel: { fontSize: 10, letterSpacing: 1, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: 'rgba(10,14,26,0.8)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, color: Colors.textPrimary, fontSize: 16, marginBottom: 14 },
  preview: { backgroundColor: 'rgba(201,168,76,0.05)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, marginBottom: 16 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  previewLabel: { fontSize: 10, color: Colors.textMuted },
  previewValue: { fontSize: 13, color: Colors.textSecondary },
});
