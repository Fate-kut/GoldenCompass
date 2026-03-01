import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts, POOLS } from '@/constants/theme';
import { Card, Tag, MiniBarChart, GoldButton, MonoText, DisplayText, SectionHeader, Divider } from '@/components/ui';
import { useStore } from '@/store';

const AUM_TREND = [11.2, 11.5, 11.8, 12.0, 12.4, 12.9, 13.2];

export default function AdminDashboard() {
  const router = useRouter();
  const { pendingKYC, auditLogs, amlFlags, approveKYC, rejectKYC, updateNAV, addAuditLog, logout } = useStore();
  const [navModal, setNavModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState('bahari');
  const [newNAV, setNewNAV] = useState('');
  const [newPoolValue, setNewPoolValue] = useState('');
  const [navNotes, setNavNotes] = useState('');
  const [createPoolModal, setCreatePoolModal] = useState(false);
  const [poolName, setPoolName] = useState('');
  const [poolType, setPoolType] = useState('Growth');

  const handleNAVUpdate = () => {
    if (!newNAV) { Alert.alert('Required', 'Enter new NAV value'); return; }
    updateNAV(selectedPool, parseFloat(newNAV), parseFloat(newPoolValue) || 0, navNotes);
    setNavModal(false);
    setNewNAV(''); setNewPoolValue(''); setNavNotes('');
    Alert.alert('✅ NAV Updated', `New NAV: KSh ${newNAV} — Logged immutably`);
  };

  const handleCreatePool = () => {
    if (!poolName) { Alert.alert('Required', 'Enter pool name'); return; }
    addAuditLog('POOL_CREATED', 'pool', poolName.toLowerCase().replace(/\s+/g, '_'), 'admin');
    setCreatePoolModal(false);
    setPoolName('');
    Alert.alert('⚓ Pool Created', `${poolName} has been launched and logged.`);
  };

  const handleLogout = () => {
    Alert.alert('Admin Logout', 'Sign out of admin panel?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => { logout(); router.replace('/(auth)/login'); } },
    ]);
  };

  const actionColors: Record<string, string> = {
    NAV_UPDATE: Colors.gold,
    KYC_APPROVED: Colors.success,
    KYC_REJECTED: Colors.danger,
    KYC_SUBMITTED: Colors.teal,
    POOL_CREATED: Colors.goldLight,
    DEPOSIT_CONFIRMED: Colors.success,
    AML_FLAGGED: Colors.danger,
    USER_LOGIN: Colors.teal,
    USER_LOGOUT: Colors.textMuted,
    WITHDRAWAL_CONFIRMED: Colors.warning,
  };

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Admin Header */}
        <View style={styles.adminHeader}>
          <View>
            <View style={styles.adminBadge}>
              <MonoText style={{ fontSize: 9, color: Colors.danger, letterSpacing: 1 }}>🔐  ADMIN</MonoText>
            </View>
            <DisplayText style={{ fontSize: 20 }}>Command Bridge</DisplayText>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <MonoText style={{ fontSize: 10, color: Colors.danger }}>Logout</MonoText>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

          {/* KPI Grid */}
          <View style={styles.kpiGrid}>
            {[
              { label: 'Total AUM', value: 'KSh 13.2M', delta: '↑ 8.4%', color: Colors.success },
              { label: 'Total Users', value: '4,429', delta: '↑ 124 today', color: Colors.teal },
              { label: 'Pending KYC', value: String(pendingKYC.length), delta: 'Review needed', color: Colors.warning },
              { label: 'AML Flags', value: String(amlFlags.length), delta: '⚠️ Action needed', color: Colors.danger },
            ].map(({ label, value, delta, color }) => (
              <Card key={label} style={styles.kpiCard}>
                <MonoText style={styles.kpiLabel}>{label}</MonoText>
                <Text style={[styles.kpiValue, { color }]}>{value}</Text>
                <MonoText style={[styles.kpiDelta, { color }]}>{delta}</MonoText>
              </Card>
            ))}
          </View>

          {/* AUM Chart */}
          <Card style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <View>
                <DisplayText style={{ fontSize: 14, color: Colors.gold }}>AUM Growth</DisplayText>
                <MonoText style={{ fontSize: 10, color: Colors.textMuted }}>Last 7 days (KSh M)</MonoText>
              </View>
              <Tag label="Live" variant="success" />
            </View>
            <MiniBarChart data={AUM_TREND} height={80} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <MonoText style={styles.axisLabel}>11.2M</MonoText>
              <MonoText style={styles.axisLabel}>13.2M</MonoText>
            </View>
          </Card>

          {/* Pool Management */}
          <View style={styles.sectionHeaderRow}>
            <MonoText style={styles.sectionTitle}>Pool Management</MonoText>
            <TouchableOpacity onPress={() => setCreatePoolModal(true)} style={styles.newBtn}>
              <LinearGradient colors={[Colors.goldDark, Colors.gold]} style={styles.newBtnInner}>
                <MonoText style={{ fontSize: 10, color: Colors.navy }}>+ New Pool</MonoText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {Object.values(POOLS).map(pool => (
            <Card key={pool.id} style={styles.section}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={styles.poolName}>{pool.emoji} {pool.name}</Text>
                  <MonoText style={styles.poolMeta}>{pool.totalUnits.toLocaleString()} units · {pool.investors.toLocaleString()} investors</MonoText>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Tag label="Active" variant="success" />
                  <TouchableOpacity onPress={() => { setSelectedPool(pool.id); setNavModal(true); }}>
                    <MonoText style={{ fontSize: 10, color: Colors.gold }}>✏️ Update NAV</MonoText>
                  </TouchableOpacity>
                </View>
              </View>
              <Divider />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <MonoText style={{ fontSize: 12, color: Colors.textSecondary }}>NAV: KSh {pool.nav}</MonoText>
                <MonoText style={{ fontSize: 12, color: Colors.textSecondary }}>Total: KSh {(pool.totalValue / 1000000).toFixed(2)}M</MonoText>
                <MonoText style={{ fontSize: 12, color: Colors.success }}>+{pool.returnYTD}% YTD</MonoText>
              </View>
            </Card>
          ))}

          {/* KYC Queue */}
          <MonoText style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 8 }]}>
            Pending KYC Reviews ({pendingKYC.length})
          </MonoText>
          <Card style={styles.section}>
            {pendingKYC.length === 0 ? (
              <MonoText style={{ color: Colors.textMuted, textAlign: 'center', padding: 20 }}>✅ All KYC applications reviewed</MonoText>
            ) : (
              pendingKYC.map((kyc, i) => (
                <View key={kyc.id} style={[styles.kycRow, i < pendingKYC.length - 1 && styles.kycBorder]}>
                  <View style={styles.kycAvatar}>
                    <Text style={{ fontSize: 18 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.kycName}>{kyc.name}</Text>
                    <MonoText style={styles.kycMeta}>Risk: {kyc.risk} · {new Date(kyc.submittedAt).toLocaleDateString()}</MonoText>
                  </View>
                  <View style={styles.kycActions}>
                    <TouchableOpacity onPress={() => { approveKYC(kyc.id); Alert.alert('✅', `${kyc.name}'s KYC approved`); }} style={[styles.kycBtn, { backgroundColor: Colors.success }]}>
                      <Text style={styles.kycBtnText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { rejectKYC(kyc.id); Alert.alert('❌', `${kyc.name}'s KYC rejected`); }} style={[styles.kycBtn, { backgroundColor: Colors.danger }]}>
                      <Text style={styles.kycBtnText}>✗</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </Card>

          {/* AML Flags */}
          {amlFlags.length > 0 && (
            <>
              <MonoText style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 8, color: Colors.danger }]}>
                ⚠️ AML Alerts ({amlFlags.length})
              </MonoText>
              {amlFlags.map(flag => (
                <Card key={flag.id} style={[styles.section, { borderColor: 'rgba(231,76,60,0.4)' }]}>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={{ fontSize: 24 }}>⚠️</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: Colors.danger, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>Suspicious Transaction</Text>
                      <MonoText style={{ fontSize: 10, color: Colors.textMuted, marginBottom: 2 }}>Ref: {flag.txnRef} · KSh {flag.amount.toLocaleString()}</MonoText>
                      <MonoText style={{ fontSize: 10, color: Colors.textMuted, marginBottom: 2 }}>User: {flag.user}</MonoText>
                      <MonoText style={{ fontSize: 10, color: Colors.warning }}>{flag.reason}</MonoText>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                    <GoldButton title="Block Account" onPress={() => Alert.alert('Account Blocked', 'User account has been suspended pending investigation.')} variant="danger" style={{ flex: 1 }} />
                    <GoldButton title="Mark Safe" onPress={() => Alert.alert('Marked Safe', 'Transaction cleared. Audit log updated.')} variant="outline" style={{ flex: 1 }} />
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* Audit Log */}
          <MonoText style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 8 }]}>Immutable Audit Log</MonoText>
          <Card style={styles.section}>
            {auditLogs.slice(0, 10).map((log, i) => (
              <View key={log.id} style={[styles.logRow, i < Math.min(auditLogs.length, 10) - 1 && styles.logBorder]}>
                <View style={[styles.logDot, { backgroundColor: actionColors[log.action] || Colors.textMuted }]} />
                <View style={{ flex: 1 }}>
                  <MonoText style={[styles.logAction, { color: actionColors[log.action] || Colors.textMuted }]}>{log.action}</MonoText>
                  <Text style={styles.logEntity}>{log.entityType} · {log.entityId}</Text>
                  <MonoText style={styles.logMeta}>by {log.actor} · {new Date(log.timestamp).toLocaleString('en-KE')}</MonoText>
                </View>
              </View>
            ))}
          </Card>
        </ScrollView>

        {/* NAV Update Modal */}
        <Modal visible={navModal} transparent animationType="slide" onRequestClose={() => setNavModal(false)}>
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <DisplayText style={{ fontSize: 18, marginBottom: 4 }}>✏️ Update Pool NAV</DisplayText>
              <Text style={{ color: Colors.textSecondary, fontSize: 14, marginBottom: 16 }}>
                Pool: {POOLS[selectedPool as keyof typeof POOLS]?.name}
              </Text>
              <AdminInput label="New NAV per Unit (KES)" value={newNAV} onChangeText={setNewNAV} keyboardType="decimal-pad" placeholder="e.g. 101.45" />
              <AdminInput label="Total Pool Value (KES)" value={newPoolValue} onChangeText={setNewPoolValue} keyboardType="numeric" placeholder="e.g. 4860000" />
              <AdminInput label="Admin Notes" value={navNotes} onChangeText={setNavNotes} placeholder="e.g. Monthly rebalancing" />
              <GoldButton title="📊  Publish NAV Update" onPress={handleNAVUpdate} style={{ marginBottom: 10 }} />
              <GoldButton title="Cancel" onPress={() => setNavModal(false)} variant="outline" />
            </View>
          </View>
        </Modal>

        {/* Create Pool Modal */}
        <Modal visible={createPoolModal} transparent animationType="slide" onRequestClose={() => setCreatePoolModal(false)}>
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <DisplayText style={{ fontSize: 18, marginBottom: 16 }}>⚓ Create New Pool</DisplayText>
              <AdminInput label="Pool Name" value={poolName} onChangeText={setPoolName} placeholder="e.g. Msitu Growth Fund" />
              <View style={{ marginBottom: 16 }}>
                <MonoText style={styles.inputLabel}>Pool Type</MonoText>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['Growth', 'Stable', 'Balanced', 'Fixed Income'].map(t => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setPoolType(t)}
                      style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: t === poolType ? Colors.gold : Colors.border, backgroundColor: t === poolType ? 'rgba(201,168,76,0.1)' : 'transparent' }}
                    >
                      <MonoText style={{ fontSize: 10, color: t === poolType ? Colors.gold : Colors.textMuted }}>{t}</MonoText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <GoldButton title="✅  Launch Pool" onPress={handleCreatePool} style={{ marginBottom: 10 }} />
              <GoldButton title="Cancel" onPress={() => setCreatePoolModal(false)} variant="outline" />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

function AdminInput({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: 14 }}>
      <MonoText style={{ fontSize: 10, letterSpacing: 1, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' }}>{label}</MonoText>
      <TextInput
        style={{ backgroundColor: 'rgba(10,14,26,0.8)', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, color: Colors.textPrimary, fontSize: 15 }}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.gold}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  adminHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 14 },
  adminBadge: { backgroundColor: 'rgba(192,57,43,0.1)', borderWidth: 1, borderColor: 'rgba(192,57,43,0.3)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 6, alignSelf: 'flex-start' },
  logoutBtn: { backgroundColor: 'rgba(192,57,43,0.1)', borderWidth: 1, borderColor: 'rgba(192,57,43,0.3)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10, marginBottom: 4 },
  kpiCard: { width: '47%', padding: 16, marginBottom: 0 },
  kpiLabel: { fontSize: 9, color: Colors.textMuted, marginBottom: 6, letterSpacing: 0.5 },
  kpiValue: { fontSize: 20, fontFamily: Fonts.display, marginBottom: 4 },
  kpiDelta: { fontSize: 10 },
  section: { marginHorizontal: 20 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 10, color: Colors.gold, letterSpacing: 1.2, textTransform: 'uppercase' },
  newBtn: { borderRadius: 8, overflow: 'hidden' },
  newBtnInner: { paddingHorizontal: 12, paddingVertical: 8 },
  axisLabel: { fontSize: 9, color: Colors.textMuted },
  poolName: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600', marginBottom: 3 },
  poolMeta: { fontSize: 10, color: Colors.textMuted },
  kycRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  kycBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.08)' },
  kycAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.1)', alignItems: 'center', justifyContent: 'center' },
  kycName: { fontSize: 14, color: Colors.textPrimary, marginBottom: 3 },
  kycMeta: { fontSize: 10, color: Colors.textMuted },
  kycActions: { flexDirection: 'row', gap: 6 },
  kycBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  kycBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  logBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.06)' },
  logDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  logAction: { fontFamily: Fonts.mono, fontSize: 11, letterSpacing: 0.5, marginBottom: 2 },
  logEntity: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
  logMeta: { fontSize: 9, color: Colors.textMuted },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: Colors.navyMid, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 24, paddingBottom: 44 },
  handle: { width: 40, height: 4, backgroundColor: Colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  inputLabel: { fontSize: 10, letterSpacing: 1, color: Colors.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
});
