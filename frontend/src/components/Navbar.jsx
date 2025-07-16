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

  const scrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById(id);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <motion.nav
      className="fixed top-5 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl px-6 py-3 
      rounded-full bg-black/60 backdrop-blur-lg border border-white/10 shadow-xl z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 70 }}
    >
      <div className="flex justify-between items-center text-white text-sm font-medium">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-wider text-white hover:text-blue-400 transition"
        >
          EVENTALLY
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => scrollToSection('all-events')}
            className="hover:text-blue-400 transition"
          >
            All Events
          </button>

          {authUser ? (
            <>
              <button
                onClick={() => scrollToSection('personalized-events')}
                className="hover:text-blue-400 transition"
              >
                For You
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-300 hover:text-red-500 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="flex items-center justify-center w-9 h-9 rounded-full 
                bg-white/10 hover:bg-white/20 transition border border-white/20"
                title="Profile"
              >
                <FaUserCircle className="text-white text-lg" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-green-300 hover:text-green-400 transition"
              >
                <FaSignInAlt />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-1 text-purple-300 hover:text-purple-400 transition"
              >
                <FaUserPlus />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
