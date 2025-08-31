import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  user: null,
  token: sessionStorage.getItem('token') || null,
  isAuthenticated: !!sessionStorage.getItem('token'),
  status: 'idle',
  signupStatus: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.status = 'loading';
    },
    loginSuccess: (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      sessionStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    signupRequest: (state) => {
        state.signupStatus = 'loading';
        state.error = null;
    },
    signupSuccess: (state) => {
        state.signupStatus = 'succeeded';
    },
    signupFailure: (state, action) => {
        state.signupStatus = 'failed';
        state.error = action.payload;
    },
    logout: (state) => {
      try {
        const token = state.token;
        if (token) {
          const decoded = jwtDecode(token);
          const userEmail = decoded.email;
          localStorage.removeItem(`bookmarks_${userEmail}`);
        }
      } catch (e) {
        console.error("Could not clear bookmarks on logout", e);
      }
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      sessionStorage.removeItem('token');
    },
    hydrateUser: (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
    },
    resetAuthState: (state) => {
        state.status = 'idle';
        state.signupStatus = 'idle';
        state.error = null;
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logout,
  hydrateUser,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
