import React, { useState, useEffect } from 'react';
import { API } from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/useAuth';
import { useEventsStore } from '../store/useEvents';
import DateTimePicker from '../components/DateTimePicker';

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
      // Use the events store to create event (handles cache invalidation)
      await useEventsStore.getState().createEvent(eventData);

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
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8eaed] shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-[#5f6368] hover:text-[#202124] transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold text-[#202124]">Create New Event</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e8eaed] p-8">
            <h2 className="text-xl font-bold text-[#202124] mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <div>
                <label htmlFor="club_name" className="block text-sm font-medium text-[#5f6368] mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="club_name"
                  name="club_name"
                  value={form.club_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-transparent"
                  placeholder="Enter your organization or club name"
                  required
                />
                <p className="mt-1 text-xs text-[#80868b]">You can customize the organization name for this event</p>
              </div>

              <div>
                <label htmlFor="event_name" className="block text-sm font-medium text-[#5f6368] mb-2">
                  Event Identifier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="event_name"
                  name="event_name"
                  value={form.event_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-transparent"
                  placeholder="unique-event-name"
                  required
                />
                <p className="mt-1 text-xs text-[#80868b]">Used for internal identification and URLs</p>
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-[#5f6368] mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-transparent"
                  placeholder="Enter the public title for your event"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-[#5f6368] mb-2">
                  Event Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-transparent resize-none"
                  placeholder="Provide a detailed description of your event, including what attendees can expect..."
                />
                <p className="mt-1 text-xs text-[#80868b]">Optional: Describe what makes this event special</p>
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e8eaed] p-8">
            <h2 className="text-xl font-bold text-[#202124] mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mr-3">📅</span>
              Schedule Your Event
            </h2>

            <DateTimePicker
              eventDate={form.event_date}
              eventTime={form.time}
              onDateChange={(date) => setForm(prev => ({ ...prev, event_date: date }))}
              onTimeChange={(time) => setForm(prev => ({ ...prev, time: time }))}
              required={true}
            />

            {/* Venue Section */}
            <div className="mt-8">
              <label htmlFor="venue" className="flex items-center text-sm font-semibold text-slate-800 mb-4">
                <svg className="w-5 h-5 text-[#5f6368] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Event Venue <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#80868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-[#1a73e8] transition-all duration-200 shadow-sm hover:shadow-md bg-white"
                  placeholder="Enter the event location or venue name"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-[#80868b]">
                Provide a specific location to help attendees find your event
              </p>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e8eaed] p-8">
            <h2 className="text-xl font-bold text-[#202124] mb-6">Additional Details</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="registration_link" className="block text-sm font-medium text-[#5f6368] mb-2">
                  Registration Link
                </label>
                <input
                  type="url"
                  id="registration_link"
                  name="registration_link"
                  value={form.registration_link}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#dadce0] rounded-lg text-[#202124] focus:outline-none focus:ring-2 focus:ring-[#e8f0fe] focus:border-transparent"
                  placeholder="https://example.com/register"
                />
                <p className="mt-1 text-xs text-[#80868b]">Optional: External registration or ticket link</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5f6368] mb-3">
                  Event Categories <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-[#80868b] mb-3">Select at least one category that best describes your event</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {interestsList.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleDomain(domain)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium border transition-colors duration-200 ${form.domains.includes(domain)
                        ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                        : 'bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa] hover:border-[#80868b]'
                        }`}
                    >
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </button>
                  ))}
                </div>
                {form.domains.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">Please select at least one category</p>
                )}
              </div>

              <div>
                <label htmlFor="thumbnail" className="block text-sm font-medium text-[#5f6368] mb-2">
                  Event Image
                </label>
                <div className="border-2 border-dashed border-[#dadce0] rounded-lg p-6 text-center hover:border-[#80868b] transition-colors duration-200">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="thumbnail"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {form.thumbnail ? (
                      <div className="w-full">
                        <img
                          src={URL.createObjectURL(form.thumbnail)}
                          alt="Event Preview"
                          className="w-full max-h-48 object-cover rounded-lg mb-3"
                        />
                        <p className="text-sm text-[#5f6368]">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-[#80868b] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-[#5f6368] mb-1">Upload Event Image</p>
                        <p className="text-xs text-[#80868b]">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
                <p className="mt-1 text-xs text-[#80868b]">Optional: Add an attractive image to showcase your event</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-[#dadce0] text-[#5f6368] rounded-lg hover:bg-[#f8f9fa] transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || form.domains.length === 0}
              className="flex-1 px-6 py-3 bg-[#1a73e8] text-white rounded-lg hover:bg-[#1557b0] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;