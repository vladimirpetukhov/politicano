import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "firebase/auth";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";
import { User } from "@shared/schema";

// Вход с имейл и парола
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Създаваме User обект от Firebase user данните
  const user: User = {
    id: 0, // Това ще се генерира от базата
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName,
    avatarUrl: firebaseUser.photoURL,
    role: "user", // По подразбиране всички нови потребители са "user"
  };

  store.dispatch(setUser(user));
};

// Регистрация с имейл и парола
export const registerWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Изпращаме имейл за потвърждение
  await sendEmailVerification(firebaseUser);

  // Създаваме User обект от Firebase user данните
  const user: User = {
    id: 0, // Това ще се генерира от базата
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: null,
    avatarUrl: null,
    role: "user",
  };

  store.dispatch(setUser(user));
};

// Изход
export const logout = async () => {
  await auth.signOut();
  store.dispatch(setUser(null));
};