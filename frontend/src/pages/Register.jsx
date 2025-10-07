import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaUserAlt, FaEnvelope, FaLock, FaUserEdit, FaCheck } from 'react-icons/fa';
import { MdOutlineInterests } from 'react-icons/md';
import { FiEye, FiEyeOff, FiUserPlus } from 'react-icons/fi';
import { useAuthStore } from '../store/useAuth';

const interestsOptions = [
  "technical", "cultural", "sports", "literary", "workshop", "seminar", "others"
];

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    interests: []
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const toggleInterest = (interest) => {
    const updated = form.interests.includes(interest)
      ? form.interests.filter(i => i !== interest)
      : [...form.interests, interest];
    setForm({ ...form, interests: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (form.interests.length === 0) {
      toast.error("Please select at least one interest.");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);
      const message = err?.response?.data?.message || "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-36 h-36 bg-purple-500/10 rounded-full blur-xl"
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FiUserPlus className="text-white text-2xl" />
          </motion.div>
          
          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create Account
          </motion.h1>
          
          <motion.p
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join our event community
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div
          className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="text-sm font-medium text-gray-300 block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
                <FaUserEdit className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </motion.div>

            {/* Username Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="text-sm font-medium text-gray-300 block">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Choose a username"
                  required
                />
                <FaUserAlt className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="text-sm font-medium text-gray-300 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                  required
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <label className="text-sm font-medium text-gray-300 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                </button>
              </div>
            </motion.div>

            {/* Interests Selection */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <label className="text-sm font-medium text-gray-300 block flex items-center">
                <MdOutlineInterests className="mr-2" />
                Your Interests
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestsOptions.map((interest) => (
                  <motion.button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
                      form.interests.includes(interest)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="capitalize">{interest}</span>
                    {form.interests.includes(interest) && (
                      <FaCheck className="text-xs" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Create Account Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FiUserPlus className="mr-2" />
                  Create Account
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
