import { db } from '../firebase/firebaseConfig';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore'; // Import setDoc

const postsCollection = collection(db, 'posts');

export const createPost = async (postId, postData) => { // Accept postId as argument
  const newPost = { ...postData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  await setDoc(doc(postsCollection, postId), newPost); // Use setDoc with postId
  return postId;
};

export const getPost = async (postId) => {
  const postDoc = await getDoc(doc(postsCollection, postId));
  return postDoc.exists() ? { id: postDoc.id, ...postDoc.data() } : null;
};

export const getPosts = async () => {
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePost = async (postId, postData) => {
  await updateDoc(doc(postsCollection, postId), { ...postData, updatedAt: serverTimestamp() });
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(postsCollection, postId));
};
