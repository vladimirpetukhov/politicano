import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import articleReducer from "./slices/articleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
