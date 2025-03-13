import { mockUsers } from "./mockData";
import { store } from "@/store/store";
import { setUser } from "@/store/slices/authSlice";

// Симулира login с mock потребител
export const mockLogin = (userType: "admin" | "blogger" | "user" = "user") => {
  const user = mockUsers.find(u => u.role === userType);
  if (user) {
    store.dispatch(setUser(user));
  }
};

// Симулира logout
export const mockLogout = () => {
  store.dispatch(setUser(null));
};
