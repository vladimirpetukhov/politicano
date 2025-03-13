import { auth, storage } from "./firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateCurrentUser
} from "firebase/auth";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";
import { User } from "@shared/schema";

// Login with email and password
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const user: User = {
    id: 0,
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName,
    avatarUrl: firebaseUser.photoURL,
    role: "user",
  };

  store.dispatch(setUser(user));
};

// Register with email and password
export const registerWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  await sendEmailVerification(firebaseUser);

  const user: User = {
    id: 0,
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: null,
    avatarUrl: null,
    role: "user",
  };

  store.dispatch(setUser(user));
};

// Logout
export const logout = async () => {
  await auth.signOut();
  store.dispatch(setUser(null));
};

// Update profile
export const updateUserProfile = async (displayName: string, photoURL?: string | null) => {
  if (!auth.currentUser) throw new Error("Not logged in");

  try {
    console.log('Updating profile:', { displayName, photoURL });

    // First update Firebase Auth profile
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL: photoURL || null
    });

    // Force refresh to get updated profile
    await updateCurrentUser(auth, auth.currentUser);

    console.log('Profile updated successfully');

    // Update Redux store
    store.dispatch(setUser({
      id: 0, // This should be fetched from your database
      uid: auth.currentUser.uid,
      email: auth.currentUser.email!,
      displayName: auth.currentUser.displayName,
      avatarUrl: auth.currentUser.photoURL,
      role: "user", // This should be fetched from your database
    }));

    // TODO: Add API call to update user info in PostgreSQL database
    // This will be implemented when we set up the backend routes

    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string) => {
  if (!auth.currentUser || !auth.currentUser.email) {
    throw new Error("Not logged in");
  }

  try {
    // Re-authenticate user first
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Then change password
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error("Password change error:", error);
    throw new Error("Wrong current password or password change failed");
  }
};