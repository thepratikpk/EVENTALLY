import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${event.id}`, { state: { event } }); // Fix: Use template literals
  };

  return (
    <div
      className="w-72 h-96 bg-white p-4 rounded-lg shadow-lg text-black overflow-hidden flex flex-col transition-transform transform hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <img src={event.image} alt={event.title} className="w-full h-70 rounded-lg object-cover" />
      <div className="flex-grow flex flex-col justify-between p-4">
        <h3 className="text-2xl font-semibold mt-4">{event.title}</h3>
        <p className="text-lg mt-2"><strong>Date:</strong> {event.date}</p>
      </div>
    </div>
  );
};

export default EventCard;