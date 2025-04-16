import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/types';

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: null,
  loading: false,
  error: null,
};

// Login thunk
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
        if (username === 'admin' && password === 'password') {
            await new Promise(resolve => setTimeout(resolve, 1000));   
            localStorage.setItem('isAuthenticated', 'true');
            return { username }; // Return user data
        } else {
            return rejectWithValue('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        return rejectWithValue('Authentication failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('isAuthenticated');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ username: string }>) => {
        state.isAuthenticated = true;
        state.user = { username: action.payload.username, id: '', roles: [] }; // Adjust to match User type
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
