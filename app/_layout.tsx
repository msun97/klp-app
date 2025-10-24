import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../lib/AuthContext';

function RootLayoutContent() {
  const { user, loading } = useAuth() as any;
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      // 로그인됨 + auth 화면에 있음 → main으로
      router.replace('/(main)');
    } else if (!user && !inAuthGroup) {
      // 로그인 안됨 + auth 화면 아님 → login으로
      router.replace('/(auth)/login');
    }
    // 로그인 안됨 + auth 화면 → 그대로 (register 이동 가능!)
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}