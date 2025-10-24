import { db } from '../firebase/firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDoc, FieldValue, runTransaction } from 'firebase/firestore'; // Import FieldValue and runTransaction

export const toggleLike = async (postId, userId) => {
  const likeDocRef = doc(db, 'posts', postId, 'likes', userId);
  const postRef = doc(db, 'posts', postId); // Reference to the parent post

  try {
    const result = await runTransaction(db, async (transaction) => {
      const likeDoc = await transaction.get(likeDocRef);

      if (likeDoc.exists()) {
        // Unlike
        transaction.delete(likeDocRef);
        transaction.update(postRef, {
          likesCount: FieldValue.increment(-1)
        });
        return false; // Indicate unliked
      } else {
        // Like
        transaction.set(likeDocRef, { userId, createdAt: new Date() });
        transaction.update(postRef, {
          likesCount: FieldValue.increment(1)
        });
        return true; // Indicate liked
      }
    });
    return result;
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
};

export const hasLiked = async (postId, userId) => {
  const likeDocRef = doc(db, 'posts', postId, 'likes', userId);
  const likeDoc = await getDoc(likeDocRef);
  return likeDoc.exists();
};

export const getLikesCount = async (postId) => {
  // This function is now less critical as likesCount is denormalized in the post document
  // However, it can still be used to fetch the current count if needed directly from the post.
  console.warn("getLikesCount is a placeholder. Consider fetching likesCount directly from the post document.");
  return 0; // Placeholder, actual count should come from post document
};
