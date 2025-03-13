import { mockUsers } from "./mockData";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

// Моркнати credentials за тестване
const TEST_CREDENTIALS = {
  admin: { email: "admin@politicalblog.com", password: "admin123" },
  blogger: { email: "blogger@politicalblog.com", password: "blog123" },
  user: { email: "user@politicalblog.com", password: "user123" },
};

// Симулира login с credentials или социален вход
export const mockLogin = (email?: string, password?: string) => {
  let user;

  if (email && password) {
    // Проверка на credentials
    if (email === TEST_CREDENTIALS.admin.email && password === TEST_CREDENTIALS.admin.password) {
      user = mockUsers.find(u => u.role === "admin");
    } else if (email === TEST_CREDENTIALS.blogger.email && password === TEST_CREDENTIALS.blogger.password) {
      user = mockUsers.find(u => u.role === "blogger");
    } else if (email === TEST_CREDENTIALS.user.email && password === TEST_CREDENTIALS.user.password) {
      user = mockUsers.find(u => u.role === "user");
    }
  } else {
    // Ако няма credentials, значи е социален вход (винаги връща regular user)
    user = mockUsers.find(u => u.role === "user");
  }

  if (user) {
    store.dispatch(setUser(user));
  }
};

// Симулира регистрация
export const mockRegister = (email: string, password: string) => {
  // Проверка дали потребителя вече съществува
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error("Този имейл вече е регистриран");
  }

  // Създаване на нов потребител
  const newUser = {
    id: mockUsers.length + 1,
    uid: `mock-${mockUsers.length + 1}`,
    email,
    role: "user" as const,
  };

  // В реална среда тук ще се запазва в базата
  mockUsers.push(newUser);
  store.dispatch(setUser(newUser));
};

// Симулира logout
export const mockLogout = () => {
  store.dispatch(setUser(null));
};