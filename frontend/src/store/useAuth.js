import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
// import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        try {
          const res = await axiosInstance.get("/auth/check");
    
          set({ authUser: res.data });
          
        } catch (error) {
          console.log("Error in checkAuth:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          console.log("loggedin");
          set({ authUser: res.data });
          toast.success("Logged in successfully");
    
          
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
      register: async (data) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosInstance.post("/auth/register", data);
          console.log("Register API response:", res); // Add logging to see the actual response
          
          // Check if res has a data property, if not, use the entire response as the user data
          const userData = res.data || res;
          set({ authUser: userData });
          toast.success("Account created successfully");
          
        } catch (error) {
          console.error("Registration error:", error);
          toast.error(error.response?.data?.message || "Registration failed");
        } finally {
          set({ isSigningUp: false });
        }
      },
      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully");
          
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
}));