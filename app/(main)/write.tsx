import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { createPost } from "../../lib/firestore/posts";
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { uploadImageAndGetURL } from "../../lib/firebase/storage"; // Import uploadImageAndGetURL

export default function WritePost() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null); // New state for selected image URI

  const pickImage = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '이미지를 선택하려면 미디어 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

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
    let imageUrl = null;
    try {
      if (imageUri) {
        // Upload image to Firebase Storage
        const imagePath = `post_images/${user.uid}/${Date.now()}`;
        imageUrl = await uploadImageAndGetURL(imageUri, imagePath);
      }

      await createPost({
        title,
        content,
        authorId: user.uid,
        authorEmail: user.email,
        imageUrl: imageUrl, // Store image URL in Firestore
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

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton} disabled={loading}>
        <Text style={styles.imagePickerButtonText}>이미지 선택</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

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
    height: 150, // Adjusted height to make space for image picker
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  imagePickerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 15,
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
