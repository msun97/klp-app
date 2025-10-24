import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function WritePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 8 }}
      />
      <TextInput
        placeholder="내용"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ borderWidth: 1, marginBottom: 20, padding: 10, borderRadius: 8, height: 200 }}
      />

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ backgroundColor: "#4F46E5", padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>등록</Text>
      </TouchableOpacity>
    </View>
  );
}
