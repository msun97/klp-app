import { db } from '../firebase/firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const usersCollection = collection(db, 'users');

export const getUser = async (uid) => {
  const userDoc = await getDoc(doc(usersCollection, uid));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
};

export const createUserProfile = async (uid, data) => {
  await setDoc(doc(usersCollection, uid), data);
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(usersCollection, uid), data);
};

export const deleteUserProfile = async (uid) => {
  await deleteDoc(doc(usersCollection, uid));
};
