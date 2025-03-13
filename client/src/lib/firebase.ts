import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "vladimir-blog-5cbac.firebasestorage.app",
  messagingSenderId: "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithRedirect(auth, provider);
export const logout = () => signOut(auth);

export const uploadAvatar = async (file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("Трябва да сте влезли в системата");
  }

  try {
    // Simple path: avatars/userId/filename
    const path = `avatars/${auth.currentUser.uid}/${file.name}`;
    const storageRef = ref(storage, path);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get and return download URL
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Грешка при качване на снимката");
  }
};