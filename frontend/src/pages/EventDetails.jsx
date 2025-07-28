// src/pages/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { API } from '../lib/axios';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaArrowLeft,
} from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object to access state

  // Initialize event state with data from location.state if available
  // This provides immediate content for perceived performance
  const [event, setEvent] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state); // Set loading true only if no initial state

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); // Ensure loading is true when starting fetch
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data.data); // Update with full, fresh data from API
      } catch (err) {
        console.error('Error fetching event:', err);
        // Optionally, navigate back or show an error message if event not found
        // navigate('/', { replace: true });
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    // Always fetch to ensure data is fresh and complete, even if initial state exists
    fetchEvent();
  }, [id]); // Dependency on id ensures refetch if ID changes

  // Display a loading state if event data is not yet available
  if (loading || !event) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="ml-4 text-white text-lg">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 relative text-white px-4 py-10 sm:px-8 md:px-16 lg:px-24">
      {/* Static Background */}
      <div className="absolute top-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-white transition z-10"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto mt-12 p-6 sm:p-10 rounded-xl bg-[#1c1c1e]/60 backdrop-blur-md shadow-[0_0_40px_rgba(128,128,255,0.1)]">
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt={event.title}
            className="w-full h-auto rounded-lg mb-8 border border-gray-700 shadow-inner"
          />
        )}

        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-blue-400 to-white mb-4">
          {event.title}
        </h1>
        <p className="text-lg text-gray-300 mb-4">
          Hosted by <span className="font-semibold">{event.club_name}</span>
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-400">
            <FaCalendarAlt className="mr-2 text-purple-400" />
            <span>
              {new Date(event.event_date).toLocaleDateString()} at {event.time}
            </span>
          </div>
          <div className="flex items-center text-gray-400">
            <FaMapMarkerAlt className="mr-2 text-pink-400" />
            <span>{event.venue}</span>
          </div>
        </div>

        <p className="text-gray-300 mb-8 leading-relaxed">{event.description}</p>

        {event.registration_link && (
          <a
            href={event.registration_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-white transition hover:underline"
          >
            Register Here <FaExternalLinkAlt className="ml-2" />
          </a>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
