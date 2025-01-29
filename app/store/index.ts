import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import searchResultReducer from "./searchResultSlices";

export const store = configureStore({
  reducer: {
    user: userReducer,
    searchResults: searchResultReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
