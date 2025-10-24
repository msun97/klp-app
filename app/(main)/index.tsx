import { useRouter } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useAuth } from "../../lib/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase/firebaseConfig"; // Adjust path as needed

export default function PostList() {
  const router = useRouter();
  const { logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching posts: ", error);
      Alert.alert("오류", "게시물을 불러오는 데 실패했습니다.");
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirection to login is handled by AuthContext in _layout.tsx
    } catch (error) {
      Alert.alert("로그아웃 실패", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>게시물 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 게시물이 없습니다.</Text>
          <Text style={styles.emptyText}>새 게시물을 작성해보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/post/${item.id}`)}
              style={styles.postItem}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              {item.authorEmail && <Text style={styles.postAuthor}>작성자: {item.authorEmail}</Text>}
              {item.createdAt && (
                <Text style={styles.postDate}>
                  {new Date(item.createdAt.toDate()).toLocaleString()}
                </Text>
              )}
              <View style={styles.postStats}>
                <Text style={styles.postStatText}>좋아요: {item.likesCount || 0}</Text>
                <Text style={styles.postStatText}>댓글: {item.commentsCount || 0}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push("/post/write")}
        style={styles.writeButton}
      >
        <Text style={{ color: "white", fontSize: 24 }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60, // Adjust for logout button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    marginBottom: 5,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF6347", // Tomato color for logout
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 1, // Ensure button is on top
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  postItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postAuthor: {
    fontSize: 14,
    color: "#666",
  },
  postDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 10,
  },
  postStatText: {
    fontSize: 12,
    color: '#666',
    marginRight: 15,
  },
  writeButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#4F46E5",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
