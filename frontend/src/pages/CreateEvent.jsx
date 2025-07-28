import React, { useState, useEffect } from 'react';
import { API } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuth';

const interestsList = [
  'technical', 'cultural', 'sports', 'literary', 'workshop', 'seminar', 'others',
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      navigate('/');
    }
  }, [isCheckingAuth, authUser, navigate]);

  const [form, setForm] = useState({
    club_name: '',
    event_name: '',
    title: '',
    description: '',
    event_date: '',
    time: '',
    venue: '',
    registration_link: '',
    domains: [],
    thumbnail: null,
  });

  useEffect(() => {
    if (authUser) {
      setForm((prev) => ({
        ...prev,
        club_name: authUser.fullname,
      }));
    }
  }, [authUser]);

  const [loading, setLoading] = useState(false);

  const toggleDomain = (domain) => {
    setForm((prev) => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter((d) => d !== domain)
        : [...prev.domains, domain],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, thumbnail: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.event_name || !form.title || !form.event_date || !form.time || !form.venue || form.domains.length === 0) {
      toast.error('Please fill in all required fields (Event Name, Title, Date, Time, Venue, and select at least one Domain).');
      return;
    }


    const eventData = new FormData();
    for (let key in form) {
      if (key === 'domains') {
        form.domains.forEach((d) => eventData.append('domains[]', d));
      } else if (key === 'thumbnail') {
        if (form.thumbnail) {
          eventData.append('thumbnail', form.thumbnail);
        }
      } else {
        eventData.append(key, form[key]);
      }
    }

    setLoading(true);
    try {
      await API.post('/events/admin', eventData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Event created successfully!');
      navigate('/managed-events');
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error(err?.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-sky-50 py-8 px-4 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">Create New Event</h2>

        <div>
          <label htmlFor="club_name" className="block font-semibold mb-1 text-sm">Club Name</label>
          <input
            type="text"
            id="club_name"
            name="club_name"
            value={form.club_name}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your Club / Organizer Name"
            required
            readOnly
          />
        </div>

        <div>
          <label htmlFor="event_name" className="block font-semibold mb-1 text-sm">Event Name</label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            value={form.event_name}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Unique identifier for the event"
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block font-semibold mb-1 text-sm">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Event title to be displayed"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-semibold mb-1 text-sm">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What is this event about?"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event_date" className="block font-semibold mb-1 text-sm">Date</label>
            <input
              type="date"
              id="event_date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block font-semibold mb-1 text-sm">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="venue" className="block font-semibold mb-1 text-sm">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Location of the event"
            required
          />
        </div>

        <div>
          <label htmlFor="registration_link" className="block font-semibold mb-1 text-sm">Registration Link (Optional)</label>
          <input
            type="url"
            id="registration_link"
            name="registration_link"
            value={form.registration_link}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/register"
          />
        </div>

        <div>
          <p className="font-semibold mb-2 text-sm">Event Domains (Select at least one):</p>
          <div className="flex flex-wrap gap-2">
            {interestsList.map((domain) => (
              <div
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition 
                  ${form.domains.includes(domain)
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
              >
                {domain}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="thumbnail" className="block font-semibold mb-2 text-sm">Thumbnail Image (Optional)</label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full text-sm mb-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {form.thumbnail && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Preview:</p>
              <img
                src={URL.createObjectURL(form.thumbnail)}
                alt="Thumbnail Preview"
                className="w-full max-h-64 object-cover rounded border border-gray-300"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Posting Event...' : 'Post Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;