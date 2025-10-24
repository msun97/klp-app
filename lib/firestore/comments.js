import { db } from '../firebase/firebaseConfig';
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, serverTimestamp, FieldValue, runTransaction } from 'firebase/firestore'; // Import FieldValue and runTransaction

export const createComment = async (postId, commentData) => {
  const commentsCollection = collection(db, 'posts', postId, 'comments');
  const postRef = doc(db, 'posts', postId); // Reference to the parent post

  const newComment = { ...commentData, createdAt: serverTimestamp() };

  try {
    await runTransaction(db, async (transaction) => {
      // Add the comment
      const commentDocRef = doc(commentsCollection); // Get a new doc ref for the comment
      transaction.set(commentDocRef, newComment);

      // Increment commentsCount in the parent post
      transaction.update(postRef, {
        commentsCount: FieldValue.increment(1)
      });
    });
    return true; // Indicate success
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
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
  const postRef = doc(db, 'posts', postId); // Reference to the parent post

  try {
    await runTransaction(db, async (transaction) => {
      // Delete the comment
      transaction.delete(commentDocRef);

      // Decrement commentsCount in the parent post
      transaction.update(postRef, {
        commentsCount: FieldValue.increment(-1)
      });
    });
    return true; // Indicate success
  } catch (e) {
    console.error("Transaction failed: ", e);
    throw e;
  }
};
