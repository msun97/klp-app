import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { IconSymbol } from "@/components/ui/icon-symbol"; // Import IconSymbol

export default function Register() {
  const router = useRouter();
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleRegister = async () => {
    setLoading(true);
    try {
      await signup(email, password);
      Alert.alert("회원가입 성공", "계정이 성공적으로 생성되었습니다. 로그인 해주세요.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("회원가입 실패", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>

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
        onPress={handleRegister}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "가입 중..." : "가입하기"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")} style={styles.linkButton}>
        <Text style={styles.linkButtonText}>로그인</Text>
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
