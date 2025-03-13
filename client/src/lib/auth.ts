import { mockUsers } from "./mockData";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

// Симулира login и връща потребител с роля "user"
export const mockLogin = () => {
  // В реална среда ролята ще се определя от backend
  const user = mockUsers.find(u => u.role === "user");
  if (user) {
    store.dispatch(setUser(user));
  }
};

// Симулира logout
export const mockLogout = () => {
  store.dispatch(setUser(null));
};