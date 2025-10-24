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
      let errorMessage = "알 수 없는 오류가 발생했습니다.";
      if (error.message) {
        if (error.message.includes("auth/email-already-in-use")) {
          errorMessage = "이미 사용 중인 이메일 주소입니다.";
        } else if (error.message.includes("auth/invalid-email")) {
          errorMessage = "유효하지 않은 이메일 주소입니다.";
        } else if (error.message.includes("auth/weak-password")) {
          errorMessage = "비밀번호는 6자 이상이어야 합니다.";
        } else if (error.message.includes("Password must be at least 6 characters long.")) {
          errorMessage = "비밀번호는 6자 이상이어야 합니다.";
        } else if (error.message.includes("Invalid email address.")) {
          errorMessage = "유효하지 않은 이메일 주소입니다.";
        }
        else {
          errorMessage = error.message; // Fallback to generic message if not recognized
        }
      }
      Alert.alert("회원가입 실패", errorMessage);
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
