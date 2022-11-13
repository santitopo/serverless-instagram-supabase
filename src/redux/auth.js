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
      const userChunk = action.payload;
      state.user = {
        email: userChunk.email,
        email_confirmed_at: userChunk.email_confirmed_at,
        full_name: userChunk.user_metadata.full_name,
        username: userChunk.user_metadata.username,
        avatar_url: userChunk.user_metadata.avatar_url,
      };
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
