/**
 * Auth Slice - manages user login state
 */

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null, // {uid, email, displayName}
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: state => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {setUser, clearUser, setLoading, setError} = authSlice.actions;

// Selectors
export const selectUser = state => state.auth.user;
export const selectIsLoggedIn = state => !!state.auth.user;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;

export default authSlice.reducer;
