import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Article } from "@shared/schema";

interface ArticlesState {
  articles: Article[];
  loading: boolean;
  filters: {
    author: string | null;
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
  };
}

const initialState: ArticlesState = {
  articles: [],
  loading: false,
  filters: {
    author: null,
    dateRange: {
      start: null,
      end: null,
    },
  },
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFilters: (state, action: PayloadAction<ArticlesState["filters"]>) => {
      state.filters = action.payload;
    },
  },
});

export const { setArticles, setLoading, setFilters } = articleSlice.actions;
export default articleSlice.reducer;
