import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuth';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl px-6 py-3 bg-black/50 backdrop-blur-md rounded-full z-50 shadow-lg">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">EVENTALLY</Link>
        <div className="flex gap-6 items-center">
          <button 
            onClick={() => scrollToSection('all-events')}
            className="text-white hover:text-blue-300 transition-colors text-sm"
          >
            All Events
          </button>
          
          {authUser ? (
            <>
              <button 
                onClick={() => scrollToSection('personalized-events')}
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-sm"
              >
                <FaUserCircle />
                <span>For You</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-sm"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-sm"
              >
                <FaSignInAlt />
                Login
              </Link>
              <Link 
                to="/register" 
                className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors text-sm"
              >
                <FaUserPlus />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;