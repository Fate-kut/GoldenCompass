import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList,
  TouchableOpacity, KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts } from '@/constants/theme';
import { MonoText, DisplayText } from '@/components/ui';
import { useStore } from '@/store';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  'How is my portfolio performing?',
  'Which fund should I invest in?',
  'Explain NAV calculation',
  'What are my risks?',
  'How does M-Pesa deposit work?',
  'When is NAV updated?',
];

const AI_RESPONSES: Record<string, string> = {
  default: "Ahoy! I'm your Golden Compass AI Navigator. I can help with portfolio analysis, fund recommendations, NAV explanations, risk assessments, and M-Pesa guidance. How can I guide your wealth voyage today?",
  portfolio: "Your portfolio is charting an excellent course! 📊\n\nTotal Value: KSh 124,850 (+12.4% YTD)\n\n• Bahari Growth Fund — 752 units → KSh 76,192 (+8.9%)\n• Pwani Stable Fund — 496 units → KSh 48,658 (+4.2%)\n\nYou're well-diversified with a 62/38 growth-to-stable split. Your returns are outperforming the Kenya Shilling money market benchmark. Navigate on, Captain!",
  fund: "Based on your moderate risk profile, here's my chart:\n\n⭐ Best Match: Kilima Balanced Fund\n• 9.1% YTD — balanced growth and stability\n• Most popular (2,441 crew members)\n• 14-day holding period, 1% exit fee\n\n🌊 For bold returns (higher risk): Bahari Growth (+12.4% YTD)\n⚓ For calm waters (lower risk): Pwani Stable (+6.2% YTD)\n\nWant me to calculate projected returns for a specific investment amount?",
  nav: "NAV (Net Asset Value) is how your investment's daily price is calculated:\n\nNAV per Unit = Total Pool Assets ÷ Units Issued\n\nExample:\nIf Bahari Growth has KSh 4,860,000 in assets and 48,000 units outstanding:\nNAV = 4,860,000 ÷ 48,000 = KSh 101.25/unit\n\n📅 Updated every morning at 6:00 AM EAT\n🔒 All NAV history is immutably recorded and cannot be altered\n📋 Monthly external audit by CMA-approved auditors",
  risk: "Risk assessment for your voyage, Captain:\n\n⚠️ Market Risk — Pool NAVs fluctuate with market conditions\n📉 Capital Risk — You may receive less than your invested amount\n💧 Liquidity Risk — Exit fees apply within holding periods\n🏛️ Regulatory — We operate under CMA-licensed structure\n🔒 Custody — Funds in segregated accounts (not commingled)\n\nYour risk score: Moderate\nRecommended: Kilima Balanced or Bahari Growth\n\nRemember: past returns don't guarantee future performance.",
  mpesa: "Depositing via M-Pesa is simple and fast! Here's the voyage map:\n\n1️⃣ Tap Deposit → Enter your amount (min KSh 1,000)\n2️⃣ We send an STK Push to your M-Pesa number\n3️⃣ Enter your M-Pesa PIN to confirm\n4️⃣ Funds appear in your wallet within ~30 seconds\n5️⃣ Units are auto-allocated at the day's NAV price\n\nNo deposit fees from our side. Standard Safaricom M-Pesa charges apply. Transactions are processed via the official Safaricom Daraja API.",
  nav_update: "NAV is updated every day at 6:00 AM East Africa Time (EAT).\n\nThe process:\n• Fund manager calculates total pool assets\n• Divides by total units outstanding\n• New NAV is published and logged immutably\n• All investors see updated unit values in their portfolio\n\nYou'll receive a push notification each morning with the new NAV. Check the History tab for the complete immutable NAV log.",
};

function getResponse(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('portfolio') || m.includes('performing') || m.includes('return') || m.includes('value')) return AI_RESPONSES.portfolio;
  if (m.includes('fund') || m.includes('invest') || m.includes('which') || m.includes('recommend') || m.includes('best')) return AI_RESPONSES.fund;
  if (m.includes('nav') || m.includes('net asset') || m.includes('calculation') || m.includes('how') && m.includes('work')) return AI_RESPONSES.nav;
  if (m.includes('risk') || m.includes('safe') || m.includes('loss') || m.includes('danger')) return AI_RESPONSES.risk;
  if (m.includes('mpesa') || m.includes('m-pesa') || m.includes('deposit') || m.includes('money') || m.includes('fund')) return AI_RESPONSES.mpesa;
  if (m.includes('when') || m.includes('update') || m.includes('time')) return AI_RESPONSES.nav_update;
  return AI_RESPONSES.default;
}

