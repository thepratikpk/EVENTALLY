import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simple hash function (NOTE: This is NOT secure for production)
// For a real application, you should use a proper hashing library like bcrypt
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Add some salt and make it a string
  return hash.toString(36) + 'salt_' + (hash * 7).toString(36);
}

// Helper function to save data to localStorage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to load data from localStorage
const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, password, interests }, { rejectWithValue, getState }) => {
    try {
      // Check if username already exists
      const { users } = getState().auth;
      const userExists = users.some(user => user.username === username);
      
      if (userExists) {
        return rejectWithValue('Username already exists');
      }

      // Hash the password before storing
      const hashedPassword = simpleHash(password);
      
      // Return user object with interests
      return { 
        username, 
        password: hashedPassword,
        interests: interests || '' // Handle case where interests might be undefined
      };
    } catch (error) {
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue, getState }) => {
    try {
      const { users } = getState().auth;
      const user = users.find(user => user.username === username);
      
      if (!user) {
        return rejectWithValue('Invalid username or password');
      }
      
      // Check if the hashed password matches
      const hashedPassword = simpleHash(password);
      
      if (hashedPassword !== user.password) {
        return rejectWithValue('Invalid username or password');
      }
      
      // Return user data including interests
      return { 
        username,
        interests: user.interests
      };
    } catch (error) {
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

// Load initial state from localStorage
const initialState = {
  users: loadFromLocalStorage('users') || [],
  currentUser: loadFromLocalStorage('currentUser') || null,
  isAuthenticated: !!loadFromLocalStorage('currentUser'),
  error: null,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      saveToLocalStorage('currentUser', null);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateUserInterests: (state, action) => {
      // Allow updating interests later if needed
      if (state.currentUser) {
        state.currentUser.interests = action.payload;
        
        // Update the user in the users array
        const userIndex = state.users.findIndex(user => user.username === state.currentUser.username);
        if (userIndex !== -1) {
          state.users[userIndex].interests = action.payload;
          saveToLocalStorage('users', state.users);
        }
        
        // Save current user
        saveToLocalStorage('currentUser', state.currentUser);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Register user cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        saveToLocalStorage('users', state.users);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Login user cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        saveToLocalStorage('currentUser', action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutUser, clearAuthError, updateUserInterests } = authSlice.actions;
export default authSlice.reducer;
