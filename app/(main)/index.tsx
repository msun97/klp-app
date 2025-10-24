import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function PostList() {
  const router = useRouter();
  const mockPosts = [
    { id: "1", title: "첫 번째 글" },
    { id: "2", title: "두 번째 글" },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
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
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
          backgroundColor: "#4F46E5",
          borderRadius: 50,
          padding: 15,
        }}
      >
        <Text style={{ color: "white" }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}
