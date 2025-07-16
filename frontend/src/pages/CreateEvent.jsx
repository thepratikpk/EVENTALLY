import React, { useState } from 'react';
import { API } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuth';

const interestsList = [
  'technical',
  'cultural',
  'sports',
  'literary',
  'workshop',
  'seminar',
  'others',
];

const CreateEvent = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const [form, setForm] = useState({
    club_name: authUser?.fullname || '',
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
    if (file) {
      setForm((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.thumbnail) {
      toast.error('Thumbnail is required');
      return;
    }

    const eventData = new FormData();
    for (let key in form) {
      if (key === 'domains') {
        form.domains.forEach((d) => eventData.append('domains[]', d));
      } else if (key === 'thumbnail') {
        eventData.append('thumbnail', form.thumbnail);
      } else {
        eventData.append(key, form[key]);
      }
    }

    setLoading(true);
    try {
      const res = await API.post('/events/admin', eventData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Event created successfully!');
      navigate('/managed-events');
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || 'Failed to create event');
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

        {/* Club Name */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Club Name</label>
          <input
            type="text"
            name="club_name"
            value={form.club_name}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm"
            placeholder="Your Club / Organizer Name"
            required
          />
        </div>

        {/* Event Name */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Event Name</label>
          <input
            type="text"
            name="event_name"
            value={form.event_name}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm"
            placeholder="Unique identifier for the event"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm"
            placeholder="Event title to be displayed"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border rounded text-sm"
            placeholder="What is this event about?"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1 text-sm">Date</label>
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="w-full p-3 border rounded text-sm"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-sm">Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full p-3 border rounded text-sm"
              required
            />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Venue</label>
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm"
            placeholder="Location of the event"
            required
          />
        </div>

        {/* Registration Link */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Registration Link</label>
          <input
            type="text"
            name="registration_link"
            value={form.registration_link}
            onChange={handleChange}
            className="w-full p-3 border rounded text-sm"
            placeholder="https://..."
          />
        </div>

        {/* Domains */}
        <div>
          <p className="font-semibold mb-2 text-sm">Event Domains:</p>
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

        {/* Thumbnail Upload + Preview */}
        <div>
          <label className="block font-semibold mb-2 text-sm">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full text-sm mb-2"
            required
          />
          {form.thumbnail && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Preview:</p>
              <img
                src={URL.createObjectURL(form.thumbnail)}
                alt="Thumbnail Preview"
                className="w-full max-h-64 object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
        >
          {loading ? 'Posting...' : 'Post Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
