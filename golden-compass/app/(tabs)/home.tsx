import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, POOLS } from '@/constants/theme';
import {
  Card, Tag, MiniBarChart, GoldButton, MonoText, DisplayText,
  SectionHeader, Divider, ProgressBar, NAVBadge,
} from '@/components/ui';
import { useStore } from '@/store';

const NAV_CHART_DATA = [45, 55, 62, 58, 70, 75, 80];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, investments, transactions, deposit, withdraw } = useStore();
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('+254 700 000 000');
  const [selectedPool, setSelectedPool] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const totalValue = investments.reduce((s, i) => s + i.currentValue, 0);
  const totalInvested = investments.reduce((s, i) => s + i.investedAmount, 0);
  const totalReturns = totalValue - totalInvested;

  const handleDeposit = async () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt < 1000) { Alert.alert('Error', 'Minimum deposit is KSh 1,000'); return; }
    setProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await deposit(amt, selectedPool || undefined, depositPhone);
      setDepositModal(false);
      setDepositAmount('');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('✅ Deposit Confirmed', `KSh ${amt.toLocaleString()} received via M-Pesa`);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt < 1000) { Alert.alert('Error', 'Minimum withdrawal is KSh 1,000'); return; }
    setProcessing(true);
    try {
      await withdraw(amt, 'bahari');
      setWithdrawModal(false);
      setWithdrawAmount('');
      Alert.alert('✅ Withdrawal Requested', `KSh ${amt.toLocaleString()} will be sent to your M-Pesa`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <MonoText style={styles.greeting}>Welcome back, Captain</MonoText>
              <DisplayText style={styles.userName}>{currentUser?.fullName?.split(' ')[0]} {currentUser?.fullName?.split(' ')[1]?.charAt(0)}.</DisplayText>
            </View>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.avatarText}>{currentUser?.avatar}</Text>
            </TouchableOpacity>
          </View>

          {/* Portfolio Card */}
          <LinearGradient
            colors={['#0F1520', '#1A2235', '#0D1018']}
            style={styles.portfolioCard}
          >
            <View style={styles.portfolioTop}>
              <View>
                <MonoText style={styles.portfolioLabel}>Total Portfolio Value</MonoText>
                <DisplayText style={styles.portfolioValue}>KSh {totalValue.toLocaleString()}</DisplayText>
              </View>
              <NAVBadge value="+12.4" isPositive />
            </View>
            <Divider />
            <View style={styles.portfolioStats}>
              <View style={styles.stat}>
                <MonoText style={styles.statLabel}>Invested</MonoText>
                <MonoText style={styles.statValue}>{totalInvested.toLocaleString()}</MonoText>
              </View>
              <View style={styles.stat}>
                <MonoText style={styles.statLabel}>Returns</MonoText>
                <MonoText style={[styles.statValue, { color: Colors.success }]}>+{totalReturns.toLocaleString()}</MonoText>
              </View>
              <View style={styles.stat}>
                <MonoText style={styles.statLabel}>Units</MonoText>
                <MonoText style={[styles.statValue, { color: Colors.teal }]}>
                  {investments.reduce((s, i) => s + i.unitsOwned, 0).toFixed(1)}
                </MonoText>
              </View>
            </View>
          </LinearGradient>

          {/* NAV Chart */}
          <Card style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <DisplayText style={styles.cardTitle}>NAV Performance</DisplayText>
                <MonoText style={styles.cardSubtitle}>Last 7 trading days</MonoText>
              </View>
              <Tag label="Live" variant="success" />
            </View>
            <MiniBarChart data={NAV_CHART_DATA} height={80} />
            <View style={styles.chartLabels}>
              {DAYS.map(d => (
                <MonoText key={d} style={styles.chartLabel}>{d}</MonoText>
              ))}
            </View>
          </Card>

          {/* Quick Actions */}
          <View style={styles.quickGrid}>
            {[
              { icon: '💰', label: 'Deposit', onPress: () => setDepositModal(true) },
              { icon: '📤', label: 'Withdraw', onPress: () => setWithdrawModal(true) },
              { icon: '⚓', label: 'Pools', onPress: () => router.push('/(tabs)/pools') },
              { icon: '🧭', label: 'Navigator', onPress: () => router.push('/(tabs)/navigator') },
            ].map(({ icon, label, onPress }) => (
              <TouchableOpacity key={label} onPress={onPress} activeOpacity={0.8} style={styles.quickBtn}>
                <LinearGradient colors={['#1A2235', '#111827']} style={styles.quickBtnInner}>
                  <Text style={styles.quickIcon}>{icon}</Text>
                  <MonoText style={styles.quickLabel}>{label}</MonoText>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Active Positions */}
          <SectionHeader title="Active Positions" action="View all" onAction={() => router.push('/(tabs)/pools')} />
          {investments.map((inv) => {
            const pool = POOLS[inv.poolId as keyof typeof POOLS];
            if (!pool) return null;
            const pct = (inv.currentValue / totalValue) * 100;
            const returnPct = ((inv.currentValue - inv.investedAmount) / inv.investedAmount * 100).toFixed(1);
            return (
              <Card key={inv.poolId} style={styles.positionCard} onPress={() => router.push(`/pool/${inv.poolId}`)}>
                <View style={styles.positionHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.poolName}>{pool.emoji} {pool.name}</Text>
                    <MonoText style={styles.unitInfo}>{inv.unitsOwned.toFixed(1)} units @ KSh {pool.nav}</MonoText>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.returnPct, { color: Colors.success }]}>+{returnPct}%</Text>
                    <MonoText style={styles.currentVal}>{inv.currentValue.toLocaleString()}</MonoText>
                  </View>
                </View>
                <ProgressBar value={inv.currentValue} max={totalValue} variant={pool.type === 'Stable' ? 'teal' : 'gold'} />
                <View style={styles.positionFooter}>
                  <MonoText style={styles.pctLabel}>{pct.toFixed(0)}% of portfolio</MonoText>
                  <Tag label={pool.type} variant={pool.type === 'Stable' ? 'teal' : 'gold'} />
                </View>
              </Card>
            );
          })}

          {/* Recent Transactions */}
          <SectionHeader title="Recent Transactions" action="See all" onAction={() => router.push('/(tabs)/history')} />
          <Card style={{ marginHorizontal: 20 }}>
            {transactions.slice(0, 3).map((tx, i) => (
              <View key={tx.id} style={[styles.txRow, i < 2 && styles.txBorder]}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === 'deposit' ? 'rgba(39,174,96,0.15)' : 'rgba(231,76,60,0.15)' }]}>
                  <Text style={styles.txEmoji}>{tx.type === 'deposit' ? '💚' : '🔴'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle}>{tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'} · {tx.poolName}</Text>
                  <MonoText style={styles.txRef}>{tx.id} · {tx.createdAt.split('T')[0]}</MonoText>
                </View>
                <MonoText style={[styles.txAmt, { color: tx.type === 'deposit' ? Colors.success : Colors.danger }]}>
                  {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()}
                </MonoText>
              </View>
            ))}
          </Card>

          <View style={{ height: 20 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── Deposit Modal ── */}
      <Modal visible={depositModal} transparent animationType="slide" onRequestClose={() => setDepositModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <DisplayText style={styles.sheetTitle}>💰 Deposit via M-Pesa</DisplayText>
            <Text style={styles.sheetSub}>Funds appear within 30 seconds via STK Push</Text>
            <ModalInput label="M-Pesa Phone" value={depositPhone} onChangeText={setDepositPhone} keyboardType="phone-pad" />
            <ModalInput label="Amount (KES)" value={depositAmount} onChangeText={setDepositAmount} keyboardType="numeric" placeholder="Min. 1,000" />
            <View style={styles.infoBanner}>
              <Text style={styles.infoBannerText}>📱 An STK Push will be sent to your M-Pesa. Enter your PIN to confirm.</Text>
            </View>
            <GoldButton title="🔐  Send STK Push" onPress={handleDeposit} loading={processing} style={{ marginBottom: 10 }} />
            <GoldButton title="Cancel" onPress={() => setDepositModal(false)} variant="outline" />
          </View>
        </View>
      </Modal>

      {/* ── Withdraw Modal ── */}
      <Modal visible={withdrawModal} transparent animationType="slide" onRequestClose={() => setWithdrawModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <DisplayText style={styles.sheetTitle}>📤 Withdraw to M-Pesa</DisplayText>
            <Text style={styles.sheetSub}>Funds sent to your registered M-Pesa number</Text>
            <ModalInput label="Amount (KES)" value={withdrawAmount} onChangeText={setWithdrawAmount} keyboardType="numeric" placeholder="Min. 1,000" />
            <View style={[styles.infoBanner, { borderColor: 'rgba(201,168,76,0.3)' }]}>
              <Text style={[styles.infoBannerText, { color: Colors.textSecondary }]}>⏱️ Processing takes 1–3 business days. 2% exit fee applies within 30 days.</Text>
            </View>
            <GoldButton title="📤  Request Withdrawal" onPress={handleWithdraw} loading={processing} style={{ marginBottom: 10 }} />
            <GoldButton title="Cancel" onPress={() => setWithdrawModal(false)} variant="outline" />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

function ModalInput({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 14 }}>
      <MonoText style={{ fontSize: 10, letterSpacing: 1, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' }}>{label}</MonoText>
      <TextInput
        style={{ backgroundColor: 'rgba(10,14,26,0.8)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, color: Colors.textPrimary, fontSize: 16 }}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  greeting: { fontSize: 11, color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 4 },
  userName: { fontSize: 22 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.goldDark, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Fonts.display, fontSize: 16, color: Colors.navy },
  portfolioCard: { marginHorizontal: 20, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', marginBottom: 14 },
  portfolioTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  portfolioLabel: { fontSize: 10, letterSpacing: 0.8, color: Colors.textSecondary, marginBottom: 6 },
  portfolioValue: { fontSize: 28 },
  portfolioStats: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 9, color: Colors.textSecondary, letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 14, color: Colors.textPrimary },
  chartCard: { marginHorizontal: 20, marginBottom: 14 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardTitle: { fontSize: 14, color: Colors.gold, marginBottom: 2 },
  cardSubtitle: { fontSize: 10, color: Colors.textMuted },
  chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  chartLabel: { fontSize: 9, color: Colors.textMuted },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginBottom: 14 },
  quickBtn: { width: '47%', borderRadius: 16, overflow: 'hidden' },
  quickBtnInner: { padding: 18, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: Colors.border, borderRadius: 16 },
  quickIcon: { fontSize: 26 },
  quickLabel: { fontSize: 10, color: Colors.textSecondary, letterSpacing: 0.5 },
  positionCard: { marginHorizontal: 20 },
  positionHeader: { flexDirection: 'row', marginBottom: 12 },
  poolName: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 3 },
  unitInfo: { fontSize: 10, color: Colors.textMuted },
  returnPct: { fontSize: 15, fontFamily: Fonts.mono },
  currentVal: { fontSize: 13, color: Colors.textSecondary },
  positionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  pctLabel: { fontSize: 9, color: Colors.textMuted },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.08)' },
  txIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  txEmoji: { fontSize: 18 },
  txTitle: { fontSize: 14, color: Colors.textPrimary, marginBottom: 3 },
  txRef: { fontSize: 9, color: Colors.textMuted },
  txAmt: { fontFamily: Fonts.mono, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.navyMid, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 24, paddingBottom: 40 },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, marginBottom: 6 },
  sheetSub: { color: Colors.textSecondary, fontSize: 14, marginBottom: 20 },
  infoBanner: { backgroundColor: 'rgba(42,191,191,0.08)', borderWidth: 1, borderColor: 'rgba(42,191,191,0.3)', borderRadius: 10, padding: 12, marginBottom: 16 },
  infoBannerText: { fontSize: 13, color: Colors.teal, lineHeight: 20 },
});
