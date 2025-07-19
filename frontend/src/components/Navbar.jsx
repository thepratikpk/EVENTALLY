import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAuthStore } from '../store/useAuth';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-9 left-1/2 transform -translate-x-1/2 w-[88%] max-w-sm px-4 py-4
      rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-sm z-50 text-white text-xs"
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 90 }}
    >
      <div className="flex justify-between items-center ">
        {/* Left Side */}
        <button
          onClick={() => navigate('/about')}
          className="hover:text-blue-400 transition px-5"
        >
          About
        </button>

        {/* Right Side - Auth Controls */}
        <div className="flex items-center gap-6 px-2">
          {authUser ? (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-300 hover:text-red-500 transition"
              >
                <FaSignOutAlt className="text-sm" />
                <span>Logout</span>
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-1 hover:text-white/80 transition"
              >
                <FaUserCircle className="text-base" />
                <span>Profile</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-green-300 hover:text-green-400 transition"
              >
                <FaSignInAlt className="text-sm" />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1 text-purple-300 hover:text-purple-400 transition"
              >
                <FaUserPlus className="text-sm" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
