import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaUserAlt, FaEnvelope, FaLock, FaUserEdit } from 'react-icons/fa';
import { MdOutlineInterests } from 'react-icons/md';
import { useAuthStore } from '../store/useAuth';

const interestsOptions = [
  "technical", "cultural", "sports", "literary", "workshop", "seminar", "others"
];

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  
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

    try {
      const { confirmPassword, ...payload } = form; // remove confirmPassword
      await register(payload);
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);
      const message = err?.response?.data?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-sky-100 to-white overflow-hidden">
      {/* Left Animation Panel */}
      <motion.div 
        className="hidden md:flex w-1/2 items-center justify-center relative"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="w-96 h-96 bg-blue-200 rounded-full absolute animate-pulse"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        />
        <motion.div 
          className="text-center z-10 text-blue-800 text-4xl font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          Join Our Event Community
        </motion.div>

        {/* Floating Shapes */}
        <motion.div className="absolute w-20 h-20 bg-blue-300 opacity-30 rounded-full top-10 left-10"
          animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 4 }} />
        <motion.div className="absolute w-32 h-32 bg-purple-200 opacity-20 rounded-full bottom-20 left-20"
          animate={{ x: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 6 }} />
        <motion.div className="absolute w-16 h-16 bg-green-300 opacity-20 rounded-full top-1/3 left-1/4"
          animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} />
      </motion.div>

      {/* Right Form Panel */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Register</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fullname */}
            <div className="relative">
              <FaUserEdit className="absolute top-3 left-3 text-gray-400" />
              <input type="text" name="fullname" placeholder="Full Name"
                value={form.fullname} onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>

            {/* Username */}
            <div className="relative">
              <FaUserAlt className="absolute top-3 left-3 text-gray-400" />
              <input type="text" name="username" placeholder="Username"
                value={form.username} onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input type="email" name="email" placeholder="Email"
                value={form.email} onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input type="password" name="password" placeholder="Password"
                value={form.password} onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password"
                value={form.confirmPassword} onChange={handleChange}
                className="pl-10 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required />
            </div>

            {/* Interests */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                <MdOutlineInterests />
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interestsOptions.map((interest) => (
                  <motion.div
                    key={interest}
                    whileHover={{ scale: 1.1 }}
                    className={`cursor-pointer px-3 py-1 rounded-full border transition 
                      ${form.interests.includes(interest)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Register
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
