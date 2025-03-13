import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { store } from "./store/store";
import { queryClient } from "./lib/queryClient";
import { Layout } from "./components/layout/Layout";

import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Article from "./pages/article";
import CreateArticle from "./pages/create-article";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </Provider>
  );
}

export default App;