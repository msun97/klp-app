import { useRouter } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../lib/AuthContext";

export default function PostList() {
  const router = useRouter();
  const { logout } = useAuth();
  const mockPosts = [
    { id: "1", title: "첫 번째 글" },
    { id: "2", title: "두 번째 글" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Redirection to login is handled by AuthContext in _layout.tsx
    } catch (error) {
      Alert.alert("로그아웃 실패", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>

      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => router.push("/post/write")}
        style={styles.writeButton}
      >
        <Text style={{ color: "white" }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF6347", // Tomato color for logout
    padding: 10,
    borderRadius: 8,
    zIndex: 1, // Ensure button is on top
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  writeButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#4F46E5",
    borderRadius: 50,
    padding: 15,
  },
});
