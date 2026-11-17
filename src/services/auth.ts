import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
} from '@utils/burger-api';
import { setCookie, deleteCookie } from '@utils/cookie';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TUser } from '@utils/types';

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (data: { email: string; name: string; password: string }) => {
    const response = await registerUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }
);

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }
);

export const logoutUserThunk = createAsyncThunk('auth/logout', async () => {
  const response = await logoutApi();
  if (response.success) {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  }
  return response;
});

export const getUserInfoThunk = createAsyncThunk('auth/info', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password?: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const checkAuthThunk = createAsyncThunk('auth/checkAuth', async () => {
  const response = await getUserApi();
  return response.user;
});

type authState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: SerializedError | null;
  isAuthChecked: boolean;
};

const initialStateAuth: authState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthChecked: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialStateAuth,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        }
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getUserInfoThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserInfoThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getUserInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(checkAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecked = false;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error;
      });
  },
});
