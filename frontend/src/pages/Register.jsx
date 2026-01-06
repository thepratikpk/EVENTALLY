import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuth';

const interestsOptions = [
  "technical", "cultural", "sports", "literary", "workshop", "seminar", "others"
];

const Register = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
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
      toast.error("Passwords don't match");
      return;
    }

    if (form.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await register(payload);
      toast.success("Account created successfully!");
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);
      toast.error(err?.response?.data?.message || "Registration failed");
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
        className="w-full max-w-lg"
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
            <h1 className="text-2xl font-normal text-[#202124] mt-6 mb-2">Create your account</h1>
            <p className="text-sm text-[#5f6368]">Join EventAlly to discover events</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="fullname"
                placeholder="Full name"
                value={form.fullname}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
            />

            {/* Password Row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-base text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all duration-200"
              />
            </div>

            {/* Interests */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-[#202124] mb-3">
                Select your interests
              </label>
              <div className="flex flex-wrap gap-2">
                {interestsOptions.map((interest) => (
                  <motion.button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${form.interests.includes(interest)
                        ? 'bg-[#1a73e8] text-white'
                        : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-6">
              <Link
                to="/login"
                className="text-sm font-medium text-[#1a73e8] hover:underline"
              >
                Sign in instead
              </Link>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#1a73e8] text-white rounded-md font-medium text-sm hover:bg-[#1557b0] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? "Creating..." : "Create account"}
              </motion.button>
            </div>
          </form>
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

export default Register;
