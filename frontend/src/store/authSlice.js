import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    // Backend appears cookie-based; keep token optional for future JWT.
    token: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload || {};
      state.isAuthenticated = true;
      state.user = user ?? state.user ?? null;
      state.token = token ?? state.token ?? null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

