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
    return <div className="h-screen flex justify-center items-center text-white">Checking auth...</div>;
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
    <div className="max-w-3xl mx-auto p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Superadmin - Manage User Roles</h1>

      <div className="mb-4">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border px-4 py-2 rounded w-full text-black"
        />
        <button onClick={handleSearch} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Search User
        </button>
      </div>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {user && (
        <div className="bg-gray-100 p-4 rounded shadow text-black">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Fullname:</strong> {user.fullname}</p>
          <p><strong>Current Role:</strong> {user.role}</p>

          <div className="mt-4">
            <label className="block mb-1 font-medium">Change Role:</label>
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              className="border px-4 py-2 rounded w-full"
            >
              <option value="">Select new role</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
            <button
              onClick={handleRoleUpdate}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
              disabled={!newRole}
            >
              Update Role
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleManager;
