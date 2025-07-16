import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuth';
import { API } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaUserTag,
  FaStar,
  FaRegEdit,
} from 'react-icons/fa';
import SpotlightCard from '../components/SpotlightCard';
import TrueFocus from '../components/TrueFocus'; // ✅ Adjust path if needed

const interestsList = [
  'technical',
  'cultural',
  'sports',
  'literary',
  'workshop',
  'seminar',
  'others',
];

const Profile = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    interests: [],
    oldPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate('/login');
    }
  }, [isCheckingAuth, authUser]);

  useEffect(() => {
    if (authUser) {
      setForm({
        fullname: authUser.fullname,
        email: authUser.email,
        interests: authUser.interests || [],
        oldPassword: '',
        newPassword: '',
      });
    }
  }, [authUser]);

  const toggleInterest = (interest) => {
    const updated = form.interests.includes(interest)
      ? form.interests.filter((i) => i !== interest)
      : [...form.interests, interest];
    setForm({ ...form, interests: updated });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.patch('/auth/update-account', {
        fullname: form.fullname,
        email: form.email,
      });

      await API.patch('/auth/update-interests', {
        interests: form.interests,
      });

      if (form.oldPassword && form.newPassword) {
        await API.patch('/auth/change-password', {
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        });
        toast.success('Password changed');
      }

      toast.success('Profile updated');
      setEditMode(false);
      setForm((prev) => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
      }));
      checkAuth();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth || !authUser) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SpotlightCard spotlightColor="rgba(255,255,255,0.15)">
          <div className="flex flex-col items-center gap-4 text-center">
            {editMode ? (
              <>
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="text-xl font-bold text-center border rounded p-1 text-gray-700"
                />
                <p className="text-sm text-gray-500">@{authUser.username}</p>
              </>
            ) : (
              <>
                <div className="text-2xl text-white font-bold p-2">
                  <TrueFocus
                    sentence={authUser.fullname}
                    manualMode={false}
                    blurAmount={5}
                    borderColor="white"
                    animationDuration={1}
                    pauseBetweenAnimations={0.5}
                  />
                </div>
                <p className="text-sm text-gray-400">@{authUser.username}</p>
              </>
            )}
          </div>

          <div className="mt-6 space-y-4 text-white">
            {/* Email */}
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-400" />
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 p-1 border rounded text-sm text-black"
                />
              ) : (
                <span>{authUser.email}</span>
              )}
            </div>

            {/* Role */}
            <div className="flex items-center gap-3">
              <FaStar className="text-yellow-400" />
              <span className="capitalize">{authUser.role || 'user'}</span>
            </div>

            {/* Interests */}
            <div className="flex items-start gap-3">
              <FaUserTag className="text-purple-500 mt-1" />
              <div className="flex-1">
                <p className="font-semibold">Interests:</p>
                {editMode ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interestsList.map((interest) => (
                      <div
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition border ${
                          form.interests.includes(interest)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc ml-5 text-sm text-gray-300">
                    {authUser.interests.map((interest) => (
                      <li key={interest}>{interest}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Password */}
            {editMode && (
              <div className="mt-4 space-y-2">
                <input
                  type="password"
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  placeholder="Current password"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm text-black"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="New password (min 6 chars)"
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm text-black"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {editMode ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-sm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                <FaRegEdit />
                Edit Profile
              </button>
            )}

            {['admin', 'superadmin'].includes(authUser.role) && (
              <>
                <button
                  onClick={() => navigate('/managed-events')}
                  className="text-sm bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Manage Events
                </button>
                <button
                  onClick={() => navigate('/create-event')}
                  className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Post Event
                </button>
              </>
            )}
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  );
};

export default Profile;
