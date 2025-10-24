import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebaseConfig';

export const storage = getStorage(app);

export const uploadImageAndGetURL = async (uri, path) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, path);
  const uploadTask = await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(uploadTask.ref);
  return downloadURL;
};
