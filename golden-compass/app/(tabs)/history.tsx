import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/constants/theme';
import { MonoText, DisplayText, Card } from '@/components/ui';
import { useStore, Transaction } from '@/store';

type Filter = 'all' | 'deposit' | 'withdrawal';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

export default function HistoryScreen() {
  const { transactions } = useStore();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0);

  const renderTx = ({ item, index }: { item: Transaction; index: number }) => (
    <View style={[styles.txRow, index < filtered.length - 1 && styles.txBorder]}>
      <View style={[styles.txIcon, { backgroundColor: item.type === 'deposit' ? 'rgba(39,174,96,0.15)' : 'rgba(231,76,60,0.12)' }]}>
        <Text style={styles.txEmoji}>{item.type === 'deposit' ? '💚' : '🔴'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txTitle}>{item.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</Text>
        <MonoText style={styles.txPool}>{item.poolName}</MonoText>
        <MonoText style={styles.txRef}>{item.id} · M-Pesa: {item.mpesaReference}</MonoText>
        <MonoText style={styles.txDate}>{formatDate(item.createdAt)} at {formatTime(item.createdAt)}</MonoText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <MonoText style={[styles.txAmt, { color: item.type === 'deposit' ? Colors.success : Colors.danger }]}>
          {item.type === 'deposit' ? '+' : '-'}{item.amount.toLocaleString()}
        </MonoText>
        <View style={[styles.statusBadge, { backgroundColor: 'rgba(39,174,96,0.1)' }]}>
          <MonoText style={{ fontSize: 9, color: Colors.success }}>{item.status.toUpperCase()}</MonoText>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <DisplayText style={{ fontSize: 20 }}>Transaction History</DisplayText>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: 'rgba(39,174,96,0.3)' }]}>
            <MonoText style={{ fontSize: 9, color: Colors.textMuted, marginBottom: 4 }}>TOTAL DEPOSITED</MonoText>
            <MonoText style={{ fontSize: 16, color: Colors.success }}>+{totalDeposits.toLocaleString()}</MonoText>
          </View>
          <View style={[styles.summaryCard, { borderColor: 'rgba(231,76,60,0.3)' }]}>
            <MonoText style={{ fontSize: 9, color: Colors.textMuted, marginBottom: 4 }}>TOTAL WITHDRAWN</MonoText>
            <MonoText style={{ fontSize: 16, color: Colors.danger }}>-{totalWithdrawals.toLocaleString()}</MonoText>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(['all', 'deposit', 'withdrawal'] as Filter[]).map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterBtnActive]}>
              <MonoText style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'deposit' ? 'Deposits' : 'Withdrawals'}
              </MonoText>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          renderItem={renderTx}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <MonoText style={{ fontSize: 10, color: Colors.textMuted }}>{filtered.length} transactions</MonoText>
              <View style={styles.auditNote}>
                <MonoText style={{ fontSize: 9, color: Colors.gold }}>🔒 Immutably logged · CMA Compliant</MonoText>
              </View>
            </View>
          }
          ItemSeparatorComponent={() => null}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', padding: 40 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>📜</Text>
              <MonoText style={{ color: Colors.textMuted, textAlign: 'center' }}>No {filter} transactions yet</MonoText>
            </View>
          }
          style={{ backgroundColor: Colors.cardBg, borderRadius: 16, borderWidth: 1, borderColor: Colors.border }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 14 },
  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 14 },
  summaryCard: { flex: 1, backgroundColor: Colors.cardBg, borderWidth: 1, borderRadius: 14, padding: 14 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.navyLight, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  filterBtnActive: { backgroundColor: Colors.goldDark, borderColor: Colors.gold },
  filterText: { fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5 },
  filterTextActive: { color: Colors.goldLight },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  auditNote: { backgroundColor: 'rgba(201,168,76,0.08)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  txRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 14, paddingHorizontal: 4 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.08)' },
  txIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  txEmoji: { fontSize: 18 },
  txTitle: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', marginBottom: 2 },
  txPool: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  txRef: { fontSize: 9, color: Colors.textMuted, marginBottom: 2 },
  txDate: { fontSize: 9, color: Colors.textMuted },
  txAmt: { fontFamily: Fonts.mono, fontSize: 15, marginBottom: 4 },
  statusBadge: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3 },
});
