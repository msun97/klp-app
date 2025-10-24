import { Slot, Stack, useSegments, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { useEffect } from 'react';

function RootLayoutContent() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (user && !inAuthGroup) {
      // User is authenticated, but not in the auth stack, redirect to app
      router.replace('/(main)');
    } else if (!user && inAuthGroup) {
      // User is not authenticated, but in the app stack, redirect to auth
      router.replace('/login');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(main)" options={{ headerShown: false }} />
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