import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { createPost } from "../../lib/firestore/posts"; // Adjust path as needed

export default function WritePost() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!user) {
      Alert.alert("오류", "로그인 후 게시글을 작성할 수 있습니다.");
      router.replace("/login");
      return;
    }

    if (!title.trim()) {
      Alert.alert("오류", "제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("오류", "내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await createPost({
        title,
        content,
        authorId: user.uid,
        authorEmail: user.email, // Store author's email for display
      });
      Alert.alert("성공", "게시글이 성공적으로 작성되었습니다.");
      router.back(); // Go back to the post list
    } catch (error) {
      console.error("Error creating post: ", error);
      Alert.alert("오류", "게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        editable={!loading}
      />
      <TextInput
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
        style={[styles.input, styles.contentInput]}
        editable={!loading}
      />

      <TouchableOpacity
        onPress={handleCreatePost}
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>등록</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
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
  contentInput: {
    height: 200,
    textAlignVertical: "top", // For Android to start text at top
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
