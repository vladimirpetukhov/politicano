import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { store } from "./store/store";
import { queryClient } from "./lib/queryClient";
import { Layout } from "./components/layout/Layout";
import { useEffect } from "react";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, setLoading } from "./store/slices/authSlice";

import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Article from "./pages/article";
import CreateArticle from "./pages/create-article";
import NotFound from "./pages/not-found";

// Firebase auth state listener
function AuthStateListener({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        store.dispatch(setUser({
          id: 0, // This will be set by the backend
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          avatarUrl: firebaseUser.photoURL,
          role: "user", // Default role, should be updated from backend
        }));
      } else {
        // User is signed out
        store.dispatch(setUser(null));
      }
      store.dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthStateListener>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/profile" component={Profile} />
              <Route path="/article/:id" component={Article} />
              <Route path="/create-article" component={CreateArticle} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </AuthStateListener>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;