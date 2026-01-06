import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuth';
import { useEventsStore } from '../store/useEvents';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { EventGridSkeleton } from '../components/SkeletonLoaders';

const Hero = () => {
  const navigate = useNavigate();
  const { authUser, isCheckingAuth } = useAuthStore();
  const {
    allEvents,
    allEventsLoading,
    allEventsError,
    fetchAllEvents,
    interestEvents,
    interestEventsLoading,
    fetchInterestEvents,
  } = useEventsStore();

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadAllEvents = async () => {
      try {
        await fetchAllEvents();
      } catch (err) {
        console.error("Failed to fetch all events:", err);
      } finally {
        if (isMounted) setInitialLoadComplete(true);
      }
    };
    loadAllEvents();
    return () => { isMounted = false; };
  }, [fetchAllEvents]);

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      fetchInterestEvents().catch(err => {
        console.error("Failed to fetch interest events:", err);
      });
    }
  }, [isCheckingAuth, authUser, fetchInterestEvents]);

  const isLoading = !initialLoadComplete || allEventsLoading;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9fa] to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f0fe] text-[#1a73e8] rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-[#1a73e8] rounded-full animate-pulse" />
              No more WhatsApp chaos
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[#202124] mb-6 tracking-tight">
              All campus events,
              <span className="text-[#1a73e8]"> one place</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-[#5f6368] mb-10 max-w-2xl mx-auto leading-relaxed">
              Skip the endless WhatsApp groups. Discover events from all college clubs based on your interests — technical, cultural, sports, and more.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-[#1a73e8] text-white rounded-full font-medium text-base hover:bg-[#1557b0] hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore events
              </motion.button>
              {!authUser && (
                <motion.button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-white text-[#1a73e8] rounded-full font-medium text-base border border-[#e8eaed] hover:bg-[#f8f9fa] hover:border-[#dadce0] transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create account
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Real Stats Only */}
          {allEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-16 flex justify-center"
            >
              <div className="text-center px-8 py-4 bg-[#f8f9fa] rounded-2xl">
                <div className="text-3xl sm:text-4xl font-medium text-[#202124] mb-1">{allEvents.length}</div>
                <div className="text-sm text-[#5f6368]">Upcoming Events</div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Interest-Based Events */}
      {authUser && interestEvents.length > 0 && (
        <section className="py-16 bg-[#f8f9fa]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-[#1a73e8] mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Personalized for you
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium text-[#202124]">
                Based on your interests
              </h2>
            </motion.div>

            {interestEventsLoading ? (
              <EventGridSkeleton count={3} />
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {interestEvents.map((event) => (
                  <motion.div key={event._id} variants={itemVariants}>
                    <EventCard
                      id={event._id}
                      title={event.title}
                      club_name={event.club_name}
                      description={event.description}
                      thumbnail={event.thumbnail}
                      event_date={event.event_date}
                      time={event.time}
                      venue={event.venue}
                      registration_link={event.registration_link}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* All Events Section */}
      <section id="events-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-medium text-[#202124] mb-2">
              Upcoming events
            </h2>
            <p className="text-[#5f6368]">
              Browse all upcoming events and find something exciting to join.
            </p>
          </motion.div>

          {isLoading ? (
            <EventGridSkeleton count={6} />
          ) : allEventsError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#fce8e6] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#202124] mb-2">Failed to load events</h3>
              <p className="text-[#5f6368] mb-6">{allEventsError}</p>
              <button
                onClick={() => fetchAllEvents(1, 10, true)}
                className="px-6 py-2 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0] transition-colors duration-200"
              >
                Try again
              </button>
            </motion.div>
          ) : allEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#f1f3f4] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#202124] mb-2">No events yet</h3>
              <p className="text-[#5f6368]">Check back later for upcoming events.</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {allEvents.map((event) => (
                <motion.div key={event._id} variants={itemVariants}>
                  <EventCard
                    id={event._id}
                    title={event.title}
                    club_name={event.club_name}
                    description={event.description}
                    thumbnail={event.thumbnail}
                    event_date={event.event_date}
                    time={event.time}
                    venue={event.venue}
                    registration_link={event.registration_link}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#e8eaed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#5f6368]">
              © {new Date().getFullYear()} EventAlly. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/about')} className="text-sm text-[#5f6368] hover:text-[#202124] transition-colors duration-200">
                About
              </button>
              <a href="#" className="text-sm text-[#5f6368] hover:text-[#202124] transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-sm text-[#5f6368] hover:text-[#202124] transition-colors duration-200">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;