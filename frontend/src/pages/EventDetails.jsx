// src/pages/EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../lib/axios';
import { FaCalendarAlt, FaMapMarkerAlt, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

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

  if (!event) return <div className="text-center py-20">Loading event...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      {event.thumbnail && (
        <img src={event.thumbnail} alt={event.title} className="w-full rounded-xl mb-6" />
      )}

      <h1 className="text-4xl font-bold text-blue-800 mb-2">{event.title}</h1>
      <p className="text-lg text-gray-600 mb-4">Hosted by {event.club_name}</p>

      <div className="flex items-center text-gray-700 mb-2">
        <FaCalendarAlt className="mr-2 text-blue-500" />
        <span>{new Date(event.event_date).toLocaleDateString()} at {event.time}</span>
      </div>
      <div className="flex items-center text-gray-700 mb-4">
        <FaMapMarkerAlt className="mr-2 text-red-500" />
        <span>{event.venue}</span>
      </div>

      <p className="text-gray-700 mb-6">{event.description}</p>

      {event.registration_link && (
        <a
          href={event.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          Register Here <FaExternalLinkAlt className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default EventDetails;
