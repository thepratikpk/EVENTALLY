import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux/authSlice";
import eventReducer from "./redux/eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
  },
});
