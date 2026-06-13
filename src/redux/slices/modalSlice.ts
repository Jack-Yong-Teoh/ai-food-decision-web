import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  loginModalOpen: boolean;
  signUpModalOpen: boolean;
  forgotPassModalOpen: boolean;
}

const initialState: ModalState = {
  loginModalOpen: false,
  signUpModalOpen: false,
  forgotPassModalOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.loginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },
    openSignUpModal: (state) => {
      state.signUpModalOpen = true;
    },
    closeSignUpModal: (state) => {
      state.signUpModalOpen = false;
    },
    closeAllModals: (state) => {
      state.loginModalOpen = false;
      state.signUpModalOpen = false;
      state.forgotPassModalOpen = false;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openSignUpModal,
  closeSignUpModal,
  closeAllModals,
} = modalSlice.actions;

export default modalSlice.reducer;
