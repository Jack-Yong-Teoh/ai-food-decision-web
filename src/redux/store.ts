import { configureStore } from "@reduxjs/toolkit";

import layoutReducer from "./slices/layoutSlice";
import modalReducer from "./slices/modalSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    profile: profileReducer,
    layout: layoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
