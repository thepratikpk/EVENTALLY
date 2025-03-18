import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  if (!event) {
    return <p className="text-center text-red-500">Event not found.</p>;
  }

  return (
    <div className="p-10  mt-16 min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* Event Image */}
      <img src={event.image} alt={event.title} className="w-full max-w-2xl h-80 object-cover rounded-lg shadow-lg" />
      
      {/* Event Title */}
      <h1 className="text-3xl font-bold mt-6">{event.title}</h1>
      
      {/* Event Date */}
      <p className="mt-2 font-semibold">Date: {event.date}</p>
      {/* Event Description */}
      <p className="mt-2 text-lg">{event.description}</p>
      
      
      {/* Registration Button */}
      <a 
        href={event.registrationLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Register Now
      </a>

      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default EventDetails;
