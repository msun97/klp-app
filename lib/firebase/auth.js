import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './firebaseConfig';

export const auth = getAuth(app);

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

export const signup = async (email, password) => {
  if (!validateEmail(email)) {
    throw new Error('Invalid email address.');
  }
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters long.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  if (!validateEmail(email)) {
    throw new Error('Invalid email address.');
  }
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 6 characters long.');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
