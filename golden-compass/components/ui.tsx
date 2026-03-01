import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts } from '@/constants/theme';

// ─── GoldButton ────────────────────────────────────────────────────────────────
interface GoldButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
  variant?: 'gold' | 'teal' | 'outline' | 'danger';
  disabled?: boolean;
}

export function GoldButton({ title, onPress, loading, style, variant = 'gold', disabled }: GoldButtonProps) {
  const gradients: Record<string, [string, string]> = {
    gold: [Colors.goldDark, Colors.goldLight],
    teal: [Colors.tealDark, Colors.teal],
    danger: ['#922B21', Colors.crimson],
    outline: ['transparent', 'transparent'],
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.btn,
          variant === 'outline' && styles.btnOutline,
          (disabled || loading) && { opacity: 0.5 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'outline' ? Colors.textSecondary : Colors.navy} />
        ) : (
          <Text style={[styles.btnText, variant === 'outline' && styles.btnTextOutline]}>
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

// ─── Card ───────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'gold' | 'dark';
}

export function Card({ children, style, onPress, variant = 'default' }: CardProps) {
  const cardStyle = [
    styles.card,
    variant === 'gold' && styles.cardGold,
    variant === 'dark' && styles.cardDark,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={cardStyle}>{children}</View>;
}

// ─── Tag ───────────────────────────────────────────────────────────────────────
interface TagProps {
  label: string;
  variant?: 'gold' | 'teal' | 'success' | 'danger' | 'warning';
}

export function Tag({ label, variant = 'gold' }: TagProps) {
  const colors = {
    gold: { bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.3)', text: Colors.gold },
    teal: { bg: 'rgba(42,191,191,0.1)', border: 'rgba(42,191,191,0.3)', text: Colors.teal },
    success: { bg: 'rgba(39,174,96,0.1)', border: 'rgba(39,174,96,0.3)', text: Colors.success },
    danger: { bg: 'rgba(231,76,60,0.1)', border: 'rgba(231,76,60,0.3)', text: Colors.danger },
    warning: { bg: 'rgba(243,156,18,0.1)', border: 'rgba(243,156,18,0.3)', text: Colors.warning },
  };
  const c = colors[variant];
  return (
    <View style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.tagText, { color: c.text }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

// ─── MonoText ──────────────────────────────────────────────────────────────────
export function MonoText({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontFamily: Fonts.mono, color: Colors.textPrimary }, style]}>{children}</Text>;
}

// ─── DisplayText ───────────────────────────────────────────────────────────────
export function DisplayText({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ fontFamily: Fonts.display, color: Colors.goldLight }, style]}>{children}</Text>;
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionAction}>{action} →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

// ─── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, variant = 'gold' }: { value: number; max: number; variant?: 'gold' | 'teal' }) {
  const pct = Math.min((value / max) * 100, 100);
  const fillColors: [string, string] = variant === 'gold'
    ? [Colors.goldDark, Colors.goldLight]
    : [Colors.tealDark, Colors.teal];
  return (
    <View style={styles.progressBg}>
      <LinearGradient colors={fillColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressFill, { width: `${pct}%` }]} />
    </View>
  );
}

// ─── Toggle ────────────────────────────────────────────────────────────────────
export function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <View style={[styles.toggle, value && styles.toggleOn]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </View>
    </TouchableOpacity>
  );
}

// ─── MiniBarChart ──────────────────────────────────────────────────────────────
export function MiniBarChart({ data, variant = 'gold', height = 80 }: { data: number[]; variant?: 'gold' | 'teal'; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const colors: [string, string] = variant === 'gold' ? [Colors.goldDark, Colors.gold] : [Colors.tealDark, Colors.teal];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height, gap: 4 }}>
      {data.map((v, i) => {
        const barH = 12 + ((v - min) / range) * (height - 12);
        return (
          <LinearGradient
            key={i}
            colors={colors}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ flex: 1, height: barH, borderRadius: 4 }}
          />
        );
      })}
    </View>
  );
}

// ─── NAVBadge ──────────────────────────────────────────────────────────────────
export function NAVBadge({ value, isPositive = true }: { value: string; isPositive?: boolean }) {
  return (
    <View style={[styles.navBadge, { backgroundColor: isPositive ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.12)' }]}>
      <Text style={[styles.navBadgeText, { color: isPositive ? Colors.success : Colors.danger }]}>
        {isPositive ? '+' : ''}{value}%
      </Text>
    </View>
  );
}

// ─── ScreenHeader ──────────────────────────────────────────────────────────────
export function ScreenHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={styles.screenHeader}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : <View style={{ width: 40 }} />}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 40 }}>{right}</View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnText: {
    fontFamily: Fonts.display,
    fontSize: 12,
    color: Colors.navy,
    letterSpacing: 0.8,
  },
  btnTextOutline: {
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  cardGold: {
    backgroundColor: '#1A160A',
    borderColor: 'rgba(201,168,76,0.5)',
  },
  cardDark: {
    backgroundColor: '#0D1018',
    borderColor: 'rgba(201,168,76,0.12)',
  },
  tag: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: Fonts.mono,
  },
  sectionAction: {
    color: Colors.gold,
    fontSize: 13,
    fontFamily: Fonts.mono,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  progressBg: {
    height: 6,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  toggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.navyLight,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOn: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  navBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 24,
    color: Colors.gold,
  },
  headerTitle: {
    fontFamily: Fonts.display,
    fontSize: 16,
    color: Colors.goldLight,
  },
});
