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
    event_date: '', // Will be YYYY-MM-DD string
    time: '',       // Will be HH:MM string
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
          toast.error('You are not authorized to edit this event.');
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
        console.error("Error fetching event for edit:", err);
        toast.error(err?.response?.data?.message || 'Failed to fetch event for editing.');
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

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setThumbnailPreview(form.thumbnail || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.event_name || !form.title || !form.event_date || !form.time || !form.venue || form.domains.length === 0) {
        toast.error('Please fill in all required fields (Event Name, Title, Date, Time, Venue, and select at least one Domain).');
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

      toast.success('Event updated successfully!');
      navigate('/managed-events');
    } catch (err) {
      console.error("Error updating event:", err);
      toast.error(err?.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!initialLoadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="ml-4 text-gray-700">Loading event data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700">Edit Event</h2>

        <div>
          <label htmlFor="event_name" className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <input
            type="text"
            id="event_name"
            name="event_name"
            placeholder="Event Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={form.event_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="event_date"
              name="event_date"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={form.event_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
          <input
            type="text"
            id="venue"
            name="venue"
            placeholder="Venue"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={form.venue}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="registration_link" className="block text-sm font-medium text-gray-700 mb-1">Registration Link (Optional)</label>
          <input
            type="url"
            id="registration_link"
            name="registration_link"
            placeholder="Registration Link"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={form.registration_link}
            onChange={handleChange}
          />
        </div>

        <div>
          <p className="font-semibold mb-2 text-sm text-gray-700">Domains:</p>
          <div className="flex flex-wrap gap-2">
            {interestsList.map((domain) => (
              <div
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`cursor-pointer px-3 py-1 rounded-full text-sm border transition ${
                  form.domains.includes(domain)
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
          <label htmlFor="thumbnail_upload" className="block text-sm font-medium text-gray-700 mb-2">Update Thumbnail:</label>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="h-40 w-full object-cover rounded mb-2 border border-gray-300"
            />
          )}
          <input
            type="file"
            id="thumbnail_upload"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
