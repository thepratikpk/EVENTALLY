import React, { useEffect, useState } from 'react';
import { getAllEvents, getEventsByUserInterests } from '../api/events.api';
import { useAuthStore } from '../store/useAuth';
import Navbar from '../components/Navbar';
import MetaBalls from '../components/MetaBalls';
import EventCard from '../components/EventCard';
import TrueFocus from '../components/TrueFocus';

const Hero = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [interestEvents, setInterestEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { authUser } = useAuthStore();

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
          onClick={() =>
            setExpandedId((prev) => (prev === event._id ? null : event._id))
          }
        />
      ))}
    </div>
  );

  return (
    <div className="relative">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden text-white">
        {/* Radial background */}
        <div className="fixed top-0 left-0 -z-20 h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        {/* MetaBalls right half - hidden on small devices */}
        <div className="hidden md:block absolute inset-0 z-0 pointer-events-auto">
          <div className="w-1/2 h-full ml-auto">
            <MetaBalls
              color="#ffffff"
              cursorBallColor="#ffffff"
              cursorBallSize={2}
              ballCount={15}
              animationSize={30}
              enableMouseInteraction={true}
              enableTransparency={true}
              hoverSmoothness={0.05}
              clumpFactor={1}
              speed={0.3}
            />
          </div>
        </div>

        {/* Content */}
        <div className="-z-10 px-6 md:px-40 w-full flex flex-col md:flex-row justify-between items-center">
          {/* Left: TrueFocus Title */}
          <div className="md:w-1/2 w-full flex justify-center md:justify-start">
            <TrueFocus
              sentence="EVENT ALLY"
              manualMode={false}
              blurAmount={8}
              borderColor="blue"
              glowColor="rgba(255, 0, 0, 0.6)"
              animationDuration={2}
              pauseBetweenAnimations={0.75}
              fontSize="5rem "
            />
          </div>
        </div>
      </div>

      {/* Interest-Based Events */}
      {authUser && interestEvents.length > 0 && (
        <div className="w-full text-gray-800 px-4 py-16 md:px-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-blue-600">
            Events Based on Your Interests
          </h2>
          {renderEventsGrid(interestEvents)}
        </div>
      )}

      {/* All Events Section */}
      <div className="w-full text-gray-800 px-4 py-16 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">
          All Upcoming Events
        </h2>

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
