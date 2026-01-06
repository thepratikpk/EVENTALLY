import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuth";
import { API } from "../lib/axios";

const Login = () => {
  const navigate = useNavigate();
  const { login, authUser } = useAuthStore();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (authUser) navigate("/");
  }, [authUser, navigate]);

  useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID_FRONTEND,
        callback: handleGoogleLoginSuccess,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        width: "100%",
      });
    }
  }, []);

  const handleGoogleLoginSuccess = async (response) => {
    const idToken = response.credential;
    try {
      const backendResponse = await API.post('/auth/google-login', { idToken });
      if (backendResponse.data?.data?.user) {
        useAuthStore.getState().setAuthUser(backendResponse.data.data.user);
        toast.success("Signed in with Google!");
        navigate("/");
      } else {
        toast.error("Google sign-in failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err?.response?.data?.message || "Google sign-in failed");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login({
        username: form.username,
        email: form.username,
        password: form.password,
      });
      if (result?.data?.user || result?.user) {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white border border-[#e8eaed] rounded-lg p-8 sm:p-10 shadow-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-semibold text-[#202124]">
                Event<span className="text-[#1a73e8]">Ally</span>
              </span>
            </Link>
            <h1 className="text-2xl font-normal text-[#202124] mt-6 mb-2">Sign in</h1>
            <p className="text-sm text-[#5f6368]">to continue to EventAlly</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username/Email Input */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Email or username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <button type="button" className="text-sm font-medium text-[#1a73e8] hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4">
              <Link
                to="/register"
                className="text-sm font-medium text-[#1a73e8] hover:underline"
              >
                Create account
              </Link>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#1a73e8] text-white rounded-md font-medium text-sm hover:bg-[#1557b0] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Signing in..." : "Next"}
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e8eaed]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#5f6368]">or</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div ref={googleButtonRef} className="w-full flex justify-center" />
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-xs text-[#5f6368]">
          <span>English (United States)</span>
          <div className="flex gap-4">
            <button className="hover:text-[#202124]">Help</button>
            <button className="hover:text-[#202124]">Privacy</button>
            <button className="hover:text-[#202124]">Terms</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
