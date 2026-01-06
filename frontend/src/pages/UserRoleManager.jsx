import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuth';
import { getUserByUsername, updateUserRole } from '../api/users.api';
import { Navigate } from 'react-router-dom';

const UserRoleManager = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [message, setMessage] = useState('');

  if (isCheckingAuth) {
    return <div className="h-screen flex justify-center items-center text-gray-800 bg-gray-50">Checking auth...</div>;
  }

  if (!authUser || authUser.role !== 'superadmin') {
    return <Navigate to="/" />;
  }

  const handleSearch = async () => {
    try {
      const result = await getUserByUsername(username);
      setUser(result);
      setMessage('');
    } catch (err) {
      setUser(null);
      setMessage(err.response?.data?.message || 'User not found');
    }
  };

  const handleRoleUpdate = async () => {
    try {
      const updated = await updateUserRole(user._id, newRole);
      setMessage(`Role updated to "${updated.role}"`);
      setUser(updated);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto p-8 text-gray-800">
        <h1 className="text-2xl font-bold mb-6">Superadmin - Manage User Roles</h1>

        <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
            className="border border-gray-300 px-4 py-2 rounded w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Search User
          </button>
        </div>

        {message && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded border border-red-200">{message}</p>}

        {user && (
          <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
            <p className="mb-2"><strong>Username:</strong> {user.username}</p>
            <p className="mb-2"><strong>Fullname:</strong> {user.fullname}</p>
            <p className="mb-4"><strong>Current Role:</strong> <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{user.role}</span></p>

            <div className="mt-4">
              <label className="block mb-2 font-medium text-gray-700">Change Role:</label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select new role</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <button
                onClick={handleRoleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newRole}
              >
                Update Role
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleManager;
