// src/pages/Hero.jsx
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaRocket, FaStar, FaCalendarAlt } from 'react-icons/fa';
import heroImage from '../assets/Bg.jpg';
import EventCard from '../components/EventCard';
import { getAllEvents, getEventsByUserInterests } from '../api/events.api';
import { useAuthStore } from '../store/useAuth';
import Navbar from '../components/Navbar';

const Hero = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [interestEvents, setInterestEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { authUser } = useAuthStore();
  
  const { scrollY } = useScroll();
  const rocketY = useTransform(scrollY, [0, 300], [0, -100]);
  const starsRotate = useTransform(scrollY, [0, 300], [0, 360]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [all, interest] = await Promise.all([
          getAllEvents(),
          authUser ? getEventsByUserInterests() : [],
        ]);
        
        setAllEvents(all || []);
        setInterestEvents(interest || []);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [authUser]);
  
  const renderEventsGrid = (events) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
        key={event._id}
        id={event._id}  
        title={event.title}
        club_name={event.club_name}
        description={event.description}
        thumbnail={event.thumbnail}
        event_date={event.event_date}
        time={event.time}
        venue={event.venue}
        registration_link={event.registration_link}
        isExpanded={expandedId === event._id}
        onClick={() => setExpandedId((prev) => (prev === event._id ? null : event._id))}
        />
      ))}
    </div>
  );
  
  return (
    <div>
      <Navbar/>
      {/* Hero Section */}
      <div
        className="h-screen w-full relative flex flex-col items-center justify-center text-white text-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />

        <motion.h1 className="text-5xl md:text-7xl font-bold z-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}>
          Discover Events. Connect. Celebrate.
        </motion.h1>

        <motion.p className="text-xl md:text-2xl mt-4 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          Dive into your college’s vibrant community
        </motion.p>

        <motion.div style={{ y: rocketY }} className="absolute left-10 top-1/2 text-blue-400 opacity-80 z-10">
          <FaRocket size={40} />
        </motion.div>

        <motion.div style={{ rotate: starsRotate }} className="absolute right-10 top-1/3 text-yellow-300 opacity-80 z-10">
          <FaStar size={40} />
        </motion.div>

        <motion.div className="absolute bottom-10 z-10 animate-bounce text-white" whileHover={{ scale: 1.2 }}>
          <FaCalendarAlt size={32} />
          <p className="text-sm mt-1">Scroll to view events</p>
        </motion.div>
      </div>

      {/* Interest-Based Events Section */}
      {authUser && interestEvents.length > 0 && (
        <div className="w-full bg-gradient-to-b from-blue-50 to-white text-gray-800 px-4 py-16 md:px-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
            Events Based on Your Interests
          </h2>
          {renderEventsGrid(interestEvents)}
        </div>
      )}

      {/* All Events Section */}
      <div className="w-full bg-white text-gray-800 px-4 py-16 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">All Upcoming Events</h2>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : allEvents.length === 0 ? (
          <div className="text-center text-lg text-gray-600">No events found.</div>
        ) : (
          renderEventsGrid(allEvents)
        )}
      </div>
    </div>
  );
};

export default Hero;
