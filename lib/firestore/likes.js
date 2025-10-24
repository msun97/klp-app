import { db } from '../firebase/firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

export const toggleLike = async (postId, userId) => {
  const likeDocRef = doc(db, 'posts', postId, 'likes', userId);
  const likeDoc = await getDoc(likeDocRef);

  if (likeDoc.exists()) {
    // Unlike
    await deleteDoc(likeDocRef);
    return false;
  } else {
    // Like
    await setDoc(likeDocRef, { userId, createdAt: new Date() });
    return true;
  }
};

export const hasLiked = async (postId, userId) => {
  const likeDocRef = doc(db, 'posts', postId, 'likes', userId);
  const likeDoc = await getDoc(likeDocRef);
  return likeDoc.exists();
};

export const getLikesCount = async (postId) => {
  // This would typically be handled by a denormalized counter in the post document
  // For a real-time count, you'd use onSnapshot and count documents
  // For simplicity, this is a placeholder.
  console.warn("getLikesCount is a placeholder. Consider denormalizing likesCount in post document.");
  return 0;
};
