import { createSlice } from '@reduxjs/toolkit';

// Helper function to save data to localStorage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Helper function to load data from localStorage
const loadFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Load initial state from localStorage
const initialState = {
  users: loadFromLocalStorage('users') || [], // Load users from localStorage
  currentUser: loadFromLocalStorage('currentUser') || null, // Load currentUser from localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const { username, password } = action.payload;
      const userExists = state.users.some((user) => user.username === username);
      if (!userExists) {
        state.users.push({ username, password });
        state.currentUser = { username }; // Set currentUser after registration
        saveToLocalStorage('users', state.users); // Save users to localStorage
        saveToLocalStorage('currentUser', state.currentUser); // Save currentUser to localStorage
      }
    },
    loginUser: (state, action) => {
      const { username, password } = action.payload;
      const user = state.users.find(
        (user) => user.username === username && user.password === password
      );
      if (user) {
        state.currentUser = { username }; // Set currentUser after login
        saveToLocalStorage('currentUser', state.currentUser); // Save currentUser to localStorage
      }
    },
    logoutUser: (state) => {
      state.currentUser = null; // Clear currentUser on logout
      saveToLocalStorage('currentUser', null); // Clear currentUser from localStorage
    },
  },
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;