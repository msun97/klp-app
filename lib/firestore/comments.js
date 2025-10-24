import { db } from '../firebase/firebaseConfig';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export const createComment = async (postId, commentData) => {
  const commentsCollection = collection(db, 'posts', postId, 'comments');
  const newComment = { ...commentData, createdAt: serverTimestamp() };
  const docRef = await addDoc(commentsCollection, newComment);
  return docRef.id;
};

export const getComments = async (postId) => {
  const commentsCollection = collection(db, 'posts', postId, 'comments');
  const q = query(commentsCollection, orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateComment = async (postId, commentId, commentData) => {
  const commentDocRef = doc(db, 'posts', postId, 'comments', commentId);
  await updateDoc(commentDocRef, { ...commentData, updatedAt: serverTimestamp() });
};

export const deleteComment = async (postId, commentId) => {
  const commentDocRef = doc(db, 'posts', postId, 'comments', commentId);
  await deleteDoc(commentDocRef);
};
