import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuth";
import EventCard from "./EventCard";
import { toast } from "react-hot-toast";

const PersonalizedEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchPersonalizedEvents = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/events");
        const userInterests = authUser?.interests || [];
        
        if (userInterests.length > 0) {
          const filteredEvents = res.data.filter(event => 
            event.domains.some(domain => 
              userInterests.some(interest => 
                domain.toLowerCase().includes(interest.toLowerCase()) || 
                interest.toLowerCase().includes(domain.toLowerCase())
              )
            )
          );
          setEvents(filteredEvents);
        } else {
          setEvents(res.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load personalized events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedEvents();
  }, [authUser]);

  return (
    <div>
      {authUser?.interests && authUser.interests.length > 0 && (
        <div className="mb-8 text-center">
          <h3 className="text-lg text-white mb-2">Based on your interests:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {authUser.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : events.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-lg shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {authUser?.interests?.length > 0 
              ? "No events match your interests" 
              : "Add interests to your profile to see personalized events"}
          </h2>
          <p className="text-gray-600 mb-6">
            {authUser?.interests?.length > 0
              ? "We couldn't find any events matching your interests."
              : "Update your profile with your interests to see relevant events."}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PersonalizedEvents;