import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleUsernameClick = () => {
    if (currentUser) {
      navigate('/dashboard'); // Redirect to dashboard when username is clicked
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md text-white p-4 flex justify-between z-50">
      <div className="text-2xl font-bold">EventAlly</div>
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/" className="hover:underline">Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" className="hover:underline">About</NavLink>
        </li>
        {currentUser ? (
          <>
            <li>
              <button
                onClick={handleUsernameClick}
                className="text-green-400 hover:underline cursor-pointer"
              >
                {currentUser.username} {/* Clickable username */}
              </button>
            </li>
            <li>
              <button
                onClick={() => dispatch(logoutUser())}
                className="hover:underline text-red-400"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className="hover:underline">Login</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;