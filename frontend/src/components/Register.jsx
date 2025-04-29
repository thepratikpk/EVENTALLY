import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { LuLoaderCircle } from "react-icons/lu";
import { useAuthStore } from '../store/useAuth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    interests: ""
  });

  const { register, isSigningUp, authUser } = useAuthStore();
  const navigate = useNavigate();

  // Redirect when logged in
  useEffect(() => {
    if (authUser) {
      navigate('/'); // Navigate to the home/hero page
    }
  }, [authUser, navigate]);

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (!formData.interests.trim()) return toast.error("At least one interest is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      await register(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        className="w-full max-w-sm p-8 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg border border-white/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-gray-800">Create Account</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className='relative'>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500/80" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-white/40 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400/30 focus:border-gray-400/50 placeholder-gray-500/70 text-gray-700"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500/80" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2.5 bg-white/40 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400/30 focus:border-gray-400/50 placeholder-gray-500/70 text-gray-700"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500/80 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOff className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Interests */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-4 pr-4 py-2.5 bg-white/40 border border-gray-300/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400/30 focus:border-gray-400/50 placeholder-gray-500/70 text-gray-700"
                placeholder="Interests (comma separated)"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-2.5 px-6 bg-gray-800/90 hover:bg-gray-800 rounded-lg font-normal text-white transition-all flex justify-center items-center gap-2"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <LuLoaderCircle className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </motion.button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6 pt-5 border-t border-gray-300/30">
          <p className="text-gray-600/90 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;