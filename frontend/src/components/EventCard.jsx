import React from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const EventCard = ({ event }) => {
  const cardVariants = {
    initial: {
      borderColor: "transparent",
      scale: 1,
    },
    hover: {
      borderColor: "white",
      scale: 1.03,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        borderColor: { duration: 0.3 },
        scale: { duration: 0.3 },
        ease: "easeOut",
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.2,
      }
    }
  };

  return (
    <motion.div
      className="bg-black/50 shadow-md rounded-2xl p-6 w-full mx-auto overflow-hidden relative"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      style={{
        border: "2px solid",
        borderColor: "transparent", // default
        borderRadius: "1rem", // rounded-2xl
      }}
    >
      {/* Decorative hover overlay */}
      <motion.div
        className="absolute inset-0 bg-blue-500/10 opacity-0"
        whileHover={{ opacity: 0.2 }}
        transition={{ duration: 0.3 }}
      />

      <h2 className="text-xl font-bold text-white mb-2 relative z-10">
        {event.event_name}
      </h2>
      <p className="text-sm text-white/90 mb-4 relative z-10">{event.title}</p>

      <div className="flex flex-col gap-3 text-sm text-white/70 relative z-10">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <FaCalendarAlt className="text-blue-500" /> {event.event_date}
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <FaClock className="text-blue-500" /> {event.time}
        </motion.div>
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <FaMapMarkerAlt className="text-blue-500" /> {event.venue}
        </motion.div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 relative z-10">
        {event.domains.map((domain, idx) => (
          <motion.span
            key={idx}
            className="px-3 py-1 text-xs bg-blue-500/10 text-white rounded-full"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(59, 130, 246, 0.2)"
            }}
            transition={{ duration: 0.2 }}
          >
            {domain}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default EventCard;
