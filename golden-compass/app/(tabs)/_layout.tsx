import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, { color: focused ? Colors.gold : Colors.textMuted }]}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.navyMid,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="home" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🧭" label="Home" focused={focused} /> }} />
      <Tabs.Screen name="pools" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="⚓" label="Pools" focused={focused} /> }} />
      <Tabs.Screen name="navigator" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🤖" label="Navigator" focused={focused} /> }} />
      <Tabs.Screen name="history" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📜" label="History" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', gap: 3, paddingTop: 8 },
  tabItemFocused: {},
  emoji: { fontSize: 22 },
  label: { fontFamily: Fonts.mono, fontSize: 9, letterSpacing: 0.5 },
});
