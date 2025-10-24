import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function PostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>글 제목 {id}</Text>
      <Text style={{ marginTop: 10 }}>여기에 글 내용이 들어갑니다.</Text>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginTop: 30, backgroundColor: "#4F46E5", padding: 10, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>뒤로가기</Text>
      </TouchableOpacity>
    </View>
  );
}
  