import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithRedirect(auth, provider);
export const logout = () => signOut(auth);

// Function to upload avatar to Firebase Storage
export const uploadAvatar = async (file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("User must be logged in to upload avatar");
  }

  try {
    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}/${filename}`);

    console.log('Starting file upload to:', storageRef.fullPath);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('File uploaded successfully:', snapshot.metadata);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File download URL:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error("Failed to upload avatar");
  }
};