import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import authService from '../../../services/auth';
import userService from '../../../services/users';
import { AzureData, User } from '../../../shared/types/user';
import { reduxAuthPersistKey } from '../../../shared/utils/values';
import { clearAzureLocalStorageData, saveRedirectUrl } from '../../../shared/functions';


export type AuthState = {
  user: User | null,
  refreshToken: string
};


const initialState: AuthState = {
  user: null,
  refreshToken: ''
};


export const login = createAsyncThunk('auth/login', async (azureData: AzureData, thunkAPI) => {
  try {
    const response = await authService.login(azureData);

    if (!response.user.active) {
      await userService.activateUser(response.user.id);
    }

    return {
      ...response,
      user: {
        ...response.user,
        active: true,
        azureData
      }
    } as AuthState;
  }

  catch (error: any) {
    const message = error || 'error';
    return thunkAPI.rejectWithValue({message, azureData});
  };
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout();
  }

  catch (error: any) {
    const message = error || 'error';
    return thunkAPI.rejectWithValue(message);
  };
});


export const clearLoginState = (skipPageReload: boolean, error?: string) => {
  clearAzureLocalStorageData();
  sessionStorage.removeItem('persist:' + reduxAuthPersistKey);

  if (error) {
    toast.error(error, {
      onClose: () => window.location.pathname = '/login'
    });
  } else {
    if (!skipPageReload) window.location.pathname = '/login';
  }
};


const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setUser: (state: AuthState, {payload}: {payload: User | null}) => {
      state.user = payload;
    },

    setRefreshToken: (state: AuthState, {payload}: {payload: string}) => {
      state.refreshToken = payload;
    },

    forceLogout: (_: AuthState, {payload}: {payload: string}) => {
      saveRedirectUrl();
      clearLoginState(false, payload);
    }
  },

  extraReducers: (builder) => {
    // User login process
    builder
      .addCase(login.fulfilled, (state, {payload}) => {
        state.user = payload.user;
        state.refreshToken = payload.refreshToken;
      })
      .addCase(login.rejected, (_, {payload}: any) => {
        clearLoginState(false, payload.message);
      });

    // User logout process
    builder
      .addMatcher(isAnyOf(logout.fulfilled, logout.rejected), () => {
        // Clear persisted auth state before login
        clearLoginState(false);
      });
  }
});


export const { setUser, setRefreshToken, forceLogout } = authSlice.actions;
export default authSlice.reducer;