export default function NavigatorScreen() {
  const { currentUser, investments } = useStore();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'ai', text: AI_RESPONSES.default, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const dotAnim1 = useRef(new Animated.Value(0.4)).current;
  const dotAnim2 = useRef(new Animated.Value(0.4)).current;
  const dotAnim3 = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isThinking) return;
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    pulse(dotAnim1, 0);
    pulse(dotAnim2, 200);
    pulse(dotAnim3, 400);
  }, [isThinking]);

  const sendMessage = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: getResponse(msg),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000 + Math.random() * 800);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgWrapper, item.role === 'user' && styles.msgWrapperUser]}>
      {item.role === 'ai' && (
        <View style={styles.aiAvatar}>
          <Text style={{ fontSize: 16 }}>🧭</Text>
        </View>
      )}
      <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
        {item.role === 'ai' && (
          <MonoText style={styles.aiLabel}>Navigator · AI</MonoText>
        )}
        <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[Colors.navy, '#0A0E1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.aiInfo}>
            <LinearGradient colors={[Colors.goldDark, Colors.gold]} style={styles.aiAvatarLarge}>
              <Text style={{ fontSize: 20 }}>🧭</Text>
            </LinearGradient>
            <View>
              <DisplayText style={{ fontSize: 16, marginBottom: 2 }}>AI Navigator</DisplayText>
              <MonoText style={{ fontSize: 10, color: Colors.teal }}>● Online · Golden Compass AI</MonoText>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={0}>
          {/* Messages */}
          <FlatList
            ref={flatRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={
              isThinking ? (
                <View style={[styles.msgWrapper, { marginBottom: 8 }]}>
                  <View style={styles.aiAvatar}><Text style={{ fontSize: 16 }}>🧭</Text></View>
                  <View style={[styles.bubble, styles.bubbleAI]}>
                    <View style={styles.thinkingDots}>
                      {[dotAnim1, dotAnim2, dotAnim3].map((anim, i) => (
                        <Animated.View key={i} style={[styles.dot, { opacity: anim }]} />
                      ))}
                    </View>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <View>
              <FlatList
                data={QUICK_PROMPTS}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickList}
                keyExtractor={i => i}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => sendMessage(item)} style={styles.quickChip}>
                    <MonoText style={styles.quickChipText}>{item}</MonoText>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Input bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.chatInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ask your Navigator..."
              placeholderTextColor={Colors.textMuted}
              selectionColor={Colors.gold}
              onSubmitEditing={() => sendMessage()}
              returnKeyType="send"
              multiline
            />
            <TouchableOpacity
              onPress={() => sendMessage()}
              disabled={!input.trim() || isThinking}
              style={[styles.sendBtn, (!input.trim() || isThinking) && { opacity: 0.4 }]}
            >
              <LinearGradient colors={[Colors.goldDark, Colors.gold]} style={styles.sendBtnInner}>
                <Text style={styles.sendIcon}>↑</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  aiInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  aiAvatarLarge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  messageList: { padding: 16, paddingBottom: 8, gap: 12 },
  msgWrapper: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgWrapperUser: { justifyContent: 'flex-end' },
  aiAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.navyLight, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: 14 },
  bubbleAI: { backgroundColor: Colors.navyMid, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: Colors.goldDark, borderBottomRightRadius: 4 },
  aiLabel: { fontSize: 9, color: Colors.gold, letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' },
  bubbleText: { color: Colors.textPrimary, fontSize: 14, lineHeight: 22 },
  bubbleTextUser: { color: Colors.navy, fontWeight: '500' },
  thinkingDots: { flexDirection: 'row', gap: 5, paddingVertical: 4 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.gold },
  quickList: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  quickChip: { backgroundColor: Colors.navyMid, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  quickChipText: { fontSize: 11, color: Colors.textSecondary, letterSpacing: 0.3 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.border, gap: 10 },
  chatInput: { flex: 1, backgroundColor: 'rgba(10,14,26,0.8)', borderWidth: 1, borderColor: Colors.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: Colors.textPrimary, fontSize: 15, maxHeight: 100 },
  sendBtn: { alignSelf: 'flex-end' },
  sendBtnInner: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 18, color: Colors.navy, fontWeight: '700' },
});
