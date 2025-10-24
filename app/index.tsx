import { useRouter } from "expo-router";
import { Button, LogBox, StyleSheet, Text, View } from "react-native";

export default function Page() {
  const router = useRouter();
// Enable logging for all warnings
LogBox.ignoreAllLogs(false);

// Capture global JS errors
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error("Caught global error:", error, isFatal);
});

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
        
        <Button 
          title="로그인으로 이동" 
          onPress={() => router.push('/login')}
        />
        <Button 
          title="메인으로 이동" 
          onPress={() => router.push('/(main)')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});