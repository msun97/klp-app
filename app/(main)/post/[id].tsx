import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, Image, ScrollView, FlatList, TextInput, TouchableOpacity } from "react-native";
import { getPost } from "../../../lib/firestore/posts";
import { createComment, getComments } from "../../../lib/firestore/comments"; // Import comment functions
import { useAuth } from "../../../lib/AuthContext"; // Import useAuth
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"; // Import Firestore functions for comments
import { db } from "../../../lib/firebase/firebaseConfig"; // Import db

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth(); // Get current user
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [addingComment, setAddingComment] = useState(false);

  // Fetch Post Details
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setPostError("게시글 ID가 없습니다.");
        setLoadingPost(false);
        return;
      }
      try {
        const fetchedPost = await getPost(id);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setPostError("게시글을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setPostError("게시글을 불러오는 데 실패했습니다.");
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [id]);

  // Listen for Comments
  useEffect(() => {
    if (!id) return;

    const q = query(collection(db, "posts", id, "comments"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
      setLoadingComments(false);
    }, (error) => {
      console.error("Error fetching comments: ", error);
      Alert.alert("오류", "댓글을 불러오는 데 실패했습니다.");
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddComment = async () => {
    if (!user) {
      Alert.alert("오류", "로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }
    if (!commentInput.trim()) {
      Alert.alert("오류", "댓글 내용을 입력해주세요.");
      return;
    }

    setAddingComment(true);
    try {
      await createComment(id, {
        content: commentInput,
        authorId: user.uid,
        authorEmail: user.email,
      });
      setCommentInput(""); // Clear input after adding
    } catch (error) {
      console.error("Error adding comment: ", error);
      Alert.alert("오류", "댓글 작성에 실패했습니다.");
    } finally {
      setAddingComment(false);
    }
  };

  if (loadingPost) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>게시글 불러오는 중...</Text>
      </View>
    );
  }

  if (postError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{postError}</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>게시글을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: post.title }} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{post.title}</Text>
        {post.authorEmail && <Text style={styles.author}>작성자: {post.authorEmail}</Text>}
        {post.createdAt && (
          <Text style={styles.date}>
            작성일: {new Date(post.createdAt.toDate()).toLocaleString()}
          </Text>
        )}

        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
        )}

        <Text style={styles.content}>{post.content}</Text>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>댓글</Text>
          {loadingComments ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : comments.length === 0 ? (
            <Text style={styles.emptyCommentsText}>아직 댓글이 없습니다.</Text>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentAuthor}>{item.authorEmail}</Text>
                  <Text style={styles.commentContent}>{item.content}</Text>
                  {item.createdAt && (
                    <Text style={styles.commentDate}>
                      {new Date(item.createdAt.toDate()).toLocaleString()}
                    </Text>
                  )}
                </View>
              )}
              scrollEnabled={false} // Disable FlatList scrolling inside ScrollView
            />
          )}

          {/* Comment Input */}
          {user && ( // Only show comment input if user is logged in
            <View style={styles.commentInputContainer}>
              <TextInput
                placeholder="댓글을 입력하세요..."
                value={commentInput}
                onChangeText={setCommentInput}
                style={styles.commentTextInput}
                multiline
                editable={!addingComment}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.addCommentButton}
                disabled={addingComment}
              >
                {addingComment ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.addCommentButtonText}>등록</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
  },
  postImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    marginBottom: 20, // Add margin bottom for comments section
  },
  commentsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  emptyCommentsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  commentItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 3,
  },
  commentContent: {
    fontSize: 15,
    color: "#333",
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
    textAlign: "right",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 100, // Limit height for multiline input
  },
  addCommentButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addCommentButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
