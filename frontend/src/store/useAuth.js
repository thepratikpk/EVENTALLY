import { create } from "zustand";
import { API } from "../lib/axios";
import toast from "react-hot-toast";


export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggedin:false,
    checkAuth: async () => {
        try {
            await API.post('/auth/refresh-token');
            const res = await API.get('/auth/me')
            set({ authUser: res.data?.data })
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    register: async (data) => {
        set({ isSigningUp: true })
        try {
             await API.post('/auth/register',data)
            
            toast.success("Registered successfully");
        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
          set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({isLoggedin:true})
        try {
            const res = await API.post("/auth/login", data);
            set({ authUser: res.data?.data?.user });
            toast.success("Logged in successfully");
            return res.data
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
            throw err
        } finally {
          set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await API.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (err) {
            toast.error("Logout failed");
        }
    },
}))