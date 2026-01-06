import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuth';
import { useEventsStore } from '../store/useEvents';

const interestsList = [
  'technical', 'cultural', 'sports', 'literary',
  'workshop', 'seminar', 'others'
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [form, setForm] = useState({
    event_name: '',
    title: '',
    description: '',
    event_date: '',
    time: '',
    venue: '',
    registration_link: '',
    domains: [],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        const myEvent = res.data?.data;

        if (!myEvent) {
          toast.error('Event not found');
          return navigate('/managed-events');
        }

        if (myEvent.club !== authUser._id) {
          toast.error('Not authorized');
          return navigate('/managed-events');
        }

        setForm({
          event_name: myEvent.event_name,
          title: myEvent.title,
          description: myEvent.description,
          event_date: myEvent.event_date ? new Date(myEvent.event_date).toISOString().slice(0, 10) : '',
          time: myEvent.time || '',
          venue: myEvent.venue,
          registration_link: myEvent.registration_link,
          domains: myEvent.domains,
        });

        setThumbnailPreview(myEvent.thumbnail);
      } catch (err) {
        toast.error('Failed to load event');
        navigate('/managed-events');
      } finally {
        setInitialLoadComplete(true);
      }
    };

    if (authUser?._id && !initialLoadComplete) {
      fetchEvent();
    }
  }, [authUser, id, navigate, initialLoadComplete]);

  const toggleDomain = (domain) => {
    setForm(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.event_name || !form.title || !form.event_date || !form.time || !form.venue || form.domains.length === 0) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }

      await API.patch(`/events/admin/${id}/details`, form);

      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile);
        await API.patch(`/events/admin/${id}/thumbnail`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      useEventsStore.getState().invalidateCache();
      toast.success('Event updated!');
      navigate('/managed-events');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!initialLoadComplete) {
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#202124] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h1 className="text-lg font-medium text-[#202124]">Edit Event</h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-[#e8eaed] p-6">
            <h2 className="text-base font-medium text-[#202124] mb-6">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#5f6368] mb-2">Event Name *</label>
                <input
                  type="text"
                  name="event_name"
                  value={form.event_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-[#5f6368] mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm text-[#5f6368] mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg border border-[#e8eaed] p-6">
            <h2 className="text-base font-medium text-[#202124] mb-6">Schedule & Location</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#5f6368] mb-2">Date *</label>
                <input
                  type="date"
                  name="event_date"
                  value={form.event_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-[#5f6368] mb-2">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-[#5f6368] mb-2">Venue *</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
              />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg border border-[#e8eaed] p-6">
            <h2 className="text-base font-medium text-[#202124] mb-6">Additional Details</h2>

            <div className="mb-4">
              <label className="block text-sm text-[#5f6368] mb-2">Registration Link</label>
              <input
                type="url"
                name="registration_link"
                value={form.registration_link}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-[#5f6368] mb-3">Categories *</label>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => toggleDomain(domain)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.domains.includes(domain)
                        ? 'bg-[#1a73e8] text-white'
                        : 'bg-[#f1f3f4] text-[#5f6368] hover:bg-[#e8eaed]'
                      }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#5f6368] mb-2">Event Image</label>
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-3" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="text-sm text-[#5f6368]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-[#dadce0] text-[#5f6368] rounded-lg hover:bg-[#f1f3f4] transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] disabled:opacity-60 transition-colors font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditEvent;
