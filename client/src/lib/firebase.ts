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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Auth providers
const provider = new GoogleAuthProvider();
export const loginWithGoogle = () => signInWithRedirect(auth, provider);
export const logout = () => signOut(auth);

export const uploadAvatar = async (file: File): Promise<string> => {
  if (!auth.currentUser) {
    throw new Error("User must be logged in to upload avatar");
  }

  try {
    // Create unique file name to prevent conflicts
    const uniqueFileName = `${Date.now()}-${file.name}`;
    // Create reference to 'avatars/userId/filename'
    const avatarRef = ref(storage, `avatars/${auth.currentUser.uid}/${uniqueFileName}`);

    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(avatarRef, file);
    console.log("File uploaded successfully:", snapshot.ref.fullPath);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File available at:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar");
  }
};