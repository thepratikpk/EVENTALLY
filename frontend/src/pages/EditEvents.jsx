// src/pages/EditEvent.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuth';

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

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events`);
        const myEvent = res.data?.data?.find(e => e._id === id);
        if (!myEvent) throw new Error('Event not found');
        if (myEvent.club !== authUser._id) {
          toast.error('Unauthorized');
          return navigate('/');
        }

        setForm({
          event_name: myEvent.event_name,
          title: myEvent.title,
          description: myEvent.description,
          event_date: myEvent.event_date.slice(0, 10),
          time: myEvent.time,
          venue: myEvent.venue,
          registration_link: myEvent.registration_link,
          domains: myEvent.domains,
        });

        setThumbnailPreview(myEvent.thumbnail);
      } catch (err) {
        toast.error('Failed to fetch event');
      }
    };

    if (authUser?._id) fetchEvent();
  }, [authUser, id]);

  const toggleDomain = (domain) => {
    setForm(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update details
      await API.patch(`/events/admin/${id}/details`, form);

      // Update thumbnail if selected
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile);
        await API.patch(`/events/admin/${id}/thumbnail`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('Event updated!');
      navigate('/managed-events');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">Edit Event</h2>

        <input
          type="text"
          name="event_name"
          placeholder="Event Name"
          className="w-full p-3 border rounded"
          value={form.event_name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-3 border rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={4}
          className="w-full p-3 border rounded"
          value={form.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="event_date"
            className="p-3 border rounded"
            value={form.event_date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            className="p-3 border rounded"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="venue"
          placeholder="Venue"
          className="w-full p-3 border rounded"
          value={form.venue}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="registration_link"
          placeholder="Registration Link"
          className="w-full p-3 border rounded"
          value={form.registration_link}
          onChange={handleChange}
        />

        <div>
          <p className="font-semibold mb-2">Domains:</p>
          <div className="flex flex-wrap gap-2">
            {interestsList.map((domain) => (
              <div
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
                  form.domains.includes(domain)
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {domain}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">Update Thumbnail:</p>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Preview"
              className="h-40 w-full object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
