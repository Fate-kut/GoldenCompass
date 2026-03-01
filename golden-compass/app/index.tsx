import { Redirect } from 'expo-router';
import { useStore } from '@/store';

export default function Index() {
  const isLoggedIn = useStore(s => s.isLoggedIn);
  const currentUser = useStore(s => s.currentUser);

  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;
  if (currentUser?.role === 'admin') return <Redirect href="/(admin)/dashboard" />;
  return <Redirect href="/(tabs)/home" />;
}
