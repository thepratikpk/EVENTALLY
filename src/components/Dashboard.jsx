import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">Welcome, {currentUser?.username || "User"}!</h2>
      <p className="text-gray-400 mb-4">This is your personalized event dashboard.</p>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;