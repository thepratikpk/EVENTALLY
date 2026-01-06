import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import EventCard from "../components/EventCard";
import { useAuthStore } from "../store/useAuth";
import { useEventsStore } from "../store/useEvents";
import { EventGridSkeleton } from "../components/SkeletonLoaders";

const ManageEvents = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const { myEvents, myEventsLoading, myEventsError, fetchMyEvents, deleteEvent } = useEventsStore();

  useEffect(() => {
    if (!authUser || (authUser.role !== "admin" && authUser.role !== "superadmin")) {
      toast.error("Unauthorized access");
      navigate("/");
      return;
    }
    fetchMyEvents(1, 10, true).catch(() => toast.error("Failed to fetch events"));
  }, [authUser, navigate, fetchMyEvents]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const activeCount = myEvents.filter(e => new Date(e.event_date) > new Date()).length;
  const thisMonthCount = myEvents.filter(e => new Date(e.event_date).getMonth() === new Date().getMonth()).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-white border-b border-[#e8eaed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-medium text-[#202124]">Your Events</h1>
              <p className="text-sm text-[#5f6368] mt-1">Manage and organize your events</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                onClick={() => navigate("/create-event")}
                className="px-5 py-2.5 bg-[#1a73e8] text-white rounded-lg font-medium text-sm hover:bg-[#1557b0] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create event
              </motion.button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-lg font-medium text-sm transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {myEventsLoading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-5 border border-[#e8eaed]">
                  <div className="h-4 w-20 bg-[#f1f3f4] rounded mb-2 skeleton" />
                  <div className="h-6 w-12 bg-[#f1f3f4] rounded skeleton" />
                </div>
              ))}
            </div>
            <EventGridSkeleton count={6} />
          </>
        ) : myEventsError ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#fce8e6] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#ea4335]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#202124] mb-2">Error loading events</h3>
            <p className="text-[#5f6368] mb-6">{myEventsError}</p>
            <button
              onClick={() => fetchMyEvents(1, 10, true)}
              className="px-6 py-2 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0]"
            >
              Try again
            </button>
          </div>
        ) : myEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#f1f3f4] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#5f6368]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#202124] mb-2">No events yet</h3>
            <p className="text-[#5f6368] mb-6">Create your first event to get started</p>
            <button
              onClick={() => navigate("/create-event")}
              className="px-6 py-2 bg-[#1a73e8] text-white rounded-full font-medium hover:bg-[#1557b0]"
            >
              Create event
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total', value: myEvents.length },
                { label: 'Active', value: activeCount },
                { label: 'This month', value: thisMonthCount },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg p-5 border border-[#e8eaed]"
                >
                  <p className="text-sm text-[#5f6368] mb-1">{stat.label}</p>
                  <p className="text-2xl font-medium text-[#202124]">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Events Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {myEvents.map((event) => (
                <motion.div key={event._id} variants={itemVariants} className="relative group">
                  <EventCard
                    id={event._id}
                    title={event.title}
                    club_name={event.club_name}
                    thumbnail={event.thumbnail}
                    event_date={event.event_date}
                    time={event.time}
                    venue={event.venue}
                  />
                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/events/edit/${event._id}`); }}
                      className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-[#5f6368] hover:text-[#1a73e8] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(event._id); }}
                      className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-[#5f6368] hover:text-[#ea4335] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${new Date(event.event_date) > new Date()
                        ? 'bg-[#e6f4ea] text-[#34a853]'
                        : 'bg-[#f1f3f4] text-[#5f6368]'
                      }`}>
                      {new Date(event.event_date) > new Date() ? 'Active' : 'Past'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
