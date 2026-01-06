import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuth';
import { API } from '../lib/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const interestsList = [
  'technical', 'cultural', 'sports', 'literary',
  'workshop', 'seminar', 'others',
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

  useEffect(() => { checkAuth(); }, [checkAuth]);
  useEffect(() => {
    if (!isCheckingAuth && !authUser) navigate('/login');
  }, [isCheckingAuth, authUser, navigate]);

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
      ? form.interests.filter(i => i !== interest)
      : [...form.interests, interest];
    setForm({ ...form, interests: updated });
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.patch('/auth/update-account', { fullname: form.fullname, email: form.email });
      await API.patch('/auth/update-interests', { interests: form.interests });

      if (form.oldPassword && form.newPassword) {
        await API.patch('/auth/change-password', { oldPassword: form.oldPassword, newPassword: form.newPassword });
        toast.success('Password updated');
      }

      toast.success('Profile updated');
      setEditMode(false);
      setForm(prev => ({ ...prev, oldPassword: '', newPassword: '' }));
      checkAuth();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8eaed]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#202124] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-lg font-medium text-[#202124]">Account</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
      >
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg border border-[#e8eaed] p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1a73e8] flex items-center justify-center text-white text-2xl font-medium">
              {authUser.fullname?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#202124]">{authUser.fullname}</h2>
              <p className="text-sm text-[#5f6368]">@{authUser.username}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-[#e8f0fe] text-[#1a73e8] text-xs font-medium rounded-full">
                {authUser.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-lg border border-[#e8eaed]">
          <div className="p-6 border-b border-[#e8eaed] flex items-center justify-between">
            <h3 className="text-base font-medium text-[#202124]">Personal info</h3>
            {!editMode && (
              <motion.button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 text-sm font-medium text-[#1a73e8] hover:bg-[#e8f0fe] rounded-md transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Edit
              </motion.button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="w-32 text-sm text-[#5f6368]">Name</span>
              {editMode ? (
                <input
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 text-sm text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                />
              ) : (
                <span className="flex-1 text-sm text-[#202124]">{authUser.fullname}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="w-32 text-sm text-[#5f6368]">Email</span>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 text-sm text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                />
              ) : (
                <span className="flex-1 text-sm text-[#202124]">{authUser.email}</span>
              )}
            </div>

            {/* Interests */}
            <div className="flex flex-col sm:flex-row gap-2">
              <span className="w-32 text-sm text-[#5f6368] pt-2">Interests</span>
              <div className="flex-1">
                {editMode ? (
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${form.interests.includes(interest)
                            ? 'bg-[#1a73e8] text-white'
                            : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                          }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {authUser.interests?.map((interest) => (
                      <span key={interest} className="px-3 py-1.5 bg-[#f1f3f4] text-[#5f6368] text-sm rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Password Change */}
            <AnimatePresence>
              {editMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-[#e8eaed] space-y-4"
                >
                  <h4 className="text-sm font-medium text-[#202124]">Change password</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="password"
                      name="oldPassword"
                      value={form.oldPassword}
                      onChange={handleChange}
                      placeholder="Current password"
                      className="px-4 py-2 text-sm text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={form.newPassword}
                      onChange={handleChange}
                      placeholder="New password"
                      className="px-4 py-2 text-sm text-[#202124] bg-white border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <AnimatePresence>
              {editMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3 pt-4"
                >
                  <motion.button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-[#1a73e8] text-white text-sm font-medium rounded-md hover:bg-[#1557b0] disabled:opacity-60 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </motion.button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 text-sm font-medium text-[#5f6368] hover:bg-[#f1f3f4] rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Admin Actions */}
        {['admin', 'superadmin'].includes(authUser.role) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-white rounded-lg border border-[#e8eaed]"
          >
            <div className="p-6 border-b border-[#e8eaed]">
              <h3 className="text-base font-medium text-[#202124]">Admin actions</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/managed-events')}
                className="flex items-center gap-3 p-4 text-left bg-[#f8f9fa] hover:bg-[#f1f3f4] rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-sm font-medium text-[#202124]">Manage Events</span>
              </button>
              <button
                onClick={() => navigate('/create-event')}
                className="flex items-center gap-3 p-4 text-left bg-[#f8f9fa] hover:bg-[#f1f3f4] rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm font-medium text-[#202124]">Create Event</span>
              </button>
              {authUser.role === 'superadmin' && (
                <button
                  onClick={() => navigate('/users/superadmin')}
                  className="flex items-center gap-3 p-4 text-left bg-[#f8f9fa] hover:bg-[#f1f3f4] rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span className="text-sm font-medium text-[#202124]">Manage Users</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
