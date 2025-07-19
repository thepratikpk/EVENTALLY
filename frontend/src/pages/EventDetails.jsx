// src/pages/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event)
    return (
      <div className="text-center py-20 text-white">Loading event...</div>
    );

  return (
    <div className="min-h-screen bg-neutral-950 relative text-white px-4 py-10 sm:px-8 md:px-16 lg:px-24">
      {/* Static Background */}
      <div className="absolute top-0 z-[-2] h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center text-gray-400 hover:text-white transition"
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
