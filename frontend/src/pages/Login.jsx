import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaLock, FaUserAlt } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";

import { useAuthStore } from "../store/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const {login} = useAuthStore(); // <- Zustand
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result=await login({
        username: form.username,
        email: form.username,
        password: form.password,
      });
  // Zustand store method
      if(result?.data?.user||result?.user){
        
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-white to-sky-100 overflow-hidden">
      {/* Left Panel */}
      <motion.div
        className="hidden md:flex w-1/2 items-center justify-center relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Animated background rings */}
        <motion.div
          className="w-80 h-80 border-4 border-blue-300 rounded-full absolute animate-pulse"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.div
          className="text-center z-10 text-blue-800 text-4xl font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome Back!
        </motion.div>

        {/* Floating lock icon */}
        <motion.div
          className="absolute bottom-10 left-16 text-blue-500 opacity-30"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <FaLock size={50} />
        </motion.div>
      </motion.div>

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 flex items-center justify-center gap-2">
            <FiLogIn /> Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <FaUserAlt className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username or Email"
                value={form.username}
                onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
