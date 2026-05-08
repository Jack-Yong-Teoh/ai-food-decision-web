import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LayoutState {
  collapsed: boolean;
  logoutProgress: boolean;
}

const initialState: LayoutState = {
  collapsed: true,
  logoutProgress: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload;
    },
    setLogoutProgress: (state, action: PayloadAction<boolean>) => {
      state.logoutProgress = action.payload;
    },
    toggleLogoutProgress: (state) => {
      state.logoutProgress = !state.logoutProgress;
    },
  },
});

export const {
  toggleCollapsed,
  setCollapsed,
  setLogoutProgress,
  toggleLogoutProgress,
} = layoutSlice.actions;

export default layoutSlice.reducer;
