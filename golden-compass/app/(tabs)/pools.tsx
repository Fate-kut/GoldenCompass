import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts, POOLS } from '@/constants/theme';
import { Card, Tag, MiniBarChart, GoldButton, MonoText, DisplayText, Divider, NAVBadge } from '@/components/ui';

export default function PoolsScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={styles.header}>
          <DisplayText style={styles.title}>Investment Pools</DisplayText>
          <Tag label="3 Active" variant="success" />
        </View>

        {/* Summary Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <MonoText style={styles.summaryLabel}>Daily NAV Update</MonoText>
            <MonoText style={[styles.summaryValue, { color: Colors.gold }]}>6:00 AM EAT</MonoText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MonoText style={styles.summaryLabel}>Avg. Yield (30d)</MonoText>
            <MonoText style={[styles.summaryValue, { color: Colors.success }]}>+9.8% p.a.</MonoText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <MonoText style={styles.summaryLabel}>Min. Investment</MonoText>
            <MonoText style={[styles.summaryValue, { color: Colors.teal }]}>KSh 1,000</MonoText>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 20 }}>
          {Object.values(POOLS).map((pool) => (
            <TouchableOpacity
              key={pool.id}
              activeOpacity={0.9}
              onPress={() => router.push(`/pool/${pool.id}`)}
            >
              <LinearGradient
                colors={['#0F1520', '#1A2235']}
                style={styles.poolCard}
              >
                {/* Header */}
                <View style={styles.poolHeader}>
                  <View>
                    <View style={styles.poolTitleRow}>
                      <Text style={styles.poolEmoji}>{pool.emoji}</Text>
                      <Text style={styles.poolName}>{pool.name}</Text>
                    </View>
                    <View style={styles.tags}>
                      <Tag label={pool.type} variant={pool.type === 'Stable' ? 'teal' : 'gold'} />
                      <Tag label="Active" variant="success" />
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <DisplayText style={[styles.returnPct, { color: pool.type === 'Stable' ? Colors.teal : Colors.goldLight }]}>
                      +{pool.returnYTD}%
                    </DisplayText>
                    <MonoText style={styles.returnLabel}>YTD Return</MonoText>
                  </View>
                </View>

                <Divider />

                {/* Stats */}
                <View style={styles.statsRow}>
                  {[
                    { label: 'NAV/Unit', value: `${pool.nav}` },
                    { label: 'Pool Size', value: `${(pool.totalValue / 1000000).toFixed(1)}M` },
                    { label: 'Investors', value: pool.investors.toLocaleString() },
                  ].map(({ label, value }) => (
                    <View key={label} style={styles.statCell}>
                      <MonoText style={styles.statLabel}>{label}</MonoText>
                      <MonoText style={styles.statValue}>{value}</MonoText>
                    </View>
                  ))}
                </View>

                {/* Mini chart */}
                <MiniBarChart data={pool.navHistory} variant={pool.type === 'Stable' ? 'teal' : 'gold'} height={50} />

                <View style={{ marginTop: 14 }}>
                  <GoldButton
                    title={`Invest in ${pool.name.split(' ')[0]}`}
                    onPress={() => router.push(`/pool/${pool.id}`)}
                    variant={pool.type === 'Stable' ? 'teal' : 'gold'}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}

          {/* Compliance note */}
          <View style={styles.complianceNote}>
            <MonoText style={styles.complianceText}>
              🔒  All pools operate under CMA-licensed structure with daily immutable NAV recording and monthly external audit.
            </MonoText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  title: { fontSize: 20 },
  summaryBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontSize: 9, color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 4 },
  summaryValue: { fontSize: 12, letterSpacing: 0.3 },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  poolCard: { borderWidth: 1, borderColor: Colors.border, borderRadius: 18, padding: 20, marginBottom: 16 },
  poolHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  poolTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  poolEmoji: { fontSize: 26 },
  poolName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  tags: { flexDirection: 'row', gap: 6 },
  returnPct: { fontSize: 20, marginBottom: 2 },
  returnLabel: { fontSize: 9, color: Colors.textMuted },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCell: {},
  statLabel: { fontSize: 9, color: Colors.textMuted, marginBottom: 4 },
  statValue: { fontSize: 14 },
  complianceNote: {
    backgroundColor: 'rgba(201,168,76,0.06)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  complianceText: { fontSize: 11, color: Colors.textMuted, lineHeight: 18, letterSpacing: 0.3 },
});
