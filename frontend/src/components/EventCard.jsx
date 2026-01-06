import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import seminarImg from "../assets/seminar.png";

const EventCard = memo(({ id, title, club_name, thumbnail, description, event_date, time, venue, registration_link }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/event/${id}`, {
      state: {
        id,
        title,
        club_name,
        thumbnail,
        description,
        event_date,
        time,
        venue,
        registration_link,
      },
    });
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="bg-white rounded-xl border border-[#e8eaed] overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-[#dadce0]">
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden bg-[#f8f9fa]">
          <motion.img
            src={thumbnail || seminarImg}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Date Badge */}
          {event_date && (
            <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium text-[#202124] shadow-sm">
              {formatDate(event_date)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-base font-medium text-[#202124] mb-2 line-clamp-2 group-hover:text-[#1a73e8] transition-colors duration-200">
            {title}
          </h3>

          {/* Organizer */}
          <p className="text-sm text-[#5f6368] mb-4">
            {club_name}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-[#80868b]">
            {venue && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate max-w-[120px]">{venue}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{time}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
