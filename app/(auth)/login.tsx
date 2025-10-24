import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol"; // Import IconSymbol

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
      // Redirection is handled by AuthContext in _layout.tsx
    } catch (error) {
      Alert.alert("로그인 실패", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          placeholder="비밀번호"
          secureTextEntry={!showPassword} // Toggle secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.passwordVisibilityToggle}
        >
          <IconSymbol
            name={showPassword ? "eye.slash.fill" : "eye.fill"} // Change icon based on visibility
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "로그인 중..." : "로그인"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("register")} style={styles.linkButton}>
        <Text style={styles.linkButtonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordVisibilityToggle: {
    padding: 10,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 10,
  },
  linkButtonText: {
    color: "#4F46E5",
    textAlign: "center",
    fontSize: 16,
  },
});
