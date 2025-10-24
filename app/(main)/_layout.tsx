import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "글 목록" }} />
      <Stack.Screen name="write" options={{ title: "글 작성" }} />
      <Stack.Screen name="[id]" options={{ title: "글 상세" }} />
    </Stack>
  );
}