import { mockUsers } from "./mockData";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

// Моркнати credentials за тестване
const TEST_CREDENTIALS = {
  admin: { username: "admin", password: "admin123" },
  blogger: { username: "blogger", password: "blog123" },
  user: { username: "user", password: "user123" },
};

// Симулира login с credentials или социален вход
export const mockLogin = (username?: string, password?: string) => {
  let user;

  if (username && password) {
    // Проверка на credentials
    if (username === TEST_CREDENTIALS.admin.username && password === TEST_CREDENTIALS.admin.password) {
      user = mockUsers.find(u => u.role === "admin");
    } else if (username === TEST_CREDENTIALS.blogger.username && password === TEST_CREDENTIALS.blogger.password) {
      user = mockUsers.find(u => u.role === "blogger");
    } else if (username === TEST_CREDENTIALS.user.username && password === TEST_CREDENTIALS.user.password) {
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

// Симулира logout
export const mockLogout = () => {
  store.dispatch(setUser(null));
};