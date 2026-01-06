import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEventsStore } from '../store/useEvents';
import { motion } from 'framer-motion';
import { EventDetailsSkeleton } from '../components/SkeletonLoaders';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentEvent, currentEventLoading, currentEventError, fetchEventById } = useEventsStore();
  const initialEvent = location.state || null;

  useEffect(() => {
    fetchEventById(id, true).catch(err => {
      console.error('Error fetching event:', err);
    });
  }, [id, fetchEventById]);

  const event = (currentEvent && currentEvent._id === id) ? currentEvent :
    (currentEventLoading ? initialEvent : currentEvent);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (currentEventLoading && !event) {
    return <EventDetailsSkeleton />;
  }

  if (currentEventError && !event) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-[#fce8e6] rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-[#202124] mb-2">Event not found</h2>
          <p className="text-[#5f6368] mb-6">{currentEventError}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0] transition-colors"
          >
            Back to Events
          </button>
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return <EventDetailsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e8eaed]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#202124] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover Image */}
            {event.thumbnail && (
              <div className="aspect-video rounded-xl overflow-hidden bg-[#f8f9fa]">
                <img
                  src={event.thumbnail}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title & Organizer */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-medium text-[#202124] mb-2">{event.title}</h1>
              <p className="text-[#5f6368]">by {event.club_name}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-[#f8f9fa] rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[#5f6368] uppercase tracking-wide mb-1">Date & Time</p>
                  <p className="text-sm font-medium text-[#202124]">{formatDate(event.event_date)}</p>
                  <p className="text-sm text-[#5f6368]">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-[#5f6368]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[#5f6368] uppercase tracking-wide mb-1">Location</p>
                  <p className="text-sm font-medium text-[#202124]">{event.venue}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-base font-medium text-[#202124] mb-3">About this event</h2>
              <p className="text-[#5f6368] leading-relaxed whitespace-pre-wrap">
                {event.description || 'No description available for this event.'}
              </p>
            </div>

            {/* Categories */}
            {event.domains?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-[#202124] mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {event.domains.map((domain, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#f1f3f4] text-[#5f6368] text-sm rounded-full">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Registration Card */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-6">
                <h3 className="text-base font-medium text-[#202124] mb-4">Register</h3>
                {event.registration_link ? (
                  <>
                    <p className="text-sm text-[#5f6368] mb-4">
                      Secure your spot at this event.
                    </p>
                    <motion.a
                      href={event.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 bg-[#1a73e8] text-white text-center rounded-lg font-medium hover:bg-[#1557b0] transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Register Now
                    </motion.a>
                    <p className="text-xs text-[#80868b] text-center mt-3">
                      Opens in a new tab
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-[#5f6368]">
                    Registration info not available. Contact the organizer.
                  </p>
                )}
              </div>

              {/* Event Info */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-6">
                <h3 className="text-base font-medium text-[#202124] mb-4">Event info</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[#5f6368] mb-1">Organizer</p>
                    <p className="font-medium text-[#202124]">{event.club_name}</p>
                  </div>
                  <div>
                    <p className="text-[#5f6368] mb-1">Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${new Date(event.event_date) > new Date()
                        ? 'bg-[#e6f4ea] text-[#34a853]'
                        : 'bg-[#f1f3f4] text-[#5f6368]'
                      }`}>
                      {new Date(event.event_date) > new Date() ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-white border border-[#e8eaed] rounded-xl p-6">
                <h3 className="text-base font-medium text-[#202124] mb-4">Share</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied!');
                  }}
                  className="w-full py-2 bg-[#f1f3f4] text-[#5f6368] rounded-lg text-sm font-medium hover:bg-[#e8eaed] transition-colors"
                >
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
