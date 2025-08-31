import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: sessionStorage.getItem('token') || null,
  isAuthenticated: !!sessionStorage.getItem('token'),
  status: 'idle', // for login status
  signupStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ... login reducers remain the same
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
    },
    // Signup Reducers
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
    },
    hydrateUser: (state, action) => {
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
  resetAuthState, // Export the new action
} = authSlice.actions;

export default authSlice.reducer;