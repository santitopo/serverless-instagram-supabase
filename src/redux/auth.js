import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  isLoading: true,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticated(state, action) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    authStarted(state, action) {
      state.isLoading = true;
      state.error = null;
    },
    authCleared(state, action) {
      state.user = null;
      state.isLoading = false;
      state.error = action.payload?.message || null;
    },
  },
});

export const { authenticated, authCleared, authStarted } = authSlice.actions;

export const selectError = (state) => state.auth.error;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
